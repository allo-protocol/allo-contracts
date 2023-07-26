// Update this file any time a new QF voting contract has been deployed
type QFVotingParams = {
  factory: string;
  implementation: string;
  contract: string
};

type DeployParams = Record<string, QFVotingParams>;

export const QFVotingParams: DeployParams = {
  "mainnet": {
    factory: '0x4a850F463D1C4842937c5Bc9540dBc803D744c9F',
    implementation: '0xDdC143f736f912Ae6AAF2fceF2C78b267745B0f2',
    contract: ''
  },
  "goerli": {
    factory: '0x06A6Cc566c5A88E77B1353Cdc3110C2e6c828e38',
    implementation: '0x08186fEEa8115D1cf57bBE227e2C9bEa350cF40d',
    contract: '0x818A3C8F82667bd222faF84a954F35d2b0Eb6a78'
  },
  "optimism-mainnet": {
    factory: '0x838C5e10dcc1e54d62761d994722367BA167AC22',
    implementation: '0x27C43Ee6b8deF6Ad804Ca9106736a43FF9dFB6F1',
    contract: ''
  },
  "fantom-mainnet": {
    factory: '0x534d2AAc03dCd0Cb3905B591BAf04C14A95426AB',
    implementation: '0x87DeA2C57ac3Ab1df18D9aa327c3eE229147059f',
    contract: ''
  },
  "fantom-testnet": {
    factory: '0x545B282A50EaeA01A619914d44105437036CbB36',
    implementation: '0x2AFA4bE0f2468347A2F086c2167630fb1E58b725',
    contract: ''
  },
  "pgn-mainnet": {
    factory: '0x2AFA4bE0f2468347A2F086c2167630fb1E58b725',
    implementation: '0xF7c101A95Ea4cBD5DA0Ab9827D7B2C9857440143',
    contract: ''
  },
  "celo-testnet": {
    factory: '0xdb064d7645b050C82065dAb95E1f29351407885E',
    implementation: '0x6d9E48380F7eA5D78986945D4e133b50b0f0Db02',
    contract: ''
  },
};