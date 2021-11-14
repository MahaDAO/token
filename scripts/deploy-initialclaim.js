// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require('web3');
const web3 = new Web3();

async function main() {
  const token = '0xf2c96e402c9199682d5ded26d3771c6b192c01af'

  // Deploy InitialClaim
  // console.log('deploying InitialClaim')
  // const InitialClaim = await hre.ethers.getContractFactory("InitialClaim");
  // const contract = await InitialClaim.deploy(token);
  // await contract.deployed();
  // console.log("InitialClaim deployed to:", token.address);

  // verify token contract
  await hre.run("verify:verify", {
    address: '0x338345b429b8bd5b3760dbab51607d724b09575b',
    constructorArguments: [token],
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
