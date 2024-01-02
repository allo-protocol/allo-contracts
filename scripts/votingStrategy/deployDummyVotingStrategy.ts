// This script deals with deploying the QuadraticFundingVotingStrategyFactory on a given network
import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { confirmContinue, getBlocksToWait } from "../../utils/script-utils";
import * as utils from "../utils";

utils.assertEnvironment();

export async function main() {
  await confirmContinue({
    contract: "DummyVotingStrategy",
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  });

  // Deploy QuadraticFundingVotingStrategyFactory
  const contractFactory = await ethers.getContractFactory(
    "DummyVotingStrategy"
  );
  const contract = await contractFactory.deploy();

  console.log(`Deploying DummyVotingStrategy to ${contract.address}`);

  await contract.deployTransaction.wait(getBlocksToWait(hre.network.name));
  console.log("✅ Deployed.");

  return contract.address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
