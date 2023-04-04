// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { deployOrLoadAndVerify } from "./utils";

async function main() {
  const [deployer] = await ethers.getSigners();

  const gnosisProxy = "0x575e143702a015d09F298663405d1eD7fD20f0dD";
  const admin = "0x77cd66d59ac48a0E7CE54fF16D9235a5fffF335E";

  console.log("Deploying ARTHValuecoin...", deployer.address);

  const factory = await ethers.getContractFactory("ARTHValuecoinProxyImpl");
  const implementation = await deployOrLoadAndVerify(
    "ARTHValuecoinImpl",
    "ARTHValuecoinProxyImpl",
    []
  );

  // deploy as proxy
  console.log("Deploying proxy...");
  const initDecode = factory.interface.encodeFunctionData("initialize", [
    deployer.address,
  ]);

  const proxy = await deployOrLoadAndVerify(
    "ARTHValuecoin",
    "TransparentUpgradeableProxy",
    [implementation.address, gnosisProxy, initDecode]
  );

  const instance = await ethers.getContractAt("ARTHValuecoin", proxy.address);
  console.log("ARTHValuecoin deployed at", instance.address);

  const e18 = BigNumber.from(10).pow(18);

  console.log("mint 1mn arth");
  await instance.mint(admin, e18.mul(1000000));

  // transfer ownership to gnosis safe
  console.log("transfer ownership");
  await instance.transferOwnership(gnosisProxy);

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
