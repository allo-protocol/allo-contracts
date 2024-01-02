// This script deals with deploying the RoundFactory on a given network
import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { confirmContinue, getBlocksToWait } from "../../utils/script-utils";
import * as utils from "../utils";

utils.assertEnvironment();

export async function main() {
  await confirmContinue({
    contract: "RoundFactory",
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  });

  // Deploy RoundImplementation
  const contractFactory = await ethers.getContractFactory("RoundFactory");
  const contract = await upgrades.deployProxy(contractFactory);

  console.log(`Deploying Upgradable RoundFactory to ${contract.address}`);

  await contract.deployTransaction.wait(getBlocksToWait(hre.network.name));
  console.log("✅ Deployed.");

  return contract.address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
