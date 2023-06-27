import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet } from 'ethers';
import { deployContract } from "ethereum-waffle";
import { isAddress } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";
import { artifacts, ethers, upgrades } from "hardhat";
import { Artifact } from "hardhat/types";
import { DirectPayoutStrategyFactory, DirectPayoutStrategyFactory__factory, DirectPayoutStrategyImplementation } from "../../typechain";

describe("DirectPayoutStrategyFactory", function () {

  let user: SignerWithAddress;

  // DirectPayoutStrategy Factory
  let DirectPayoutStrategyFactory: DirectPayoutStrategyFactory;
  let DirectPayoutStrategyContractFactory: DirectPayoutStrategyFactory__factory;

  // DirectPayoutStrategy Implementation
  let DirectPayoutStrategyImplementation: DirectPayoutStrategyImplementation;
  let directStrategyProxy: DirectPayoutStrategyImplementation;
  let DirectPayoutStrategyImplementationArtifact: Artifact;


  describe('constructor', () => {

    it('DirectPayoutStrategyFactory SHOULD deploy properly', async () => {

      [user] = await ethers.getSigners();

      DirectPayoutStrategyContractFactory = await ethers.getContractFactory('DirectPayoutStrategyFactory');
      DirectPayoutStrategyFactory = <DirectPayoutStrategyFactory>await upgrades.deployProxy(DirectPayoutStrategyContractFactory);

      // Verify deploy
      expect(isAddress(DirectPayoutStrategyFactory.address), 'Failed to deploy DirectPayoutStrategyFactory').to.be.true;
    });
  })


  describe('core functions', () => {

    describe('test: updatePayoutImplementation', async () => {
      beforeEach(async () => {
        [user] = await ethers.getSigners();

        // Deploy DirectPayoutStrategyFactory contract
        DirectPayoutStrategyContractFactory = await ethers.getContractFactory('DirectPayoutStrategyFactory');
        DirectPayoutStrategyFactory = <DirectPayoutStrategyFactory>await upgrades.deployProxy(DirectPayoutStrategyContractFactory);

        // Deploy DirectPayoutStrategyImplementation contract
        DirectPayoutStrategyImplementationArtifact = await artifacts.readArtifact('DirectPayoutStrategyImplementation');
        DirectPayoutStrategyImplementation = <DirectPayoutStrategyImplementation>await deployContract(user, DirectPayoutStrategyImplementationArtifact, []);
      });

      it("SHOULD have default address after deploy ", async () => {
        expect(await DirectPayoutStrategyFactory.payoutImplementation())
          .to.be.equal(AddressZero);
      });

      it("SHOULD emit PayoutImplementationUpdated event after invoking updatePayoutImplementation", async () => {
        await expect(DirectPayoutStrategyFactory.updatePayoutImplementation(DirectPayoutStrategyImplementation.address))
          .to.emit(DirectPayoutStrategyFactory, 'PayoutImplementationUpdated')
          .withArgs(DirectPayoutStrategyImplementation.address);
      });

      it("SHOULD have payout contract address after invoking updatePayoutImplementation", async () => {
        await DirectPayoutStrategyFactory.updatePayoutImplementation(DirectPayoutStrategyImplementation.address).then(async () => {
          const payoutImplementation = await DirectPayoutStrategyFactory.payoutImplementation();
          expect(payoutImplementation).to.be.equal(DirectPayoutStrategyImplementation.address);
        });

      });
    });

    describe('test: create', async () => {

      before(async () => {
        [user] = await ethers.getSigners();

        // Deploy DirectPayoutStrategyFactory contract
        DirectPayoutStrategyContractFactory = await ethers.getContractFactory('DirectPayoutStrategyFactory');
        DirectPayoutStrategyFactory = <DirectPayoutStrategyFactory>await upgrades.deployProxy(DirectPayoutStrategyContractFactory);

        // Deploy DirectPayoutStrategyImplementation contract
        DirectPayoutStrategyImplementationArtifact = await artifacts.readArtifact('DirectPayoutStrategyImplementation');
        DirectPayoutStrategyImplementation = <DirectPayoutStrategyImplementation>await deployContract(user, DirectPayoutStrategyImplementationArtifact, []);

        await (await DirectPayoutStrategyFactory.updatePayoutImplementation(DirectPayoutStrategyImplementation.address)).wait()
      })

      it("invoking create SHOULD initialize strategy", async () => {
        let alloSettings = Wallet.createRandom().address;
        let vaultAddress = Wallet.createRandom().address;
        let roundFeeAddress = Wallet.createRandom().address;
        let roundFeePercentage = 123;

        const txn = await DirectPayoutStrategyFactory.create(alloSettings, vaultAddress, roundFeePercentage, roundFeeAddress);

        const receipt = await txn.wait();

        if (receipt.events) {
          const event = receipt.events.find(e => e.event === 'PayoutContractCreated');
          if (event && event.args) {
            directStrategyProxy = await ethers.getContractAt("DirectPayoutStrategyImplementation", event.args.payoutContractAddress) as DirectPayoutStrategyImplementation;
          }
        }

        expect(await directStrategyProxy.alloSettings()).to.eq(alloSettings)
        expect(await directStrategyProxy.vaultAddress()).to.eq(vaultAddress)
        expect(await directStrategyProxy.roundFeeAddress()).to.eq(roundFeeAddress)
        expect(await directStrategyProxy.roundFeePercentage()).to.eq(roundFeePercentage)
      });


      it("SHOULD emit PayoutContractCreated event after invoking create", async () => {
        let alloSettings = Wallet.createRandom().address;
        let vaultAddress = Wallet.createRandom().address;
        let roundFeeAddress = Wallet.createRandom().address;
        let roundFeePercentage = 123;

        const txn = await DirectPayoutStrategyFactory.create(alloSettings, vaultAddress, roundFeePercentage, roundFeeAddress);


        const receipt = await txn.wait();

        let payoutContractAddress;
        let payoutImplementation;

        if (receipt.events) {
          const event = receipt.events.find(e => e.event === 'PayoutContractCreated');
          if (event && event.args) {

            payoutContractAddress = event.args.payoutContractAddress;
            payoutImplementation = event.args.payoutImplementation;
          }
        }

        expect(txn)
          .to.emit(DirectPayoutStrategyFactory, 'PayoutContractCreated')
          .withArgs(payoutContractAddress, payoutImplementation);

        await expect(isAddress(payoutContractAddress)).to.be.true;
        await expect(isAddress(payoutImplementation)).to.be.true;
      });
    });

  });

});
