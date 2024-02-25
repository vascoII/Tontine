require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ARBITRUM_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_API_KEY;
const SEPOLIA_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API_KEY;
const OPTIMISUM_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISUM_API_KEY;
const MUMBAI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY;

const ARBITRUM_ACCOUNT_KEY =
  process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_ACCOUNT_KEY;
const SEPOLIA_ACCOUNT_KEY = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_ACCOUNT_KEY;
const OPTIMISUM_ACCOUNT_KEY =
  process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISUM_ACCOUNT_KEY;
const MUMBAI_ACCOUNT_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_ACCOUNT_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // URL de nœud Ethereum local
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [SEPOLIA_ACCOUNT_KEY],
    },
    mumbai: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${MUMBAI_API_KEY}`,
      accounts: [MUMBAI_ACCOUNT_KEY],
    },
    optimisum: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${OPTIMISUM_API_KEY}`,
      accounts: [OPTIMISUM_ACCOUNT_KEY],
    },
    arbitrum: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${ARBITRUM_API_KEY}`,
      accounts: [ARBITRUM_ACCOUNT_KEY],
    },
  },
};
