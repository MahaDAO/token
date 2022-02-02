// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();

import { wait } from "./utils";

async function main() {
  // Deploy the SCLP token
  const sclpTokenBSC = "0xf2c96e402c9199682d5ded26d3771c6b192c01af";

  console.log("deploying contract");
  const Contract = await hre.ethers.getContractFactory(
    "ScallopInvestorsDistribution"
  );
  const contract = await Contract.deploy(sclpTokenBSC);
  await contract.deployed();
  console.log("contract deployed to:", contract.address);

  await wait(30 * 1000); // 30sec wait

  await hre.run("verify:verify", {
    address: contract.address,
    contract:
      "contracts/ScallopInvestorsDistribution.sol:ScallopInvestorsDistribution",
    constructorArguments: [sclpTokenBSC],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
