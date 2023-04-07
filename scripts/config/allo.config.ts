// Update this file any time a new contract has been deployed
type AlloSettingsParams = {
  alloSettingsContract: string;
  newProtocolFeePercentage: number;
  newProtocolTreasury: string;
};

type DeployParams = Record<string, AlloSettingsParams>;

export const AlloSettingsParams: DeployParams = {
  "mainnet": {
    alloSettingsContract: '0x9fcC854b145Bd3640a01c49Aa2Cfa725Ed0B4210',
    newProtocolFeePercentage: 0,
    newProtocolTreasury: '',
  },
  "goerli": {
    alloSettingsContract: '0x2330b7ABA1DbC159E14113C0Ec56F273e2134F2c',
    newProtocolFeePercentage: 5000, // 5% == 5_000
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