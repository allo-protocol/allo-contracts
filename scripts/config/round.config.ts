// Update this file any time a new contract has been deployed
type RoundParams = {
  roundImplementationContract: string;
  roundFactoryContract: string;
  roundContract?: string;
  newProtocolFeePercentage?: number;
  newProtocolTreasury?: string;
};

type DeployParams = Record<string, RoundParams>;

export const roundParams: DeployParams = {
  mainnet: {
    roundFactoryContract: "0x9Cb7f434aD3250d1656854A9eC7A71EceC6eE1EF",
    roundImplementationContract: "0x10825896637298473877b6610BB380be51D20D04",
    roundContract: "",
  },
  goerli: {
    roundFactoryContract: "0x60EF85011E1480BD21dFa636FDa7F6e2e3dbbDa7",
    roundImplementationContract: "0x71ffC79b386e8477A6deE69eb5abc50f7c614058",
    roundContract: "",
  },
  "optimism-mainnet": {
    roundFactoryContract: "0x04E753cFB8c8D1D7f776f7d7A033740961b6AEC2",
    roundImplementationContract: "0x4bbE502461D67d2cecB3834Ff2440510f33BE024",
    roundContract: "",
  },
  "fantom-mainnet": {
    roundFactoryContract: "0xfb08d1fD3a7c693677eB096E722ABf4Ae63B0B95",
    roundImplementationContract: "0x43F24E777A2a3717690784633c01c9F9122352BB",
    roundContract: "",
  },
  "fantom-testnet": {
    roundFactoryContract: "0x8AdFcF226dfb2fA73788Ad711C958Ba251369cb3",
    roundImplementationContract: "0xD9B7Ce1F68A93dF783A8519ed52b74f5DcF5AFE1",
    roundContract: "",
  },
  "pgn-mainnet": {
    roundFactoryContract: "0x8AdFcF226dfb2fA73788Ad711C958Ba251369cb3",
    roundImplementationContract: "0xD9B7Ce1F68A93dF783A8519ed52b74f5DcF5AFE1",
    roundContract: "",
  },
  arbitrumGoerli: {
    roundFactoryContract: "0xdf25423c9ec15347197Aa5D3a41c2ebE27587D59",
    roundImplementationContract: "0xfF94fAfC740Be8D2010304108266E7b90ed232fc",
    roundContract: "",
  },
  arbitrumOne: {
    roundFactoryContract: "0xF2a07728107B04266015E67b1468cA0a536956C8",
    roundImplementationContract: "0xc7722909fEBf7880E15e67d563E2736D9Bb9c1Ab",
    roundContract: "",
  },
  "avalanche-mainnet": {
    roundFactoryContract: "0x8eC471f30cA797FD52F9D37A47Be2517a7BD6912",
    roundImplementationContract: "0xE1c5812e9831bc1d5BDcF50AAEc1a47C4508F3fA",
    roundContract: "",
  },
  "fuji-testnet": {
    roundFactoryContract: "0x3615d870d5B760cea43693ABED70Cd8A9b59b3d8",
    roundImplementationContract: "0x292285C40E966520D5Fd8e4Ab91583C70bBa3dc0",
    roundContract: "",
  },
  "mumbai": {
    roundFactoryContract: "0xE1c5812e9831bc1d5BDcF50AAEc1a47C4508F3fA",
    roundImplementationContract: "0x359c9fD5ef57D4eDD6C8b42a351e12352DB0DaBC",
    roundContract: "",
  },
  polygon: {
    roundFactoryContract: "0x5ab68dCdcA37A1C2b09c5218e28eB0d9cc3FEb03",
    roundImplementationContract: "0xcE7c30DbcEC2a98B516E4C64fA4E3256AB813b10",
    roundContract: "",
  },
  "zksync-testnet": {
    roundFactoryContract: "0x0Bb6e2dfEaef0Db5809B3979717E99e053Cbae72",
    roundImplementationContract: "",
    roundContract: "",
  },
  "zksync-mainnet": {
    roundFactoryContract: "",
    roundImplementationContract: "",
    roundContract: "",
  },
  "base": {
    roundFactoryContract: "0xc7722909fEBf7880E15e67d563E2736D9Bb9c1Ab",
    roundImplementationContract: "0x8eC471f30cA797FD52F9D37A47Be2517a7BD6912",
    roundContract: "",
  },
};
