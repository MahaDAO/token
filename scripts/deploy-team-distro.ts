// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require("web3");
import { deployOrLoadAndVerify } from "./utils";

async function main() {
  await deployOrLoadAndVerify("MahaTeamDistribution", "MahaTeamDistribution", [
    "0x745407c86df8db893011912d3ab28e68b62e49b0", // address token,
    "0x77cd66d59ac48a0E7CE54fF16D9235a5fffF335E", // address owner,
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
