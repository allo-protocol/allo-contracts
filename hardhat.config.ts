import * as dotenv from "dotenv";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-upgradable";
import "@matterlabs/hardhat-zksync-verify";
// import "@nomiclabs/hardhat-etherscan";
// import "@nomiclabs/hardhat-solhint";
// import "@nomiclabs/hardhat-waffle";
// import "@openzeppelin/hardhat-upgrades";
// import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
// import "hardhat-abi-exporter";
// import "hardhat-contract-sizer";
// import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "solidity-coverage";

dotenv.config();

const chainIds = {
  // local
  localhost: 31337,
  // testnet
  goerli: 5,
  "fantom-testnet": 4002,
  "zksync-testnet": 280,

  // mainnet
  mainnet: 1,
  "optimism-mainnet": 10,
  "fantom-mainnet": 250,
  "zksync-mainnet": 324,
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

let deployPrivateKey = process.env.DEPLOYER_PRIVATE_KEY as string;
if (!deployPrivateKey) {
  deployPrivateKey =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
}

const infuraIdKey = process.env.INFURA_ID as string;

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
  },
  networks: {
    // Main Networks
    mainnet: { ...createMainnetConfig("mainnet"), zksync: false },
    "optimism-mainnet": {
      ...createMainnetConfig("optimism-mainnet"),
      zksync: false,
    },
    "fantom-mainnet": {
      ...createMainnetConfig("fantom-mainnet", "https://rpc.ftm.tools"),
      zksync: false,
    },
    "zksync-mainnet": {
      ...createMainnetConfig(
        "zksync-mainnet",
        "https://zksync2-mainnet.zksync.io"
      ),
      zksync: true,
      ethNetwork: "mainnet",
    },

    // Test Networks
    goerli: { ...createTestnetConfig("goerli"), zksync: false },
    "fantom-testnet": {
      ...createTestnetConfig(
        "fantom-testnet",
        "https://rpc.testnet.fantom.network/"
      ),
      zksync: false,
    },
    localhost: {
      ...createTestnetConfig("localhost", "http://localhost:8545"),
      zksync: false,
    },
    hardhat: { zksync: true },
    "zksync-testnet": {
      ...createTestnetConfig(
        "zksync-testnet",
        "https://zksync2-testnet.zksync.dev"
      ),
      zksync: true,
      ethNetwork: "goerli",
      verifyURL:
        "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
    },
  },
  defaultNetwork: "zksync-testnet",
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
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
      ftmTestnet: process.env.FTMSCAN_API_KEY,
      // @ts-ignore
      opera: process.env.FTMSCAN_API_KEY,
    },
  },
  abiExporter: abiExporter,
  dodoc: dodoc,
  zksolc: {
    version: "1.3.13",
    compilerSource: "binary",
    settings: {
      isSystem: true,
    },
  },
};

export default config;
