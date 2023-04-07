// Update this file any time a new program contract has been deployed
type ProgramParams = {
  programFactoryContract: string;
  programImplementationContract: string;
  programContract: string
};

type DeployParams = Record<string, ProgramParams>;

export const programParams: DeployParams = {
  "mainnet": {
    programFactoryContract: '0x56296242CA408bA36393f3981879fF9692F193cC',
    programImplementationContract: '0x0BFA0AAF5f2D81f859e85C8E82A3fc5b624fc6E8',
    programContract: ''
  },
  "goerli": {
    programFactoryContract: '0x79Ba35cb31620db1b5b101A9A13A1b0A82B5BC9e',
    programImplementationContract: '0xe0281a20dFaCb0E179E6581c33542bC533DdC4AB',
    programContract: '0x6ac4C161768bDc64762f5C1c173af339e2E6a689'
  },
  "optimism-mainnet": {
    programFactoryContract: '',
    programImplementationContract: '',
    programContract: ''
  },
  "fantom-mainnet": {
    programFactoryContract: '0xe0281a20dFaCb0E179E6581c33542bC533DdC4AB',
    programImplementationContract: '0x21B0be8253DEdA0d2d8f010d06ED86093d52359b',
    programContract: '0x4fde273e009F58Aa0e5e09289242D5336FD18ad1'
  },
  "fantom-testnet": {
    programFactoryContract: '0xbB8f276FE1D52a38FbED8845bCefb9A23138Af92',
    programImplementationContract: '0xc76Ea06e2BC6476178e40E2B40bf5C6Bf3c40EF6',
    programContract: '0x3Cd6edA7fDF9ab6b6AF6E226Ce184569C5DF8Ae5'
  }
};