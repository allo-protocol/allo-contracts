// Update this file any time a new contract has been deployed
type AlloSettingsParams = {
  alloSettingsContract: string;
  newProtocolFeePercentage: number;
  newProtocolTreasury: string;
};

type DeployParams = Record<string, AlloSettingsParams>;

export const AlloSettingsParams: DeployParams = {
  "mainnet": {
    alloSettingsContract: '',
    newProtocolFeePercentage: 0,
    newProtocolTreasury: '',
  },
  "goerli": {
    alloSettingsContract: '',
    newProtocolFeePercentage: 0,
    newProtocolTreasury: '',
  },
  "optimism-mainnet": {
    alloSettingsContract: '',
    newProtocolFeePercentage: 0,
    newProtocolTreasury: '',
  },
  "fantom-mainnet": {
    alloSettingsContract: '',
    newProtocolFeePercentage: 0,
    newProtocolTreasury: '',
  },
  "fantom-testnet": {
    alloSettingsContract: '',
    newProtocolFeePercentage: 0,
    newProtocolTreasury: '',
  }
};