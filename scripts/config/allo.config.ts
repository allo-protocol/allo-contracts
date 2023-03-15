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
    alloSettingsContract: '0xf37a5987052282eFAaE92c2B8c350595C28b81e0',
    newProtocolFeePercentage: 1, // 1%
    newProtocolTreasury: '0xB8cEF765721A6da910f14Be93e7684e9a3714123',
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