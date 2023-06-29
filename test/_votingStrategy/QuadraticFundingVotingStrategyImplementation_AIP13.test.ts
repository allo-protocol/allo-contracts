import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployContract } from "ethereum-waffle";
import { Event, Wallet, BigNumber } from "ethers";
import { BytesLike, formatBytes32String, isAddress } from "ethers/lib/utils";
import { encodeRoundParameters } from "../../scripts/utils";
import { artifacts, ethers } from "hardhat";
import { Artifact, Contracts } from "hardhat/types";
import {
  MockERC20,
  QuadraticFundingVotingStrategyImplementation,
  RoundFactory,
  MerklePayoutStrategyFactory,
  QuadraticFundingVotingStrategyFactory,
  RoundImplementation,
  AlloSettings,
  MockProxyVote,
} from "../../typechain";

describe("QuadraticFundingVotingStrategyImplementation Vote event", () => {
  let user: SignerWithAddress;
  let roundStartTime: number;
  let votingContractFactory: Contracts.QuadraticFundingVotingStrategyFactory__factory;
  let roundImplementation: RoundImplementation;

  before(async () => {
    [user] = await ethers.getSigners();

    // Deploy AlloSettings contract
    const alloSettingsContractFactory = await ethers.getContractFactory(
      "AlloSettings"
    );

    const alloSettingsContract = <AlloSettings>(
      await upgrades.deployProxy(alloSettingsContractFactory)
    );

    // Deploy VotingStrategyFactory contract
    const votingStrategyFactoryArtifact = await artifacts.readArtifact(
      "QuadraticFundingVotingStrategyFactory"
    );

    const votingStrategyFactoryContract = <
      QuadraticFundingVotingStrategyFactory
    >await deployContract(user, votingStrategyFactoryArtifact, []);
    await votingStrategyFactoryContract.initialize();

    votingContractFactory = await ethers.getContractFactory(
      "QuadraticFundingVotingStrategyImplementation"
    );

    const votingStrategyArtifact = await artifacts.readArtifact(
      "QuadraticFundingVotingStrategyImplementation"
    );
    const votingInstance = <QuadraticFundingVotingStrategyImplementation>(
      await deployContract(user, votingStrategyArtifact, [])
    );

    votingStrategyFactoryContract.updateVotingContract(votingInstance.address);

    // Deploy PayoutStrategy factory contract
    const payoutStrategyFactoryArtifact = await artifacts.readArtifact(
      "MerklePayoutStrategyFactory"
    );
    const payoutStrategyFactoryContract = <MerklePayoutStrategyFactory>(
      await deployContract(user, payoutStrategyFactoryArtifact, [])
    );

    // Deploy Round
    const roundImplementationArtifact = await artifacts.readArtifact(
      "RoundImplementation"
    );

    roundImplementation = <RoundImplementation>(
      await deployContract(user, roundImplementationArtifact, [])
    );

    const initAddress = [
      votingStrategyFactoryContract.address, // votingStrategyFactory
      payoutStrategyFactoryContract.address, // payoutStrategyFactory
    ];

    const now = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;

    roundStartTime = now + 500;

    const initRoundTime = [
      now + 100, // applicationsStartTime
      now + 250, // applicationsEndTime
      roundStartTime, // roundStartTime
      roundStartTime + 1000, // roundEndTime
    ];

    const roundMetaPtr = {
      protocol: 1,
      pointer: "test-cid",
    };

    const applicationMetaPtr = {
      protocol: 1,
      pointer: "test-cid",
    };

    const initMetaPtr = [roundMetaPtr, applicationMetaPtr];
    const initRoles = [[user.address], [user.address]];

    const tx = await roundImplementation.initialize(
      encodeRoundParameters([
        initAddress,
        initRoundTime,
        "0x0",
        AddressZero,
        "0x0",
        AddressZero,
        initMetaPtr,
        initRoles,
      ]),
      alloSettingsContract.address
    );

    await tx.wait();
  });

  it("emit different addresses for voter and origin", async () => {
    // deploy our voting proxy
    const MockProxyVoteArtifact = await artifacts.readArtifact("MockProxyVote");
    const voteProxy = <MockProxyVote>(
      await deployContract(user, MockProxyVoteArtifact, [
        roundImplementation.address,
      ])
    );

    // setup the encoded vote
    const voteAmount = ethers.utils.parseUnits("11", "ether");
    const grantAddress = "0x0000000000000000000000000000000000000777";
    const votes = [
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "address", "bytes32", "uint256"],
        [
          AddressZero,
          voteAmount,
          grantAddress,
          formatBytes32String("grant1"),
          0,
        ]
      ),
    ];

    // wait for the round start time
    await ethers.provider.send("evm_mine", [roundStartTime]);

    // vote using the voting proxy
    const voteTx = await voteProxy.proxyVote(votes, {
      value: voteAmount,
    });
    const voteRec = await voteTx.wait();

    // the events are not emitted by the voteProxy, so they are not parse automatically
    const parsedEvents = (voteRec.events || []).map((e) =>
      votingContractFactory.interface.parseLog(e)
    );

    expect(parsedEvents.length).to.equal(1);

    const vote = parsedEvents[0];
    // the voter should be the proxy contract address
    expect(vote.args.voter).to.equal(voteProxy.address);

    // the origin should be the EOA address
    expect(vote.args.origin).to.equal(user.address);
  });
});
