// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require('web3');
const web3 = new Web3();

async function main() {
  // Deploy the SCLP token
  console.log('deploying token')
  const ScallopToken = await hre.ethers.getContractFactory("ScallopRootToken");
  const token = await ScallopToken.deploy();
  await token.deployed();
  console.log("token deployed to:", token.address);

  // set this accordingly
  const admin = '0xd2f850606f4BB953A39a630C6505D20ab79D76A2';
  const minter = '0xd2f850606f4BB953A39a630C6505D20ab79D76A2';

  // Deploy proxy contract
  const encodedFunctionSignature = web3.eth.abi.encodeFunctionCall({
    name: 'initialize',
    type: 'function',
    inputs: [{
        type: 'address',
        name: 'owner'
      }]
    }, [minter]
  );

  console.log('deploying proxy')
  const ProxyContract = await hre.ethers.getContractFactory("ScallopProxy");
  const proxy = await ProxyContract.deploy(
    token.address,
    admin,
    encodedFunctionSignature
  );
  await proxy.deployed();

  console.log('proxy at', proxy.address);

  // verify token contract
  await hre.run("verify:verify", {
    address: token.address,
    constructorArguments: [],
  });


  await hre.run("verify:verify", {
    address: proxy.address,
    contract: 'contracts/ScallopProxy.sol:ScallopProxy',
    constructorArguments: [
      token.address,
      admin,
      encodedFunctionSignature
    ],
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
