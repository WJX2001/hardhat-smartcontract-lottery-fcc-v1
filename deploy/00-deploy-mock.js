
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

// 0.25 is the premium fee 
const BASE_FEE = ethers.parseEther("0.25")
const GAS_PRICE_LINK = 1e9 // 1000000000 // link per gas 

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const args = [BASE_FEE, GAS_PRICE_LINK]

  // 本地环境
  if(developmentChains.includes(network.name)) {
    console.log("Local network detected! Deploying mocks...")
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args,
    })
    console.log("Mocks deployed!")

  }
}


module.exports.tags = ["all", "mocks"]
