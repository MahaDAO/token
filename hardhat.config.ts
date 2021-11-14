import { task } from "hardhat/config";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/types";
import { NetworkUserConfig } from "hardhat/types";

import "hardhat-gas-reporter";
import "hardhat-proxy";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const WALLET_SECRET = process.env.WALLET_SECRET || "";

function createTestnetConfig(
  network: keyof typeof chainIds
): NetworkUserConfig {
  const url: string = "https://" + network + ".infura.io/v3/" + INFURA_API_KEY;
  return {
    accounts: [WALLET_SECRET],
    chainId: chainIds[network],
    url,
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.hardhat,
    },
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    bsc: {
      accounts: [WALLET_SECRET],
      chainId: 56,
      url: "https://bsc-dataseed.binance.org/",
    },
    bscTestnet: {
      accounts: [WALLET_SECRET],
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.8.0",
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    // enabled: process.env.REPORT_GAS ? true : false,
  },
};

export default config;
