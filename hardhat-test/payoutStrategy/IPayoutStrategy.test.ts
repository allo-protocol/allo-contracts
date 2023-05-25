import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployContract, MockContract } from "ethereum-waffle";
import { Wallet } from "ethers";
import { hexlify, isAddress } from "ethers/lib/utils";
import { artifacts, ethers, upgrades } from "hardhat";
import { Artifact } from "hardhat/types";
import { encodeRoundParameters } from "../../scripts/utils";
import { AlloSettings, AlloSettings__factory, MerklePayoutStrategyFactory, MerklePayoutStrategyFactory__factory, MerklePayoutStrategyImplementation, MockERC20, QuadraticFundingVotingStrategyFactory, QuadraticFundingVotingStrategyFactory__factory, QuadraticFundingVotingStrategyImplementation, RoundFactory, RoundFactory__factory, RoundImplementation } from "../../typechain";
import { randomBytes } from "crypto";
import { encodeDistributionParameters } from "./MerklePayoutStrategyImplementation.test";

describe("IPayoutStrategy", function () {

  let user: SignerWithAddress;

  // Allo Settings contract
  let alloSettingsContractFactory: AlloSettings__factory;
  let alloSettingsContract: AlloSettings;

  // Round Factory
  let roundContractFactory: RoundFactory__factory;
  let roundFactoryContract: RoundFactory;

  // Round Implementation
  let roundImplementation: RoundImplementation;
  let roundImplementationArtifact: Artifact;

  // Voting Strategy Factory
  let VotingStrategyFactory: QuadraticFundingVotingStrategyFactory;
  let VotingStrategyContractFactory: QuadraticFundingVotingStrategyFactory__factory;

  // Voting Strategy Implementation
  let votingStrategyImplementation: QuadraticFundingVotingStrategyImplementation;
  let votingStrategyImplementationArtifact: Artifact;

  // MerklePayoutStrategy Factory
  let MerklePayoutStrategyFactory: MerklePayoutStrategyFactory;
  let MerklePayoutStrategyContractFactory: MerklePayoutStrategyFactory__factory;

  // MerklePayoutStrategy Implementation
  let merklePayoutStrategyImplementation: MerklePayoutStrategyImplementation;
  let merklePayoutStrategyImplementationArtifact: Artifact;

  // MockERC20
  let mockERC20: MockERC20;
  let mockERC20Artifact: Artifact;


  const VERSION = "0.2.0";


  before(async () => {
    [user] = await ethers.getSigners();

    // Deploy AlloSettings contract
    alloSettingsContractFactory = await ethers.getContractFactory('AlloSettings');
    alloSettingsContract = <AlloSettings>await upgrades.deployProxy(alloSettingsContractFactory);

    // Deploy RoundFactory contract
    roundContractFactory = await ethers.getContractFactory('RoundFactory');
    roundFactoryContract = <RoundFactory>await upgrades.deployProxy(roundContractFactory);

    // Deploy voting strategy factory
    VotingStrategyContractFactory = await ethers.getContractFactory('QuadraticFundingVotingStrategyFactory');
    VotingStrategyFactory = <QuadraticFundingVotingStrategyFactory>await upgrades.deployProxy(VotingStrategyContractFactory);

    // Deploy MerklePayoutStrategyFactory
    MerklePayoutStrategyContractFactory = await ethers.getContractFactory('MerklePayoutStrategyFactory');
    MerklePayoutStrategyFactory = <MerklePayoutStrategyFactory>await upgrades.deployProxy(MerklePayoutStrategyContractFactory);

    // Deploy voting strategy implementation
    votingStrategyImplementationArtifact = await artifacts.readArtifact('QuadraticFundingVotingStrategyImplementation');
    votingStrategyImplementation = <QuadraticFundingVotingStrategyImplementation>await deployContract(user, votingStrategyImplementationArtifact, []);

    // Deploy MerklePayoutStrategyImplementation
    merklePayoutStrategyImplementationArtifact = await artifacts.readArtifact('MerklePayoutStrategyImplementation');
    merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>await deployContract(user, merklePayoutStrategyImplementationArtifact, []);

    // link contracts to factory
    await VotingStrategyFactory.updateVotingContract(votingStrategyImplementation.address);
    await MerklePayoutStrategyFactory.updatePayoutImplementation(merklePayoutStrategyImplementation.address);

    roundImplementationArtifact = await artifacts.readArtifact('RoundImplementation');

  })

  describe ('constructor', () => {

    it('SHOULD deploy properly', async () => {

      // Verify deploy
      expect(isAddress(merklePayoutStrategyImplementation.address), 'Failed to deploy MerklePayoutStrategyImplementation').to.be.true;
    });
  });

  let _currentBlockTimestamp: number;

  describe('IPayoutStrategy functions', () => {

    const initPayoutStrategy = async (
      _currentBlockTimestamp: number,
      overrides?: any
    ) => {

      // Deploy MockERC20 contract if _token is not provided
      mockERC20Artifact = await artifacts.readArtifact('MockERC20');
      mockERC20 = <MockERC20>await deployContract(user, mockERC20Artifact, [10000]);
      const token =  overrides && overrides.hasOwnProperty('token') ? overrides.token : mockERC20.address;

      const roundMetaPtr = { protocol: 1, pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi" };
      const applicationMetaPtr = { protocol: 1, pointer: "bafybeiaoakfoxjwi2kwh43djbmomroiryvhv5cetg74fbtzwef7hzzvrnq" };

      const adminRoles = [ user.address ];
      const roundOperators = [
        user.address,
        Wallet.createRandom().address,
        Wallet.createRandom().address
      ];

      // Deploy RoundImplementation contract
      roundImplementationArtifact = await artifacts.readArtifact('RoundImplementation');
      roundImplementation = <RoundImplementation>await deployContract(user, roundImplementationArtifact, []);

      const matchAmount = 100;
      const denominator = await alloSettingsContract.DENOMINATOR();
      const roundFeePercentage = 10 * (denominator / 100);

      const roundFeeAddress = Wallet.createRandom().address;

      const initAddress = [
        VotingStrategyFactory.address, // votingStrategyFactory
        MerklePayoutStrategyFactory.address, // payoutStrategyFactory
      ];

      const initRoundTime = [
        _currentBlockTimestamp + 100, // applicationsStartTime
        _currentBlockTimestamp + 250, // applicationsStartTime
        _currentBlockTimestamp + 500, // roundStartTime
        _currentBlockTimestamp + 1000, // roundEndTime
      ];

      const initMetaPtr = [
        roundMetaPtr,
        applicationMetaPtr,
      ];

      const initRoles = [
        adminRoles,
        roundOperators
      ];

      let params = [
        initAddress,
        initRoundTime,
        matchAmount,
        token,
        roundFeePercentage,
        roundFeeAddress,
        initMetaPtr,
        initRoles
      ];

      await roundImplementation.initialize(
        encodeRoundParameters(params),
        alloSettingsContract.address
      );

      return params;
    };

    describe('test: init', () => {

      let merklePayoutStrategyImplementation: MerklePayoutStrategyImplementation;
      before(async () => {
        [user] = await ethers.getSigners();

        _currentBlockTimestamp = (await ethers.provider.getBlock(
          await ethers.provider.getBlockNumber())
        ).timestamp;

        await initPayoutStrategy(_currentBlockTimestamp);

        merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );
      });

      it("SHOULD set the contract version", async() => {
        expect(await merklePayoutStrategyImplementation.VERSION()).to.equal(VERSION);
      });

      it("SHOULD set the round address", async() => {
        expect(await merklePayoutStrategyImplementation.roundAddress()).to.equal(roundImplementation.address);
      });

      it("SHOULD revert WHEN invoked more than once", async() => {
        const tx = merklePayoutStrategyImplementation.init();
        await expect(tx).to.revertedWith('roundAddress already set');
      });
    });

    describe('test: setReadyForPayout', () => {

      beforeEach(async () => {

        // update protocol treasury
        let protocolTreasury = Wallet.createRandom().address;
        await alloSettingsContract.updateProtocolTreasury(protocolTreasury);

        [user] = await ethers.getSigners();

        _currentBlockTimestamp = (await ethers.provider.getBlock(
          await ethers.provider.getBlockNumber())
        ).timestamp;

      });

      it("SHOULD revert if invoked when roundAddress is not set", async() => {
        const tx = merklePayoutStrategyImplementation.setReadyForPayout();
        await expect(tx).to.revertedWith('not linked to a round');
      });

      it("SHOULD revert if not called by Round", async () => {
        await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );

        const tx = merklePayoutStrategyImplementation.setReadyForPayout();
        await expect(tx).to.revertedWith('not invoked by round');
      });

      it("SHOULD revert if round has not ended", async () => {
        await initPayoutStrategy(_currentBlockTimestamp);

        // transfer some tokens to roundImplementation
        await mockERC20.transfer(roundImplementation.address, 110);

        const tx = roundImplementation.setReadyForPayout();
        await expect(tx).to.revertedWith('Round: Round has not ended');
      });

      it("SHOULD revert if distribution is not set", async() => {
        await initPayoutStrategy(_currentBlockTimestamp);
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1300]);

        // transfer some tokens to roundImplementation
        await mockERC20.transfer(roundImplementation.address, 110);

        const tx = roundImplementation.setReadyForPayout();
        await expect(tx).to.revertedWith('distribution not set');
      });

      it("SHOULD set isReadyForPayout as true", async() => {
        await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );

        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1300]);

        await merklePayoutStrategyImplementation.updateDistribution(
          encodeDistributionParameters(hexlify(randomBytes(32)), 1, "test")
        );

        // transfer some tokens to roundImplementation
        await mockERC20.transfer(roundImplementation.address, 110);

        await roundImplementation.setReadyForPayout();

        expect(await merklePayoutStrategyImplementation.isReadyForPayout()).to.equal(true);
      });

      it("SHOULD emit ReadyForPayout event", async() => {
        await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );

        // transfer some tokens to roundImplementation
        await mockERC20.transfer(roundImplementation.address, 110);
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1300])

        await merklePayoutStrategyImplementation.updateDistribution(
          encodeDistributionParameters(hexlify(randomBytes(32)), 1, "test")
        );

        // set isReadyForPayout as true
        const tx = roundImplementation.setReadyForPayout();

        await expect(tx).to.emit(merklePayoutStrategyImplementation, 'ReadyForPayout');
      });

      it("SHOULD revert if isReadyForPayout is already true", async() => {
        await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );

        // transfer some tokens to roundImplementation
        await mockERC20.transfer(roundImplementation.address, 110);
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1300])

        await merklePayoutStrategyImplementation.updateDistribution(
          encodeDistributionParameters(hexlify(randomBytes(32)), 1, "test")
        );

        // set isReadyForPayout as true
        await roundImplementation.setReadyForPayout();

        // try to set isReadyForPayout as true again
        await mockERC20.transfer(roundImplementation.address, 110);
        const tx = roundImplementation.setReadyForPayout();

        await expect(tx).to.revertedWith('isReadyForPayout already set');
      });

    });

    describe('test: withdrawFunds', () => {

      let params: any;

      beforeEach(async () => {
        [user] = await ethers.getSigners();

        _currentBlockTimestamp = (await ethers.provider.getBlock(
          await ethers.provider.getBlockNumber())
        ).timestamp;

        // Deploy MerklePayoutStrategyImplementation
        merklePayoutStrategyImplementationArtifact = await artifacts.readArtifact('MerklePayoutStrategyImplementation');
        merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>await deployContract(user, merklePayoutStrategyImplementationArtifact, []);

      });

      it("SHOULD revert WHEN invoked by not round operator", async() => {
        params = await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );
        const [_, notRoundOperator] = await ethers.getSigners();
        const tx = merklePayoutStrategyImplementation.connect(notRoundOperator).withdrawFunds(Wallet.createRandom().address);
        await expect(tx).to.revertedWith('not round operator');
      });

      it("SHOULD revert WHEN invoked before endLockingTime", async() => {
        params = await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );
        const tx = merklePayoutStrategyImplementation.withdrawFunds(Wallet.createRandom().address);
        await expect(tx).to.revertedWith('round has not ended');
      });

      it("SHOULD not revert WHEN invoked when the contract has no funds", async() => {
        params = await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );
        // Mine Blocks
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1200])

        const tx = merklePayoutStrategyImplementation.withdrawFunds(Wallet.createRandom().address);
        await expect(tx).to.not.reverted;
      });

      it("SHOULD transfer native funds WHEN invoked after endLockingTime", async() => {

        params = await initPayoutStrategy(_currentBlockTimestamp, {
          token: AddressZero
        });
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );
        // Mine Blocks
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1200])

        // transfer funds to payout strategy
        await user.sendTransaction({
          to: merklePayoutStrategyImplementation.address,
          value: ethers.utils.parseEther("1.0"),
        });

        expect(await ethers.provider.getBalance(merklePayoutStrategyImplementation.address)).to.equal(ethers.utils.parseEther("1.0"));

        // withdraw funds
        const withdrawAddress = Wallet.createRandom().address;
        await merklePayoutStrategyImplementation.withdrawFunds(withdrawAddress);

        expect(await ethers.provider.getBalance(merklePayoutStrategyImplementation.address)).to.equal(0);
        expect(await ethers.provider.getBalance(withdrawAddress)).to.equal(ethers.utils.parseEther("1.0"));

      });

      it("SHOULD transfer ERC20 funds and emit event WHEN invoked after endLockingTime", async() => {

        const [_, withdrawAddress] = await ethers.getSigners();

        params = await initPayoutStrategy(_currentBlockTimestamp, {});

        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );

        // Mine Blocks
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1200])

        // transfer funds to payout strategy
        await mockERC20.transfer(merklePayoutStrategyImplementation.address, 10);

        // check balance on payout strategy
        expect(await mockERC20.balanceOf(merklePayoutStrategyImplementation.address)).to.equal(10);

        // withdraw funds
        await merklePayoutStrategyImplementation.withdrawFunds(withdrawAddress.address);

        // check balance on payout strategy & withdraw address
        expect(await mockERC20.balanceOf(merklePayoutStrategyImplementation.address)).to.equal(0);
        expect(await mockERC20.balanceOf(withdrawAddress.address)).to.equal(10);
      });

      it("SHOULD emit event WHEN invoked after endLockingTime", async() => {
        params = await initPayoutStrategy(_currentBlockTimestamp);
        const merklePayoutStrategyImplementation = <MerklePayoutStrategyImplementation>(
          await ethers.getContractAt(
            "MerklePayoutStrategyImplementation",
            await roundImplementation.payoutStrategy()
          )
        );

        // Mine Blocks
        await ethers.provider.send("evm_mine", [_currentBlockTimestamp + 1200])

        // transfer funds to payout strategy
        await mockERC20.transfer(merklePayoutStrategyImplementation.address, 10);

        // check balance on payout strategy
        expect(await mockERC20.balanceOf(merklePayoutStrategyImplementation.address)).to.equal(10);

        // withdraw funds
        const withdrawAddress = Wallet.createRandom().address;
        const tx = merklePayoutStrategyImplementation.withdrawFunds(withdrawAddress);

        await expect(tx).to.emit(
          merklePayoutStrategyImplementation, 'FundsWithdrawn'
        ).withArgs(
          mockERC20.address,
          10,
          withdrawAddress
        );
      });

    });
  });
})