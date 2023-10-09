import hre, { ethers, upgrades } from "hardhat";
import { LedgerSigner } from "@anders-t/ethers-ledger";
import { confirmContinue, prettyNum } from "../../utils/script-utils";

async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = hre.network.name;
  let account;
  let accountAddress;

  account = (await ethers.getSigners())[0];
  accountAddress = await account.getAddress();
  const balance = await ethers.provider.getBalance(accountAddress);

  console.log("This script populates the local chain");

  const projectRegistry = await ethers.getContractAt(
    "ProjectRegistry",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    account
  );

  await projectRegistry.createProject({
    protocol: 1,
    pointer: "bafkreibqdvodcxbpcf2x7yrgqilvyysknrerlv25f7gnbhqnoo3jxoc274",
  });

  console.log("Chain populated");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
