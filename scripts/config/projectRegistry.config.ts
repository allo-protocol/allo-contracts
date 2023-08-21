// Update this file any time a new project registry contract has been deployed / upgraded
type ProjectRegistryParams = {
  proxyContractAddress: string;
};

type DeployParams = Record<string, ProjectRegistryParams>;

export const projectRegistryParams: DeployParams = {
  mainnet: {
    proxyContractAddress: "",
  },
  goerli: {
    proxyContractAddress: "0xa71864fAd36439C50924359ECfF23Bb185FFDf21",
  },
  "optimism-mainnet": {
    proxyContractAddress: "",
  },
  "fantom-mainnet": {
    proxyContractAddress: "0xAdcB64860902A29c3e408586C782A2221d595B55",
  },
  "fantom-testnet": {
    proxyContractAddress: "0x5e5b7D871efDE8224390a334045e1dcb7daAf4E2",
  },
  "pgn-mainnet": {
    proxyContractAddress: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
  },
  arbitrumGoerli: {
    proxyContractAddress: "0x0CD135777dEaB6D0Bb150bDB0592aC9Baa4d0871",
  },
  arbitrumOne: {
    proxyContractAddress: "0x73AB205af1476Dc22104A6B8b3d4c273B58C6E27",
  },
};
