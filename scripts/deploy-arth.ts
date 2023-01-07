// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from "hardhat";
import { wait } from "./utils";

async function main() {
  console.log("deploying token");
  const ARTHValuecoin = await ethers.getContractFactory("ARTHValuecoin");
  const token = await ARTHValuecoin.deploy();
  await token.deployed();
  console.log("token deployed to:", token.address);

  await wait(15 * 1000);

  // verify token contract
  await hre.run("verify:verify", {
    address: token.address,
  });

  process.exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
