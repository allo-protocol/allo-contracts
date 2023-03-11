import { ethers } from "hardhat";
import hre from "hardhat";
import { confirmContinue } from "../../utils/script-utils";
import { AlloSettingsParams } from '../config/allo.config';
import * as utils from "../utils";

utils.assertEnvironment();
  
export async function main() {

  const network = hre.network;

  const networkParams = AlloSettingsParams[network.name];

  if (!networkParams) {
    throw new Error(`Invalid network ${network.name}`);
  }

  const alloSettingsContract = networkParams.alloSettingsContract;

  const alloSettings = await ethers.getContractAt('AlloSettings', alloSettingsContract);

  const currentProtocolFeePercentage = await alloSettings.protocolFeePercentage();
  const currentProtocolTreasury = await alloSettings.protocolTreasury();

  const newProtocolTreasury = networkParams.newProtocolTreasury;
  const newProtocolFeePercentage = networkParams.newProtocolFeePercentage;
  
  await confirmContinue({
    "info"                         : "set protocol percentage and treasury address",
    "alloSettingsContract"         : alloSettingsContract,
    "currentProtocolTreasury"      : currentProtocolTreasury,
    "newProtocolTreasury"          : newProtocolTreasury,
    "currentProtocolFeePercentage" : currentProtocolFeePercentage,
    "newProtocolFeePercentage"     : newProtocolFeePercentage,
    "network"                      : network.name,
    "chainId"                      : network.config.chainId
  });


  if (newProtocolTreasury && newProtocolTreasury != currentProtocolTreasury) {
    console.log("setting protocol fee treasury to: " + newProtocolTreasury);
    const tx = await alloSettings.updateProtocolTreasury(
      newProtocolTreasury
    );

    console.log("✅ Txn hash: " + tx.hash);
  }  

  if (newProtocolFeePercentage && newProtocolFeePercentage != currentProtocolFeePercentage) {
    console.log("setting protocol fee percentage to: " + newProtocolFeePercentage);
    const tx = await alloSettings.updateProtocolFeePercentage(
      newProtocolFeePercentage
    );

    console.log("✅ Txn hash: " + tx.hash);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
