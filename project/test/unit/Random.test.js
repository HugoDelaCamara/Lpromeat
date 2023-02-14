const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments } = require("hardhat");
const {
  developmentsChains,
  networkConfig,
} = require("../../helper-hardhat-config");

!developmentsChains.includes(network.name)
  ? describe.skip
  : describe("Random Unit Tests", async function () {
      let random, vrfCoordinatorV2Mock, viewFee;
      const chainId = network.config.chainId;

      beforeEach(async function () {
        const { deployer } = await getNamedAccounts();
        await deployments.fixture(["all"]);
        random = await ethers.getContract("Random", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
        viewFee = await random.getViewFee();
      });

      describe("viewSupplyChain", async function () {
        it("reverts when you don´t pay enough", async function () {
          await expect(random.viewSupplyChain()).to.be.revertedWith(
            "View__NotEnoughETHView"
          );
        });
        it("emits event on viewing", async function () {
          await expect(random.viewSupplyChain({ value: viewFee })).to.emit(
            random,
            "ViewFee"
          );
        });
      });
    });
