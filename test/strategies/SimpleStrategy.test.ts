import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { loadFixture } from "ethereum-waffle";
import { upgrades } from "hardhat";
import { Vote, convertToBytes32, encodeVotes } from "../../utils/encode";

describe("SimpleStrategy", function () {
  async function strategyFixture() {
    const [owner, user] = waffle.provider.getWallets();
    const Strategy = await ethers.getContractFactory("SimpleStrategy");
    const strategyImplementation = await Strategy.deploy();
    await strategyImplementation.deployed();

    // deploy proxy
    const StrategyProxy = await ethers.getContractFactory("SimpleStrategy");
    const strategyProxy = await upgrades.deployProxy(StrategyProxy, ["0x"], {
      initializer: "initialize",
    });

    await strategyProxy.deployed();

    // deploy mockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await MockERC20.deploy((1e18).toString());
    await mockERC20.deployed();

    return {
      owner,
      user,
      strategy: strategyImplementation,
      strategyProxy,
      mockERC20,
    };
  }

  describe("Implementation", function () {
    it("should not be initializable", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      await expect(strategy.initialize("0x")).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });

    it("should have a version", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      expect(await strategy.version()).to.equal("0.2.0");
    });
  });

  describe("Proxy", function () {
    it("should have a version", async function () {
      const { strategyProxy } = await loadFixture(strategyFixture);
      expect(await strategyProxy.version()).to.equal("0.2.0");
    });

    it("should have a round address", async function () {
      const { owner, strategyProxy } = await loadFixture(strategyFixture);
      expect(await strategyProxy.roundAddress()).to.equal(owner.address);
    });

    it("should not be initializable again", async function () {
      const { strategyProxy } = await loadFixture(strategyFixture);
      await expect(strategyProxy.initialize("0x")).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
  });

  describe("Vote", function () {
    it("should be able to vote with ERC20 token", async function () {
      const { owner, user, strategyProxy, mockERC20 } = await loadFixture(
        strategyFixture
      );
      await mockERC20.approve(strategyProxy.address, 3);

      const votes: Vote[] = [
        {
          token: mockERC20.address,
          amount: "1",
          grantAddress: user.address,
          projectId: convertToBytes32("0x11"),
          applicationIndex: 1,
        },

        {
          token: mockERC20.address,
          amount: "2",
          grantAddress: user.address,
          projectId: convertToBytes32("0x22"),
          applicationIndex: 2,
        },
      ];

      const encoded = encodeVotes(votes);
      const txn = await strategyProxy.vote(encoded, owner.address);
      txn.wait();

      expect(txn).to.emit(strategyProxy, "Voted").withArgs(
        votes[0].token,
        votes[0].amount,
        owner.address,
        votes[0].grantAddress,
        votes[0].projectId,
        votes[0].applicationIndex,
        owner.address // note: this would be the round contract
      );

      expect(txn).to.emit(strategyProxy, "Voted").withArgs(
        votes[1].token,
        votes[1].amount,
        owner.address,
        votes[1].grantAddress,
        votes[1].projectId,
        votes[1].applicationIndex,
        owner.address // note: this would be the round contract
      );

      expect(await mockERC20.balanceOf(user.address)).to.equal(3);
    });

    it("should be able to vote with ETH", async function () {
      const { owner, user, strategyProxy } = await loadFixture(strategyFixture);

      const votes: Vote[] = [
        {
          token: ethers.constants.AddressZero,
          amount: "1",
          grantAddress: user.address,
          projectId: convertToBytes32("0x11"),
          applicationIndex: 1,
        },
        {
          token: ethers.constants.AddressZero,
          amount: "2",
          grantAddress: user.address,
          projectId: convertToBytes32("0x22"),
          applicationIndex: 2,
        },
      ];

      const encoded = encodeVotes(votes);
      const txn = await strategyProxy.vote(encoded, owner.address, {
        value: 3,
      });
      txn.wait();

      expect(txn).to.emit(strategyProxy, "Voted").withArgs(
        votes[0].token,
        votes[0].amount,
        owner.address,
        votes[0].grantAddress,
        votes[0].projectId,
        votes[0].applicationIndex,
        owner.address // note: this would be the round contract
      );

      expect(txn).to.emit(strategyProxy, "Voted").withArgs(
        votes[1].token,
        votes[1].amount,
        owner.address,
        votes[1].grantAddress,
        votes[1].projectId,
        votes[1].applicationIndex,
        owner.address // note: this would be the round contract
      );
    });

    it("should be able to vote with ETH and ERC20", async function () {
      const { owner, user, strategyProxy, mockERC20 } = await loadFixture(
        strategyFixture
      );
      await mockERC20.approve(strategyProxy.address, 1);

      const votes: Vote[] = [
        {
          token: mockERC20.address,
          amount: "1",
          grantAddress: user.address,
          projectId: convertToBytes32("0x11"),
          applicationIndex: 1,
        },
        {
          token: ethers.constants.AddressZero,
          amount: "2",
          grantAddress: user.address,
          projectId: convertToBytes32("0x22"),
          applicationIndex: 2,
        },
      ];

      const encoded = encodeVotes(votes);
      const txn = await strategyProxy.vote(encoded, owner.address, {
        value: 2,
      });
      txn.wait();

      expect(txn).to.emit(strategyProxy, "Voted").withArgs(
        votes[0].token,
        votes[0].amount,
        owner.address,
        votes[0].grantAddress,
        votes[0].projectId,
        votes[0].applicationIndex,
        owner.address // note: this would be the round contract
      );

      expect(txn).to.emit(strategyProxy, "Voted").withArgs(
        votes[1].token,
        votes[1].amount,
        owner.address,
        votes[1].grantAddress,
        votes[1].projectId,
        votes[1].applicationIndex,
        owner.address // note: this would be the round contract
      );
    });

    it("should fail if amounts are not equal", async function () {
      const { owner, user, strategyProxy, mockERC20 } = await loadFixture(
        strategyFixture
      );
      await mockERC20.approve(strategyProxy.address, 1);

      const votes: Vote[] = [
        {
          token: mockERC20.address,
          amount: "1",
          grantAddress: user.address,
          projectId: convertToBytes32("0x11"),
          applicationIndex: 1,
        },
        {
          token: ethers.constants.AddressZero,
          amount: "2",
          grantAddress: user.address,
          projectId: convertToBytes32("0x22"),
          applicationIndex: 2,
        },
      ];

      const encoded = encodeVotes(votes);
      await expect(
        strategyProxy.vote(encoded, owner.address, {
          value: 3,
        })
      ).to.be.revertedWith("msg.value does not match vote amount");
    });
  });
});
