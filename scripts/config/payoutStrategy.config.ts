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
    factory: "0x2A21CB7C82f20a92e03238Cb539002919546a422",
    implementation: "0x7Dc9D6A6c6a1F93478eDE87d09e20Bf8d5Faf6Bd",
    contract: "",
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
  "arbitrumGoerli": {
    factory: "0x8F8d78f119Aa722453d33d6881f4D400D67D054F",
    implementation: "0xCF50D794c639D57bA8D6BB8FaE34fBd1B89D7112",
    contract: "",
  },
  "arbitrumOne": {
    factory: "0x04b194b14532070F5cc8D3A760c9a0957D85ad5B",
    implementation: "0x5b55728e41154562ee80027C1247B13382692e5C",
    contract: "0xE8536d29e5325cB5cce0c1799caE80D6d0fAFDf3",
  },
};

// TODO: Update this file any time a new dummy voting contract has been deployed
export const DirectPayoutParams: DeployParams = {
  mainnet: {
    factory: "0xd07D54b0231088Ca9BF7DA6291c911B885cBC140",
    implementation: "0x3D77E65aEA55C0e07Cb018aB4Dc22D38cAD75921",
    contract: "",
  },
  goerli: {
    factory: "0x9c88730986A07223176fCaaC2Dd8214B9a286780",
    implementation: "0x7C9C52f09a1A362a1F0f7cd0EaCCAFEe38e6111b",
    contract: "",
  },
  "pgn-mainnet": {
    factory: "0x0c33c9dEF7A3d9961b802C6C6402d306b7D48135",
    implementation: "0x9A606A7E4A2eeD3649C1830A8c5B90cDB9859e9c",
    contract: "",
  },
  "pgn-sepolia": {
    factory: "0x3D77E65aEA55C0e07Cb018aB4Dc22D38cAD75921",
    implementation: "0xC3A195EEa198e74D67671732E1B8F8A23781D735",
    contract: "",
  },
  sepolia: {
    factory: "",
    implementation: "",
    contract: "",
  },
  "optimism-mainnet": {
    factory: "0x2Bb670C3ffC763b691062d671b386E51Cf1840f0",
    implementation: "0x534d2AAc03dCd0Cb3905B591BAf04C14A95426AB",
    contract: "",
  },
  "fantom-mainnet": {
    factory: "0x9B1Ee60B539a3761E328a621A3d980EE9385679a",
    implementation: "0xf78DCed8BA0baAeb982D068b786588d6B8D181cd",
    contract: "",
  },
  "fantom-testnet": {
    factory: "0x8eC471f30cA797FD52F9D37A47Be2517a7BD6912",
    implementation: "0xE1c5812e9831bc1d5BDcF50AAEc1a47C4508F3fA",
    contract: "",
  },
  "arbitrumGoerli": {
    factory: "0xCd3618509983FE4990D7770CF6f02c7145dC365F",
    implementation: "0xE1F4A28299966686c689223Ee7803258Dbde0942",
    contract: "",
  },
  "arbitrumOne": {
    factory: "0xc1a26b0789C3E93b07713e90596Cad8d0442C826",
    implementation: "0x74c3665540FC8B92Dd06a7e56a51eCa038C18180",
    contract: "",
  },
};
