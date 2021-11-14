import { ethers, network } from "hardhat";
import fs from "fs/promises";
import path from "path";
import { isAddress } from "./utils";

async function main() {
  console.log(
    `\nBeginnning Whitelisting script on network ${network.name}...\n`
  );

  const fixedSwap = await ethers.getContractAt(
    "InitialClaim",
    "0x338345b429b8bd5b3760dbab51607d724b09575b"
  );

  // console.log(investors, amounts);
  await fixedSwap.setInitialTimestamp(
    Math.floor(new Date("Thu Oct 28 2021 11:15:00 UTC").getTime() / 1000)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
