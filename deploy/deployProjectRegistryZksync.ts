import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as dotenv from "dotenv";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { utils, Wallet } from "zksync-web3";

dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Deploying ProjectRegistry contract...");

  // Initialize the wallet
  const wallet = new Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? "");

  // Create a deployer object and load the artifact(s)
  const deployer = new Deployer(hre, wallet);
  const ProjectRegistry = await deployer.loadArtifact("ProjectRegistry");

  // Estimate fee
  const deploymentFee = await deployer.estimateDeployFee(ProjectRegistry, []);
 
  // OPTIONAL: Deposit funds to L2
  // Comment this block if you already have funds on zkSync.
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`Estimated deployment fee: ${parsedFee} ETH`);

  // Deploy the contract
  const projectRegistryContract = await deployer.deploy(ProjectRegistry, []);

  // Show the contract info
  console.log("ProjectRegistry deployed to:", projectRegistryContract.address);
}
