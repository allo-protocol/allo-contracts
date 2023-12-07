// This is a helper script to create a program.
// This should be created via the frontend and this script is meant to be used for quick test
import * as ethers from "ethers";
import { Provider } from "zksync-web3";
import { confirmContinue } from "../../utils/script-utils";
import { programParams } from "../config/program.config";
import * as utils from "../utils";
import { encodeProgramParameters } from "../utils";

utils.assertEnvironment();

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "programContractAddress",
        type: "address",
      },
    ],
    name: "ProgramContractUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "programContractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "programImplementation",
        type: "address",
      },
    ],
    name: "ProgramCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedParameters",
        type: "bytes",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "programContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newProgramContract",
        type: "address",
      },
    ],
    name: "updateProgramContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export async function main() {
  const network = "zksync-testnet";
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const signer = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY as string,
    provider
  );

  const networkParams = programParams[network];
  if (!networkParams) {
    throw new Error(`Invalid network ${network}`);
  }

  const programFactoryContract = networkParams.programFactoryContract;
  const programImplementationContract =
    networkParams.programImplementationContract;

  if (!programFactoryContract) {
    throw new Error(`error: missing programFactoryContract`);
  }

  const programFactory = new ethers.Contract(
    programFactoryContract,
    abi,
    signer
  );

  await confirmContinue({
    info: "create a Program",
    programFactoryContract: programFactoryContract,
    network: network,
    chainId: 280,
  });

  const params = [
    {
      protocol: 1,
      pointer: "bafybeif43xtcb7zfd6lx7rfq42wjvpkbqgoo7qxrczbj4j4iwfl5aaqv2q",
    }, // _metaPtr
    [
      "0x5cdb35fADB8262A3f88863254c870c2e6A848CcA",
      "0xB8cEF765721A6da910f14Be93e7684e9a3714123",
      "0xA2A6460f20E43dcC5F8f55714A969500c342d7CE",
      "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
    ], // _adminRoles
    [
      "0x5cdb35fADB8262A3f88863254c870c2e6A848CcA",
      "0xB8cEF765721A6da910f14Be93e7684e9a3714123",
      "0xA2A6460f20E43dcC5F8f55714A969500c342d7CE",
      "0xf4c5c4deDde7A86b25E7430796441e209e23eBFB",
      "0x4873178BeA2DCd7022f0eF6c70048b0e05Bf9017",
      "0x6e8C1ADaEDb9A0A801dD50aFD95b5c07e9629C1E",
      "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
    ], // _programOperators
  ];

  const encodedParameters = encodeProgramParameters(params);

  const programTx = await programFactory.create(encodedParameters);

  const receipt = await programTx.wait();
  let programAddress;

  if (receipt.events) {
    const event = receipt.events.find((e: any) => e.event === "ProgramCreated");
    if (event && event.args) {
      programAddress = event.args.programContractAddress;
    }
  }

  console.log("✅ Txn hash: " + programTx.hash);
  console.log("✅ Program created: ", programAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
