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
    contract: "ProgramFactoryZkZK",
  });

  // Deploy the Program Factory contract
  // Load the artifact we want to deploy
  console.info("Deploying ProgramFactoryZk contract...");
  const ProgramFactoryZk = await deployer.loadArtifact("ProgramFactoryZkZK");

  // Estimate fee
  const programFactoryZkDeploymentFee = await deployer.estimateDeployFee(
    ProgramFactoryZk,
    []
  );

  const parsedProgramFactoryZkFee = ethers.utils.formatEther(
    programFactoryZkDeploymentFee.toString()
  );
  console.info(`Estimated deployment fee: ${parsedProgramFactoryZkFee} ETH`);

  // Deploy the contract
  const programProxy = await hre.zkUpgrades.deployProxy(
    deployer.zkWallet,
    ProgramFactoryZk,
    []
  );

  await programProxy.deployed();

  // Show the contract info
  console.info("ProgramFactoryZk deployed to:", programProxy.address);

  // /** Deploy Program Implementation */
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

  // // Link the ProgramFactoryZk contract with the ProgramImplementation contract
  // console.info(
  //   "Linking ProgramFactoryZk contract to ProgramImplementation contract..."
  // );
  // const updateTx = await programProxy.updateProgramContract(
  //   programImplementationContractDeployment.address
  // );
  // await updateTx.wait();
  // console.info(
  //   "ProgramFactoryZk contract linked to ProgramImplementation contract in tx",
  //   updateTx.hash
  // );

  /** Deploy Voting Factory */
  await confirmContinue({
    contract: "QuadraticFundingVotingStrategyFactoryZk",
  });
  const quadraticFundingVotingStrategyFactoryZk = await deployer.loadArtifact(
    "QuadraticFundingVotingStrategyFactoryZk"
  );
  const quadraticFundingVotingStrategyFactoryZkFee =
    await deployer.estimateDeployFee(quadraticFundingVotingStrategyFactoryZk, []);
  const parsedQuadraticFundingVotingStrategyFactoryZkFee =
    ethers.utils.formatEther(
      quadraticFundingVotingStrategyFactoryZkFee.toString()
    );
  console.info(
    `Estimated deployment fee: ${parsedQuadraticFundingVotingStrategyFactoryZkFee} ETH`
  );
  const QuadraticFundingVotingStrategyFactoryZkDeployment = await deployer.deploy(
    quadraticFundingVotingStrategyFactoryZk,
    []
  );

  await QuadraticFundingVotingStrategyFactoryZkDeployment.deployed();
  await QuadraticFundingVotingStrategyFactoryZkDeployment.initialize();

  console.info(
    "QuadraticFundingVotingStrategyFactoryZk deployed to",
    QuadraticFundingVotingStrategyFactoryZkDeployment.address
  );

  /** Deploy Voting Implementation */
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
  //   "Linking QuadraticFundingVotingStrategyFactoryZk to implementation"
  // );
  // let qfLink =
  //   await QuadraticFundingVotingStrategyFactoryZkDeployment.updateVotingContract(
  //     QfVotingImpFactoryDeployment.address
  //   );
  // console.info(
  //   "QuadraticFundingVotingStrategyFactoryZk linked to QuadraticFundingVotingStrategyImplementation in tx",
  //   qfLink.hash
  // );
  // console.info(
  //   "Linked QuadraticFundingVotingStrategyFactoryZk to implementation"
  // );

  // /** Merkle Payout Strategy */
  await confirmContinue({
    contract: "MerklePayoutStrategyFactoryZk",
  });
  console.info("Deploying MerklePayoutStrategyFactoryZk...");
  const merklePayoutStrategyFactoryZk = await deployer.loadArtifact(
    "MerklePayoutStrategyFactoryZk"
  );
  const MerklePayoutStrategyFactoryZkDeployment = await deployer.deploy(
    merklePayoutStrategyFactoryZk,
    []
  );

  await MerklePayoutStrategyFactoryZkDeployment.deployed();
  await MerklePayoutStrategyFactoryZkDeployment.initialize();

  // console.info(
  //   "MerklePayoutStrategyFactoryZk deployed to",
  //   MerklePayoutStrategyFactoryZkDeployment.address
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
  //   await MerklePayoutStrategyFactoryZkDeployment.updatePayoutImplementation(
  //     merklePayoutStrategyImplementationDeployment.address
  //   );
  // console.info(
  //   "MerklePayoutStrategyImplementation linked to MerklePayoutStrategyFactoryZk in tx",
  //   merkleLinkTx.hash
  // );

  // /** Direct Payout Strategy */
  await confirmContinue({
    contract: "DirectPayoutStrategyFactoryZk",
  });
  console.info("Deploying DirectPayoutStrategyFactoryZk...");
  const directPayoutStrategyFactoryZk = await deployer.loadArtifact(
    "DirectPayoutStrategyFactoryZk"
  );
  const directPayoutStrategyFactoryZkDeployment = await deployer.deploy(
    directPayoutStrategyFactoryZk,
    []
  );

  await directPayoutStrategyFactoryZkDeployment.deployed();
  await directPayoutStrategyFactoryZkDeployment.initialize();

  console.info(
    "DirectPayoutStrategyFactoryZk deployed to",
    directPayoutStrategyFactoryZkDeployment.address
  );

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
  //   await directPayoutStrategyFactoryZkDeployment.updatePayoutImplementation(
  //     directPayoutStrategyImplementationDeployment.address
  //   );
  // console.info(
  //   "DirectPayoutStrategyImplementation linked to DirectPayoutStrategyFactoryZk in tx",
  //   payoutLinkTx.hash
  // );

  // /* Round Factory */
  await confirmContinue({
    contract: "RoundFactoryZk",
  });
  console.info("Deploying RoundFactoryZk...");
  const roundFactoryZk = await deployer.loadArtifact("RoundFactoryZk");
  const roundFactoryZkDeployment = await deployer.deploy(roundFactoryZk, []);

  await roundFactoryZkDeployment.deployed();
  await roundFactoryZkDeployment.initialize();

  console.info("RoundFactoryZk deployed to", roundFactoryZkDeployment.address);

  /* Deploy Allo Settings */
  await confirmContinue({
    contract: "AlloSettings",
  });
  console.info("Deploying AlloSettings...");
  const alloSettingsContract = await deployer.loadArtifact("AlloSettings");
  const alloSettingsDeployment = await deployer.deploy(
    alloSettingsContract,
    []
  );

  await alloSettingsDeployment.deployed();
  console.info("AlloSettings deployed to", alloSettingsDeployment.address);
  await alloSettingsDeployment.initialize();
  console.info("AlloSettings initialized");

  const alloLinkTx = await roundFactoryZkDeployment.updateAlloSettings(
    alloSettingsDeployment.address
  );
  await alloLinkTx.wait();
  console.info("RoundFactoryZk linked to AlloSettings in tx", alloLinkTx.hash);

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

  // const roundLinkTx = await roundFactoryZkDeployment.updateRoundImplementation(
  //   roundImplementationDeployment.address
  // );
  // await roundLinkTx.wait();

  // console.info(
  //   "RoundFactoryZk linked to RoundImplementation in tx",
  //   roundLinkTx.hash
  // );

  await confirmContinue({
    contract: "DummyVotingStrategy",
  });

  const dummyFactory = await deployer.loadArtifact("DummyVotingStrategy");

  // Estimate Fee
  const dummyFactoryDeploymentFee = await deployer.estimateDeployFee(
    dummyFactory,
    []
  );

  const parsedDummyFactoryFee = ethers.utils.formatEther(
    dummyFactoryDeploymentFee.toString()
  );

  console.info(`Estimated deployment fee: ${parsedDummyFactoryFee} ETH`);

  const dummyVotingStrategy = await deployer.deploy(dummyFactory, []);

  await dummyVotingStrategy.deployed();

  console.info(
    "DummyVotingStrategy deployed to",
    dummyVotingStrategy.address
  );

  // ====> VERIFICATION

    await confirmContinue({
      verify: "verify all deployed contracts",
    });


  console.info("Waiting for 30 seconds for the blocks to mine...");
  setTimeout(async () => {
    try {
      //// new
      try {
        console.log("Verify ProgramFactoryZk");
        await hre.run("verify:verify", {
          address: programProxy.address, // this should be the implementation and not the proxy
          constructorArguments: [
            projectRegistryContractDeployment.address,
          ],
        });

      } catch (error) {
        console.error("ProgramFactoryZk verification", error);
      }

      // try {
      //   console.log("Verify ProgramImplementation");
      //   await hre.run("verify:verify", {
      //     address: programImplementationContractDeployment.address,
      //     constructorArguments: [],
      //   });
      // } catch (error) {
      //   console.error("ProgramImplementation verification", error);
      // }

      try {
        console.log("Verify QuadraticFundingVotingStrategyFactoryZk");
        await hre.run("verify:verify", {
          address: QuadraticFundingVotingStrategyFactoryZkDeployment.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error(
          "QuadraticFundingVotingStrategyFactoryZk verification",
          error
        );
      }

      // try {
      //   console.log("Verify QuadraticFundingVotingStrategyImplementation");
      //   await hre.run("verify:verify", {
      //     address: QfVotingImpFactoryDeployment.address,
      //     constructorArguments: [],
      //   });
      // } catch (error) {
      //   console.error(
      //     "QuadraticFundingVotingStrategyImplementation verification",
      //     error
      //   );
      // }

      try {
        console.log("Verify MerklePayoutStrategyFactoryZk");
        await hre.run("verify:verify", {
          address: MerklePayoutStrategyFactoryZkDeployment.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error("MerklePayoutStrategyFactoryZk verification", error);
      }

      // try {
      //   console.log("Verify MerklePayoutStrategyImplementation");
      //   await hre.run("verify:verify", {
      //     address: merklePayoutStrategyImplementationDeployment.address,
      //     constructorArguments: [],
      //   });
      // } catch (error) {
      //   console.error("MerklePayoutStrategyImplementation verification", error);
      // }

      try {
        console.log("Verify DirectPayoutStrategyFactoryZk");
        await hre.run("verify:verify", {
          address: directPayoutStrategyFactoryZkDeployment.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error("DirectPayoutStrategyFactoryZk verification", error);
      }

      // try {
      //   console.log("Verify DirectPayoutStrategyImplementation");
      //   await hre.run("verify:verify", {
      //     address: directPayoutStrategyImplementationDeployment.address,
      //     constructorArguments: [],
      //   });
      // } catch (error) {
      //   console.error("DirectPayoutStrategyImplementation verification", error);
      // }

      try {
        console.log("Verify AlloSettings");
        await hre.run("verify:verify", {
          address: alloSettingsDeployment.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error("AlloSettings verification", error);
      }

      try {
        console.log("Verify RoundFactoryZk");
        await hre.run("verify:verify", {
          address: roundFactoryZkDeployment.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error("RoundFactoryZk verification", error);
      }

      // try {
      //   console.log("Verify RoundImplementation");
      //   await hre.run("verify:verify", {
      //     address: roundImplementationDeployment.address,
      //     constructorArguments: [],
      //   });
      // } catch (error) {
      //   console.error("RoundImplementation verification", error);
      // }

      try {
        console.log("Verify ProjectRegistry");
        await hre.run("verify:verify", {
          address: projectRegistryContractDeployment.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error("ProjectRegistry verification", error);
      }

      try {
        console.log("Verify DummyVotingStrategy");
        await hre.run("verify:verify", {
          address: dummyVotingStrategy.address,
          constructorArguments: [],
        });
      } catch (error) {
        console.error("DummyVotingStrategy verification", error);
      }

    } catch (error) {
      console.error(error);
    }
  }, 30000);

  // Print the markdown table.

  console.log(`## ${formatNetworkName(networkName)} \n`);
  console.log(
    "| Contract                              | Address                                    |"
  );
  console.log(
    "|---------------------------------------|--------------------------------------------|"
  );
  console.log(
    `| ProgramFactoryZk                        | ${programProxy.address} |`
  );
  console.log(
    `| QuadraticFundingVotingStrategyFactoryZk | ${QuadraticFundingVotingStrategyFactoryZkDeployment.address} |`
  );
  console.log(
    `| QFVotingStrategyImplementation        | ${QfVotingImpFactoryDeployment.address} |`
  );
  console.log(
    `| MerklePayoutStrategyFactoryZk           | ${MerklePayoutStrategyFactoryZkDeployment.address} |`
  );
  console.log(
    `| DirectPayoutStrategyFactoryZk           | ${directPayoutStrategyFactoryZkDeployment.address} |`
  );
  console.log(
    `| AlloSettings                          | ${alloSettingsDeployment.address} |`
  );
  console.log(
    `| RoundFactoryZk                          | ${roundFactoryZkDeployment.address} |`
  );
  console.log(
    `| ProjectRegistry                       | ${projectRegistryContractDeployment.address} |`
  );
  console.log(
    `| DummyVotingStrategy                   | ${dummyVotingStrategy.address} |`
  );
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
