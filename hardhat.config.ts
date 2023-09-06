import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import { HardhatUserConfig, task } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "solidity-coverage";

dotenv.config();

const chainIds = {
  // local
  localhost: 31337,
  // testnet
  goerli: 5,
  "optimism-goerli": 420,
  "fantom-testnet": 4002,
  "pgn-sepolia": 58008,
  "arbitrum-goerli": 421613,
  "fuji-testnet": 43113,
  polygon: 137,

  // mainnet
  mainnet: 1,
  "optimism-mainnet": 10,
  "pgn-mainnet": 424,
  "fantom-mainnet": 250,
  "arbitrumOne-mainnet": 42161,
  "avalanche-mainnet": 43114,
  mumbai: 80001,
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

let deployPrivateKey = process.env.DEPLOYER_PRIVATE_KEY as string;
if (!deployPrivateKey) {
  // default first account deterministically created by local nodes like `npx hardhat node` or `anvil`
  deployPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
}

const infuraIdKey = process.env.INFURA_ID as string;
const alchemyKey = process.env.ALCHEMY_API_KEY as string;

/**
 * Generates hardhat network configuration the test networks.
 * @param network
 * @param url (optional)
 * @returns {NetworkUserConfig}
 */
function createTestnetConfig(
  network: keyof typeof chainIds,
  url?: string
): NetworkUserConfig {
  if (!url) {
    url = `https://${network}.infura.io/v3/${infuraIdKey}`;
  }
  return {
    accounts: [deployPrivateKey],
    chainId: chainIds[network],
    allowUnlimitedContractSize: true,
    url,
  };
}

/**
 * Generates hardhat network configuration the mainnet networks.
 * @param network
 * @param url (optional)
 * @returns {NetworkUserConfig}
 */
function createMainnetConfig(
  network: keyof typeof chainIds,
  url?: string
): NetworkUserConfig {
  if (!url) {
    url = `https://${network}.infura.io/v3/${infuraIdKey}`;
  }
  return {
    accounts: [deployPrivateKey],
    chainId: chainIds[network],
    url,
  };
}

const abiExporter = [
  {
    path: "./abis/pretty",
    flat: true,
    clear: true,
    format: "fullName",
  },
  {
    path: "./abis/ugly",
    flat: true,
    clear: true,
  },
];

const dodoc = {
  outputDir: "./docs/contracts",
  exclude: ["contracts/dummy", "contracts/mocks"],
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 400,
      },
    },
    // @ts-ignore
  },
  networks: {
    // Main Networks
    mainnet: createMainnetConfig("mainnet"),
    "optimism-mainnet": createMainnetConfig("optimism-mainnet"),
    "pgn-mainnet": {
      accounts: [deployPrivateKey],
      chainId: chainIds["pgn-mainnet"],
      url: "https://rpc.publicgoods.network",
      gasPrice: 20000000000,
    },
    "fantom-mainnet": createMainnetConfig(
      "fantom-mainnet",
      "https://rpc.ftm.tools"
    ),
    arbitrumOne: {
      accounts: [deployPrivateKey],
      url: "https://arb1.arbitrum.io/rpc",
      chainId: chainIds["arbitrumOne-mainnet"],
    },
    "avalanche-mainnet": {
      accounts: [deployPrivateKey],
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: chainIds["avalanche-mainnet"],
      gasPrice: 25000000000,
    },
    polygon: {
      accounts: [deployPrivateKey],
      url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`,
      chainId: chainIds["polygon"],
      gas: "auto",
    },

    // Test Networks
    goerli: createTestnetConfig("goerli"),
    "optimism-goerli": {
      accounts: [deployPrivateKey],
      chainId: chainIds["optimism-goerli"],
      url: "https://goerli.optimism.io",
      gasPrice: 15000000,
    },
    "fantom-testnet": createTestnetConfig(
      "fantom-testnet",
      "https://rpc.testnet.fantom.network/"
    ),
    "pgn-sepolia": {
      accounts: [deployPrivateKey],
      chainId: chainIds["pgn-sepolia"],
      url: "https://sepolia.publicgoods.network",
      gasPrice: 15000000,
    },
    arbitrumGoerli: {
      accounts: [deployPrivateKey],
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: chainIds["arbitrum-goerli"],
    },
    "fuji-testnet": {
      accounts: [deployPrivateKey],
      url: "https://avalanche-fuji-c-chain.publicnode.com",
      chainId: chainIds["fuji-testnet"],
      gasPrice: 25000000000,
    },
    mumbai: {
      accounts: [deployPrivateKey],
      url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyKey}`,
      chainId: chainIds["mumbai"],
    },

    localhost: createTestnetConfig("localhost", "http://localhost:8545"),
    hardhat: {
      forking: {
        url: `https://goerli.infura.io/v3/${infuraIdKey}`,
        // blockNumber: 9188740, // A recent block where both AllowanceModule an Safe factory exist
      },
    },
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    excludeContracts: ["contracts/mocks", "contracts/dummy"],
  },
  etherscan: {
    apiKey: {
      // @ts-ignore
      mainnet: process.env.ETHERSCAN_API_KEY,
      // @ts-ignore
      goerli: process.env.ETHERSCAN_API_KEY,
      // @ts-ignore
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
      // @ts-ignore
      optimisticGoerli: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
      // @ts-ignore
      ftmTestnet: process.env.FTMSCAN_API_KEY,
      // @ts-ignore
      opera: process.env.FTMSCAN_API_KEY,
      // @ts-ignore
      "pgn-mainnet": process.env.PGNSCAN_API_KEY,
      // @ts-ignore
      "pgn-sepolia": process.env.PGNSCAN_API_KEY,
      // @ts-ignore
      arbitrumGoerli: process.env.ARBITRUM_API_KEY,
      // @ts-ignore
      arbitrumOne: process.env.ARBITRUM_API_KEY,
      // @ts-ignore
      "avalanche-mainnet": process.env.AVALANCHE_API_KEY,
      // @ts-ignore
      "fuji-testnet": process.env.AVALANCHE_API_KEY,
      // @ts-ignore
      polygon: process.env.POLYGONSCAN_API_KEY,
      // @ts-ignore
      mumbai: process.env.POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: "pgn-mainnet",
        chainId: chainIds["pgn-mainnet"],
        urls: {
          apiURL: "https://explorer.publicgoods.network/api",
          browserURL: "https://explorer.publicgoods.network",
        },
      },
      {
        network: "pgn-sepolia",
        chainId: chainIds["pgn-sepolia"],
        urls: {
          apiURL: "https://explorer.sepolia.publicgoods.network/api",
          browserURL: "https://explorer.sepolia.publicgoods.network",
        },
      },
      {
        network: "fuji-testnet",
        chainId: chainIds["fuji-testnet"],
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io/",
        },
      },
      {
        network: "avalanche-mainnet",
        chainId: chainIds["avalanche-mainnet"],
        urls: {
          apiURL: "https://api.snowtrace.io/api",
          browserURL: "https://snowtrace.io/",
        },
      },
      {
        network: "mumbai",
        chainId: chainIds["mumbai"],
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com/",
        },
      },
      {
        network: "polygon",
        chainId: chainIds["polygon"],
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com/",
        },
      },
    ],
  },
  abiExporter: abiExporter,
  dodoc: dodoc,
};

export default config;