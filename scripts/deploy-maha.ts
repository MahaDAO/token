// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from "hardhat";
import { wait } from "./utils";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("deploying token", deployer.address);
  const ARTHValuecoin = await ethers.getContractAt(
    "MahaToken",
    "0x745407c86DF8DB893011912d3aB28e68B62E49B0"
  );

  // await ARTHValuecoin.grantRole(
  //   "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  //   "0x6357edbfe5ada570005ceb8fad3139ef5a8863cc"
  // );

  // await ARTHValuecoin.grantRole(
  //   "0x0000000000000000000000000000000000000000000000000000000000000000",
  //   "0x6357edbfe5ada570005ceb8fad3139ef5a8863cc"
  // );

  // await ARTHValuecoin.grantRole(
  //   "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a",
  //   "0x6357edbfe5ada570005ceb8fad3139ef5a8863cc"
  // );

  await ARTHValuecoin.renounceRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    "0x2B6D96826dfBC212aeAb6748ca10d71039A518f0"
  );
  await ARTHValuecoin.renounceRole(
    "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a",
    "0x2B6D96826dfBC212aeAb6748ca10d71039A518f0"
  );
  await ARTHValuecoin.renounceRole(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    "0x2B6D96826dfBC212aeAb6748ca10d71039A518f0"
  );

  // const token = await ARTHValuecoin.deploy();
  // await token.deployed();
  // console.log("token deployed to:", token.address);
  // await wait(15 * 1000);

  // verify token contract
  await hre.run("verify:verify", {
    address: "0x745407c86DF8DB893011912d3aB28e68B62E49B0",
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
