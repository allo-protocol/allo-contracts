import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployContract } from "ethereum-waffle";
import { BigNumberish, ContractFactory, Wallet } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  isAddress,
} from "ethers/lib/utils";
import { artifacts, ethers, upgrades } from "hardhat";
import { Artifact } from "hardhat/types";
import { encodeRoundParameters } from "../../scripts/utils";
import {
  buildStatusRow,
  ApplicationStatus,
} from "../../utils/applicationStatus";
import {
  MockERC20,
  RoundFactory,
  RoundFactory__factory,
  RoundImplementation,
  AlloSettings__factory,
  AlloSettings,
  SimpleStrategy,
} from "../../typechain";

type MetaPtr = {
  protocol: BigNumberish;
  pointer: string;
};

describe("RoundImplementation", function () {
  let user: SignerWithAddress;

  // Allotment Settings
  let alloSettingsContractFactory: AlloSettings__factory;
  let alloSettingsContract: AlloSettings;

  // Round Factory
  let roundContractFactory: RoundFactory__factory;
  let roundFactoryContract: RoundFactory;

  // Round Implementation
  let roundImplementation: RoundImplementation;
  let roundImplementationArtifact: Artifact;

  let strategyFactory: ContractFactory;
  let strategyImplementation: SimpleStrategy;

  // Variable declarations

  let roundMetaPtr: MetaPtr;
  let applicationMetaPtr: MetaPtr;

  let adminRoles: string[];
  let roundOperators: string[];

  const ROUND_OPERATOR_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("ROUND_OPERATOR")
  );

  const DEFAULT_ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  before(async () => {
    [user] = await ethers.getSigners();

    // Deploy AlloSettings contract
    alloSettingsContractFactory = await ethers.getContractFactory(
      "AlloSettings"
    );
    alloSettingsContract = <AlloSettings>(
      await upgrades.deployProxy(alloSettingsContractFactory)
    );

    // Deploy RoundFactory contract
    roundContractFactory = await ethers.getContractFactory("RoundFactory");
    roundFactoryContract = <RoundFactory>(
      await upgrades.deployProxy(roundContractFactory)
    );

    strategyFactory = await ethers.getContractFactory("SimpleStrategy");
    strategyImplementation = <SimpleStrategy>await upgrades.deployProxy(strategyFactory, {
      initializer: false      
    });
  });

  describe("constructor", () => {
    it("deploys properly", async () => {
      roundImplementationArtifact = await artifacts.readArtifact(
        "RoundImplementation"
      );

      roundImplementation = <RoundImplementation>(
        await deployContract(user, roundImplementationArtifact, [])
      );

      // Verify deploy
      expect(
        isAddress(roundImplementation.address),
        "Failed to deploy RoundImplementation"
      ).to.be.true;
    });
  });

  describe("core functions", () => {
    const initRound = async (
      _currentBlockTimestamp: number,
      overrides?: any
    ) => {
      const initRoundTime = [
        _currentBlockTimestamp + 100, // applicationsStartTime
        _currentBlockTimestamp + 250, // applicationsEndTime
        _currentBlockTimestamp + 500, // roundStartTime
        _currentBlockTimestamp + 1000, // roundEndTime
      ];

      const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

      const initRoles = [adminRoles, roundOperators];

      let params = [initRoundTime, initMetaPtr, initRoles];

      strategyImplementation = <SimpleStrategy>await upgrades.deployProxy(strategyFactory,{
        initializer: false
      });
      
      roundImplementation = <RoundImplementation>(
        await deployContract(user, roundImplementationArtifact, [])
      );

      await roundImplementation.initialize(
        encodeRoundParameters(params),
        "0x",
        alloSettingsContract.address,
        strategyImplementation.address
      );

      return params;
    };

    before(async () => {
      roundMetaPtr = {
        protocol: 1,
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      };
      applicationMetaPtr = {
        protocol: 1,
        pointer: "bafybeiaoakfoxjwi2kwh43djbmomroiryvhv5cetg74fbtzwef7hzzvrnq",
      };

      adminRoles = [user.address];
      roundOperators = [
        user.address,
        Wallet.createRandom().address,
        Wallet.createRandom().address,
      ];
    });

    beforeEach(async () => {
      // Deploy RoundImplementation contract
    });

    describe("test: initialize", () => {
      let _currentBlockTimestamp: number;

      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("default values MUST match the arguments while invoking initialize", async () => {
        // check roles
        expect(await roundImplementation.ROUND_OPERATOR_ROLE()).equals(
          ROUND_OPERATOR_ROLE
        );
        expect(await roundImplementation.DEFAULT_ADMIN_ROLE()).equals(
          DEFAULT_ADMIN_ROLE
        );

        expect(await roundImplementation.applicationsStartTime()).equals(
          _currentBlockTimestamp + 100
        );
        expect(await roundImplementation.applicationsEndTime()).equals(
          _currentBlockTimestamp + 250
        );
        expect(await roundImplementation.roundStartTime()).equals(
          _currentBlockTimestamp + 500
        );
        expect(await roundImplementation.roundEndTime()).equals(
          _currentBlockTimestamp + 1000
        );

        expect(await roundImplementation.votingStrategy).not.equals(
          ethers.constants.AddressZero
        );

        const roundMetaPtr = await roundImplementation.roundMetaPtr();
        expect(roundMetaPtr.pointer).equals(roundMetaPtr.pointer);
        expect(roundMetaPtr.protocol).equals(roundMetaPtr.protocol);

        const applicationMetaPtr =
          await roundImplementation.applicationMetaPtr();
        expect(applicationMetaPtr.pointer).equals(applicationMetaPtr.pointer);
        expect(applicationMetaPtr.protocol).equals(applicationMetaPtr.protocol);

        expect(
          await roundImplementation.getRoleMemberCount(DEFAULT_ADMIN_ROLE)
        ).equals(adminRoles.length);
        expect(
          await roundImplementation.getRoleMember(DEFAULT_ADMIN_ROLE, 0)
        ).equals(adminRoles[0]);

        expect(
          await roundImplementation.getRoleMemberCount(ROUND_OPERATOR_ROLE)
        ).equals(roundOperators.length);
        expect(
          await roundImplementation.getRoleMember(ROUND_OPERATOR_ROLE, 0)
        ).equals(roundOperators[0]);
        expect(
          await roundImplementation.getRoleMember(ROUND_OPERATOR_ROLE, 1)
        ).equals(roundOperators[1]);
      });

      it("SHOULD revert when applicationsStartTime is in the past", async () => {
        const newRoundImplementation = <RoundImplementation>(
          await deployContract(user, roundImplementationArtifact, [])
        );
        const initRoundTime = [
          _currentBlockTimestamp - 100, // applicationsStartTime
          _currentBlockTimestamp + 250, // applicationsEndTime
          _currentBlockTimestamp + 500, // roundStartTime
          _currentBlockTimestamp + 1000, // roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        let params = [initRoundTime, initMetaPtr, initRoles];

        await expect(
          newRoundImplementation.initialize(
            encodeRoundParameters(params),
            "0x",
            roundFactoryContract.address,
            strategyImplementation.address
          )
        ).to.be.revertedWith("Round: Time has already passed");
      });

      it("SHOULD revert when applicationsStartTime is after applicationsEndTime", async () => {
        const newRoundImplementation = <RoundImplementation>(
          await deployContract(user, roundImplementationArtifact, [])
        );

        const initRoundTime = [
          _currentBlockTimestamp + 100, // applicationsStartTime
          _currentBlockTimestamp + 50, // applicationsEndTime
          _currentBlockTimestamp + 500, // roundStartTime
          _currentBlockTimestamp + 1000, // roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        let params = [initRoundTime, initMetaPtr, initRoles];

        await expect(
          newRoundImplementation.initialize(
            encodeRoundParameters(params),
            "0x",
            roundFactoryContract.address,
            strategyImplementation.address
          )
        ).to.be.revertedWith("Round: App end is before app start");
      });

      it("SHOULD revert if applicationsEndTime is after roundEndTime", async () => {
        const newRoundImplementation = <RoundImplementation>(
          await deployContract(user, roundImplementationArtifact, [])
        );

        const initRoundTime = [
          _currentBlockTimestamp + 100, // applicationsStartTime
          _currentBlockTimestamp + 250, // applicationsStartTime
          _currentBlockTimestamp + 500, // roundStartTime
          _currentBlockTimestamp + 200, // roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        let params = [initRoundTime, initMetaPtr, initRoles];

        await expect(
          newRoundImplementation.initialize(
            encodeRoundParameters(params),
            "0x",
            roundFactoryContract.address,
            strategyImplementation.address
          )
        ).to.be.revertedWith("Round: Round end is before app end");
      });

      it("SHOULD revert if roundEndTime is after roundStartTime", async () => {
        const newRoundImplementation = <RoundImplementation>(
          await deployContract(user, roundImplementationArtifact, [])
        );

        const initRoundTime = [
          _currentBlockTimestamp + 100, // applicationsStartTime
          _currentBlockTimestamp + 250, // applicationsStartTime
          _currentBlockTimestamp + 1250, // roundStartTime
          _currentBlockTimestamp + 1000, // roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        let params = [initRoundTime, initMetaPtr, initRoles];

        await expect(
          newRoundImplementation.initialize(
            encodeRoundParameters(params),
            "0x",
            roundFactoryContract.address,
            strategyImplementation.address
          )
        ).to.be.revertedWith("Round: Round end is before round start");
      });

      it("SHOULD revert when applicationsStartTime is after roundStartTime", async () => {
        const newRoundImplementation = <RoundImplementation>(
          await deployContract(user, roundImplementationArtifact, [])
        );

        const initRoundTime = [
          _currentBlockTimestamp + 100, // applicationsStartTime
          _currentBlockTimestamp + 250, // applicationsStartTime
          _currentBlockTimestamp + 50, // roundStartTime
          _currentBlockTimestamp + 1000, // roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        let params = [initRoundTime, initMetaPtr, initRoles];

        await expect(
          newRoundImplementation.initialize(
            encodeRoundParameters(params),
            "0x",
            roundFactoryContract.address,
            strategyImplementation.address
          )
        ).to.be.revertedWith("Round: Round start is before app start");
      });

      it("SHOULD revert ON invoking initialize on already initialized contract ", async () => {
        const initRoundTime = [
          _currentBlockTimestamp + 100, // applicationsStartTime
          _currentBlockTimestamp + 250, // applicationsStartTime
          _currentBlockTimestamp + 500, // roundStartTime
          _currentBlockTimestamp + 1000, // roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        let params = [initRoundTime, initMetaPtr, initRoles];

        await expect(
          roundImplementation.initialize(
            encodeRoundParameters(params),
            "0x",
            roundFactoryContract.address,
            strategyImplementation.address
          )
        ).to.be.revertedWith("Initializable: contract is already initialized");
      });
    });

    describe("test: updateRoundMetaPtr", () => {
      let _currentBlockTimestamp: number;

      const randomMetaPtr: MetaPtr = {
        protocol: 1,
        pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      };

      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD revert if invoked by wallet who is not round operator", async () => {
        const [_, notRoundOperator] = await ethers.getSigners();
        await expect(
          roundImplementation
            .connect(notRoundOperator)
            .updateRoundMetaPtr(randomMetaPtr)
        ).to.revertedWith(
          `AccessControl: account ${notRoundOperator.address.toLowerCase()} is missing role 0xec61da14b5abbac5c5fda6f1d57642a264ebd5d0674f35852829746dfb8174a5`
        );
      });

      it("SHOULD update roundMetaPtr value IF called is round operator", async () => {
        const txn = await roundImplementation.updateRoundMetaPtr(randomMetaPtr);
        await txn.wait();

        const roundMetaPtr = await roundImplementation.roundMetaPtr();
        expect(roundMetaPtr.pointer).equals(randomMetaPtr.pointer);
        expect(roundMetaPtr.protocol).equals(randomMetaPtr.protocol);
      });

      it("SHOULD emit RoundMetaPtrUpdated event", async () => {
        const txn = await roundImplementation.updateRoundMetaPtr(randomMetaPtr);

        expect(txn)
          .to.emit(roundImplementation, "RoundMetaPtrUpdated")
          .withArgs(
            [randomMetaPtr.protocol, randomMetaPtr.pointer]
          );
      });

      it("SHOULD revert if invoked after roundEndTime", async () => {
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1500]);

        await expect(
          roundImplementation.updateRoundMetaPtr(randomMetaPtr)
        ).to.revertedWith("Round: Round has ended");
      });
    });

    describe("test: updateApplicationMetaPtr", () => {
      let _currentBlockTimestamp: number;

      const randomMetaPtr: MetaPtr = {
        protocol: 1,
        pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      };

      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("updateApplicationMetaPtr SHOULD revert if invoked by wallet who is not round operator", async () => {
        const [_, notRoundOperator] = await ethers.getSigners();

        await expect(
          roundImplementation
            .connect(notRoundOperator)
            .updateApplicationMetaPtr(randomMetaPtr)
        ).to.revertedWith(
          `AccessControl: account ${notRoundOperator.address.toLowerCase()} is missing role 0xec61da14b5abbac5c5fda6f1d57642a264ebd5d0674f35852829746dfb8174a5`
        );
      });

      it("SHOULD update applicationMetaPtr value IF called is round operator", async () => {
        const txn = await roundImplementation.updateApplicationMetaPtr(
          randomMetaPtr
        );
        await txn.wait();

        const applicationMetaPtr =
          await roundImplementation.applicationMetaPtr();
        expect(applicationMetaPtr.pointer).equals(randomMetaPtr.pointer);
        expect(applicationMetaPtr.protocol).equals(randomMetaPtr.protocol);
      });

      it("SHOULD emit ApplicationMetaPtrUpdated event", async () => {
        const txn = await roundImplementation.updateApplicationMetaPtr(
          randomMetaPtr
        );

        expect(txn)
          .to.emit(roundImplementation, "ApplicationMetaPtrUpdated")
          .withArgs(
            [randomMetaPtr.protocol, randomMetaPtr.pointer]
          );
      });

      it("SHOULD revert if invoked after roundEndTime", async () => {
        await ethers.provider.send("evm_mine", [
          _currentBlockTimestamp + 150000,
        ]);

        await expect(
          roundImplementation.updateApplicationMetaPtr(randomMetaPtr)
        ).to.revertedWith("Round: Round has ended");
      });
    });

    describe("test: updateStartAndEndTimes", () => {
      let _currentBlockTimestamp: number;
      let newApplicationsStartTime: number;
      let newApplicationsEndTime: number;
      let newRoundStartTime: number;
      let newRoundEndTime: number;

      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        newApplicationsStartTime = _currentBlockTimestamp + 150;
        newApplicationsEndTime = _currentBlockTimestamp + 350;
        newRoundStartTime = _currentBlockTimestamp + 550;
        newRoundEndTime = _currentBlockTimestamp + 750;

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD revert if invoked by wallet who is not round operator", async () => {
        const [_, notRoundOperator] = await ethers.getSigners();
        await expect(
          roundImplementation
            .connect(notRoundOperator)
            .updateStartAndEndTimes(
              newApplicationsStartTime,
              newApplicationsEndTime,
              newRoundStartTime,
              newRoundEndTime
            )
        ).to.revertedWith(
          `AccessControl: account ${notRoundOperator.address.toLowerCase()} is missing role 0xec61da14b5abbac5c5fda6f1d57642a264ebd5d0674f35852829746dfb8174a5`
        );
      });

      it("SHOULD revert if newApplicationStartTime is after newApplicationsEndTime", async () => {
        const _newApplicationsStartTime = _currentBlockTimestamp + 400;

        await expect(
          roundImplementation.updateStartAndEndTimes(
            _newApplicationsStartTime,
            newApplicationsEndTime,
            newRoundStartTime,
            newRoundEndTime
          )
        ).to.revertedWith("Round: Application end is before application start");
      });

      it("SHOULD revert if newRoundStartTime is after newRoundEndTime", async () => {
        const _newRoundStartTime = _currentBlockTimestamp + 800;

        await expect(
          roundImplementation.updateStartAndEndTimes(
            newApplicationsStartTime,
            newApplicationsEndTime,
            _newRoundStartTime,
            newRoundEndTime
          )
        ).to.revertedWith("Round: Round end is before round start");
      });

      it("SHOULD revert if newRoundStartTime is before newApplicationsStartTime", async () => {
        const _newApplicationsStartTime = _currentBlockTimestamp + 600;
        const _newApplicationsEndTime = _currentBlockTimestamp + 800;

        await expect(
          roundImplementation.updateStartAndEndTimes(
            _newApplicationsStartTime,
            _newApplicationsEndTime,
            newRoundStartTime,
            newRoundEndTime
          )
        ).to.revertedWith("Round: Round start is before application start");
      });

      it("SHOULD revert if newApplicationsEndTime is after newRoundEndTime", async () => {
        const _newApplicationsEndTime = _currentBlockTimestamp + 800;

        await expect(
          roundImplementation.updateStartAndEndTimes(
            newApplicationsStartTime,
            _newApplicationsEndTime,
            newRoundStartTime,
            newRoundEndTime
          )
        ).to.revertedWith("Round: Round end is before application end");
      });

      it("SHOULD update start & end times value IF called is round operator", async () => {
        const txn = await roundImplementation.updateStartAndEndTimes(
          newApplicationsStartTime,
          newApplicationsEndTime,
          newRoundStartTime,
          newRoundEndTime
        );
        await txn.wait();

        const applicationsStartTime =
          await roundImplementation.applicationsStartTime();
        const applicationsEndTime =
          await roundImplementation.applicationsEndTime();
        const roundStartTime = await roundImplementation.roundStartTime();
        const roundEndTime = await roundImplementation.roundEndTime();

        expect(applicationsStartTime).equals(newApplicationsStartTime);
        expect(applicationsEndTime).equals(newApplicationsEndTime);
        expect(roundStartTime).equals(newRoundStartTime);
        expect(roundEndTime).equals(newRoundEndTime);
      });

      it("SHOULD emit all TimeUpdated event", async () => {
        const tx = await roundImplementation.updateStartAndEndTimes(
          newApplicationsStartTime,
          newApplicationsEndTime,
          newRoundStartTime,
          newRoundEndTime
        );

        expect(tx)
          .to.emit(roundImplementation, "ApplicationsStartTimeUpdated")
          .withArgs(newApplicationsStartTime);

        expect(tx)
          .to.emit(roundImplementation, "ApplicationsEndTimeUpdated")
          .withArgs(newApplicationsEndTime);

        expect(tx)
          .to.emit(roundImplementation, "RoundStartTimeUpdated")
          .withArgs(newRoundStartTime);

        expect(tx)
          .to.emit(roundImplementation, "RoundEndTimeUpdated")
          .withArgs(newRoundEndTime);
      });

      it("SHOULD revert if newApplicationsStartTime has passed current timestamp", async () => {
        const _newApplicationsStartTime = _currentBlockTimestamp - 100;

        const tx = roundImplementation.updateStartAndEndTimes(
          _newApplicationsStartTime,
          newApplicationsEndTime,
          newRoundStartTime,
          newRoundEndTime
        );

        await expect(tx).to.revertedWith("Round: Time has already passed");
      });

      it("SHOULD emit event only for updated timestamp", async () => {
        const oldRoundEndTime = await roundImplementation.roundEndTime();

        const tx = await roundImplementation.updateStartAndEndTimes(
          newApplicationsStartTime,
          newApplicationsEndTime,
          newRoundStartTime,
          oldRoundEndTime
        );

        expect(tx)
          .to.emit(roundImplementation, "ApplicationsStartTimeUpdated")
          .withArgs(newApplicationsStartTime);

        expect(tx)
          .to.emit(roundImplementation, "ApplicationsEndTimeUpdated")
          .withArgs(newApplicationsEndTime);

        expect(tx)
          .to.emit(roundImplementation, "RoundStartTimeUpdated")
          .withArgs(newRoundStartTime);

        expect(tx).not.to.emit(roundImplementation, "RoundEndTimeUpdated");
      });

      it("SHOULD revert if invoked after roundEndTime", async () => {
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1500]);

        await expect(
          roundImplementation.updateStartAndEndTimes(
            newApplicationsStartTime,
            newApplicationsEndTime,
            newRoundStartTime,
            newRoundEndTime
          )
        ).to.revertedWith("Round: Round has ended");
      });
    });

    describe("test: update using multicall", () => {
      let _currentBlockTimestamp: number;
      let newApplicationsStartTime: number;
      let newApplicationsEndTime: number;
      let newRoundStartTime: number;
      let newRoundEndTime: number;

      let newApplicationMetapointer: MetaPtr;
      let newRoundMetapointer: MetaPtr;

      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        newApplicationsStartTime = _currentBlockTimestamp + 150;
        newApplicationsEndTime = _currentBlockTimestamp + 350;
        newRoundStartTime = _currentBlockTimestamp + 550;
        newRoundEndTime = _currentBlockTimestamp + 750;

        newApplicationMetapointer = {
          protocol: 1,
          pointer: "newApplicationMetapointer",
        };
        newRoundMetapointer = {
          protocol: 1,
          pointer: "newRoundMetapointer",
        };

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD revert if called by non-owner", async () => {
        const [_, notRoundOperator] = await ethers.getSigners();

        const updateApplicationMetaPtr =
          roundImplementation.interface.encodeFunctionData(
            "updateApplicationMetaPtr",
            [newApplicationMetapointer]
          );

        await expect(
          roundImplementation
            .connect(notRoundOperator)
            .multicall([updateApplicationMetaPtr])
        ).to.be.revertedWith(
          `AccessControl: account ${notRoundOperator.address.toLowerCase()} is missing role 0xec61da14b5abbac5c5fda6f1d57642a264ebd5d0674f35852829746dfb8174a5`
        );
      });

      it("SHOULD update all values", async () => {
        const updateStartAndEndTimes =
          roundImplementation.interface.encodeFunctionData(
            "updateStartAndEndTimes",
            [
              newApplicationsStartTime,
              newApplicationsEndTime,
              newRoundStartTime,
              newRoundEndTime,
            ]
          );

        const updateApplicationMetaPtr =
          roundImplementation.interface.encodeFunctionData(
            "updateApplicationMetaPtr",
            [newApplicationMetapointer]
          );

        const updateRoundMetaPtr =
          roundImplementation.interface.encodeFunctionData(
            "updateRoundMetaPtr",
            [newRoundMetapointer]
          );

        const tx = await roundImplementation.multicall([
          updateStartAndEndTimes,
          updateApplicationMetaPtr,
          updateRoundMetaPtr,
        ]);

        await tx.wait();

        expect(await roundImplementation.applicationsStartTime()).equals(
          newApplicationsStartTime
        );

        expect(await roundImplementation.applicationsEndTime()).equals(
          newApplicationsEndTime
        );

        expect(await roundImplementation.roundStartTime()).equals(
          newRoundStartTime
        );

        expect(await roundImplementation.roundEndTime()).equals(
          newRoundEndTime
        );

        const applicationMetaPtr =
          await roundImplementation.applicationMetaPtr();
        expect(applicationMetaPtr.protocol).equals(
          newApplicationMetapointer.protocol
        );
        expect(applicationMetaPtr.pointer).equals(
          newApplicationMetapointer.pointer
        );

        const roundMetaPtr = await roundImplementation.roundMetaPtr();
        expect(roundMetaPtr.protocol).equals(newRoundMetapointer.protocol);
        expect(roundMetaPtr.pointer).equals(newRoundMetapointer.pointer);
      });
    });

    describe("test: setApplicationStatuses", () => {
      let _currentBlockTimestamp: number;
      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD set the correct application statuses", async () => {
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 110]);
        for (let i = 0; i < 4; i++) {
          await roundImplementation.applyToRound(
            ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            {
              protocol: 1,
              pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            }
          );
        }

        const statuses = [
          { index: 0, status: ApplicationStatus.PENDING },
          { index: 1, status: ApplicationStatus.ACCEPTED },
          { index: 2, status: ApplicationStatus.REJECTED },
          { index: 3, status: ApplicationStatus.CANCELED },
        ];

        const newState = buildStatusRow(0n, statuses);

        const applicationStatus = {
          index: 0,
          statusRow: newState,
        };

        await roundImplementation.setApplicationStatuses([applicationStatus]);

        expect(await roundImplementation.getApplicationStatus(0)).equal(
          ApplicationStatus.PENDING
        );

        expect(await roundImplementation.getApplicationStatus(1)).equal(
          ApplicationStatus.ACCEPTED
        );

        expect(await roundImplementation.getApplicationStatus(2)).equal(
          ApplicationStatus.REJECTED
        );

        expect(await roundImplementation.getApplicationStatus(3)).equal(
          ApplicationStatus.CANCELED
        );
      });
    });

    describe("test: applyToRound", () => {
      let projectID: string;
      let newProjectMetaPtr: MetaPtr;
      let _currentBlockTimestamp: number;

      before(async () => {
        projectID = ethers.utils.hexlify(ethers.utils.randomBytes(32));

        newProjectMetaPtr = {
          protocol: 1,
          pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        };
      });

      beforeEach(async () => {
        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD revert WHEN invoked before applicationsStartTime has started", async () => {
        await expect(
          roundImplementation.applyToRound(projectID, newProjectMetaPtr)
        ).to.be.revertedWith("Round: Applications period not started or over");
      });

      it("SHOULD revert WHEN invoked after applicationsEndTime", async () => {
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 7500]);

        await expect(
          roundImplementation.applyToRound(projectID, newProjectMetaPtr)
        ).to.be.revertedWith("Round: Applications period not started or over");
      });

      it("SHOULD add application to applications array", async () => {
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 110]);
        await roundImplementation.applyToRound(projectID, newProjectMetaPtr);

        const application = await roundImplementation.applications(0);

        expect(application.projectID).equals(projectID);
        expect(application.metaPtr.protocol).equals(newProjectMetaPtr.protocol);
        expect(application.metaPtr.pointer).equals(newProjectMetaPtr.pointer);

        expect(
          await roundImplementation.applicationsIndexesByProjectID(projectID, 0)
        ).equals(0);
      });

      it("SHOULD emit NewProjectApplication event", async () => {
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 110]);

        const txn = await roundImplementation.applyToRound(
          projectID,
          newProjectMetaPtr
        );

        expect(txn)
          .to.emit(roundImplementation, "NewProjectApplication")
          .withArgs(projectID, 0, [
            newProjectMetaPtr.protocol,
            newProjectMetaPtr.pointer,
          ]);
      });
    });

    describe("test: vote", () => {
      let encodedVotes: BytesLike[] = [];
      let mockERC20: MockERC20;
      let _currentBlockTimestamp: number;

      beforeEach(async () => {
        let mockERC20Artifact = await artifacts.readArtifact("MockERC20");
        mockERC20 = <MockERC20>(
          await deployContract(user, mockERC20Artifact, [10000])
        );

        // Prepare Votes
        const votes = [
          [
            mockERC20.address,
            5,
            Wallet.createRandom().address,
            formatBytes32String("grant2"),
            1,
          ],
        ];

        for (let i = 0; i < votes.length; i++) {
          encodedVotes.push(
            ethers.utils.defaultAbiCoder.encode(
              ["address", "uint256", "address", "bytes32", "uint256"],
              votes[i]
            )
          );
        }

        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD NOT revert when round is active", async () => {
        const votingStrategy = await roundImplementation.votingStrategy();
        await mockERC20.approve(votingStrategy, 1000);

        // Mine Blocks
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 900]);

        await expect(roundImplementation.vote(encodedVotes)).to.not.be.reverted;
      });

      it("SHOULD revert WHEN invoked before roundStartTime", async () => {
        await expect(roundImplementation.vote(encodedVotes)).to.be.revertedWith(
          "Round: Round is not active"
        );
      });

      it("SHOULD revert WHEN invoked after roundEndTime", async () => {
        await ethers.provider.send("evm_mine", [
          _currentBlockTimestamp + 18000,
        ]);

        await expect(roundImplementation.vote(encodedVotes)).to.be.revertedWith(
          "Round: Round is not active"
        );
      });
    });

    describe("test: withdraw", () => {
      let mockERC20: MockERC20;
      let _currentBlockTimestamp: number;

      beforeEach(async () => {
        // Deploy RoundImplementation contract
        roundImplementationArtifact = await artifacts.readArtifact(
          "RoundImplementation"
        );
        roundImplementation = <RoundImplementation>(
          await deployContract(user, roundImplementationArtifact, [])
        );

        let mockERC20Artifact = await artifacts.readArtifact("MockERC20");
        mockERC20 = <MockERC20>(
          await deployContract(user, mockERC20Artifact, [10000])
        );

        _currentBlockTimestamp = (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;

        await initRound(_currentBlockTimestamp);
      });

      it("SHOULD revert when not invoked by round operator", async () => {
        const [user, notRoundOperator] = await ethers.getSigners();

        await expect(
          roundImplementation
            .connect(notRoundOperator)
            .withdraw(mockERC20.address, user.address)
        ).to.revertedWith(
          `AccessControl: account ${notRoundOperator.address.toLowerCase()} is missing role 0xec61da14b5abbac5c5fda6f1d57642a264ebd5d0674f35852829746dfb8174a5`
        );
      });

      it("SHOULD drain and transfer ERC-20 token funds from contract to recipent ", async () => {
        // check user balance before withdraw
        let originalUserBalance = Number(
          await mockERC20.balanceOf(user.address)
        );

        // transfer tokens to 1000 to round contract
        await mockERC20.transfer(roundImplementation.address, 100);

        let userBalanceBeforeWithdraw = Number(
          await mockERC20.balanceOf(user.address)
        );
        expect(userBalanceBeforeWithdraw).to.equal(originalUserBalance - 100);

        // check round balance before withdraw
        let roundBalance = await mockERC20.balanceOf(
          roundImplementation.address
        );
        expect(roundBalance).to.equal(100);

        // withdraw
        await roundImplementation.withdraw(mockERC20.address, user.address);

        // check user balance after withdraw
        let userBalanceAfterWithdraw = Number(
          await mockERC20.balanceOf(user.address)
        );
        expect(userBalanceAfterWithdraw).to.equal(originalUserBalance);

        // check round balance after withdraw
        let roundBalanceAfterWithdraw = Number(
          await mockERC20.balanceOf(roundImplementation.address)
        );
        expect(roundBalanceAfterWithdraw).to.equal(0);
      });

      it("SHOULD drain and transfer native token funds from contract to recipent ", async () => {
        // transfer tokens to 1 ETH to round contract
        await user.sendTransaction({
          to: roundImplementation.address,
          value: ethers.utils.parseEther("1.0"),
        });

        // check round balance before withdraw
        let roundBalance = await ethers.provider.getBalance(
          roundImplementation.address
        );
        expect(roundBalance).to.equal(ethers.utils.parseEther("1.0"));

        await roundImplementation.withdraw(
          ethers.constants.AddressZero,
          user.address
        );

        // check round balance after withdraw
        roundBalance = await ethers.provider.getBalance(
          roundImplementation.address
        );
        expect(roundBalance).to.equal(ethers.utils.parseEther("0"));
      });
    });
  });
});
