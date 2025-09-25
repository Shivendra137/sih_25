const { ethers } = require('ethers');
const { uploadJsonToPinata, uploadJsonToPinataMock } = require('../utils/cid_form');
const { sha256HexFromString} = require('../utils/hash'); 
// require('dotenv').config();
const ABI = require('../../../blockchain/artifacts/contracts/MRVAnchor.sol/MRVAnchor.json').abi;
const ALCHEMY_API_URL=  "http://127.0.0.1:8545"
const CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
const PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
async function anchorReport(reportObject, missionId) {
  const ipfsCid = await uploadJsonToPinataMock(reportObject);
  const payload = { ...reportObject, ipfsCid, missionId };
  const hex = sha256HexFromString(JSON.stringify(payload));
  const reportHash = '0x' + hex;
  console.log(ALCHEMY_API_URL, PRIVATE_KEY, CONTRACT_ADDRESS);
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    console.log('Contract address:', contract.target || contract.address || contract);
try {
  // list ABI function names
  console.log('Contract functions (interface):', contract.interface ? contract.interface.fragments.map(f => f.name) : Object.keys(contract));
} catch(e) {
  console.log('Could not read contract.interface:', e.message);
}
console.log('Has anchor?', typeof contract.anchor);

  const already = await contract.isAnchored(reportHash);
  if (already) {
    const rec = await contract.getRecord(reportHash);
    console.log('Report already anchored:', rec);
    return { reportHash, ipfsCid, already: true, record: rec };
  }
  console.log('Anchoring report with hash:', reportHash, 'and CID:', ipfsCid);
  const tx = await contract.anchor(reportHash, ipfsCid, missionId, { gasLimit: 300000 });
  const receipt = await tx.wait(2);
  console.log('Anchored report:', { reportHash, ipfsCid, txHash: receipt.transactionHash });
  return {
    reportHash,
    ipfsCid,
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber
  };
}
// anchorReport('test', 'mission1').then(console.log).catch(console.error);
module.exports = { anchorReport };
