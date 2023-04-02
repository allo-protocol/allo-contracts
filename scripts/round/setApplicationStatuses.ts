// This script deals with setting new application statuses.
// Ideally this would be done via the UI and not this script
import { ethers } from "hardhat";
import hre from "hardhat";
import { confirmContinue } from "../../utils/script-utils";
import { roundParams } from "../config/round.config";
import * as utils from "../utils";
import { buildStatusRow, ApplicationStatus } from "../../utils/applicationStatus";

utils.assertEnvironment();

const applicationStatusBitMapIndex = 0;

const statuses = [
  { index: 0, status: ApplicationStatus.PENDING },
  { index: 1, status: ApplicationStatus.ACCEPTED },
  { index: 2, status: ApplicationStatus.REJECTED },
  { index: 3, status: ApplicationStatus.CANCELED },
];

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
  const newState = buildStatusRow(
    BigInt(currentStatuses.toString()),
    statuses
  );

  const applicationStatus = {
    index: applicationStatusBitMapIndex,
    statusRow: newState,
  };

  const updateTx = await round.setApplicationStatuses([applicationStatus]);
  await updateTx.wait();

  console.log("✅ application statuses updated: ", updateTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
