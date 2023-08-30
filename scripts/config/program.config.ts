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
    programFactoryContract: '0x2562e3035905e62723fe85467bA4c9314df7A5e4',
    programImplementationContract: '0xb4373B79bf5e2d397f81a9974ff66257B13E6c02',
    programContract: '0xd071F2330D716c47F86000a223AEA1A0355a66bF'
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
  "arbitrumGoerli": {
    programFactoryContract: "0xd39b40aC9279EeeB86FBbDeb2C9acDF16e16cF89",
    programImplementationContract: "0x9fcC854b145Bd3640a01c49Aa2Cfa725Ed0B4210",
    programContract: ""
  },
  "arbitrumOne": {
    programFactoryContract: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
    programImplementationContract: "0x424C5C175fbd46CA0b27866044A5B956c6AbEe0D",
    programContract: ""
  },
  "avalanche-mainnet": {
    programFactoryContract: "0xd07D54b0231088Ca9BF7DA6291c911B885cBC140",
    programImplementationContract: "0x3D77E65aEA55C0e07Cb018aB4Dc22D38cAD75921",
    programContract: ""
  },
  "fuji-testnet": {
    programFactoryContract: "0x862D7F621409cF572f179367DdF1B7144AcE1c76",
    programImplementationContract: "0x56296242CA408bA36393f3981879fF9692F193cC",
    programContract: ""
  }
};
