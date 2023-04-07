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
    roundImplementationContract: '0x1c582D2c6Abdc3E53cB6c5747C7c3bb96663Ab77',
    roundContract: '0xF7b7d21257DEaC12F75D901309026913429C9bdF',
  },
  "optimism-mainnet": {
    roundFactoryContract: '0x04E753cFB8c8D1D7f776f7d7A033740961b6AEC2',
    roundImplementationContract: '0x4bE4B959Ee75226C517E1ABe5d9FEAD275583b2A',
    roundContract: ''
  },
  "fantom-mainnet": {
    roundFactoryContract: '0x3e7f72DFeDF6ba1BcBFE77A94a752C529Bb4429E',
    roundImplementationContract: '0xC2B0d8dAdB88100d8509534BB8B5778d1901037d',
    roundContract: '0x866485759ABC95c36FA77B216A5AdbA4275a14aB'
  },
  "fantom-testnet": {
    roundFactoryContract: '0x00F51ba2Cd201F4bFac0090F450de0992a838762',
    roundImplementationContract: '0x635E69237C0428861EC8c5D8083e9616022c89Ea',
    roundContract: '0xd3E45c78050a6472e28b9E02AA8596F7868e63d6'
  }
};