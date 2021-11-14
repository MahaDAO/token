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
  const ScallopToken = await hre.ethers.getContractFactory("ScallopChildToken");
  const token = await ScallopToken.deploy();
  await token.deployed();
  console.log("token deployed to:", token.address);

  // set this accordingly
  const admin = '0x67c569F960C1Cc0B9a7979A851f5a67018c5A3b0';
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

  console.log('deploying bridge')
  const ScallopBridge = await hre.ethers.getContractFactory("ScallopBridge");
  const bridge = await ScallopBridge.deploy(token.address);
  await bridge.deployed();
  console.log('bridge at', bridge.address);

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

  await hre.run("verify:verify", {
    address: bridge.address,
    constructorArguments: [
      token.address
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
