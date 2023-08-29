import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import * as hre from "hardhat";
import { Wallet } from "zksync-web3";
import { confirmContinue } from "../utils/script-utils";

dotenv.config();

export default async function main() {
  console.info("Starting deployment of Allo Protocol on zkSync Era...");

  // Initialize the wallet
  const testMnemonic =
    "stick toy mercy cactus noodle company pear crawl tide deny pipe name";
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

  /** Deploy Registry */
  await confirmContinue({
    "contract"                                : "ProjectRegistry",
  });

  // Deploy the Project Registry contract
  // Load the artifact we want to deploy
  console.info("Deploying ProjectRegistry contract...");
  // Load artifact
  const ProjectRegistry = await deployer.loadArtifact("ProjectRegistry");

  // Estimate fee
  const projectRegistryDeploymentFee = await deployer.estimateDeployFee(
    ProjectRegistry,
    []
  );

  const parsedFee = ethers.utils.formatEther(
    projectRegistryDeploymentFee.toString()
  );
  console.info(`Estimated deployment fee: ${parsedFee} ETH`);

  // Deploy the contract
  const projectRegistryContractDeployment = await deployer.deploy(
    ProjectRegistry,
    []
  );

  // Show the contract info
  console.info(
    "ProjectRegistry deployed to:",
    projectRegistryContractDeployment.address
  );

  const registryVerifyId = await hre.run("verify:verify", {
    address: projectRegistryContractDeployment.address,
    contract: "contracts/projectRegistry/ProjectRegistry.sol:ProjectRegistry",
    constructorArguments: [],
    bytedcode:projectRegistryContractDeployment.bytecode,
  });
  
  console.info("ProjectRegistry verification ID: ", registryVerifyId);

  await confirmContinue({
    "contract"                                : "ProgramFactory",
  });

  // Deploy the Program Factory contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramFactory contract...");
  const ProgramFactory = await deployer.loadArtifact("ProgramFactory");

  // Estimate fee
  const programFactoryDeploymentFee = await deployer.estimateDeployFee(
    ProgramFactory,
    []
  );

  const parsedProgramFactoryFee = ethers.utils.formatEther(
    programFactoryDeploymentFee.toString()
  );
  console.info(`Estimated deployment fee: ${parsedProgramFactoryFee} ETH`);

  // Deploy the contract
  const programProxy = await hre.zkUpgrades.deployProxy(
    deployer.zkWallet,
    ProgramFactory,
    []
  );

  // Show the contract info
  console.info("ProgramFactory deployed to:", programProxy.address);

  const programFactoryVerifyId = await hre.run("verify:verify", {
    address: programProxy.address,
    contract: "contracts/program/ProgramFactory.sol:ProgramFactory",
    constructorArguments: [],
    bytedcode:programProxy.bytecode,
  });
  
  console.info("ProgramFactory verification ID: ", programFactoryVerifyId);

  await confirmContinue({
    "contract"                                : "ProgramImplementation",
  });

  /// Deploy the Program Implementation contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramImplementation contract...");
  const ProgramImplementation = await deployer.loadArtifact("ProgramImplementation");

  // Estimate fee
  const programImplementationDeploymentFee = await deployer.estimateDeployFee(ProgramImplementation, []);
  const parsedProgramImplementationFee = ethers.utils.formatEther(programImplementationDeploymentFee.toString());
  console.info(`Estimated deployment fee: ${parsedProgramImplementationFee} ETH`);

  // Deploy the contract
  const programImplementationContractDeployment = await deployer.deploy(ProgramImplementation, []);

  // Show the contract info
  console.info("ProgramImplementation deployed to:", programImplementationContractDeployment.address);

  // Link the ProgramFactory contract with the ProgramImplementation contract
  console.info("Linking ProgramFactory contract to ProgramImplementation contract...");
  const updateTx = await programProxy.updateProgramContract(
    programImplementationContractDeployment.address
  );
  await updateTx.wait();
  console.info("ProgramFactory contract linked to ProgramImplementation contract in tx", updateTx.hash);

  const programImplementationVerifyId = await hre.run("verify:verify", {
    address: programImplementationContractDeployment.address,
    contract: "contracts/program/ProgramImplementation.sol:ProgramImplementation",
    constructorArguments: [],
    bytedcode:programProxy.bytecode,
  });
  
  console.info("ProgramImplementation verification ID: ", programImplementationVerifyId);

  // /** Voting Strategy */
  const quadraticFundingVotingStrategy = await deployer.loadArtifact("QuadraticFundingVotingStrategyFactory");
  const quadraticFundingVotingStrategyFee = await deployer.estimateDeployFee(quadraticFundingVotingStrategy, []);
  const parsedQuadraticFundingVotingStrategyFee = ethers.utils.formatEther(quadraticFundingVotingStrategyFee.toString());
  console.info(`Estimated deployment fee: ${parsedQuadraticFundingVotingStrategyFee} ETH`);
  const QuadraticFundingVotingStrategyFactoryDeployment = await deployer.deploy(quadraticFundingVotingStrategy, []);

  console.info("QuadraticFundingVotingStrategyFactory deployed to", QuadraticFundingVotingStrategyFactoryDeployment.address);

  const qfImpFactory = await deployer.loadArtifact("QuadraticFundingVotingStrategyImplementation");
  const QfVotingImpFactoryDeployment = await deployer.deploy(qfImpFactory, []);
  await QfVotingImpFactoryDeployment.initialize();

  console.info("QuadraticFundingVotingStrategyImplementation deployed to", QfVotingImpFactoryDeployment.address);

  // todo: fixme, caller is not the owner error
  // let qfLink = await QuadraticFundingVotingStrategyFactoryDeployment.updateVotingContract(QfVotingImpFactoryDeployment.address);
  // console.info("QuadraticFundingVotingStrategyFactory linked to QuadraticFundingVotingStrategyImplementation in tx", qfLink.hash);

  // /** Merkle Payout Strategy */
  console.info("Deploying MerklePayoutStrategyFactory...");
  const merklePayoutStrategyFactory = await deployer.loadArtifact("MerklePayoutStrategyFactory");
  const MerklePayoutStrategyFactoryDeployment = await deployer.deploy(merklePayoutStrategyFactory, []);
  await MerklePayoutStrategyFactoryDeployment.initialize();

  console.info("MerklePayoutStrategyFactory deployed to", MerklePayoutStrategyFactoryDeployment.address);

  // let payoutLinkTx = await MerklePayoutStrategyFactoryDeployment.updatePayoutImplementation(MerklePayoutStrategyFactoryDeployment.address);
  // console.info("MerklePayoutStrategyFactory linked to MerklePayoutStrategyFactory in tx", payoutLinkTx.hash);

  // /* Round Factory */
  console.info("Deploying RoundFactory...");
  const roundFactory = await deployer.loadArtifact("RoundFactory");
  const RoundFactoryDeployment = await deployer.deploy(roundFactory, []);

  console.info("RoundFactory deployed to", RoundFactoryDeployment.address);

  console.info("Deploying AlloSettings...");
  const alloSettingsContract = await deployer.loadArtifact("AlloSettings");
  const AlloSettingsDeployment = await deployer.deploy(alloSettingsContract, []);
  console.info("AlloSettings deployed to", AlloSettingsDeployment.address);
  await AlloSettingsDeployment.initialize();
  console.info("AlloSettings initialized");

  // FIXME: caller is not the owner error
  // const alloLinkTx = await RoundFactoryDeployment.updateAlloSettings(AlloSettingsDeployment.address);
  // await alloLinkTx.wait();
  // console.info("RoundFactory linked to AlloSettings in tx", alloLinkTx.hash);

  console.info("Deploying RoundImplementation...");
  const roundImplementation = await deployer.loadArtifact("RoundImplementation");
  const RoundImplementationDeployment = await deployer.deploy(roundImplementation, []);

  console.info("RoundImplementation deployed to", RoundImplementationDeployment.address);

  // FIXME: caller is not the owner error
  // const roundLinkTx = await RoundFactoryDeployment.updateRoundImplementation(RoundImplementationDeployment.address);
  // await roundLinkTx.wait();

  // console.info("RoundFactory linked to RoundImplementation in tx", roundLinkTx.hash);

  const roundImpId = await hre.run("verify:verify", {
    address: RoundImplementationDeployment.address,
    contract: "contracts/round/RoundImplementation.sol:RoundImplementation",
    constructorArguments: [],
    bytedcode:roundImplementation.bytecode,
  });
  
  console.info("RoundImplementation verification ID: ", roundImpId);

  // todo: are we missing anything here?
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
