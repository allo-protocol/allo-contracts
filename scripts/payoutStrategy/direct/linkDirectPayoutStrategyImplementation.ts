// This script deals with linking the implemention to the factory contract
import hre, { ethers } from "hardhat";
import { confirmContinue } from "../../../utils/script-utils";
import { DirectPayoutParams } from "../../config/payoutStrategy.config";
import * as utils from "../../utils";

utils.assertEnvironment();

export async function main(
  directPayoutStrategyFactoryContract?: string,
  directPayoutStrategyImplementationContract?: string
) {
  const network = hre.network;

  const networkParams = DirectPayoutParams[network.name];

  if (!networkParams) {
    throw new Error(`Invalid network ${network.name}`);
  }

  if (!directPayoutStrategyFactoryContract) {
    directPayoutStrategyFactoryContract = networkParams.factory;
  }

  if (!directPayoutStrategyImplementationContract) {
    directPayoutStrategyImplementationContract = networkParams.implementation;
  }

  if (!directPayoutStrategyFactoryContract) {
    throw new Error(`error: missing directPayoutStrategyFactoryContract`);
  }

  if (!directPayoutStrategyImplementationContract) {
    throw new Error(
      `error: missing directPayoutStrategyImplementationContract`
    );
  }

  const directFactory = await ethers.getContractAt(
    "DirectPayoutStrategyFactory",
    directPayoutStrategyFactoryContract
  );

  await confirmContinue({
    contract: "DirectPayoutStrategyFactory",
    directPayoutStrategyFactoryContract: directPayoutStrategyFactoryContract,
    directPayoutStrategyImplementationContract: directPayoutStrategyImplementationContract,
    network: network.name,
    chainId: network.config.chainId,
  });

  // Update PayoutImplementation
  const updateTx = await directFactory.updatePayoutImplementation(
    directPayoutStrategyImplementationContract
  );
  await updateTx.wait();

  console.log(
    "✅ DirectPayoutStrategyImplementation Contract linked to Direct Payout Strategy Contract",
    updateTx.hash
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
