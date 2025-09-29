const { ethers } = require('ethers');
const { anchorReport } = require('./anchorService.js');
const MRV_ANCHOR_ADDRESS = "0x4Eef4492491Bd65E3f29c3c8a52f772b3979EC05"; 
const CARBON_TOKEN_ADDRESS = "0x00dF42E7a596d6f9b32fEF60accb85E2bDc69719";
const ALCHEMY_API_URL = "https://eth-sepolia.g.alchemy.com/v2/tHa-TcRFNHi7rQ-2-JcuW";

const VERIFIER_PRIVATE_KEY = "ba0a3601e079e57d139681fe01589fae652f6cc673cbf2e542b358c0b17b4de8";
const PROJECT_OWNER_PRIVATE_KEY = "9c26fb3a8e05ad6aab5611b0ed4ef1273fed06808fa85c583325567fc1edc566";
// Load the ABI
const { abi: tokenAbi } = require('../../../blockchain/artifacts/contracts/CarbonCreditToken.sol/CarbonCreditToken.json');

// --- Service Logic ---
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
const verifierWallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);
const projectOwnerWallet = new ethers.Wallet(PROJECT_OWNER_PRIVATE_KEY, provider);

const tokenContract = new ethers.Contract(CARBON_TOKEN_ADDRESS, tokenAbi, verifierWallet);

async function issueCredits(reportHash, amountInTonnes) {
    console.log(`Attempting to mint ${amountInTonnes} credits for report hash: ${reportHash}`);
    console.log(`Tokens will be sent to Project Owner: ${projectOwnerWallet.address}`);
    
    const initialBalance = await tokenContract.balanceOf(projectOwnerWallet.address);
    console.log(`Project Owner initial balance: ${ethers.utils.formatUnits(initialBalance, 18)} BCC`);

    // --- ROBUST TRANSACTION FIX ---
    const feeData = await provider.getFeeData();
    const gasLimit = 200000; // Safe limit for minting

    const mintTx = await tokenContract.mintCredits(
        projectOwnerWallet.address,
        amountInTonnes,
        reportHash,
        {
            gasLimit: gasLimit,
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        }
    );

    console.log("Submitting mint transaction... Hash:", mintTx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await provider.waitForTransaction(mintTx.hash, 1, 60000);
    // --- End of Fix ---

    if (!receipt) {
        throw new Error(`Transaction receipt was null for hash ${mintTx.hash}. The transaction may have been dropped or timed out.`);
    }
    if (receipt.status === 0) {
        throw new Error(`Mint transaction failed (reverted). Hash: ${mintTx.hash}`);
    }

    console.log("✅ Mint transaction confirmed!");
    const finalBalance = await tokenContract.balanceOf(projectOwnerWallet.address);
    console.log(`Project Owner final balance: ${ethers.utils.formatUnits(finalBalance, 18)} BCC`);
    
    return {
        txHash: receipt.transactionHash,
        finalBalance: ethers.utils.formatUnits(finalBalance, 18)
    };
}

async function retireCredits(amountInTonnes, reason) {
    console.log("\n--- Retiring Credits ---");
    console.log(`Project Owner (${projectOwnerWallet.address}) is retiring ${amountInTonnes} credits.`);

    // Connect the contract instance to the project owner's wallet to sign the transaction
    const projectOwnerContract = tokenContract.connect(projectOwnerWallet);
    
    // --- ROBUST TRANSACTION FIX ---
    const feeData = await provider.getFeeData();
    const gasLimit = 150000; // Safe limit for retiring

    const retireTx = await projectOwnerContract.retire(amountInTonnes, reason, {
        gasLimit: gasLimit,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    });

    console.log("Submitting retire transaction... Hash:", retireTx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await provider.waitForTransaction(retireTx.hash, 1, 60000);
    // --- End of Fix ---

    if (!receipt) {
        throw new Error(`Transaction receipt was null for hash ${retireTx.hash}. The transaction may have been dropped or timed out.`);
    }
    if (receipt.status === 0) {
        throw new Error(`Retire transaction failed (reverted). Hash: ${retireTx.hash}`);
    }

    console.log("✅ Credits retired successfully!");

    const finalBalance = await tokenContract.balanceOf(projectOwnerWallet.address);
    console.log(`Project Owner final balance after retirement: ${ethers.utils.formatUnits(finalBalance, 18)} BCC`);
    return { finalBalance: ethers.utils.formatUnits(finalBalance, 18) };
}

module.exports = { issueCredits, retireCredits };
