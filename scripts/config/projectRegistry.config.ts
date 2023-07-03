// Update this file any time a new project registry contract has been deployed / upgraded
type ProjectRegistryParams = {
  proxyContactAddress: string;
};

type DeployParams = Record<string, ProjectRegistryParams>;

export const projectRegistryParams: DeployParams = {
  "mainnet": {
    proxyContactAddress: '',
  },
  "goerli": {
    proxyContactAddress: '0xa71864fAd36439C50924359ECfF23Bb185FFDf21',
  },
  "optimism-mainnet": {
    proxyContactAddress: '',
  },
  "fantom-mainnet": {
    proxyContactAddress: '',
  },
  "fantom-testnet": {
    proxyContactAddress: '0x5e5b7D871efDE8224390a334045e1dcb7daAf4E2',
  }
};