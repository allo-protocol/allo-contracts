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
    implementation: '0xB3Ee4800c93cBec7eD2a31050161240e4663Ff5E',
    contract: ''
  },
  "goerli": {
    factory: '0x06A6Cc566c5A88E77B1353Cdc3110C2e6c828e38',
    implementation: '0x6391D8315EDEe9Ce6F2A18c7D52D31EF1cD429BD',
    contract: '0x818A3C8F82667bd222faF84a954F35d2b0Eb6a78'
  },
  "optimism-mainnet": {
    factory: '0x838C5e10dcc1e54d62761d994722367BA167AC22',
    implementation: '0x268ef1E2c19c4D10CDb24A1C8D95b7FcA1bAdD01',
    contract: ''
  },
  "fantom-mainnet": {
    factory: '',
    implementation: '',
    contract: ''
  },
  "fantom-testnet": {
    factory: '',
    implementation: '',
    contract: ''
  }
};