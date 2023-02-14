const { ethers, network } = require("hardhat");
const fs = require("fs");
const FRONT_END_ADDRESSES_FILE =
  "../project-front-end/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../project-front-end/constants/abi.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end");
    await updateContractAddresses();
    await updateAbi();
  }

  async function updateAbi() {
    const random = await ethers.getContract("Random");
    fs.writeFileSync(
      FRONT_END_ABI_FILE,
      random.interface.format(ethers.utils.FormatTypes.json)
    );
  }

  async function updateContractAddresses() {
    const random = await ethers.getContract("Random");
    const chainId = network.config.chainId.toString();
    const contractAddresses = JSON.parse(
      fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
    );
    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId].includes(random.address)) {
        contractAddresses[chainId].push(random.address);
      }
    } else {
      contractAddresses[chainId] = [random.address];
    }
    fs.writeFileSync(
      FRONT_END_ADDRESSES_FILE,
      JSON.stringify(contractAddresses)
    );
  }
};

module.exports.tags = ["all", "frontend"];
