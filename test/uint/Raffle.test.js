
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require('chai')
const { toNumber } = require("ethers")
!developmentChains.includes(network.name) ? describe.skip : describe("Raffle Unit Tests", async function () {
  let raffle, VRFCoordinatorV2Mock, raffleEntranceFee, deployer, inteval
  const chainId = network.config.chainId

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    raffle = await ethers.getContract("Raffle", deployer)
    VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
    raffleEntranceFee = await raffle.getEntranceFee()
    inteval = await raffle.getInterval()
  })

  describe("constructor", async function () {
    it("initializes the raffle correctly", async function () {
      // Ideally we make our tests have just 1 assert per "it"
      const raffleState = await raffle.getRaffleState()
      assert.equal(raffleState.toString(), "0")
      assert.equal(inteval.toString(), networkConfig[chainId]["interval"])
    })
  })

  describe("enterRaffle", async function () {
    it("reverts when you don't pay enough", async function () {
      // await expect((raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered"))
      await expect(raffle.enterRaffle())
        .to.be.rejectedWith("Raffle__NotEnoughETHEntered")
    })

    it("records players when they enter", async function () {
      await raffle.enterRaffle({ value: raffleEntranceFee })
      const playerFromContract = await raffle.getPlayer(0)
      assert.equal(playerFromContract, deployer)
    })

    it("emits event on enter", async function () {
      await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(raffle, "RaffleEnter")
    })

    it("doesnt allow entrance when raffle is calculating", async function () {
      const tmp = ethers.toNumber(inteval)
      await raffle.enterRaffle({ value: raffleEntranceFee })
      // 为区块增加了时间，并向前挖了一个区块
      // https://hardhat.org/hardhat-network/docs/reference#hardhat_setstorageat
      await network.provider.send("evm_increaseTime", [ethers.toNumber(inteval)+1])
      await network.provider.send("evm_mine", [])
      await raffle.performUpkeep([]) // 这时进入了calculating状态
      await expect(raffle.enterRaffle({value: raffleEntranceFee})).to.be.revertedWith("Raffle_NotOpen")
    })
  })



})