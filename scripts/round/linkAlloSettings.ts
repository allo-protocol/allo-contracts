// This script deals with updating
import { ethers } from "hardhat";
import hre from "hardhat";
import { confirmContinue } from "../../utils/script-utils";
import { roundParams } from '../config/round.config';
import { AlloSettingsParams } from '../config/allo.config';

import * as utils from "../utils";

utils.assertEnvironment();

export async function main(roundFactoryContract?: string, alloSettingsContract?: string) {

  const network = hre.network;

  const roundNetworkParams = roundParams[network.name];
  const alloNetworkParams = AlloSettingsParams[network.name];

  if (!roundNetworkParams || !alloNetworkParams) {
    throw new Error(`Invalid network ${network.name}`);
  }

  if (!roundFactoryContract) {
    roundFactoryContract = roundNetworkParams.roundFactoryContract;
  }

  if (!alloSettingsContract) {
    alloSettingsContract = alloNetworkParams.alloSettingsContract;
  }

  if (!roundFactoryContract) {
    throw new Error(`error: missing roundFactoryContract`);
  }

  if (!alloSettingsContract) {
    throw new Error(`error: missing alloSettingsContract`);
  }

  const roundFactory = await ethers.getContractAt('RoundFactory', roundFactoryContract);

  await confirmContinue({
    "contract"                     : "RoundFactory",
    "roundFactoryContract"         : roundFactoryContract,
    "alloSettingsContract"         : alloSettingsContract,
    "network"                      : network.name,
    "chainId"                      : network.config.chainId
  });

  // Update alloSettingsContract
  const updateTx = await roundFactory.updateAlloSettings(alloSettingsContract)
  await updateTx.wait();

  console.log("✅ AlloSettingsContract Contract linked to Round Contract", updateTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
