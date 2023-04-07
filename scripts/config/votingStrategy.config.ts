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
    implementation: '0x114885035DAF6f8E09BE55Ed2169d41A512dad45',
    contract: '0x818A3C8F82667bd222faF84a954F35d2b0Eb6a78'
  },
  "optimism-mainnet": {
    factory: '0x838C5e10dcc1e54d62761d994722367BA167AC22',
    implementation: '0x268ef1E2c19c4D10CDb24A1C8D95b7FcA1bAdD01',
    contract: ''
  },
  "fantom-mainnet": {
    factory: '0x06A6Cc566c5A88E77B1353Cdc3110C2e6c828e38',
    implementation: '0xa71864fAd36439C50924359ECfF23Bb185FFDf21',
    contract: '0x818A3C8F82667bd222faF84a954F35d2b0Eb6a78'
  },
  "fantom-testnet": {
    factory: '0x6038fd0D126CA1D0b2eA8897a06575100f7b16C2',
    implementation: '0x1eBBf0FC753e03f13Db456A3686523Fc589E4f67',
    contract: '0x02B52C3a398567AdFffb3396d6eE3d3c2bff37fE'
  }
};