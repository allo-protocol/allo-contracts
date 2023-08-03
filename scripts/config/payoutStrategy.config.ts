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
    implementation: "0x2e86e1025605c9F2fff6851C6D5Ab04735BBfCF1",
    contract: "0xCB64FFd025384E6353C1923Ce5Bda511229e2E92",
  },
  "optimism-mainnet": {
    factory: "0xB5365543cdDa2C795AD104F4cB784EF3DB1CD383",
    implementation: "0x5d0fAd094C32F14315e4CaCbe7A83a7Cc5beC526",
    contract: "",
  },
  "fantom-mainnet": {
    factory: "0xFA1D9FF7F885757fc20Fdd9D78B72F88B00Cff77",
    implementation: "0x74312931C90bADE2Be38C96A61E2A41B3CE1a581",
    contract: "",
  },
  "fantom-testnet": {
    factory: "0x5b55728e41154562ee80027C1247B13382692e5C",
    implementation: "0xeAe0848c2A2395569cAaf3598cfc06B81b9b92D7",
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
    factory: "0x0077551e24bfB910aBABedC4336246e34B5fB0A2",
    implementation: "0xBd0Cf00aF5A5086d61777CC8704947242FC20629",
    contract: "",
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
