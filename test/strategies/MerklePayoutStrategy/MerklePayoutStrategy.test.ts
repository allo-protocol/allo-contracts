import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import { loadFixture, deployMockContract } from "ethereum-waffle";
import { upgrades } from "hardhat";
import {
  convertToBytes32,
  encodeDistributionParameters,
  encodeMerklePayoutStrategyInitParams,
} from "../../../utils/encode";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { formatBytes32String } from "ethers/lib/utils";

async function strategyFixture() {
  const [owner, user] = waffle.provider.getWallets();

  const roundArtifacts = await artifacts.readArtifact("RoundImplementation");

  const mockRound = await deployMockContract(owner, roundArtifacts.abi, {
    address: owner.address,
  });

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy((1e18).toString());
  await mockERC20.deployed();

  const strategyFactory = await ethers.getContractFactory(
    "MerklePayoutStrategy"
  );

  const encodedInitParams = encodeMerklePayoutStrategyInitParams(
    mockERC20.address,
    (1e17).toString()
  );

  const strategy = await upgrades.deployProxy(strategyFactory, {
    initializer: false,
  });

  await strategy.deployed();

  await strategy.initialize(encodedInitParams);

  return {
    owner,
    user,
    strategy,
    mockERC20,
    mockRound,
  };
}

describe("MerklePayoutStrategy", function () {
  describe("Deployment", async function () {
    it("should have a version", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      expect(await strategy.version()).to.equal("0.3.0");
    });

    it("should have a round address", async function () {
      const { owner, strategy, mockRound } = await loadFixture(strategyFixture);
      expect(await strategy.roundAddress()).to.equal(mockRound.address);
    });

    it("should not be initializable again", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      await expect(strategy.initialize("0x")).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });

    it("should have a token address", async function () {
      const { mockERC20, strategy } = await loadFixture(strategyFixture);
      expect(await strategy.tokenAddress()).to.equal(mockERC20.address);
    });

    it("should have a match amount", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      expect(await strategy.matchAmount()).to.equal((1e17).toString());
    });

    it("should have an empty merkle root", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      expect(await strategy.merkleRoot()).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });
  });

  describe("Implementation", function () {
    it("updateDistribution: should revert if called by no round operator", async function () {
      const { strategy, mockRound, user } = await loadFixture(strategyFixture);
      await mockRound.mock.roundEndTime.returns(ethers.BigNumber.from("0"));
      await mockRound.mock.isRoundOperator.returns(false);
      await expect(
        strategy
          .connect(user)
          .updateDistribution(
            encodeDistributionParameters(convertToBytes32("0x123"), 1, "test")
          )
      ).to.be.revertedWith("not round operator");
    });

    it("updateDistribution: should update merkleRoot", async function () {
      const { strategy, mockRound, owner, user } = await loadFixture(
        strategyFixture
      );
      await mockRound.mock.roundEndTime.returns(ethers.BigNumber.from("0"));
      await mockRound.mock.isRoundOperator.returns(true);

      const merkle = getMerkleProof([
        owner.address,
        user.address,
        user.address,
      ]);

      await strategy.updateDistribution(
        encodeDistributionParameters(merkle.tree.root, 1, "test")
      );
      expect(await strategy.merkleRoot()).to.be.equal(merkle.tree.root);
    });

    it("setReadyForPayout: should revert if round has not ended", async function () {
      const { strategy, mockRound } = await loadFixture(strategyFixture);
      await mockRound.mock.roundEndTime.returns(
        ethers.BigNumber.from("9999999999999999999")
      );
      await expect(strategy.setReadyForPayout()).to.be.revertedWith(
        "round has not ended"
      );
    });

    it("setReadyForPayout: should revert if called by no round operator", async function () {
      const { strategy, mockRound, user } = await loadFixture(strategyFixture);
      await mockRound.mock.roundEndTime.returns(ethers.BigNumber.from("0"));
      await mockRound.mock.isRoundOperator.returns(false);
      await expect(
        strategy.connect(user).setReadyForPayout()
      ).to.be.revertedWith("not round operator");
    });

    it("setReadyForPayout: should set isReadyForPayout", async function () {
      const { strategy, mockRound, mockERC20 } = await loadFixture(
        strategyFixture
      );
      await mockRound.mock.roundEndTime.returns(ethers.BigNumber.from("0"));
      await mockRound.mock.isRoundOperator.returns(true);
      await mockERC20.approve(strategy.address, (1e17).toString());
      await strategy.setReadyForPayout();
      expect(await strategy.isReadyForPayout()).to.be.true;
    });

    it("hasBeenDistributed: should return false if not distributed", async function () {
      const { strategy } = await loadFixture(strategyFixture);
      expect(await strategy.hasBeenDistributed(0)).to.be.false;
    });

    it("hasBeenDistributed: should return false if not distributed (test for cross-payout contamination)", async () => {
      const { owner, user, strategy, mockRound, mockERC20 } = await loadFixture(
        strategyFixture
      );

      const merkle = getMerkleProof([
        owner.address,
        user.address,
        user.address,
      ]);

      const validMerkleProof = merkle.tree.getProof(merkle.distributions[0]);

      // @ts-ignore
      await strategy["payout((uint256,address,uint256,bytes32[],bytes32)[])"]([
        {
          index: 0,
          grantee: merkle.distributions[0][1],
          amount: merkle.distributions[0][2],
          merkleProof: validMerkleProof,
          projectId: merkle.distributions[0][3],
        },
      ]);
      const hasDistributed = await strategy.hasBeenDistributed(1);
      expect(hasDistributed).to.be.false;
    });

    it("hasBeenDistributed: should return true if distributed", async function () {
      const { strategy } = await loadFixture(strategyFixture);

      const hasDistributed = await strategy.hasBeenDistributed(0);
      expect(hasDistributed).to.be.true;
    });

    it("payout: should revert if not called by round operator", async function () {
      const { strategy, user, owner, mockRound } = await loadFixture(
        strategyFixture
      );
      const merkle = getMerkleProof([
        owner.address,
        user.address,
        user.address,
      ]);

      const validMerkleProof = merkle.tree.getProof(merkle.distributions[0]);
      await mockRound.mock.isRoundOperator.returns(false);
      // @ts-ignore
      await expect(
        strategy
          .connect(user)
          ["payout((uint256,address,uint256,bytes32[],bytes32)[])"]([
            {
              index: 0,
              grantee: merkle.distributions[0][1],
              amount: merkle.distributions[0][2],
              merkleProof: validMerkleProof,
              projectId: merkle.distributions[0][3],
            },
          ])
      ).to.be.revertedWith("not round operator");
    });

    it("payout: should revert if user tries to claim twice", async function () {
      const { strategy, user, owner, mockRound } = await loadFixture(
        strategyFixture
      );
      await mockRound.mock.isRoundOperator.returns(true);

      const merkle = getMerkleProof([
        owner.address,
        user.address,
        user.address,
      ]);

      const validMerkleProof = merkle.tree.getProof(merkle.distributions[0]);

      // @ts-ignore
      await expect(
        strategy["payout((uint256,address,uint256,bytes32[],bytes32)[])"]([
          {
            index: 0,
            grantee: merkle.distributions[0][1],
            amount: merkle.distributions[0][2],
            merkleProof: validMerkleProof,
            projectId: merkle.distributions[0][3],
          },
        ])
      ).to.be.revertedWith("Payout: Already distributed");
    });

    it("payout: should revert when user tries to distribute more than the proof", async function () {
      const { strategy, user, owner, mockRound } = await loadFixture(
        strategyFixture
      );
      await mockRound.mock.isRoundOperator.returns(true);

      const merkle = getMerkleProof([
        owner.address,
        user.address,
        user.address,
      ]);

      const validMerkleProof = merkle.tree.getProof(merkle.distributions[0]);

      // @ts-ignore
      await expect(
        strategy["payout((uint256,address,uint256,bytes32[],bytes32)[])"]([
          {
            index: 1,
            grantee: merkle.distributions[1][1],
            amount: merkle.distributions[1][1] + 1,
            merkleProof: validMerkleProof,
            projectId: merkle.distributions[1][3],
          },
        ])
      ).to.be.revertedWith("Payout: Invalid proof");
    });

    it("payout: should revert when user tries to distribute funds to another address than the proof", async function () {
      const { strategy, user, owner, mockRound } = await loadFixture(
        strategyFixture
      );
      await mockRound.mock.isRoundOperator.returns(true);

      const merkle = getMerkleProof([
        owner.address,
        user.address,
        user.address,
      ]);

      const validMerkleProof = merkle.tree.getProof(merkle.distributions[1]);

      // @ts-ignore
      await expect(
        strategy["payout((uint256,address,uint256,bytes32[],bytes32)[])"]([
          {
            index: 1,
            grantee: merkle.distributions[1][1],
            amount: merkle.distributions[1][1],
            merkleProof: validMerkleProof,
            projectId: merkle.distributions[0][3],
          },
        ])
      ).to.be.revertedWith("Payout: Invalid proof");
    });
  });
});

const getMerkleProof = (address: string[]) => {
  const distributions: [number, string, number, string][] = address.map(
    (addr, index) => [
      index,
      addr,
      (index + 1) * 100,
      formatBytes32String(`project${index}`),
    ]
  );

  const tree = StandardMerkleTree.of(distributions, [
    "uint256",
    "address",
    "uint256",
    "bytes32",
  ]);

  return {
    tree,
    distributions,
  };
};
