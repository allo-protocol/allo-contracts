// Update this file any time a new Payout Strategy contract has been added
type MerklePayoutParams = {
  factory: string;
  implementation: string;
  contract: string;
};

type DeployParams = Record<string, MerklePayoutParams>;

export const MerklePayoutParams: DeployParams = {
  mainnet: {
    factory: "0x8F8d78f119Aa722453d33d6881f4D400D67D054F",
    implementation: "0xfF94fAfC740Be8D2010304108266E7b90ed232fc",
    contract: "",
  },
  goerli: {
    factory: "0xE2Bf906f7d10F059cE65769F53fe50D8E0cC7cBe",
    implementation: "0x3e7f72DFeDF6ba1BcBFE77A94a752C529Bb4429E",
    contract: "0x3172a6cCE26529e7DD2B533e7c3622a0b544f349",
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
