
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require('chai')
!developmentChains.includes(network.name) ? describe.skip : describe("Raffle Unit Tests", async function () {
  let raffle, VRFCoordinatorV2Mock
  const chainId = network.config.chainId

  beforeEach(async function () {
    const { deployer } = await getNamedAccounts()
    await deployments.fixture(["all"])
    raffle = await ethers.getContract("Raffle", deployer)
    VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
  })

  describe("constructor", async function () {
    it("initializes the raffle correctly", async function () {
      // Ideally we make our tests have just 1 assert per "it"
      const raffleState = await raffle.getRaffleState()
      const interval = await raffle.getInterval()
      assert.equal(raffleState.toString(), "0")
      assert.equal(interval.toString(), networkConfig[chainId]["interval"])
    })
  })

  describe("enterRaffle", async function () {
    it("reverts when you don't pay enough", async function () {
      // await expect((raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered"))
      await expect(raffle.enterRaffle())
        .to.be.rejectedWith("Raffle__NotEnoughETHEntered")
    })
  })

})