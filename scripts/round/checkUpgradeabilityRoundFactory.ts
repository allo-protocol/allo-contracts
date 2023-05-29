import { ethers, upgrades } from "hardhat";

// How to run: npx hardhat run scripts/round/checkUpgradeabilityRoundFactory.ts --network goerli
// todo: create a task instead of a script
async function main() {
  const roundFactory = await ethers.getContractFactory("RoundFactory");
  const address = "0x24F9EBFAdf095e0afe3d98635ee83CD72e49B5B0"; // on goerli

  // Validate that the provided address is a valid Ethereum address
  if (!ethers.utils.isAddress(address)) {
    throw new Error("Invalid address provided");
  }

  console.log("Validating upgradeability of:", address);

  // Validate the upgrade
  await upgrades.validateUpgrade(address, roundFactory);

  // Perform some operations on the upgraded contract version

  console.log("Upgrade has been successfully validated.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
