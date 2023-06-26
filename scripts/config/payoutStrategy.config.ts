// Update this file any time a new Payout Strategy contract has been added
type PayoutParams = {
  factory: string;
  implementation: string;
  contract: string;
};

type DeployParams = Record<string, PayoutParams>;

export const MerklePayoutParams: DeployParams = {
  mainnet: {
    factory: "0x8F8d78f119Aa722453d33d6881f4D400D67D054F",
    implementation: "0xf166786c1b49395F0300e52E8479712B0089FA65",
    contract: "",
  },
  goerli: {
    factory: "0xE2Bf906f7d10F059cE65769F53fe50D8E0cC7cBe",
    implementation: "0xC808c9Ea4020E0F6Ec20715EEA0642fA6870B5Cc",
    contract: "0xCB64FFd025384E6353C1923Ce5Bda511229e2E92",
  },
  "optimism-mainnet": {
    factory: "0xB5365543cdDa2C795AD104F4cB784EF3DB1CD383",
    implementation: "0x0C1B55f485dF69cc10527995c48883438aD3fC4A",
    contract: "",
  },
  "fantom-mainnet": {
    factory: "0xFA1D9FF7F885757fc20Fdd9D78B72F88B00Cff77",
    implementation: "0x5FFc749cb926349fAf05EA81D157AA9E94Dd6301",
    contract: "",
  },
  "fantom-testnet": {
    factory: "0x5b55728e41154562ee80027C1247B13382692e5C",
    implementation: "0x27efa1C90e097c980c669AB1a6e326AD4164f1Cb",
    contract: "",
  },
  "pgn-mainnet": {
    factory: "0x27efa1C90e097c980c669AB1a6e326AD4164f1Cb",
    implementation: "0xc1a26b0789C3E93b07713e90596Cad8d0442C826",
    contract: "",
  },
};

export const DirectPayoutParams: DeployParams = {
  mainnet: {
    factory: "",
    implementation: "",
    contract: "",
  },
  goerli: {
    factory: "0x51cDB7de5476e3B85Ca76FEcD63862adc343aAe6",
    implementation: "0xAEd1cE441FA6aD4F89d28026F3E7491394deEa5F",
    contract: "0xe14c00F31fBF325FE35f461e6cb821286F6cF040",
  },
  "optimism-mainnet": {
    factory: "",
    implementation: "",
    contract: "",
  },
  "fantom-mainnet": {
    factory: "",
    implementation: "",
    contract: "",
  },
  "fantom-testnet": {
    factory: "",
    implementation: "",
    contract: "",
  },
};
