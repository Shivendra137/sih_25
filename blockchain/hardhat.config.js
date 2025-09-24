require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: { // Changed from goerli
      url: process.env.ALCHEMY_SEPOLIA_URL, // Points to the new variable
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
