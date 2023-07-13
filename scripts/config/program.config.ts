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
    programFactoryContract: '0xd5Fb00093Ebd30011d932cB69bb6313c550aB05f',
    programImplementationContract: '0xBA4999bd9Cea79a76442F1E1Fb0E5E448867E3bE',
    programContract: ''
  },
  "fantom-mainnet": {
    programFactoryContract: '0x4d1f64c7920262c8F78e989C9E7Bf48b7eC02Eb5',
    programImplementationContract: '0x5c1EDa32B5d2F8048a709f8b18B02AbEC68601D8',
    programContract: ''
  },
  "fantom-testnet": {
    programFactoryContract: '0x424C5C175fbd46CA0b27866044A5B956c6AbEe0D',
    programImplementationContract: '0xd07D54b0231088Ca9BF7DA6291c911B885cBC140',
    programContract: ''
  },
  "pgn-mainnet": {
    programFactoryContract: "0xd07D54b0231088Ca9BF7DA6291c911B885cBC140",
    programImplementationContract: "0x3D77E65aEA55C0e07Cb018aB4Dc22D38cAD75921",
    programContract: ""
  },
};