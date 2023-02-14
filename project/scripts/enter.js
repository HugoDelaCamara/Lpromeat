const { ethers } = require("ethers");

async function viewSupply() {
  const random = await ethers.getContract("Random");
  const viewFee = await random.getViewFee();
  await random.viewSupplyChain({ value: viewFee + 1 });
  console.log("VIEWING");
}

viewSupply()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
