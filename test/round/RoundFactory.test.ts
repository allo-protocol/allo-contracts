import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployContract } from "ethereum-waffle";
import { isAddress } from "ethers/lib/utils";
import { ContractFactory, Wallet } from "ethers";
import { AddressZero } from "@ethersproject/constants";
import { artifacts, ethers, upgrades } from "hardhat";
import { Artifact } from "hardhat/types";
import {
  AlloSettings,
  MerklePayoutStrategyFactory,
  MerklePayoutStrategyImplementation,
  QuadraticFundingVotingStrategyFactory,
  QuadraticFundingVotingStrategyImplementation,
  RoundFactory,
  RoundImplementation,
} from "../../typechain/";
import { encodeRoundParameters } from "../../scripts/utils";
import { createProjectId } from "../../utils/createProjectId";

const TRUSTED_REGISTRY_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("TRUSTED_REGISTRY")
);

describe("RoundFactory", function () {
  let user: SignerWithAddress;
  let notOwnerWallet: SignerWithAddress;

  // Allo Settings
  let alloSettings: AlloSettings;
  let alloSettingsContractFactory: ContractFactory;

  // Round Factory
  let roundFactory: RoundFactory;
  let roundContractFactory: ContractFactory;

  // Round Implementation
  let roundImplementation: RoundImplementation;
  let roundImplementationArtifact: Artifact;

  // Voting Strategy Factory
  let votingStrategyFactory: QuadraticFundingVotingStrategyFactory;
  let votingStrategyFactoryArtifact: Artifact;

  // Payout Strategy Factory
  let payoutStrategyFactory: MerklePayoutStrategyFactory;
  let payoutStrategyFactoryArtifact: Artifact;

  let protocolTreasury = Wallet.createRandom();

  describe("constructor", () => {
    it("RoundFactory SHOULD deploy properly", async () => {
      [user] = await ethers.getSigners();

      roundContractFactory = await ethers.getContractFactory("RoundFactory");
      roundFactory = <RoundFactory>(
        await upgrades.deployProxy(roundContractFactory)
      );

      // Verify deploy
      expect(isAddress(roundFactory.address), "Failed to deploy RoundFactory")
        .to.be.true;
    });
  });

  describe("core functions", () => {
    beforeEach(async () => {
      [user, notOwnerWallet] = await ethers.getSigners();

      // Deploy AlloSettings contract
      alloSettingsContractFactory = await ethers.getContractFactory(
        "AlloSettings"
      );
      alloSettings = <AlloSettings>(
        await upgrades.deployProxy(alloSettingsContractFactory)
      );

      // Deploy RoundFactory contract
      roundContractFactory = await ethers.getContractFactory("RoundFactory");
      roundFactory = <RoundFactory>(
        await upgrades.deployProxy(roundContractFactory)
      );

      // Deploy RoundImplementation contract
      roundImplementationArtifact = await artifacts.readArtifact(
        "RoundImplementation"
      );
      roundImplementation = <RoundImplementation>(
        await deployContract(user, roundImplementationArtifact, [])
      );
    });

    describe("test: updateRoundImplementation", async () => {
      it("SHOULD REVERT if not called by owner", async () => {
        const tx = roundFactory
          .connect(notOwnerWallet)
          .updateRoundImplementation(roundImplementation.address);
        await expect(tx).to.revertedWith(
          `AccessControl: account ${notOwnerWallet.address.toLowerCase()} is missing role 0x0000000000000000000000000000000000000000000000000000000000000000`
        );
      });

      it("SHOULD REVERT if roundImplementation is 0x", async () => {
        const tx = roundFactory.updateRoundImplementation(AddressZero);
        await expect(tx).to.revertedWith("roundImplementation is 0x");
      });

      it("RoundContract SHOULD have default roundImplementation after deploy ", async () => {
        expect(await roundFactory.roundImplementation()).to.be.equal(
          AddressZero
        );
      });

      it("RoundContract SHOULD emit RoundImplementationUpdated event after invoking updateRoundImplementation", async () => {
        await expect(
          roundFactory.updateRoundImplementation(roundImplementation.address)
        )
          .to.emit(roundFactory, "RoundImplementationUpdated")
          .withArgs(roundImplementation.address);
      });

      it("RoundContract SHOULD have round address after invoking updateRoundImplementation", async () => {
        await roundFactory
          .updateRoundImplementation(roundImplementation.address)
          .then(async () => {
            const _roundImplementation =
              await roundFactory.roundImplementation();
            expect(_roundImplementation).to.be.equal(
              roundImplementation.address
            );
          });
      });
    });

    describe("test: create", async () => {
      const matchAmount = 1000;
      const token = Wallet.createRandom().address;
      const programAddress = Wallet.createRandom().address;
      const roundFeePercentage = 10;
      const roundFeeAddress = Wallet.createRandom().address;

      let _currentBlockTimestamp: number;

      let params: any = [];

      let chainId = 1;
      let projectNumber = 1;
      let projectID: string;

      beforeEach(async () => {
        [user] = await ethers.getSigners();

        projectID = createProjectId(
          chainId,
          user.address, // registry address
          projectNumber
        );

        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        // Deploy VotingStrategyFactory contract
        votingStrategyFactoryArtifact = await artifacts.readArtifact(
          "QuadraticFundingVotingStrategyFactory"
        );
        votingStrategyFactory = <QuadraticFundingVotingStrategyFactory>(
          await deployContract(user, votingStrategyFactoryArtifact, [])
        );

        // Deploy PayoutStrategyFactory contract
        payoutStrategyFactoryArtifact = await artifacts.readArtifact(
          "MerklePayoutStrategyFactory"
        );
        payoutStrategyFactory = <MerklePayoutStrategyFactory>(
          await deployContract(user, payoutStrategyFactoryArtifact, [])
        );

        // Deploy RoundFactory contract
        roundContractFactory = await ethers.getContractFactory("RoundFactory");
        roundFactory = <RoundFactory>(
          await upgrades.deployProxy(roundContractFactory)
        );

        await alloSettings.grantRole(TRUSTED_REGISTRY_ROLE, user.address);
        // Creating a Round
        const initAddress = [
          votingStrategyFactory.address, // votingStrategyFactory
          payoutStrategyFactory.address, // payoutStrategyFactory
        ];

        const initRoundTime = [
          _currentBlockTimestamp + 100, // applicationsStartTime
          _currentBlockTimestamp + 250, // applicationsEndTime
          _currentBlockTimestamp + 500, // roundStartTime
          _currentBlockTimestamp + 1000, // roundEndTime
        ];

        const initMetaPtr = [
          {
            protocol: 1,
            pointer:
              "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
          }, // roundMetaPtr
          {
            protocol: 1,
            pointer:
              "bafybeiaoakfoxjwi2kwh43djbmomroiryvhv5cetg74fbtzwef7hzzvrnq",
          }, // applicationMetaPtr
        ];

        const initRoles = [
          [Wallet.createRandom().address], // adminRoles
          [Wallet.createRandom().address, Wallet.createRandom().address], // roundOperators
        ];

        params = [
          initAddress,
          initRoundTime,
          matchAmount,
          token,
          roundFeePercentage,
          roundFeeAddress,
          initMetaPtr,
          initRoles,
        ];
      });

      it("SHOULD REVERT if roundImplementation is not set", async () => {
        // Deploy RoundFactory contract
        roundContractFactory = await ethers.getContractFactory("RoundFactory");
        roundFactory = <RoundFactory>(
          await upgrades.deployProxy(roundContractFactory)
        );
        await roundFactory.grantRole(TRUSTED_REGISTRY_ROLE, user.address);

        const txn = roundFactory.create(
          projectID,
          encodeRoundParameters(params)
        );
        await roundFactory.grantRole(REGISTRY_ROLE, user.address);

        const txn = roundFactory.create(1, encodeRoundParameters(params));

        await expect(txn).to.revertedWith("roundImplementation is 0x");
      });

      it("SHOULD REVERT if alloSettings is not set", async () => {
        // Deploy RoundFactory contract
        let roundContractFactory = await ethers.getContractFactory(
          "RoundFactory"
        );
        let roundFactory = <RoundFactory>(
          await upgrades.deployProxy(roundContractFactory)
        );
        await roundFactory.grantRole(TRUSTED_REGISTRY_ROLE, user.address);

        // Set the init values
        await roundFactory.updateRoundImplementation(
          roundImplementation.address
        );

        const txn = roundFactory.create(
          projectID,
          encodeRoundParameters(params)
        );

        const txn = roundFactory.create(1, encodeRoundParameters(params));

        await expect(txn).to.revertedWith("alloSettings is 0x");
      });

      it("invoking create SHOULD have a successfull transaction", async () => {
        // Set the init values
        await roundFactory.updateAlloSettings(alloSettings.address);
        await roundFactory.updateRoundImplementation(
          roundImplementation.address
        );

        const txn = await roundFactory.create(
          projectID,
          encodeRoundParameters(params)
        );

        const txn = await roundFactory.create(1, encodeRoundParameters(params));

        const receipt = await txn.wait();

        expect(await txn.hash).to.not.be.empty;
        expect(receipt.status).equals(1);
      });

      it("SHOULD emit RoundCreated event after invoking create", async () => {
        // Set the init values
        await roundFactory.updateAlloSettings(alloSettings.address);
        await roundFactory.updateRoundImplementation(
          roundImplementation.address
        );

        const txn = await roundFactory.create(
          projectID,
          encodeRoundParameters(params)
        );

        const txn = await roundFactory.create(1, encodeRoundParameters(params));

        let roundAddress;
        let _projectID;
        let _projectIdentifier;
        let _roundImplementation;
        let registry;

        const receipt = await txn.wait();
        if (receipt.events) {
          const event = receipt.events.find((e) => e.event === "RoundCreated");
          if (event && event.args) {
            _projectID = event.args.projectID;
            roundAddress = event.args.roundAddress;
            projectID = event.args.projectID;
            _roundImplementation = event.args.roundImplementation;
            registry = event.args.registry;
          }
        }

        expect(txn)
          .to.emit(roundFactory, "RoundCreated")
          .withArgs(_projectID, roundAddress, _roundImplementation, registry);

        expect(isAddress(roundAddress)).to.be.true;
        expect(_projectID).to.be.equal(projectID);
        expect(isAddress(_roundImplementation)).to.be.true;
        expect(isAddress(registry)).to.be.true;
      });
    });
  });
});
