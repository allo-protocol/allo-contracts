// This script deals with setting new application statuses.
// Ideally this would be done via the UI and not this script
import { ethers } from "hardhat";
import hre from "hardhat";
import { confirmContinue } from "../../utils/script-utils";
import { roundParams } from "../config/round.config";
import * as utils from "../utils";

utils.assertEnvironment();

const STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  CANCELED: 3,
};

const applicationStatusBitMapIndex = 0;

const projectIndexes: number[] = [0, 1, 2, 3];
const statusArray: number[] = [
  STATUS.PENDING,
  STATUS.ACCEPTED,
  STATUS.REJECTED,
  STATUS.CANCELED,
];

const buildNewState = (
  current: bigint,
  indexes: number[],
  statusArray: number[]
) => {
  let newState: bigint = current;

  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    const position = (index % 32) * 2;
    const mask = BigInt(~(BigInt(3) << BigInt(position)));
    newState = (newState & mask) | (BigInt(statusArray[i]) << BigInt(position));
  }

  return newState.toString();
};

export async function main() {
  const network = hre.network;

  const networkParams = roundParams[network.name];
  if (!networkParams) {
    throw new Error(`Invalid network ${network.name}`);
  }

  const contract = networkParams.roundContract;
  if (!contract) {
    throw new Error(`Missing contrat for network ${network.name}`);
  }

  const round = await ethers.getContractAt("RoundImplementation", contract);

  await confirmContinue({
    contract: "RoundImplementation",
    round: contract,
    network: network.name,
    chainId: network.config.chainId,
  });

  const currentStatuses = await round.applicationStatusesBitMap(
    applicationStatusBitMapIndex
  );
  const newState = buildNewState(BigInt(currentStatuses.toString()), projectIndexes, statusArray);

  const updateTx = await round.setApplicationStatuses(
    [applicationStatusBitMapIndex],
    [newState]
  );
  await updateTx.wait();

  console.log("✅ application statuses updated: ", updateTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
