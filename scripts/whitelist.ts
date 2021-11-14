import { ethers, network } from "hardhat";
import fs from "fs/promises";
import path from "path";
import { isAddress } from "./utils";

async function main() {
  console.log(
    `\nBeginnning Whitelisting script on network ${network.name}...\n`
  );

  const publicRaw = await fs.readFile(
    path.resolve(__dirname, "../data/investors.txt")
  );

  const publicAddresses = publicRaw.toString().split("\n");
  const finalMapping = publicAddresses.map((r) => r.split(","));

  console.log(`\nAdding to whitelist for InitialClaim...`);
  for (let i = 0; i < finalMapping.length; i += 1) {
    const addressse = finalMapping.slice(i, i + 1);
    const addressFinal = addressse.filter((a) => isAddress(a[1]));
    console.log(
      i,
      addressFinal.length - 1,
      addressFinal[0],
      addressFinal[addressFinal.length - 1]
    );

    const investors = addressFinal.map((a) => a[1]);
    const amounts = addressFinal.map((a) => Math.floor(Number(a[0])));

    try {
      const fixedSwap = await ethers.getContractAt(
        "InitialClaim",
        "0x338345b429b8bd5b3760dbab51607d724b09575b"
      );

      // console.log(investors, amounts);
      await fixedSwap.addInvestors(investors, amounts);
    } catch (error) {
      console.log("whitelist failed for i = ", i);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
