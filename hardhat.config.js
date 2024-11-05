require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const LOCALHOST_URL = process.env.LOCALHOST_URL
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: '0.8.7' }, { version: '0.4.19' }]
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${SEPOLIA_RPC_URL}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 1,
    }
  },
  solidity: "0.8.27",
  namedAccounts: {
    deployer: {
      default: 0
    },
    player: {
      default: 1
    }
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketCap: COINMARKET_API_KEY,
    token: "MATIC"
  },
}
