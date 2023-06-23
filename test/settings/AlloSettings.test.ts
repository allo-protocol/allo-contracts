import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { isAddress } from "ethers/lib/utils";
import { ContractFactory, Wallet } from "ethers";
import { AddressZero } from "@ethersproject/constants";
import { ethers, upgrades } from "hardhat";
import { AlloSettings } from "../../typechain";

describe("AlloSettings", function () {

  let user: SignerWithAddress;
  let notOwnerWallet: SignerWithAddress;

  // Allo Settings
  let alloSettings: AlloSettings;
  let alloSettingsContract: ContractFactory ;

  let protocolTreasury = Wallet.createRandom();

  describe ('constructor', () => {

    it('AlloSettings SHOULD deploy properly', async () => {

      [user] = await ethers.getSigners();

      alloSettingsContract = await ethers.getContractFactory('AlloSettings');
      alloSettings = <AlloSettings>await upgrades.deployProxy(alloSettingsContract);

      // Verify deploy
      expect(isAddress(alloSettings.address), 'Failed to deploy AlloSettings').to.be.true;
    });
  })


  describe('core functions', () => {

    beforeEach(async () => {
      [user, notOwnerWallet] = await ethers.getSigners();

      // Deploy AlloSettings contract
      alloSettingsContract = await ethers.getContractFactory('AlloSettings');
      alloSettings = <AlloSettings>await upgrades.deployProxy(alloSettingsContract);

    });

    describe ('test: updateProtocolFeePercentage', async () => {

      it("SHOULD REVERT if not called by owner", async () => {
        const tx = alloSettings.connect(notOwnerWallet).updateProtocolFeePercentage(1);
        await expect(tx).to.revertedWith('Ownable: caller is not the owner');
      });

      it("SHOULD have protocolFeePercentage as 0 after deploy ", async () => {
        expect(await alloSettings.protocolFeePercentage()).to.be.equal(0);
      });

      it("SHOULD REVERT when protocolFeePercentage > 100 % ", async () => {
        const denominator = await alloSettings.DENOMINATOR();
        await expect(alloSettings.updateProtocolFeePercentage(denominator + 1)).to.revertedWith(
          'value exceeds 100%'
        );
      });

      it("SHOULD emit ProtocolFeePercentageUpdated event after invoking updateProtocolFeePercentage", async () => {
        await expect(alloSettings.updateProtocolFeePercentage(10))
          .to.emit(alloSettings, 'ProtocolFeePercentageUpdated')
          .withArgs(10);
      });

      it("SHOULD persist the new protocolFeePercentage after invoking updateProtocolTreasury", async () => {
        await alloSettings.updateProtocolFeePercentage(20).then(async () => {
          const protocolFeePercentage = await alloSettings.protocolFeePercentage();
          expect(protocolFeePercentage).to.be.equal(20);
        });

      });
    });

    describe ('test: updateProtocolTreasury', async () => {

      it("SHOULD REVERT if not called by owner", async () => {
        const tx = alloSettings.connect(notOwnerWallet).updateProtocolTreasury(protocolTreasury.address);
        await expect(tx).to.revertedWith('Ownable: caller is not the owner');
      });

      it("SHOULD have default protocolTreasury address after deploy ", async () => {
        expect(await alloSettings.protocolTreasury()).to.be.equal(AddressZero);
      });

      it("SHOULD emit ProtocolTreasuryUpdated event after invoking updateProtocolTreasury", async () => {
        await expect(alloSettings.updateProtocolTreasury(protocolTreasury.address))
          .to.emit(alloSettings, 'ProtocolTreasuryUpdated')
          .withArgs(protocolTreasury.address);
      });

      it("SHOULD have protocolTreasury address after invoking updateProtocolTreasury", async () => {
        await alloSettings.updateProtocolTreasury(protocolTreasury.address).then(async () => {
          const protocolTreasuryAddress = await alloSettings.protocolTreasury();
          expect(protocolTreasuryAddress).to.be.equal(protocolTreasury.address);
        });

      });
    });
  });

});
