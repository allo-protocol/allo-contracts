import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as dotenv from "dotenv";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { utils, Wallet } from "zksync-web3";

dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Starting deployment...");

  // Initialize the wallet
  const wallet = new Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? "");

  // Create a deployer object
  const deployer = new Deployer(hre, wallet);

  // OPTIONAL: Deposit funds to L2
  // Comment this block if you already have funds on zkSync.
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2),
  // });
  // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  /** Deploy Program */

  /// Deploy the Project Registry contract
  // Load the artifact(s)
  console.log("Deploying ProjectRegistry contract...");
  const ProjectRegistry = await deployer.loadArtifact("ProjectRegistry");

  // Estimate fee
  const deploymentFee = await deployer.estimateDeployFee(ProjectRegistry, []);

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`Estimated deployment fee: ${parsedFee} ETH`);

  // Deploy the contract
  const projectRegistryContract = await deployer.deploy(ProjectRegistry, []);

  // Show the contract info
  console.log("ProjectRegistry deployed to:", projectRegistryContract.address);

  /// Deploy the Program Factory contract
  // Load the artifact(s)
  console.log("Deploying ProgramFactory contract...");
  const ProgramFactory = await deployer.loadArtifact("ProgramFactory");

  // Estimate fee
  const programFactoryDeploymentFee = await deployer.estimateDeployFee(ProgramFactory, []);

  const parsedProgramFactoryFee = ethers.utils.formatEther(programFactoryDeploymentFee.toString());
  console.log(`Estimated deployment fee: ${parsedProgramFactoryFee} ETH`);

  // Deploy the contract
  const programFactoryContract = await deployer.deploy(ProgramFactory, []);

  // Show the contract info
  console.log("ProgramFactory deployed to:", programFactoryContract.address);

  /// Deploy the Program Implementation contract
  // Load the artifact(s)
  console.log("Deploying ProgramImplementation contract...");
  const ProgramImplementation = await deployer.loadArtifact("ProgramImplementation");

  // Estimate fee
  const programImplementationDeploymentFee = await deployer.estimateDeployFee(ProgramImplementation, []);

  const parsedProgramImplementationFee = ethers.utils.formatEther(programImplementationDeploymentFee.toString());
  console.log(`Estimated deployment fee: ${parsedProgramImplementationFee} ETH`);

  // Deploy the contract
  const programImplementationContract = await deployer.deploy(ProgramImplementation, []);

  // Show the contract info
  console.log("ProgramImplementation deployed to:", programImplementationContract.address);

  /// Deploy the Program Factory contract
  // Load the artifact(s)
  console.log("Deploying ProgramFactory contract...");
  // Link the ProgramFactory contract with the ProgramImplementation contract
  const updateTx = await programFactoryContract.updateProgramContract(
    programImplementationContract.address
  );
  await updateTx.wait();
}
