// Update this file any time a new project registry contract has been deployed / upgraded
type ProjectRegistryParams = {
  proxyContractAddress: string;
};

type DeployParams = Record<string, ProjectRegistryParams>;

export const projectRegistryParams: DeployParams = {
  mainnet: {
    proxyContractAddress: ""
  },
  goerli: {
    proxyContractAddress: "0x9C789Ad2457A605a0ea1aaBEEf16585633530069"
  },
  "optimism-mainnet": {
    proxyContractAddress: "",
  },
  "fantom-mainnet": {
    proxyContractAddress: "0xAdcB64860902A29c3e408586C782A2221d595B55"
  },
  "fantom-testnet": {
    proxyContractAddress: "0x5e5b7D871efDE8224390a334045e1dcb7daAf4E2"
  },
  "pgn-mainnet": {
    proxyContractAddress: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e"
  },
  arbitrumGoerli: {
    proxyContractAddress: "0x0CD135777dEaB6D0Bb150bDB0592aC9Baa4d0871"
  },
  arbitrumOne: {
    proxyContractAddress: "0x73AB205af1476Dc22104A6B8b3d4c273B58C6E27"
  },
  "fuji-testnet": {
    proxyContractAddress: "0x8918401DD47f1645fF1111D8E513c0404b84d5bB"
  },
  "avalanche-mainnet": {
    proxyContractAddress: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e"
  },
  mumbai: {
    proxyContractAddress: "0x545B282A50EaeA01A619914d44105437036CbB36",
  },
  polygon: {
    proxyContractAddress: "0x5C5E2D94b107C7691B08E43169fDe76EAAB6D48b",
  },
  "zksync-testnet": {
    proxyContractAddress: "0x2C17D0FAb47bD87333714dC35f84BB669951cea6",
  },
  "zksync-mainnet": {
    proxyContractAddress: "0x1593FAA41134544354a1509566DDf8D6596e7348",
  },
  "base": {
    proxyContractAddress: "0xA78Daa89fE9C1eC66c5cB1c5833bC8C6Cb307918"
  }
};

