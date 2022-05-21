import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { isAddress } from "../utils";

async function main() {
  const instance = await ethers.getContractAt(
    "MahaTeamDistribution",
    "0x4723babf3E761f41E298cB034FD387D2e27ac9d7"
  );

  const txs = [
    "0xf4471230B65a889ba33d455713A5B50DD734a6f2,25000",
    "0xe3331B02778fd6E3e833FaDcCcff31c621BC5FF5,25000",
    "0xC15D36686a07449C178fFaA4d68712a20DC1968A,200000",
    "0x984A9f1e5f583a72165A928bc804996D777bc859,75000",
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

  const gap = 10;
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
      console.log("skipping", index, error);
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
