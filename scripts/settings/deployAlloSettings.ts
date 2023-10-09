// This script deals with deploying the AlloSettings on a given network
import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { confirmContinue, getBlocksToWait } from "../../utils/script-utils";
import * as utils from "../utils";

utils.assertEnvironment();

export async function main() {
  await confirmContinue({
    contract: "AlloSettings",
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  });

  // Deploy RoundImplementation
  const contractFactory = await ethers.getContractFactory("AlloSettings");
  const contract = await upgrades.deployProxy(contractFactory);

  console.log(`Deploying Upgradable AlloSettings to ${contract.address}`);

  await contract.deployTransaction.wait(getBlocksToWait(hre.network.name));
  console.log("✅ Deployed.");

  return contract.address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
