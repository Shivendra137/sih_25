const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");
  const MRVAnchor = await hre.ethers.getContractFactory("MRVAnchor");
  const mrvAnchor = await MRVAnchor.deploy();
  await mrvAnchor.waitForDeployment();
  const mrvAnchorAddress = mrvAnchor.target;
  console.log(`✅ MRVAnchor deployed to: ${mrvAnchorAddress}`);
  const CarbonCreditToken = await hre.ethers.getContractFactory("CarbonCreditToken");
  const carbonCreditToken = await CarbonCreditToken.deploy(mrvAnchorAddress);
  await carbonCreditToken.waitForDeployment();
  const carbonCreditTokenAddress = carbonCreditToken.target;
  console.log(`✅ CarbonCreditToken deployed to: ${carbonCreditTokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
