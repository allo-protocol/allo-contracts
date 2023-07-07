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
    roundImplementationContract: "0xbB614e55cf43842B3Ee96CfD7410E9487c627EFe",
    roundContract: "",
  },
  goerli: {
    roundFactoryContract: "0x24F9EBFAdf095e0afe3d98635ee83CD72e49B5B0",
    roundImplementationContract: "0xaac7adBa10199d1ffA883928DE7dE73e8207CbDf",
    roundContract: "0xF7b7d21257DEaC12F75D901309026913429C9bdF",
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
};
