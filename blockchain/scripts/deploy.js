const hre = require("hardhat");

async function main() {
  console.log("Deploying MRVAnchor contract...");

  // Get the ContractFactory for MRVAnchor
  const MRVAnchor = await hre.ethers.getContractFactory("MRVAnchor");

  // Deploy the contract
  const mrvAnchor = await MRVAnchor.deploy();

  // Wait for the deployment transaction to be mined
  await mrvAnchor.waitForDeployment();

  // Log the deployed address to the console
  console.log(`✅ MRVAnchor contract deployed to: ${mrvAnchor.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
