import * as fs from "fs";
import hre, { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function verifyContract(
  hre: HardhatRuntimeEnvironment,
  address: string,
  constructorArguments: any[]
) {
  try {
    // await wait(20 * 1000); // wait for 20s
    if (network.name === "hardhat") return;

    await hre.run("verify:verify", {
      address,
      contract: "contracts/vesting/CommunityVesting.sol:CommunityVesting",
      constructorArguments,
    });
  } catch (error: any) {
    console.log(error);
    if (error.name !== "NomicLabsHardhatPluginError") {
      console.error(`- Error verifying: ${error.name}`);
      console.error(error);
    }
    return false;
  }
  return true;
}

export const saveABI = (
  key: string,
  abi: string,
  address: string,
  verified: boolean = true
) => {
  if (network.name === "hardhat") return;
  const filename = `./deployments/${network.name}.json`;

  let outputFile: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    outputFile = data === "" ? {} : JSON.parse(data);
  }

  outputFile[key] = {
    abi,
    verified,
    address,
  };

  fs.writeFileSync(filename, JSON.stringify(outputFile, null, 2));
  console.log(`saved ${key}:${address} into ${network.name}.json`);
};

export const getOutput = (_network?: string) => {
  const filename = `./deployments/${_network || network.name}.json`;

  let outputFile: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    outputFile = data === "" ? {} : JSON.parse(data);
  }

  return outputFile;
};

export const getOutputAddress = (key: string, _network?: string) => {
  const __network =
    _network || process.env.FORK ? process.env.FORK : network.name;

  const outputFile = getOutput(__network);
  if (!outputFile[key]) return;
  return outputFile[key].address;
};

export const deployOrLoad = async (
  key: string,
  contractName: string,
  args: any[]
) => {
  const addr = await getOutputAddress(key);
  if (addr) {
    console.log(`using ${key} at ${addr}`);
    return await ethers.getContractAt(contractName, addr);
  }

  const { provider } = ethers;
  const estimateGasPrice = await provider.getGasPrice();
  const gasPrice = estimateGasPrice.mul(5).div(4);

  console.log(
    `\ndeploying ${key} at ${ethers.utils.formatUnits(gasPrice, `gwei`)} gwei`
  );
  const factory = await ethers.getContractFactory(contractName);
  const instance = await factory.deploy(...args, { gasPrice });
  await instance.deployed();
  console.log(
    `${instance.address} -> tx hash: ${instance.deployTransaction.hash}`
  );

  await saveABI(key, contractName, instance.address, false);
  return instance;
};

export const deployOrLoadAndVerify = async (
  key: string,
  contractName: string,
  args: any[],
  delay: number = 5000
) => {
  const instance = await deployOrLoad(key, contractName, args);

  const outputFile = getOutput();
  if (outputFile[key] && !outputFile[key].verified) {
    await wait(delay);
    const verified = await verifyContract(hre, instance.address, args);
    await saveABI(key, contractName, instance.address, verified);
  }

  return instance;
};
