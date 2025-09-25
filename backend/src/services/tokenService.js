const { ethers } = require('ethers');
const { anchorReport } = require('./anchorService.js');
const MRV_ANCHOR_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const CARBON_TOKEN_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const ALCHEMY_API_URL = "http://127.0.0.1:8545";

const VERIFIER_PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const PROJECT_OWNER_PRIVATE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";


const { abi: tokenAbi } = require('../../../blockchain/artifacts/contracts/CarbonCreditToken.sol/CarbonCreditToken.json');

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
const verifierWallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);
const projectOwnerWallet = new ethers.Wallet(PROJECT_OWNER_PRIVATE_KEY, provider);

const tokenContract = new ethers.Contract(CARBON_TOKEN_ADDRESS, tokenAbi, verifierWallet);



async function issueCredits(anchorResult, missionId, amountInTonnes) {
    // console.log("--- Step 1: Anchoring Report ---");
    // const anchorResult = await anchorReport(reportObject, missionId);
    if (!anchorResult || !anchorResult.reportHash) {
        throw new Error("Failed to anchor the report.");
    }
    const { reportHash } = anchorResult;
    console.log(`✅ Report anchored. Hash: ${reportHash}\n`);
    // console.log("--- Step 2: Minting Credits ---");
    console.log(`Attempting to mint ${amountInTonnes} credits for report hash: ${reportHash}`);
    console.log(`Tokens will be sent to Project Owner: ${projectOwnerWallet.address}`);
    const initialBalance = await tokenContract.balanceOf(projectOwnerWallet.address);
    console.log(`Project Owner initial balance: ${ethers.utils.formatUnits(initialBalance, 18)} BCC`);
    const mintTx = await tokenContract.mintCredits(
        projectOwnerWallet.address,
        amountInTonnes,
        reportHash
    );

    console.log("Submitting mint transaction... Hash:", mintTx.hash);
    console.log("Waiting for confirmation...");
    const receipt = await mintTx.wait(0);

    console.log("✅ Mint transaction confirmed!");
    const finalBalance = await tokenContract.balanceOf(projectOwnerWallet.address);
    console.log(`Project Owner final balance: ${ethers.utils.formatUnits(finalBalance, 18)} BCC`);
    
    return {
        txHash: receipt.hash,
        finalBalance: ethers.utils.formatUnits(finalBalance, 18)
    };
}
async function retireCredits(amountInTonnes, reason) {
    console.log("\n--- Retiring Credits ---");
    console.log(`Project Owner (${projectOwnerWallet.address}) is retiring ${amountInTonnes} credits.`);

    const projectOwnerContract = tokenContract.connect(projectOwnerWallet);

    const retireTx = await projectOwnerContract.retire(amountInTonnes, reason);
    console.log("Submitting retire transaction... Hash:", retireTx.hash);
    await retireTx.wait();
    console.log("✅ Credits retired successfully!");

    const finalBalance = await tokenContract.balanceOf(projectOwnerWallet.address);
    console.log(`Project Owner final balance after retirement: ${ethers.utils.formatUnits(finalBalance, 18)} BCC`);
    return { finalBalance: ethers.utils.formatUnits(finalBalance, 18) };
}


// // --- Main Execution ---
// async function runWorkflow() {
//     try {
//         await issueCredits({ data: "Verified data for Sundarbans Delta Q4" }, "MISSION-042", 62);
        
//         await retireCredits(10, "Offsetting Q4 2025 corporate travel emissions.");

//     } catch (error) {
//         console.error("Workflow failed:", error);
//     }
// }

// runWorkflow();
module.exports = { issueCredits, retireCredits };