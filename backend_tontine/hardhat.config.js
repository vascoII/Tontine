require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_KEY;

const ALCHEMY_POLYGON_API_KEY = process.env.ALCHEMY_POLYGON_API_KEY;
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // URL de nœud Ethereum local
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
};
