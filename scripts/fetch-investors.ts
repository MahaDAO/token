// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require("web3");
import { ethers } from "hardhat";
import { deployOrLoadAndVerify } from "./utils";

async function main() {
  const distro = await ethers.getContractAt(
    "MahaTeamDistribution",
    "0x4723babf3E761f41E298cB034FD387D2e27ac9d7"
  );

  const _investors: any[] = [];
  const _tokenAllocations: any[] = [];
  const _tokenClaimed: any[] = [];

  for (let index = 0; index < 10; index++) {
    const investor = await distro.investors(index);

    const info = await distro.investorsInfo(investor);

    _investors.push(investor);
    _tokenClaimed.push(info.withdrawnTokens.toString());
    _tokenAllocations.push(info.tokensAllotment.toString());

    console.log(index, investor, info);
  }

  console.log(_investors);
  console.log(_tokenAllocations);
  console.log(_tokenClaimed);

  console.log(_investors.join(","));
  console.log(_tokenAllocations.join(","));
  console.log(_tokenClaimed.join(","));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
