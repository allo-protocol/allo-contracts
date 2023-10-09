// This script deals with deploying the DirectPayoutStrategyFactory on a given network
import hre, { ethers, upgrades } from "hardhat";
import { confirmContinue, getBlocksToWait } from "../../../utils/script-utils";
import * as utils from "../../utils";

utils.assertEnvironment();

export async function main() {
  await confirmContinue({
    contract: "DirectPayoutStrategyFactory",
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  });

  // Deploy DirectPayoutStrategyFactory
  const contractFactory = await ethers.getContractFactory(
    "DirectPayoutStrategyFactory"
  );
  const contract = await upgrades.deployProxy(contractFactory);

  console.log(
    `Deploying Upgradable DirectPayoutStrategyFactory to ${contract.address}`
  );

  await contract.deployTransaction.wait(getBlocksToWait(hre.network.name));

  console.log("✅ Deployed.");

  return contract.address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
