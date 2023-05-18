import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployContract } from "ethereum-waffle";
import { Event, Wallet, BigNumber } from 'ethers';
import { BytesLike, formatBytes32String, isAddress } from "ethers/lib/utils";
import { artifacts, ethers } from "hardhat";
import { Artifact } from "hardhat/types";
import {
  MockERC20,
  QuadraticFundingVotingStrategyImplementation
} from "../../typechain";

describe("QuadraticFundingVotingStrategyImplementation", () => {
  let user: SignerWithAddress;
  let quadraticFundingVotingStrategy: QuadraticFundingVotingStrategyImplementation;
  let quadraticFundingVotingStrategyArtifact: Artifact;

  let mockERC20: MockERC20;
  let mockERC20Artifact: Artifact;

  const tokensToBeMinted = 1000;

  const VERSION = "0.2.0";

  describe("constructor", () => {
    it("deploys properly", async () => {
      [user] = await ethers.getSigners();

      quadraticFundingVotingStrategyArtifact = await artifacts.readArtifact(
        "QuadraticFundingVotingStrategyImplementation"
      );
      quadraticFundingVotingStrategy = <
        QuadraticFundingVotingStrategyImplementation
      >await deployContract(user, quadraticFundingVotingStrategyArtifact, []);

      mockERC20Artifact = await artifacts.readArtifact("MockERC20");
      mockERC20 = <MockERC20>(
        await deployContract(user, mockERC20Artifact, [tokensToBeMinted])
      );

      // Verify deploy
      expect(
        isAddress(quadraticFundingVotingStrategy.address),
        "Failed to deploy QuadraticFundingVotingStrategyImplementation"
      ).to.be.true;
      expect(isAddress(mockERC20.address), "Failed to deploy MockERC20").to.be
        .true;

      // Verify default value
      expect(await quadraticFundingVotingStrategy.roundAddress()).to.equal(
        AddressZero
      );
    });
  });

  describe("core functions", () => {
    const randomAddress = Wallet.createRandom().address;

    let grant1 = Wallet.createRandom();
    const grant1TokenTransferAmount = 150;
    const grant1NativeTokenTransferAmount = ethers.utils.parseUnits(
      "0.1",
      "ether"
    );

    let grant2 = Wallet.createRandom();
    const grant2TokenTransferAmount = 50;
    const grant2NativeTokenTransferAmount = ethers.utils.parseUnits(
      "0.05",
      "ether"
    );
    let encodedVotes: BytesLike[] = [];

    const nativeTokenAddress = AddressZero;

    const totalTokenTransfer =
      grant1TokenTransferAmount + grant2TokenTransferAmount;

    describe("test: init", () => {
      beforeEach(async () => {
        [user] = await ethers.getSigners();

        // Deploy MockERC20 contract
        mockERC20Artifact = await artifacts.readArtifact("MockERC20");
        mockERC20 = <MockERC20>(
          await deployContract(user, mockERC20Artifact, [tokensToBeMinted])
        );

        // Deploy QuadraticFundingVotingStrategy contract
        quadraticFundingVotingStrategyArtifact = await artifacts.readArtifact(
          "QuadraticFundingVotingStrategyImplementation"
        );
        quadraticFundingVotingStrategy = <
          QuadraticFundingVotingStrategyImplementation
        >await deployContract(user, quadraticFundingVotingStrategyArtifact, []);

        // Invoke init
        await quadraticFundingVotingStrategy.init();
      });

      it("invoking init once SHOULD set the contract version", async () => {
        expect(await quadraticFundingVotingStrategy.VERSION()).to.equal(
          VERSION
        );
      });

      it("invoking init once SHOULD set the round address", async () => {
        expect(await quadraticFundingVotingStrategy.roundAddress()).to.equal(
          user.address
        );
      });

      it("invoking init more than once SHOULD revert the transaction ", () => {
        expect(quadraticFundingVotingStrategy.init()).to.revertedWith(
          "init: roundAddress already set"
        );
      });
    });

    describe("test: vote", () => {
      beforeEach(async () => {
        [user] = await ethers.getSigners();

        // Deploy MockERC20 contract
        mockERC20Artifact = await artifacts.readArtifact("MockERC20");
        mockERC20 = <MockERC20>(
          await deployContract(user, mockERC20Artifact, [tokensToBeMinted])
        );

        // Deploy QuadraticFundingVotingStrategyImplementation contract
        quadraticFundingVotingStrategyArtifact = await artifacts.readArtifact(
          "QuadraticFundingVotingStrategyImplementation"
        );
        quadraticFundingVotingStrategy = <
          QuadraticFundingVotingStrategyImplementation
        >await deployContract(user, quadraticFundingVotingStrategyArtifact, []);

        encodedVotes = [];

        // Prepare Votes - only ERC20
        const votes = [
          [
            mockERC20.address,
            grant1TokenTransferAmount,
            grant1.address,
            formatBytes32String("grant1"),
            0,
          ],
          [
            mockERC20.address,
            grant2TokenTransferAmount,
            grant2.address,
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
      });

      it("invoking vote when roundAddress is not set SHOULD revert transaction", async () => {
        const txn = quadraticFundingVotingStrategy.vote(
          encodedVotes,
          user.address
        );
        await expect(txn).to.revertedWith(
          "error: voting contract not linked to a round"
        );
      });

      it("invoking vote when sender is not roundAddress SHOULD revert transaction", async () => {
        const [_, anotherUser] = await ethers.getSigners();

        // Invoke init
        await quadraticFundingVotingStrategy.connect(anotherUser).init();

        const txn = quadraticFundingVotingStrategy.vote(
          encodedVotes,
          randomAddress
        );
        await expect(txn).to.revertedWith(
          "error: can be invoked only by round contract"
        );
      });

      it("invoking vote without allowance SHOULD revert transaction ", async () => {
        // Invoke init
        await quadraticFundingVotingStrategy.init();

        const approveTx = await mockERC20.approve(
          quadraticFundingVotingStrategy.address,
          0
        );
        approveTx.wait();

        const txn = quadraticFundingVotingStrategy.vote(
          encodedVotes,
          user.address
        );
        await expect(txn).to.revertedWith("ERC20: insufficient allowance");
      });

      it("invoking vote not enough allowance SHOULD revert transaction ", async () => {
        // Invoke init
        await quadraticFundingVotingStrategy.init();

        const approveTx = await mockERC20.approve(
          quadraticFundingVotingStrategy.address,
          100
        );
        approveTx.wait();

        const txn = quadraticFundingVotingStrategy.vote(
          encodedVotes,
          user.address
        );
        await expect(txn).to.revertedWith("ERC20: insufficient allowance");
      });

      describe("test: vote with ERC20", () => {
        it("SHOULD transfer balance from user to grant", async () => {
          // Invoke init
          await quadraticFundingVotingStrategy.init();

          const beforeVotingUserBalance = await mockERC20.balanceOf(
            user.address
          );
          const beforeVotingGrant1Balance = await mockERC20.balanceOf(
            grant1.address
          );
          const beforeVotingGrant2Balance = await mockERC20.balanceOf(
            grant2.address
          );

          expect(beforeVotingGrant1Balance).to.equal("0");
          expect(beforeVotingGrant2Balance).to.equal("0");

          const approveTx = await mockERC20.approve(
            quadraticFundingVotingStrategy.address,
            totalTokenTransfer
          );
          approveTx.wait();

          const txn = await quadraticFundingVotingStrategy.vote(
            encodedVotes,
            user.address
          );
          txn.wait();

          const afterVotingUserBalance = await mockERC20.balanceOf(
            user.address
          );
          const afterVotingGrant1Balance = await mockERC20.balanceOf(
            grant1.address
          );
          const afterVotingGrant2Balance = await mockERC20.balanceOf(
            grant2.address
          );

          expect(afterVotingUserBalance).to.equal(
            Number(beforeVotingUserBalance) - totalTokenTransfer
          );
          expect(afterVotingGrant1Balance).to.equal(grant1TokenTransferAmount);
          expect(afterVotingGrant2Balance).to.equal(grant2TokenTransferAmount);
        });

        it("SHOULD emit VotesCast event with 2 votes", async () => {
          // Invoke init
          await quadraticFundingVotingStrategy.init();

          let votesCastEvents: Event[] = [];

          const approveTx = await mockERC20.approve(
            quadraticFundingVotingStrategy.address,
            totalTokenTransfer
          );
          approveTx.wait();

          const txn = await quadraticFundingVotingStrategy.vote(
            encodedVotes,
            user.address
          );
          txn.wait();

          // check votes cast event is fired
          expect(txn).to.emit(quadraticFundingVotingStrategy, "VotesCast").withArgs(
            encodedVotes,
            user.address // note: this would be the round contract
          );

          const receipt = await txn.wait();
          if (receipt.events) {
            votesCastEvents = receipt.events.filter((e) => e.event === "VotesCast");
          }

          expect(votesCastEvents.length).to.equal(1);
        });
      });

      describe("test: vote with native tokens", () => {
        let encodedVotesInNativeToken: BytesLike[] = [];

        // Prepare Votes - only ERC20
        const votesInNativeToken = [
          [
            nativeTokenAddress,
            grant1NativeTokenTransferAmount,
            grant1.address,
            formatBytes32String("grant1"),
            BigNumber.from("99")
          ],
          [
            nativeTokenAddress,
            grant2NativeTokenTransferAmount,
            grant2.address,
            formatBytes32String("grant2"),
            BigNumber.from("99")
          ],
        ];

        beforeEach(async () => {
          // Deploy QuadraticFundingVotingStrategyImplementation contract
          quadraticFundingVotingStrategyArtifact = await artifacts.readArtifact(
            "QuadraticFundingVotingStrategyImplementation"
          );
          quadraticFundingVotingStrategy = <
            QuadraticFundingVotingStrategyImplementation
          >await deployContract(
            user,
            quadraticFundingVotingStrategyArtifact,
            []
          );

          // Encode Votes
          encodedVotesInNativeToken = [];

          for (let i = 0; i < votesInNativeToken.length; i++) {
            encodedVotesInNativeToken.push(
              ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256", "address", "bytes32", "uint256"],
                votesInNativeToken[i]
              )
            );
          }
        });

        it("SHOULD revert if there are insufficent funds", async () => {
          // Invoke init
          await quadraticFundingVotingStrategy.init();

          const txn = quadraticFundingVotingStrategy.vote(
            encodedVotesInNativeToken,
            user.address,
            { value: "100000000000000000" }
          );

          await expect(txn).to.revertedWith(  
            "Address: insufficient balance"
          );
        });

        it("SHOULD transfer balance from user to grant", async () => {
          // Invoke init
          await quadraticFundingVotingStrategy.init();

          const beforeVotingGrant1Balance = await ethers.provider.getBalance(
            grant1.address
          );
          const beforeVotingGrant2Balance = await ethers.provider.getBalance(
            grant2.address
          );

          expect(beforeVotingGrant1Balance).to.equal("0");
          expect(beforeVotingGrant2Balance).to.equal("0");

          await quadraticFundingVotingStrategy.vote(
            encodedVotesInNativeToken,
            user.address,
            { value: "150000000000000000" }
          );

          const afterVotingGrant1Balance = await ethers.provider.getBalance(
            grant1.address
          );
          const afterVotingGrant2Balance = await ethers.provider.getBalance(
            grant2.address
          );

          expect(afterVotingGrant1Balance).to.equal(
            grant1NativeTokenTransferAmount
          );
          expect(afterVotingGrant2Balance).to.equal(
            grant2NativeTokenTransferAmount
          );
        });

        it("SHOULD emit VotesCast event", async () => {
          let votesCastedEvents: Event[] = [];

          // Invoke init
          await quadraticFundingVotingStrategy.init();

          const txn = await quadraticFundingVotingStrategy.vote(
            encodedVotesInNativeToken,
            user.address,
            { value: "150000000000000000" }
          );

          // check if vote for first grant fired
          expect(txn).to.emit(quadraticFundingVotingStrategy, "VotesCast").withArgs(
            encodedVotesInNativeToken,
            user.address // note: this would be the round contract
          );

          const receipt = await txn.wait();
          if (receipt.events) {
            votesCastedEvents = receipt.events.filter((e) => e.event === "VotesCast");
          }

          expect(votesCastedEvents.length).to.equal(1);
        });

        it("SHOULD revert if receiver cannot receive native tokens", async () => {
          const receiverFactory = await ethers.getContractFactory(
            "MockRevertingReceiver"
          );
          const receiver = await receiverFactory.deploy();
          await receiver.deployed();

          const nativeTokenVotes = [
            [
              nativeTokenAddress,
              grant1NativeTokenTransferAmount,
              grant1.address,
              formatBytes32String("grant1"),
              BigNumber.from("99"),
            ],
            [
              nativeTokenAddress,
              grant2NativeTokenTransferAmount,
              receiver.address,
              formatBytes32String("revert-me"),
              BigNumber.from("100"),
            ],
            [
              nativeTokenAddress,
              grant2NativeTokenTransferAmount,
              grant2.address,
              formatBytes32String("grant2"),
              BigNumber.from("101"),
            ],
          ];

          // Encode Votes
          encodedVotesInNativeToken = [];

          for (let i = 0; i < nativeTokenVotes.length; i++) {
            encodedVotesInNativeToken.push(
              ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256", "address", "bytes32", "uint256"],
                nativeTokenVotes[i]
              )
            );
          }

          // Invoke init
          await quadraticFundingVotingStrategy.init();

          await expect(
            quadraticFundingVotingStrategy.vote(
              encodedVotesInNativeToken,
              user.address,
              { value: "200000000000000000" }
            )
          ).to.revertedWith(
            "Address: unable to send value, recipient may have reverted"
          );
        });

        it("SHOULD revert if user sends too many eth", async () => {
          // Invoke init
          await quadraticFundingVotingStrategy.init();

          await expect(
            quadraticFundingVotingStrategy.vote(
              encodedVotesInNativeToken,
              user.address,
              { value: "99900000000000000000" }
            )
          ).to.revertedWith("Invalid match amount");
        });

      });

      describe("test: vote with native and ERC20 tokens", () => {
        let encodedVotes: BytesLike[] = [];

        beforeEach(async () => {
          grant1 = Wallet.createRandom();
          grant2 = Wallet.createRandom();

          // Deploy QuadraticFundingVotingStrategyImplementation contract
          quadraticFundingVotingStrategyArtifact = await artifacts.readArtifact(
            "QuadraticFundingVotingStrategyImplementation"
          );
          quadraticFundingVotingStrategy = <
            QuadraticFundingVotingStrategyImplementation
          >await deployContract(
            user,
            quadraticFundingVotingStrategyArtifact,
            []
          );

          mockERC20Artifact = await artifacts.readArtifact("MockERC20");
          mockERC20 = <MockERC20>(
            await deployContract(user, mockERC20Artifact, [tokensToBeMinted])
          );

          // Prepare Votes - Native Token + ERC20
          const votes = [
            [
              nativeTokenAddress,
              grant1NativeTokenTransferAmount,
              grant1.address,
              formatBytes32String("grant1"),
              BigNumber.from("99")
            ],
            [
              mockERC20.address,
              grant2TokenTransferAmount,
              grant2.address,
              formatBytes32String("grant2"),
              BigNumber.from("99")
            ],
          ];

          // Encode Votes
          encodedVotes = [];

          for (let i = 0; i < votes.length; i++) {
            encodedVotes.push(
              ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256", "address", "bytes32", "uint256"],
                votes[i]
              )
            );
          }
        });

        it("SHOULD transfer balance from user to grant", async () => {
          // Invoke init
          await quadraticFundingVotingStrategy.init();

          const approveTx = await mockERC20.approve(
            quadraticFundingVotingStrategy.address,
            grant2TokenTransferAmount
          );
          approveTx.wait();

          const beforeVotingGrant1Balance = await ethers.provider.getBalance(
            grant1.address
          );
          const beforeVotingGrant2Balance = await mockERC20.balanceOf(
            grant2.address
          );

          expect(beforeVotingGrant1Balance).to.equal("0");
          expect(beforeVotingGrant2Balance).to.equal("0");

          await quadraticFundingVotingStrategy.vote(
            encodedVotes,
            user.address,
            { value: "100000000000000000" }
          );

          const afterVotingGrant1Balance = await ethers.provider.getBalance(
            grant1.address
          );
          const afterVotingGrant2Balance = await mockERC20.balanceOf(
            grant2.address
          );

          expect(afterVotingGrant1Balance).to.equal(
            grant1NativeTokenTransferAmount
          );
          expect(afterVotingGrant2Balance).to.equal(grant2TokenTransferAmount);
        });

        it("SHOULD emit 2 Vote events", async () => {
          let votesCastedEvents: Event[] = [];

          // Invoke init
          await quadraticFundingVotingStrategy.init();

          const approveTx = await mockERC20.approve(
            quadraticFundingVotingStrategy.address,
            totalTokenTransfer
          );
          approveTx.wait();

          const txn = await quadraticFundingVotingStrategy.vote(
            encodedVotes,
            user.address,
            { value: "100000000000000000" }
          );

          // check if vote for first grant fired
          expect(txn).to.emit(quadraticFundingVotingStrategy, "VotesCast").withArgs(
            encodedVotes,
            user.address // note: this would be the round contract
          );

          const receipt = await txn.wait();
          if (receipt.events) {
            votesCastedEvents = receipt.events.filter((e) => e.event === "VotesCast");
          }

          expect(votesCastedEvents.length).to.equal(1);
        });
      });
    });
  });
});
