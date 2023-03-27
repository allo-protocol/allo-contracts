/* eslint-disable node/no-unpublished-import */
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as dotenv from "dotenv";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// eslint-disable-next-line no-unused-vars
import { Wallet } from "zksync-web3";

dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
  console.info("Starting deployment of Allo Protocol on zkSync Era...");

  // Initialize the wallet
  const testMnemonic = "stick toy mercy cactus noodle company pear crawl tide deny pipe name";
  const zkWallet = new Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? testMnemonic);

  // Create a deployer object
  const deployer = new Deployer(hre, zkWallet);

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
  // Load the artifact we want to deploy
  console.info("Deploying ProjectRegistry contract...");
  const ProjectRegistry = await deployer.loadArtifact("ProjectRegistry");

  // Estimate fee
  const projectRegistryDeploymentFee = await deployer.estimateDeployFee(ProjectRegistry, []);

  const parsedFee = ethers.utils.formatEther(projectRegistryDeploymentFee.toString());
  console.info(`Estimated deployment fee: ${parsedFee} ETH`);

  // Deploy the contract
  const projectRegistryContract = await deployer.deploy(ProjectRegistry, []);

  // Show the contract info
  console.info("ProjectRegistry deployed to:", projectRegistryContract.address);

  /// Deploy the Program Factory contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramFactory contract...");
  const ProgramFactory = await deployer.loadArtifact("ProgramFactory");

  // Estimate fee
  const programFactoryDeploymentFee = await deployer.estimateDeployFee(ProgramFactory, []);

  const parsedProgramFactoryFee = ethers.utils.formatEther(programFactoryDeploymentFee.toString());
  console.info(`Estimated deployment fee: ${parsedProgramFactoryFee} ETH`);

  // Deploy the contract
  const programFactoryContract = await deployer.deploy(ProgramFactory, []);

  // Initialize the ProgramFactory contract
  await programFactoryContract.initialize();

  // Show the contract info
  console.info("ProgramFactory deployed to:", programFactoryContract.address);

  /// Deploy the Program Implementation contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramImplementation contract...");
  const ProgramImplementation = await deployer.loadArtifact("ProgramImplementation");

  // Estimate fee
  const programImplementationDeploymentFee = await deployer.estimateDeployFee(ProgramImplementation, []);

  const parsedProgramImplementationFee = ethers.utils.formatEther(programImplementationDeploymentFee.toString());
  console.info(`Estimated deployment fee: ${parsedProgramImplementationFee} ETH`);

  // Deploy the contract
  const programImplementationContract = await deployer.deploy(ProgramImplementation, []);

  // Show the contract info
  console.info("ProgramImplementation deployed to:", programImplementationContract.address);

  /// Deploy the Program Factory contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramFactory contract...");
  // Link the ProgramFactory contract with the ProgramImplementation contract
  const updateTx = await programFactoryContract.updateProgramContract(
    programImplementationContract.address
  );
  await updateTx.wait();
  console.info("ProgramFactory contract linked to ProgramImplementation contract in tx", updateTx.hash);

  /** Voting Strategy */
  const quadraticFundingVotingStrategy = await deployer.loadArtifact("QuadraticFundingVotingStrategyFactory");
  const QuadraticFundingVotingStrategyFactoryDeployment = await deployer.deploy(quadraticFundingVotingStrategy, []);

  console.info("QuadraticFundingVotingStrategyFactory deployed to", QuadraticFundingVotingStrategyFactoryDeployment.address);

  const qfImpFactory = await deployer.loadArtifact("QuadraticFundingVotingStrategyImplementation");
  const QfVotingImpFactoryDeployment = await deployer.deploy(qfImpFactory, []);
  await QfVotingImpFactoryDeployment.initialize();
  
  console.info("QuadraticFundingVotingStrategyImplementation deployed to", QfVotingImpFactoryDeployment.address);

  // todo: fixme, caller is not the owner error
  // let qfLink = await QuadraticFundingVotingStrategyFactoryDeployment.updateVotingContract(QfVotingImpFactoryDeployment.address);
  // console.info("QuadraticFundingVotingStrategyFactory linked to QuadraticFundingVotingStrategyImplementation in tx", qfLink.hash);
  
  const merklePayoutStrategyFactory = await deployer.loadArtifact("MerklePayoutStrategyFactory");
  const MerklePayoutStrategyFactoryDeployment = await deployer.deploy(merklePayoutStrategyFactory, []);
  await MerklePayoutStrategyFactoryDeployment.initialize();

  console.info("MerklePayoutStrategyFactory deployed to", MerklePayoutStrategyFactoryDeployment.address);

  let payoutLinkTx = await MerklePayoutStrategyFactoryDeployment.updatePayoutImplementation(MerklePayoutStrategyFactoryDeployment.address);
  console.info("MerklePayoutStrategyFactory linked to MerklePayoutStrategyFactory in tx", payoutLinkTx.hash);

  /* Round Factory */
  const roundFactory = await deployer.loadArtifact("RoundFactory");
  const RoundFactoryDeployment = await deployer.deploy(roundFactory, []);

  console.info("RoundFactory deployed to", RoundFactoryDeployment.address);

  const alloSettingsContract = await deployer.loadArtifact("AlloSettings");
  const AlloSettingsDeployment = await deployer.deploy(alloSettingsContract, []);
  await AlloSettingsDeployment.initialize();
  await RoundFactoryDeployment.updateAlloSettings(AlloSettingsDeployment.address);

  const roundImplementation = await deployer.loadArtifact("RoundImplementation");
  const RoundImplementationDeployment = await deployer.deploy(roundImplementation, []);

  console.info("RoundImplementation deployed to", RoundImplementationDeployment.address);

  const roundLinkTx = await RoundFactoryDeployment.updateRoundImplementation(RoundImplementationDeployment.address);
  await roundLinkTx.wait();

  console.info("RoundFactory linked to RoundImplementation in tx", roundLinkTx.hash);
}
