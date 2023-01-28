// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require("web3");
import { deployOrLoadAndVerify, wait } from "./utils";

async function main() {
  // // set this accordingly
  // const token = "0xF2c96E402c9199682d5dED26D3771c6B192c01af";
  // const owner = "0x3E53029B647248EA368f59F4C9E6cDfD3eaFa3aE";
  // const beneficiary = "0x3E53029B647248EA368f59F4C9E6cDfD3eaFa3aE";

  // const contracts = [
  //   "AdvisorsVesting",
  //   "EcosystemVesting",
  //   "LPVesting",
  //   "MarketingVesting",
  //   "StakingVesting",
  //   "TeamVesting",
  // ];

  await deployOrLoadAndVerify("CommunityVesting", "CommunityVesting", [
    "0x745407c86df8db893011912d3ab28e68b62e49b0", // address token,
    "0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC", // address beneficiary,
    "0x43c958affe41d44f0a02ae177b591e93c86adbea", // address owner,
    "1409129454978223233737939", // uint256 released
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
