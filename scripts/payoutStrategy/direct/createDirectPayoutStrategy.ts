// This is a helper script to create a merkle payout contract.
// This should be created via the frontend and this script is meant to be used for quick test
import { ethers } from "hardhat";
import hre from "hardhat";
import { confirmContinue } from "../../../utils/script-utils";
import { DirectPayoutParams } from '../../config/payoutStrategy.config';
import { AlloSettingsParams } from '../../config/allo.config';
import * as utils from "../../utils";

utils.assertEnvironment();

export async function main() {

  const network = hre.network;

  const networkParams = DirectPayoutParams[network.name];
  const alloNetworkParams = AlloSettingsParams[network.name];

  if (!networkParams) {
    throw new Error(`Invalid network ${network.name}`);
  }

  const payoutFactoryContract = networkParams.factory;
  const payoutImplementationContract = networkParams.implementation;
  const alloSettingsContract = alloNetworkParams.alloSettingsContract;


  if (!payoutFactoryContract) {
    throw new Error(`error: missing factory`);
  }

  if (!payoutImplementationContract) {
    throw new Error(`error: missing implementation`);
  }

  if (!alloSettingsContract) {
    throw new Error(`error: missing alloSettingsContract`);
  }

  const DirectPayoutStrategyFactory = await ethers.getContractAt('DirectPayoutStrategyFactory', payoutFactoryContract);

  await confirmContinue({
    "info"                                        : "create a direct payout strategy contract",
    "DirectPayoutStrategyFactoryContract"         : payoutFactoryContract,
    "DirectPayoutStrategyImplementationContract"  : payoutImplementationContract,
    "network"                                     : network.name,
    "chainId"                                     : network.config.chainId
  });


  const payoutStrategyTx = await DirectPayoutStrategyFactory.create(
    alloSettingsContract,
    ethers.constants.AddressZero, // safe vault
    0, // round fee percentage
    ethers.constants.AddressZero // round fee address
  );

  const receipt = await payoutStrategyTx.wait();
  let payoutStrategyAddress;

  if (receipt.events) {
    const event = receipt.events.find(e => e.event === 'PayoutContractCreated');
    if (event && event.args) {
      payoutStrategyAddress = event.args.payoutContractAddress;
    }
  }

  console.log("✅ Txn hash: " + payoutStrategyTx.hash);
  console.log("✅ Direct Payout contract created: ", payoutStrategyAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
