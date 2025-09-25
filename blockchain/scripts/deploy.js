const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const [deployer, verifier] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Verifier address: ${verifier.address}`);

  const MRVAnchor = await hre.ethers.getContractFactory("MRVAnchor");
  const mrvAnchor = await MRVAnchor.deploy();
  await mrvAnchor.waitForDeployment();
  const mrvAnchorAddress = mrvAnchor.target;
  console.log(`\n✅ MRVAnchor deployed to: ${mrvAnchorAddress}`);

  const CarbonCreditToken = await hre.ethers.getContractFactory("CarbonCreditToken");
  const carbonCreditToken = await CarbonCreditToken.deploy(mrvAnchorAddress);
  await carbonCreditToken.waitForDeployment();
  const carbonCreditTokenAddress = carbonCreditToken.target;
  console.log(`✅ CarbonCreditToken deployed to: ${carbonCreditTokenAddress}`);

  console.log("\nGranting VERIFIER_ROLE to the verifier wallet...");
  const verifierRole = await carbonCreditToken.VERIFIER_ROLE();
  const grantRoleTx = await carbonCreditToken.connect(deployer).grantRole(verifierRole, verifier.address);
  await grantRoleTx.wait();
  console.log(`✅ VERIFIER_ROLE granted to ${verifier.address}`);

  console.log("\nDeployment and setup complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

