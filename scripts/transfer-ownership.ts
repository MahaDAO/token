// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // set this accordingly
  const newAdmin = "0xe08c3E034BE12667cc7eCb1D278BfDCe63E5b082";
  const newOwner = "0x09385a56Ef0121a72EE10a3523eBC5FCcba57674";
  const proxy = "0x3F6D1649A1366b0E82173D33e365953f9F1Cc84C";

  const proxyImp = await ethers.getContractAt("ScallopProxy", proxy);
  const tokenImp = await ethers.getContractAt("ScallopToken", proxy);

  // console.log("current admin is", await proxyImp.admin());
  // console.log("current owner is", await tokenImp.owner());

  console.log("transferring owernship to", newOwner);
  await tokenImp.transferOwnership(newOwner);

  // console.log("transferring proxy admin to", newAdmin);
  // await proxyImp.changeAdmin(newAdmin);

  console.log("done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
