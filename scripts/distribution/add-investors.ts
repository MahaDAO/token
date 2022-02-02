import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { isAddress } from "../utils";

async function main() {
  const instance = await ethers.getContractAt(
    "ScallopInvestorsDistribution",
    "0x5e60988c21910255b3ab479e67a162835390171b"
  );

  const txs = [
    "0x1ff4C0Ae0F386c16D297d7580B872Da90fadaE2c,9563",
    "0x336f2809f43fefb062a2b25F1C74a22a9bB26981,10625",
    "0xF8861c420FaB6bad324f2e83EEEDBb8c71CB0A15,35417",
    "0x842485AC1CF5d37d3cfd013745618561B2dA4B46,85000",
    "0xc27F4956826755b69651dACc8146CB7C46835E99,5667",
    "0x8f4aa767e6eadef366c707f4ca7f59127083b6d1,22667",
    "0xB8221D5fb33C317CfBD912b8cE4Bd7C7740fAF88,5667",
    "0xaEc661a58928e60f52976F1886cD27845789D90f,14167",
    "0x0962E1CE0819C840519A95111c9B2e4D8e475ecc,2833",
    "0x8adDabF339c54Aa0c6e8Adb41C2CB2F1d68451f5,11333",
  ];

  const mappedValues = txs.map((t) => t.split(","));

  const addresses = mappedValues.map((t) => t[0]);
  const decimals = BigNumber.from(10).pow(18);

  const values = mappedValues.map((t) =>
    BigNumber.from(Math.ceil(Number(t[1]))).mul(decimals)
  );

  // console.log('approving usdc spend');
  // const infinity = decimals.mul(9999999999);
  // await USDC.approve(instance.address, infinity);
  // console.log('approved usdc spend');

  const gap = 1;
  for (let index = 0; index < values.length / gap; index++) {
    const addressSnip = addresses.slice(index * gap, (index + 1) * gap);
    const valuesSnip = values.slice(index * gap, (index + 1) * gap);

    // console.log(index, "working on n =", valuesSnip.length);

    // if (!isAddress(addressSnip[0]))
    //   console.log(addressSnip[0], isAddress(addressSnip[0]));

    // console.log(addressSnip, valuesSnip);
    try {
      const tx1 = await instance.addInvestors(addressSnip, valuesSnip);
      console.log("done", tx1.hash);
    } catch (error) {
      console.log("skipping", index, error.reason);
      // process.exit();
    }
  }

  console.log("all done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
