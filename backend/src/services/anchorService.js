
const ALCHEMY_API_URL=  "https://eth-sepolia.g.alchemy.com/v2/tHa-TcRFNHi7rQ-2-JcuW"
const CONTRACT_ADDRESS="0x4Eef4492491Bd65E3f29c3c8a52f772b3979EC05"
const PRIVATE_KEY="ba0a3601e079e57d139681fe01589fae652f6cc673cbf2e542b358c0b17b4de8"
const { ethers } = require('ethers');
const { sha256HexFromString } = require('../utils/hash');
const { uploadJsonToPinataMock } = require('../utils/cid_form'); // Assuming mock for now

// Load the ABI
const { abi: anchorAbi } = require('../../../blockchain/artifacts/contracts/MRVAnchor.sol/MRVAnchor.json');

// --- Service Logic ---
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, anchorAbi, signer);

async function anchorReport(reportObject, missionId) {
    console.log("Preparing to anchor report...");

    const ipfsCid = await uploadJsonToPinataMock(reportObject);

    // --- FIX FOR TESTING: Add a unique timestamp to ensure a new hash each time ---
    const payload = { ...reportObject, ipfsCid, missionId, timestamp: Date.now() };
    // --- End of Fix ---

    const hex = sha256HexFromString(JSON.stringify(payload));
    const reportHash = '0x' + hex;

    console.log(`Checking if report hash ${reportHash} is already anchored...`);
    const already = await contract.isAnchored(reportHash);
    if (already) {
        // This block should now rarely be hit during testing unless you run the script very fast
        console.log("Report is already anchored. Fetching existing record.");
        const rec = await contract.getRecord(reportHash);
        return { reportHash, ipfsCid, already: true, record: rec };
    }

    console.log(`Anchoring report with hash: ${reportHash} and CID: ${ipfsCid}`);
    
    // 1. Get the latest fee data from the network
    const feeData = await provider.getFeeData();
    const gasLimit = 300000; // A safe gas limit for this function

    // 2. Add a balance check for clearer errors
    const maxTxCost = feeData.maxFeePerGas.mul(gasLimit);
    const balance = await signer.getBalance();
    if (balance.lt(maxTxCost)) {
        throw new Error(`Insufficient funds. Wallet has ${ethers.utils.formatEther(balance)} ETH, but transaction may cost up to ${ethers.utils.formatEther(maxTxCost)} ETH.`);
    }

    // 3. Send the transaction with the recommended gas fees
    const tx = await contract.anchor(reportHash, ipfsCid, missionId, {
        gasLimit: gasLimit,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    });

    console.log("Transaction sent. Hash:", tx.hash);
    console.log("Waiting for confirmation (this may take up to 60 seconds)...");

    // 4. Use a more robust method to wait for the transaction
    // Waits for 1 confirmation, with a 60-second timeout.
    const receipt = await provider.waitForTransaction(tx.hash, 1, 60000); 
    
    if (!receipt) {
        throw new Error(`Transaction receipt was null for hash ${tx.hash}. The transaction may have been dropped or timed out.`);
    }
    
    // Check if the transaction was successful (1) or reverted (0)
    if (receipt.status === 0) {
        throw new Error(`Transaction failed (reverted). Hash: ${tx.hash}`);
    }

    console.log('Anchored report successfully:', { reportHash, ipfsCid, txHash: receipt.transactionHash });

    return {
        reportHash,
        ipfsCid,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
    };
}

module.exports = { anchorReport };

