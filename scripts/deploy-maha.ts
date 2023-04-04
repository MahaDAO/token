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

  console.log("Deploying MahaToken...", deployer.address);

  const MahaToken = await ethers.getContractFactory("MahaToken");
  const implementation = await deployOrLoadAndVerify(
    "MahaTokenImpl",
    "MahaToken",
    []
  );

  // deploy as proxy
  console.log("Deploying proxy...");
  const initDecode = MahaToken.interface.encodeFunctionData("initialize", [
    deployer.address,
  ]);

  const proxy = await deployOrLoadAndVerify(
    "MahaToken",
    "TransparentUpgradeableProxy",
    [implementation.address, gnosisProxy, initDecode]
  );

  const instance = await ethers.getContractAt("MahaToken", proxy.address);
  console.log("MahaToken deployed at", instance.address);

  const e18 = BigNumber.from(10).pow(18);

  // mint 200k maha
  console.log("mint 200k maha");
  await instance.mint(admin, e18.mul(200000));

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
