const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // When deploying to a live network, getSigners() will return an array
  // with only the account configured in hardhat.config.cjs.
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  // 1. Deploy MRVAnchor contract
  const MRVAnchor = await hre.ethers.getContractFactory("MRVAnchor");
  const mrvAnchor = await MRVAnchor.deploy();
  await mrvAnchor.waitForDeployment();
  const mrvAnchorAddress = mrvAnchor.target;
  console.log(`\n✅ MRVAnchor deployed to: ${mrvAnchorAddress}`);

  // 2. Deploy CarbonCreditToken, passing the MRVAnchor address to its constructor
  const CarbonCreditToken = await hre.ethers.getContractFactory("CarbonCreditToken");
  const carbonCreditToken = await CarbonCreditToken.deploy(mrvAnchorAddress);
  await carbonCreditToken.waitForDeployment();
  const carbonCreditTokenAddress = carbonCreditToken.target;
  console.log(`✅ CarbonCreditToken deployed to: ${carbonCreditTokenAddress}`);

  // In this setup, the 'deployer' account automatically gets the ADMIN and VERIFIER roles
  // from the CarbonCreditToken constructor. No extra 'grantRole' is needed initially.
  // If you need a *different* account to be the verifier, you would grant the role here.
  // For now, the deployer can do everything.

  console.log("\nDeployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

