const { ethers, network } = require("hardhat");

async function mockKeepers() {
  const random = await ethers.getContract("Random");
  const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));
  /*  const { upKeepNeeded } = await random.callStatic.checkUpKeep(checkData);
  if (upKeepNeeded) {*/
  //const tx = await random.performUpKeep(checkData);
  //const txReceipt = await tx.wait(1);
  //const requestId = txReceipt.events[1].args.requestId;
  //console.log(`Performed upKeep with Request ID: ${requestId}`);
  if (network.config.chainId == 31337) {
    await mockVrf(random);
  }
  /*} else {
    console.log("No upkeep needed");
  }*/
}

async function mockVrf(random) {
  console.log("We are on a local network");
  const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
  await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, random.address);
  console.log("Responded");
  const number1 = await random.getRandomNumbers();
  console.log(`The first random number is: ${number1}`);
}
mockKeepers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
