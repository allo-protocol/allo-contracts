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

  const networkName = hre.network.name;

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
    contract: "ProgramFactoryZK",
  });

  // Deploy the Program Factory contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramFactory contract...");
  const ProgramFactory = await deployer.loadArtifact("ProgramFactoryZK");

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
  // await confirmContinue({
  //   contract: "ProgramImplementation",
  // });

  // // Load the artifact
  // console.info("Deploying ProgramImplementation contract...");
  // const ProgramImplementation = await deployer.loadArtifact(
  //   "ProgramImplementation"
  // );

  // // Estimate fee
  // const programImplementationDeploymentFee = await deployer.estimateDeployFee(
  //   ProgramImplementation,
  //   []
  // );
  // const parsedProgramImplementationFee = ethers.utils.formatEther(
  //   programImplementationDeploymentFee.toString()
  // );
  // console.info(
  //   `Estimated deployment fee: ${parsedProgramImplementationFee} ETH`
  // );

  // // Deploy the contract
  // const programImplementationContractDeployment = await deployer.deploy(
  //   ProgramImplementation,
  //   []
  // );

  // await programImplementationContractDeployment.deployed();

  // // Show the contract info
  // console.info(
  //   "ProgramImplementation deployed to:",
  //   programImplementationContractDeployment.address
  // );

  // // Link the ProgramFactory contract with the ProgramImplementation contract
  // console.info(
  //   "Linking ProgramFactory contract to ProgramImplementation contract..."
  // );
  // const updateTx = await programProxy.updateProgramContract(
  //   programImplementationContractDeployment.address
  // );
  // await updateTx.wait();
  // console.info(
  //   "ProgramFactory contract linked to ProgramImplementation contract in tx",
  //   updateTx.hash
  // );

  // /** Deploy Voting Factory */
  // await confirmContinue({
  //   contract: "QuadraticFundingVotingStrategyFactory",
  // });
  // const quadraticFundingVotingStrategyFactory = await deployer.loadArtifact(
  //   "QuadraticFundingVotingStrategyFactory"
  // );
  // const quadraticFundingVotingStrategyFactoryFee =
  //   await deployer.estimateDeployFee(quadraticFundingVotingStrategyFactory, []);
  // const parsedQuadraticFundingVotingStrategyFactoryFee =
  //   ethers.utils.formatEther(
  //     quadraticFundingVotingStrategyFactoryFee.toString()
  //   );
  // console.info(
  //   `Estimated deployment fee: ${parsedQuadraticFundingVotingStrategyFactoryFee} ETH`
  // );
  // const QuadraticFundingVotingStrategyFactoryDeployment = await deployer.deploy(
  //   quadraticFundingVotingStrategyFactory,
  //   []
  // );

  // await QuadraticFundingVotingStrategyFactoryDeployment.deployed();
  // await QuadraticFundingVotingStrategyFactoryDeployment.initialize();

  // console.info(
  //   "QuadraticFundingVotingStrategyFactory deployed to",
  //   QuadraticFundingVotingStrategyFactoryDeployment.address
  // );

  // /** Deploy Voting Implementation */
  // await confirmContinue({
  //   contract: "QuadraticFundingVotingStrategyImplementation",
  // });
  // const qfImpFactory = await deployer.loadArtifact(
  //   "QuadraticFundingVotingStrategyImplementation"
  // );
  // const QfVotingImpFactoryDeployment = await deployer.deploy(qfImpFactory, []);

  // await QfVotingImpFactoryDeployment.deployed();
  // await QfVotingImpFactoryDeployment.initialize();

  // console.info(
  //   "QuadraticFundingVotingStrategyImplementation deployed to",
  //   QfVotingImpFactoryDeployment.address
  // );

  // console.info(
  //   "Linking QuadraticFundingVotingStrategyFactory to implementation"
  // );
  // let qfLink =
  //   await QuadraticFundingVotingStrategyFactoryDeployment.updateVotingContract(
  //     QfVotingImpFactoryDeployment.address
  //   );
  // console.info(
  //   "QuadraticFundingVotingStrategyFactory linked to QuadraticFundingVotingStrategyImplementation in tx",
  //   qfLink.hash
  // );
  // console.info(
  //   "Linked QuadraticFundingVotingStrategyFactory to implementation"
  // );

  // // /** Merkle Payout Strategy */
  // await confirmContinue({
  //   contract: "MerklePayoutStrategyFactory",
  // });
  // console.info("Deploying MerklePayoutStrategyFactory...");
  // const merklePayoutStrategyFactory = await deployer.loadArtifact(
  //   "MerklePayoutStrategyFactory"
  // );
  // const MerklePayoutStrategyFactoryDeployment = await deployer.deploy(
  //   merklePayoutStrategyFactory,
  //   []
  // );

  // await MerklePayoutStrategyFactoryDeployment.deployed();
  // await MerklePayoutStrategyFactoryDeployment.initialize();

  // console.info(
  //   "MerklePayoutStrategyFactory deployed to",
  //   MerklePayoutStrategyFactoryDeployment.address
  // );

  // await confirmContinue({
  //   contract: "MerklePayoutStrategyImplementation",
  // });
  // const merklePayoutStrategyImplementation = await deployer.loadArtifact(
  //   "MerklePayoutStrategyImplementation"
  // );
  // const merklePayoutStrategyImplementationDeployment = await deployer.deploy(
  //   merklePayoutStrategyImplementation,
  //   []
  // );

  // await merklePayoutStrategyImplementationDeployment.deployed();
  // await merklePayoutStrategyImplementationDeployment.initialize();

  // console.info(
  //   "MerklePayoutStrategyImplementation deployed to",
  //   merklePayoutStrategyImplementationDeployment.address
  // );

  // let merkleLinkTx =
  //   await MerklePayoutStrategyFactoryDeployment.updatePayoutImplementation(
  //     merklePayoutStrategyImplementationDeployment.address
  //   );
  // console.info(
  //   "MerklePayoutStrategyImplementation linked to MerklePayoutStrategyFactory in tx",
  //   merkleLinkTx.hash
  // );

  // // /** Direct Payout Strategy */
  // await confirmContinue({
  //   contract: "DirectPayoutStrategyFactory",
  // });
  // console.info("Deploying DirectPayoutStrategyFactory...");
  // const directPayoutStrategyFactory = await deployer.loadArtifact(
  //   "DirectPayoutStrategyFactory"
  // );
  // const directPayoutStrategyFactoryDeployment = await deployer.deploy(
  //   directPayoutStrategyFactory,
  //   []
  // );

  // await directPayoutStrategyFactoryDeployment.deployed();
  // await directPayoutStrategyFactoryDeployment.initialize();

  // console.info(
  //   "DirectPayoutStrategyFactory deployed to",
  //   directPayoutStrategyFactoryDeployment.address
  // );

  // await confirmContinue({
  //   contract: "DirectPayoutStrategyImplementation",
  // });
  // const directPayoutStrategyImplementation = await deployer.loadArtifact(
  //   "DirectPayoutStrategyImplementation"
  // );
  // const directPayoutStrategyImplementationDeployment = await deployer.deploy(
  //   directPayoutStrategyImplementation,
  //   []
  // );

  // await directPayoutStrategyImplementationDeployment.deployed();
  // await directPayoutStrategyImplementationDeployment.initialize();

  // console.info(
  //   "DirectPayoutStrategyImplementation deployed to",
  //   directPayoutStrategyImplementationDeployment.address
  // );

  // let payoutLinkTx =
  //   await directPayoutStrategyFactoryDeployment.updatePayoutImplementation(
  //     directPayoutStrategyImplementationDeployment.address
  //   );
  // console.info(
  //   "DirectPayoutStrategyImplementation linked to DirectPayoutStrategyFactory in tx",
  //   payoutLinkTx.hash
  // );

  // // /* Round Factory */
  // await confirmContinue({
  //   contract: "RoundFactory",
  // });
  // console.info("Deploying RoundFactory...");
  // const roundFactory = await deployer.loadArtifact("RoundFactory");
  // const roundFactoryDeployment = await deployer.deploy(roundFactory, []);

  // await roundFactoryDeployment.deployed();
  // await roundFactoryDeployment.initialize();

  // console.info("RoundFactory deployed to", roundFactoryDeployment.address);

  // /* Deploy Allo Settings */
  // await confirmContinue({
  //   contract: "AlloSettings",
  // });
  // console.info("Deploying AlloSettings...");
  // const alloSettingsContract = await deployer.loadArtifact("AlloSettings");
  // const alloSettingsDeployment = await deployer.deploy(
  //   alloSettingsContract,
  //   []
  // );

  // await alloSettingsDeployment.deployed();
  // console.info("AlloSettings deployed to", alloSettingsDeployment.address);
  // await alloSettingsDeployment.initialize();
  // console.info("AlloSettings initialized");

  // const alloLinkTx = await roundFactoryDeployment.updateAlloSettings(
  //   alloSettingsDeployment.address
  // );
  // await alloLinkTx.wait();
  // console.info("RoundFactory linked to AlloSettings in tx", alloLinkTx.hash);

  // await confirmContinue({
  //   contract: "RoundImplementation",
  // });
  // console.info("Deploying RoundImplementation...");
  // const roundImplementation = await deployer.loadArtifact(
  //   "RoundImplementation"
  // );
  // const roundImplementationDeployment = await deployer.deploy(
  //   roundImplementation,
  //   []
  // );

  // await roundImplementationDeployment.deployed();

  // console.info(
  //   "RoundImplementation deployed to",
  //   roundImplementationDeployment.address
  // );

  // const roundLinkTx = await roundFactoryDeployment.updateRoundImplementation(
  //   roundImplementationDeployment.address
  // );
  // await roundLinkTx.wait();

  // console.info(
  //   "RoundFactory linked to RoundImplementation in tx",
  //   roundLinkTx.hash
  // );

  // await confirmContinue({
  //   contract: "DummyVotingStrategy",
  // });

  // const dummyFactory = await deployer.loadArtifact("DummyVotingStrategy");

  // // Estimate Fee
  // const dummyFactoryDeploymentFee = await deployer.estimateDeployFee(
  //   dummyFactory,
  //   []
  // );

  // const parsedDummyFactoryFee = ethers.utils.formatEther(
  //   dummyFactoryDeploymentFee.toString()
  // );

  // console.info(`Estimated deployment fee: ${parsedDummyFactoryFee} ETH`);

  // const dummyVotingStrategy = await deployer.deploy(dummyFactory, []);

  // await dummyVotingStrategy.deployed();

  // console.info(
  //   "DummyVotingStrategy deployed to",
  //   dummyVotingStrategy.address
  // );

  // // ====> VERIFICATION

  //   await confirmContinue({
  //     verify: "verify all deployed contracts",
  //   });


  // console.info("Waiting for 30 seconds for the blocks to mine...");
  // setTimeout(async () => {
  //   try {
  //     //// new
  //     try {
  //       console.log("Verify ProgramFactory");
  //       await hre.run("verify:verify", {
  //         address: programProxy.address, // this should be the implementation and not the proxy
  //         constructorArguments: [
  //           projectRegistryContractDeployment.address,
  //         ],
  //       });

  //     } catch (error) {
  //       console.error("ProgramFactory verification", error);
  //     }

  //     try {
  //       console.log("Verify ProgramImplementation");
  //       await hre.run("verify:verify", {
  //         address: programImplementationContractDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("ProgramImplementation verification", error);
  //     }

  //     try {
  //       console.log("Verify QuadraticFundingVotingStrategyFactory");
  //       await hre.run("verify:verify", {
  //         address: QuadraticFundingVotingStrategyFactoryDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error(
  //         "QuadraticFundingVotingStrategyFactory verification",
  //         error
  //       );
  //     }

  //     try {
  //       console.log("Verify QuadraticFundingVotingStrategyImplementation");
  //       await hre.run("verify:verify", {
  //         address: QfVotingImpFactoryDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error(
  //         "QuadraticFundingVotingStrategyImplementation verification",
  //         error
  //       );
  //     }

  //     try {
  //       console.log("Verify MerklePayoutStrategyFactory");
  //       await hre.run("verify:verify", {
  //         address: MerklePayoutStrategyFactoryDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("MerklePayoutStrategyFactory verification", error);
  //     }

  //     try {
  //       console.log("Verify MerklePayoutStrategyImplementation");
  //       await hre.run("verify:verify", {
  //         address: merklePayoutStrategyImplementationDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("MerklePayoutStrategyImplementation verification", error);
  //     }

  //     try {
  //       console.log("Verify DirectPayoutStrategyFactory");
  //       await hre.run("verify:verify", {
  //         address: directPayoutStrategyFactoryDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("DirectPayoutStrategyFactory verification", error);
  //     }

  //     try {
  //       console.log("Verify DirectPayoutStrategyImplementation");
  //       await hre.run("verify:verify", {
  //         address: directPayoutStrategyImplementationDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("DirectPayoutStrategyImplementation verification", error);
  //     }

  //     try {
  //       console.log("Verify AlloSettings");
  //       await hre.run("verify:verify", {
  //         address: alloSettingsDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("AlloSettings verification", error);
  //     }

  //     try {
  //       console.log("Verify RoundFactory");
  //       await hre.run("verify:verify", {
  //         address: roundFactoryDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("RoundFactory verification", error);
  //     }

  //     try {
  //       console.log("Verify RoundImplementation");
  //       await hre.run("verify:verify", {
  //         address: roundImplementationDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("RoundImplementation verification", error);
  //     }

  //     try {
  //       console.log("Verify ProjectRegistry");
  //       await hre.run("verify:verify", {
  //         address: projectRegistryContractDeployment.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("ProjectRegistry verification", error);
  //     }

  //     try {
  //       console.log("Verify DummyVotingStrategy");
  //       await hre.run("verify:verify", {
  //         address: dummyVotingStrategy.address,
  //         constructorArguments: [],
  //       });
  //     } catch (error) {
  //       console.error("DummyVotingStrategy verification", error);
  //     }

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, 30000);

  // // Print the markdown table.

  // console.log(`## ${formatNetworkName(networkName)} \n`);
  // console.log(
  //   "| Contract                              | Address                                    |"
  // );
  // console.log(
  //   "|---------------------------------------|--------------------------------------------|"
  // );
  // console.log(
  //   `| ProgramFactory                        | ${programProxy.address} |`
  // );
  // console.log(
  //   `| ProgramImplementation                 | ${programImplementationContractDeployment.address} |`
  // );
  // console.log(
  //   `| QuadraticFundingVotingStrategyFactory | ${QuadraticFundingVotingStrategyFactoryDeployment.address} |`
  // );
  // console.log(
  //   `| QFVotingStrategyImplementation        | ${QfVotingImpFactoryDeployment.address} |`
  // );
  // console.log(
  //   `| MerklePayoutStrategyFactory           | ${MerklePayoutStrategyFactoryDeployment.address} |`
  // );
  // console.log(
  //   `| MerklePayouStrategyImplementation     | ${merklePayoutStrategyImplementationDeployment.address} |`
  // );
  // console.log(
  //   `| DirectPayoutStrategyFactory           | ${directPayoutStrategyFactoryDeployment.address} |`
  // );
  // console.log(
  //   `| DirectPayoutStrategyImplementation    | ${directPayoutStrategyImplementationDeployment.address} |`
  // );
  // console.log(
  //   `| AlloSettings                          | ${alloSettingsDeployment.address} |`
  // );
  // console.log(
  //   `| RoundFactory                          | ${roundFactoryDeployment.address} |`
  // );
  // console.log(
  //   `| RoundImplementation                   | ${roundImplementationDeployment.address} |`
  // );
  // console.log(
  //   `| ProjectRegistry                       | ${projectRegistryContractDeployment.address} |`
  // );
  // console.log(
  //   `| DummyVotingStrategy                   | ${dummyVotingStrategy.address} |`
  // );
}

function formatNetworkName(networkName: string) {
  const words = networkName.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
