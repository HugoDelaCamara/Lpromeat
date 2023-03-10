const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentsChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

const FUND_AMOUNT = ethers.utils.parseEther("1"); // 1 Ether, or 1e18 (10^18) Wei

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

  if (chainId == 31337) {
    // create VRFV2 Subscription
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events[0].args.subId;
    // Fund the subscription
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  log("----------------------------------------------------");
  const arguments = [
    vrfCoordinatorV2Address,
    networkConfig[chainId]["entranceFee"],
    "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId,
    5000,
  ];

  const random = await deploy("Random", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Ensure the Lottery contract is a valid consumer of the VRFCoordinatorV2Mock contract.
  if (developmentsChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, random.address);
  }

  // Verify the deployment
  if (
    !developmentsChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(random.address, arguments);
  }

  log("Enter lottery with command:");
  const networkName = network.name == "hardhat" ? "localhost" : network.name;
  log(`yarn hardhat run scripts/enterLottery.js --network ${networkName}`);
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "Lottery"];
