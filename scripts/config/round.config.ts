// Update this file any time a new contract has been deployed
type RoundParams = {
  roundImplementationContract: string;
  roundFactoryContract: string;
  roundContract ?: string;
  newProtocolFeePercentage?: number;
  newProtocolTreasury?: string;
};

type DeployParams = Record<string, RoundParams>;

export const roundParams: DeployParams = {
  "mainnet": {
    roundFactoryContract: '0x9Cb7f434aD3250d1656854A9eC7A71EceC6eE1EF',
    roundImplementationContract: '0x64ab6F2E11dF8B3Be5c8838eDe3951AC928daE9C',
    roundContract: '',
  },
  "goerli": {
    roundFactoryContract: '0x24F9EBFAdf095e0afe3d98635ee83CD72e49B5B0',
    roundImplementationContract: '0xb3767a07bB1b97a55B4d0BB4fB3135a945A32426',
    roundContract: '0xF7b7d21257DEaC12F75D901309026913429C9bdF',
  },
  "optimism-mainnet": {
    roundFactoryContract: '0x04E753cFB8c8D1D7f776f7d7A033740961b6AEC2',
    roundImplementationContract: '0x9cB0679806225080BfC3A9A72b09a71B95756a84',
    roundContract: ''
  },
  "fantom-mainnet": {
    roundFactoryContract: '',
    roundImplementationContract: '',
    roundContract: ''
  },
  "fantom-testnet": {
    roundFactoryContract: '',
    roundImplementationContract: '',
    roundContract: ''
  }
};