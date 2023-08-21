// Update this file any time a new QF voting contract has been deployed
type QFVotingParams = {
  factory: string;
  implementation: string;
  contract: string;
};

type DeployParams = Record<string, QFVotingParams>;

export const QFVotingParams: DeployParams = {
  mainnet: {
    factory: "0x4a850F463D1C4842937c5Bc9540dBc803D744c9F",
    implementation: "0xDdC143f736f912Ae6AAF2fceF2C78b267745B0f2",
    contract: "",
  },
  goerli: {
    factory: "0x06A6Cc566c5A88E77B1353Cdc3110C2e6c828e38",
    implementation: "0x08186fEEa8115D1cf57bBE227e2C9bEa350cF40d",
    contract: "0x818A3C8F82667bd222faF84a954F35d2b0Eb6a78",
  },
  "optimism-mainnet": {
    factory: "0x838C5e10dcc1e54d62761d994722367BA167AC22",
    implementation: "0x27C43Ee6b8deF6Ad804Ca9106736a43FF9dFB6F1",
    contract: "",
  },
  "fantom-mainnet": {
    factory: "0x534d2AAc03dCd0Cb3905B591BAf04C14A95426AB",
    implementation: "0x87DeA2C57ac3Ab1df18D9aa327c3eE229147059f",
    contract: "",
  },
  "fantom-testnet": {
    factory: "0x545B282A50EaeA01A619914d44105437036CbB36",
    implementation: "0x2AFA4bE0f2468347A2F086c2167630fb1E58b725",
    contract: "",
  },
  "pgn-mainnet": {
    factory: "0x2AFA4bE0f2468347A2F086c2167630fb1E58b725",
    implementation: "0xF7c101A95Ea4cBD5DA0Ab9827D7B2C9857440143",
    contract: "",
  },
  "arbitrumGoerli": {
    factory: '0x0BFA0AAF5f2D81f859e85C8E82A3fc5b624fc6E8',
    implementation: '0x00CD233ae7F31DC3664401cb040f24f6bf615668',
    contract: ''
  }
};

// TODO: Update this file any time a new dummy voting contract has been deployed
export const DummyVotingParams: Record<string, { contract: string }> = {
  mainnet: {
    contract: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
  },
  goerli: {
    contract: "0x717A2cCDD81944e64c8BD9BB1D179A241dE14B46",
  },
  "pgn-mainnet": {
    contract: "0xcE7c30DbcEC2a98B516E4C64fA4E3256AB813b10",
  },
  "pgn-sepolia": {
    contract: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
  },
  "optimism-goerli": {
    contract: "0x424C5C175fbd46CA0b27866044A5B956c6AbEe0D",
  },
  sepolia: {
    contract: "0x3D77E65aEA55C0e07Cb018aB4Dc22D38cAD75921",
  },
  "optimism-mainnet": {
    contract: "0xB9fd0d433d2ca03D26A182Dc709bA1EccA3B00cC",
  },
  "fantom-mainnet": {
    contract: "0xB91749077A0dE932a4AE2b882d846ef9C53b9505",
  },
  "fantom-testnet": {
    contract: "0xc7722909fEBf7880E15e67d563E2736D9Bb9c1Ab",
  },
};
