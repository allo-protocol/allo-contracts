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
    contract: "ProjectRegistry",
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

  await projectRegistryContractDeployment.deployed();

  // Show the contract info
  console.info(
    "ProjectRegistry deployed to:",
    projectRegistryContractDeployment.address
  );

  /** Deploy Program Factory */
  await confirmContinue({
    contract: "ProgramFactory",
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

  await programProxy.deployed();

  // Show the contract info
  console.info("ProgramFactory deployed to:", programProxy.address);

  /** Deploy Program Implementation */
  await confirmContinue({
    contract: "ProgramImplementation",
  });

  // Load the artifact
  console.info("Deploying ProgramImplementation contract...");
  const ProgramImplementation = await deployer.loadArtifact(
    "ProgramImplementation"
  );

  // Estimate fee
  const programImplementationDeploymentFee = await deployer.estimateDeployFee(
    ProgramImplementation,
    []
  );
  const parsedProgramImplementationFee = ethers.utils.formatEther(
    programImplementationDeploymentFee.toString()
  );
  console.info(
    `Estimated deployment fee: ${parsedProgramImplementationFee} ETH`
  );

  // Deploy the contract
  const programImplementationContractDeployment = await deployer.deploy(
    ProgramImplementation,
    []
  );

  await programImplementationContractDeployment.deployed();

  // Show the contract info
  console.info(
    "ProgramImplementation deployed to:",
    programImplementationContractDeployment.address
  );

  // Link the ProgramFactory contract with the ProgramImplementation contract
  console.info(
    "Linking ProgramFactory contract to ProgramImplementation contract..."
  );
  const updateTx = await programProxy.updateProgramContract(
    programImplementationContractDeployment.address
  );
  await updateTx.wait();
  console.info(
    "ProgramFactory contract linked to ProgramImplementation contract in tx",
    updateTx.hash
  );

  /** Deploy Voting Factory */
  await confirmContinue({
    contract: "QuadraticFundingVotingStrategyFactory",
  });
  const quadraticFundingVotingStrategyFactory = await deployer.loadArtifact(
    "QuadraticFundingVotingStrategyFactory"
  );
  const quadraticFundingVotingStrategyFactoryFee =
    await deployer.estimateDeployFee(quadraticFundingVotingStrategyFactory, []);
  const parsedQuadraticFundingVotingStrategyFactoryFee =
    ethers.utils.formatEther(
      quadraticFundingVotingStrategyFactoryFee.toString()
    );
  console.info(
    `Estimated deployment fee: ${parsedQuadraticFundingVotingStrategyFactoryFee} ETH`
  );
  const QuadraticFundingVotingStrategyFactoryDeployment = await deployer.deploy(
    quadraticFundingVotingStrategyFactory,
    []
  );

  await QuadraticFundingVotingStrategyFactoryDeployment.deployed();
  await QuadraticFundingVotingStrategyFactoryDeployment.initialize();

  console.info(
    "QuadraticFundingVotingStrategyFactory deployed to",
    QuadraticFundingVotingStrategyFactoryDeployment.address
  );

  /** Deploy Voting Implementation */
  await confirmContinue({
    contract: "QuadraticFundingVotingStrategyImplementation",
  });
  const qfImpFactory = await deployer.loadArtifact(
    "QuadraticFundingVotingStrategyImplementation"
  );
  const QfVotingImpFactoryDeployment = await deployer.deploy(qfImpFactory, []);

  await QfVotingImpFactoryDeployment.deployed();
  await QfVotingImpFactoryDeployment.initialize();

  console.info(
    "QuadraticFundingVotingStrategyImplementation deployed to",
    QfVotingImpFactoryDeployment.address
  );

  console.info("Linking QuadraticFundingVotingStrategyFactory to implementation");
  let qfLink =
    await QuadraticFundingVotingStrategyFactoryDeployment.updateVotingContract(
      QfVotingImpFactoryDeployment.address
    );
  console.info(
    "QuadraticFundingVotingStrategyFactory linked to QuadraticFundingVotingStrategyImplementation in tx",
    qfLink.hash
  );
  console.info("Linked QuadraticFundingVotingStrategyFactory to implementation");

  // /** Merkle Payout Strategy */
  await confirmContinue({
    contract: "MerklePayoutStrategyFactory",
  });
  console.info("Deploying MerklePayoutStrategyFactory...");
  const merklePayoutStrategyFactory = await deployer.loadArtifact(
    "MerklePayoutStrategyFactory"
  );
  const MerklePayoutStrategyFactoryDeployment = await deployer.deploy(
    merklePayoutStrategyFactory,
    []
  );

  await MerklePayoutStrategyFactoryDeployment.deployed();
  await MerklePayoutStrategyFactoryDeployment.initialize();

  console.info(
    "MerklePayoutStrategyFactory deployed to",
    MerklePayoutStrategyFactoryDeployment.address
  );

  await confirmContinue({
    contract: "MerklePayoutStrategyImplementation",
  });
  const merklePayoutStrategyImplementation = await deployer.loadArtifact(
    "MerklePayoutStrategyImplementation"
  );
  const MerklePayoutStrategyImplementationDeployment = await deployer.deploy(
    merklePayoutStrategyImplementation,
    []
  );

  await MerklePayoutStrategyImplementationDeployment.deployed();
  await MerklePayoutStrategyImplementationDeployment.initialize();

  let payoutLinkTx =
    await MerklePayoutStrategyFactoryDeployment.updatePayoutImplementation(
      MerklePayoutStrategyImplementationDeployment.address
    );
  console.info(
    "MerklePayoutStrategyImplementation linked to MerklePayoutStrategyFactory in tx",
    payoutLinkTx.hash
  );

  // /* Round Factory */
  await confirmContinue({
    contract: "RoundFactory",
  });
  console.info("Deploying RoundFactory...");
  const roundFactory = await deployer.loadArtifact("RoundFactory");
  const RoundFactoryDeployment = await deployer.deploy(roundFactory, []);

  await RoundFactoryDeployment.deployed();
  await RoundFactoryDeployment.initialize();

  console.info("RoundFactory deployed to", RoundFactoryDeployment.address);

  /* Deploy Allo Settings */
  await confirmContinue({
    contract: "AlloSettings",
  });
  console.info("Deploying AlloSettings...");
  const alloSettingsContract = await deployer.loadArtifact("AlloSettings");
  const AlloSettingsDeployment = await deployer.deploy(
    alloSettingsContract,
    []
  );

  await AlloSettingsDeployment.deployed();
  console.info("AlloSettings deployed to", AlloSettingsDeployment.address);
  await AlloSettingsDeployment.initialize();
  console.info("AlloSettings initialized");

  const alloLinkTx = await RoundFactoryDeployment.updateAlloSettings(
    AlloSettingsDeployment.address
  );
  await alloLinkTx.wait();
  console.info("RoundFactory linked to AlloSettings in tx", alloLinkTx.hash);

  await confirmContinue({
    contract: "RoundImplementation",
  });
  console.info("Deploying RoundImplementation...");
  const roundImplementation = await deployer.loadArtifact(
    "RoundImplementation"
  );
  const RoundImplementationDeployment = await deployer.deploy(
    roundImplementation,
    []
  );

  await RoundImplementationDeployment.deployed();

  console.info(
    "RoundImplementation deployed to",
    RoundImplementationDeployment.address
  );

  const roundLinkTx = await RoundFactoryDeployment.updateRoundImplementation(
    RoundImplementationDeployment.address
  );
  await roundLinkTx.wait();

  console.info(
    "RoundFactory linked to RoundImplementation in tx",
    roundLinkTx.hash
  );

  await confirmContinue({
    verify: "verify all deployed contracts",
  });

  console.info("Waiting for 30 seconds for the blocks to mine...");
  setTimeout(async () => {
    try {
      try {
        const registryVerifyId = await hre.run("verify:verify", {
          address: projectRegistryContractDeployment.address,
          contract:
            "contracts/projectRegistry/ProjectRegistry.sol:ProjectRegistry",
          constructorArguments: [],
          bytedcode: projectRegistryContractDeployment.bytecode,
        });

        console.info("ProjectRegistry verification ID: ", registryVerifyId);
      } catch (error) {
        console.error("ProjectRegistry verification", error);
      }

      //! fixme: ProgramFactory verify is not working for some reason... need to investigate cc: @thelostone-mc
      try {
        const programFactoryVerifyId = await hre.run("verify:verify", {
          address: programProxy.address,
          constructorArguments: [],
          bytedcode: programProxy.bytecode,
        });

        console.info(
          "ProgramFactory verification ID: ",
          programFactoryVerifyId
        );
      } catch (error) {
        console.error("ProgramFactory verification", error);
      }

      try {
        const programImplementationVerifyId = await hre.run("verify:verify", {
          address: programImplementationContractDeployment.address,
          contract:
            "contracts/program/ProgramImplementation.sol:ProgramImplementation",
          constructorArguments: [],
          bytedcode: programImplementationContractDeployment.bytecode,
        });

        console.info(
          "ProgramImplementation verification ID: ",
          programImplementationVerifyId
        );
      } catch (error) {
        console.error("ProgramImplementation verification", error);
      }

      try {
        const roundImpId = await hre.run("verify:verify", {
          address: RoundImplementationDeployment.address,
          contract:
            "contracts/round/RoundImplementation.sol:RoundImplementation",
          constructorArguments: [],
          bytedcode: roundImplementation.bytecode,
        });

        console.info("RoundImplementation verification ID: ", roundImpId);
      } catch (error) {
        console.error("RoundImplementation verification", error);
      }

      try {
        const settingsId = await hre.run("verify:verify", {
          address: AlloSettingsDeployment.address,
          contract: "contracts/settings/AlloSettings.sol:AlloSettings",
          constructorArguments: [],
          bytedcode: alloSettingsContract.bytecode,
        });

        console.info("Allo Settings verification ID: ", settingsId);
      } catch (error) {
        console.error("Allo Settings verification", error);
      }
    } catch (error) {
      console.error(error);
    }
  }, 30000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
