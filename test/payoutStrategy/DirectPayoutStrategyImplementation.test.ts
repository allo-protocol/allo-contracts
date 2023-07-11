import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet, BigNumberish, BigNumber } from 'ethers';
import { BytesLike, formatBytes32String, isAddress } from "ethers/lib/utils";
import {takeSnapshot, restoreSnapshot, currentTime, signHash, executeTx, advanceTimeTo} from "../utils";
import { ApplicationStatus, buildStatusRow } from "../../utils/applicationStatus";
import {
  DirectPayoutStrategyFactory,
  DirectPayoutStrategyImplementation,
  AlloSettings,
  MockRoundImplementation,
  MockERC20,
  GnosisSafeProxyFactory,
  GnosisSafe,
  IAllowanceModule,
  DummyVotingStrategy
} from "../../typechain";

import { encodeRoundParameters } from "../../scripts/utils";

type Payment = {
  vault: string;
  token: string;
  amount: BigNumberish;
  grantAddress: string;
  projectId: BytesLike;
  applicationIndex: BigNumberish;
  allowanceModule: string;
  allowanceSignature: BytesLike;
}

const IN_REVIEW = 1;

export function buildInReviewStatusRow(
  currentRow: bigint,
  statuses: {index: number, status: ApplicationStatus}[]
) {
  let newRow = currentRow;

  for (let i = 0; i < statuses.length; i++) {
    if(statuses[i].index >= 256) {
      throw new Error(`Status with column index ${statuses[i].index} is out of bounds`);
    }

    const columnIndex = BigInt(statuses[i].index);
    const status = BigInt(statuses[i].status);

    // build a mask and clear the previous status of this index
    newRow = newRow & ~(1n << columnIndex);
    // set the new status
    newRow = newRow | status << columnIndex;
  }

  return newRow.toString();
};

describe.only("DirectPayoutStrategyImplementation", () => {
  let snapshot: number;
  let admin: SignerWithAddress;
  let roundOperator: SignerWithAddress;
  let notRoundOperator: SignerWithAddress;
  let safeOwner: SignerWithAddress;
  let vault: SignerWithAddress;
  let grantee1: SignerWithAddress;
  let protocolTreasury: SignerWithAddress;
  let roundFeeAddress: SignerWithAddress;

  let dummyVotingStrategy: DummyVotingStrategy;
  let directStrategyFactory: DirectPayoutStrategyFactory;
  let directStrategyImpl: DirectPayoutStrategyImplementation;
  let directStrategyProxy: DirectPayoutStrategyImplementation;
  let alloSettingsContract: AlloSettings;
  let mockRound: MockRoundImplementation;
  let mockERC20: MockERC20;

  let vaultAddress: string;
  let roundFeePercentage: BigNumberish;

  let strategyEncodedParams: string;
  let roundEncodedParams: string;

  let safeVault: GnosisSafe;
  let safeFactory: GnosisSafeProxyFactory;
  let allowanceModule: IAllowanceModule;

  const VERSION = "0.2.0";
  const CALL = 0
  const ALLOWANCE_MODULE = "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"

  let now: BigNumberish;
  let startTime: BigNumberish;
  let endTime: BigNumberish;

  let execSafeTransaction = async function(to: string, value: string | number | BigNumber, data: string, operation: number): Promise<any> {
    let nonce = (await safeVault.nonce()).toString();
    let transactionHash = await safeVault.getTransactionHash(to, value, data, operation, 0, 0, 0, ethers.constants.AddressZero, ethers.constants.AddressZero, nonce);
    let sig = await signHash(safeOwner, transactionHash)

    return executeTx(safeVault, {
      to,
      value,
      data,
      operation,
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: ethers.constants.AddressZero,
      refundReceiver: ethers.constants.AddressZero,
      nonce
    }, [sig])
  }

  before(async () => {
    [admin, safeOwner, roundOperator, notRoundOperator, vault, grantee1, roundFeeAddress, protocolTreasury] = await ethers.getSigners();

    roundFeePercentage = 0;
    vaultAddress = vault.address;

    dummyVotingStrategy = await (await ethers.getContractFactory('DummyVotingStrategy')).deploy();

    let alloSettingsContractFactory = await ethers.getContractFactory('AlloSettings');
    alloSettingsContract = <AlloSettings>await upgrades.deployProxy(alloSettingsContractFactory);

    mockRound = await (await ethers.getContractFactory('MockRoundImplementation')).deploy() as MockRoundImplementation;
    mockERC20 = await (await ethers.getContractFactory('MockERC20')).deploy(100000000000);

    allowanceModule = await ethers.getContractAt("IAllowanceModule", ALLOWANCE_MODULE) as IAllowanceModule;
    safeFactory = await ethers.getContractAt("GnosisSafeProxyFactory", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2") as GnosisSafeProxyFactory;
    const txSafe = await safeFactory.createProxyWithNonce("0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552", "0x", 0)
    const rSafe = await txSafe.wait();
    if (rSafe.events) {
      const event = rSafe.events.find(e => e.event === 'ProxyCreation');
      if (event && event.args) {
        safeVault = await ethers.getContractAt("GnosisSafe", event.args.proxy) as GnosisSafe;
      }
    }
    await safeVault.setup([safeOwner.address], 1, ethers.constants.AddressZero, "0x", "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4", ethers.constants.AddressZero, 0, ethers.constants.AddressZero);
    let enableModuleData = safeVault.interface.encodeFunctionData("enableModule", [ALLOWANCE_MODULE]);

    await execSafeTransaction(safeVault.address, 0, enableModuleData, CALL)

    // add delegate
    let addDelegateData = allowanceModule.interface.encodeFunctionData("addDelegate", [roundOperator.address]);
    await execSafeTransaction(ALLOWANCE_MODULE, 0, addDelegateData, CALL)

    // set allowance
    let setAllowanceDataERC20 = allowanceModule.interface.encodeFunctionData("setAllowance", [roundOperator.address, mockERC20.address, 100000000, 0, 0]);
    let setAllowanceDataETH = allowanceModule.interface.encodeFunctionData("setAllowance", [roundOperator.address, ethers.constants.AddressZero, 100000000, 0, 0]);
    await execSafeTransaction(ALLOWANCE_MODULE, 0, setAllowanceDataERC20, CALL)
    await execSafeTransaction(ALLOWANCE_MODULE, 0, setAllowanceDataETH, CALL)

    await mockERC20.transfer(safeVault.address, 10000000);

    await admin.sendTransaction({to: safeVault.address, value: 10000000})

    // Deploy DirectStrategy contract
    directStrategyImpl = await (await ethers.getContractFactory('DirectPayoutStrategyImplementation')).deploy();

    directStrategyFactory = <DirectPayoutStrategyFactory>await upgrades.deployProxy(await ethers.getContractFactory('DirectPayoutStrategyFactory'));
    await directStrategyFactory.updatePayoutImplementation(directStrategyImpl.address);

    // const txn = await directStrategyFactory.create();
    // const receipt = await txn.wait();

    // if (receipt.events) {
    //   const event = receipt.events.find(e => e.event === 'PayoutContractCreated');
    //   if (event && event.args) {
    //     directStrategyProxy = await ethers.getContractAt("DirectPayoutStrategyImplementation", event.args.payoutContractAddress) as DirectPayoutStrategyImplementation;
    //   }
    // }
  })

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await restoreSnapshot(snapshot);
    snapshot = await takeSnapshot();
  });

  describe("constructor", () => {
    it("deploys properly", async () => {
      // Verify deploy
      expect(
        isAddress(directStrategyImpl.address),
        "Failed to deploy DirectStrategy"
      ).to.be.true;

      // Verify default value
      expect(await directStrategyImpl.roundAddress()).to.equal(
        AddressZero
      );
    });
  });

  describe("core functions", () => {
    describe("test: init", () => {
      before(async () => {
        const roundMetaPtr = {
          protocol: 1,
          pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
        };
        const applicationMetaPtr = {
          protocol: 1,
          pointer: "bafybeiaoakfoxjwi2kwh43djbmomroiryvhv5cetg74fbtzwef7hzzvrnq",
        };

        const adminRoles = [admin.address];
        const roundOperators = [
          roundOperator.address,
          Wallet.createRandom().address,
          Wallet.createRandom().address,
        ];

        let matchAmount = 0;

        const denominator = await alloSettingsContract.DENOMINATOR();
        // roundFeePercentage = roundFeePercentage * (denominator / 100);

        const initAddress = [
          dummyVotingStrategy.address, // votingStrategy
          directStrategyFactory.address, // payoutStrategy
        ];

        now = await currentTime();
        startTime = now + 100
        endTime = startTime + 60*60*24*365; // 1 year

        const initRoundTime = [
          startTime,// applicationsStartTime
          endTime,// applicationsStartTime
          startTime, // roundStartTime
          endTime,// roundEndTime
        ];

        const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

        const initRoles = [adminRoles, roundOperators];

        const params = [
          initAddress,
          initRoundTime,
          matchAmount,
          ethers.constants.AddressZero,
          roundFeePercentage,
          roundFeeAddress.address,
          initMetaPtr,
          initRoles
        ];

        const encoded = encodeRoundParameters(params)
        await mockRound.initialize(
          encoded,
          alloSettingsContract.address
        );

        const payoutContractAddress = await mockRound.payoutStrategy();
        directStrategyProxy = await ethers.getContractAt("DirectPayoutStrategyImplementation", payoutContractAddress) as DirectPayoutStrategyImplementation;

        await advanceTimeTo(Number(startTime) + 1)
      });

      it("invoking init once SHOULD set the contract version", async () => {
        expect(await directStrategyProxy.VERSION()).to.equal(
          VERSION
        );
      });

      it("invoking init once SHOULD set the round address", async () => {
        expect(await directStrategyProxy.roundAddress()).to.equal(
          mockRound.address
        );
      });

      it("invoking init more than once SHOULD revert the transaction ", () => {
        expect(directStrategyProxy.connect(notRoundOperator).init()).to.revertedWith(
          "roundAddress already set"
        );
      });
    });

    describe('test: updateVaultAddress', () => {
      it ('SHOULD revert if invoked by wallet who is not round operator', async () => {
        await expect(
          directStrategyProxy
            .connect(notRoundOperator)
            .updateVaultAddress(safeVault.address)
        ).to.revertedWith(
          'not round operator'
        );
      });

      it ('SHOULD revert if round is ended', async () => {
        await advanceTimeTo(Number(endTime) + 1)

        let now = await currentTime();
        expect(await mockRound.roundEndTime()).to.be.lt(now)

        await expect(
          directStrategyProxy
            .connect(roundOperator)
            .updateVaultAddress(safeVault.address)
        ).to.revertedWith(
          'round has ended'
        );
      });


      it ('SHOULD update vaultAddress value IF called is round operator', async () => {
        const newVaultAddress = Wallet.createRandom().address;

        const txn = await directStrategyProxy.connect(roundOperator).updateVaultAddress(newVaultAddress);
        await txn.wait();

        const vaultAddress =
          await directStrategyProxy.vaultAddress();
        expect(vaultAddress).equals(newVaultAddress);
      });
    });

    describe("test: setApplicationsInReview", () => {
      const grantee1ProjectId = formatBytes32String("grantee1");
      const grantee1IndexPending = 0;
      const grantee1IndexApproved = 1;
      const grantee1IndexNoApplied = 2;
      const grantee1GrantAmount = 10;
      let payment: Payment;
      let inReviewStatuses:any[] = [];

      before(async () => {
        await mockERC20.transfer(vaultAddress, 1000);
        await mockERC20.connect(vault).approve(directStrategyProxy.address, ethers.constants.MaxUint256);
        // 0
        await mockRound.applyToRound(
          grantee1ProjectId,
          {
            protocol: 1,
            pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          }
        );
        // 1
        await mockRound.applyToRound(
          grantee1ProjectId,
          {
            protocol: 1,
            pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          }
        );

        const statuses = [
          { index: 0, status: ApplicationStatus.PENDING },
          { index: 1, status: ApplicationStatus.ACCEPTED }
        ]

        const newState = buildStatusRow(0n, statuses);

        const applicationStatus = {
          index: 0,
          statusRow: newState,
        }

        await mockRound.connect(roundOperator).setApplicationStatuses([applicationStatus]);
        expect(await mockRound.getApplicationStatus(0)).equal(
          ApplicationStatus.PENDING
        );

        expect(await mockRound.getApplicationStatus(1)).equal(
          ApplicationStatus.ACCEPTED
        );
      });

      it("SHOULD revert when caller is not the round operator", async () => {
        await expect(directStrategyProxy.connect(notRoundOperator).setApplicationsInReview(inReviewStatuses)).to.revertedWith("not round operator")
      })

      // it("SHOULD revert if application is not PENDING but ACCEPTED", async () => {
      //   expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

      //   await expect(directStrategyProxy.connect(roundOperator).setApplicationsInReview(grantee1IndexApproved)).to.revertedWith("DirectStrategy__setApplicationInReview_applicationInWrongStatus")
      // })

      // it("SHOULD revert if application is PENDING but not a real application", async () => {
      //   await expect(mockRound.getApplicationStatus(grantee1IndexNoApplied)).to.revertedWith("Round: Application does not exist")
      //   await expect(directStrategyProxy.connect(roundOperator).setApplicationInReview(grantee1IndexNoApplied)).to.revertedWith("Round: Application does not exist")
      // })

      it("SHOULD set a PENDING application to IN REVIEW", async () => {
        expect(await mockRound.getApplicationStatus(grantee1IndexPending)).to.eq(ApplicationStatus.PENDING)
        expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)
        expect(await directStrategyProxy.isApplicationInReview(grantee1IndexPending)).to.false
        expect(await directStrategyProxy.isApplicationInReview(grantee1IndexApproved)).to.false

        inReviewStatuses = [
          { index: 0, status: IN_REVIEW },
          { index: 1, status: IN_REVIEW }
        ]

        const newState = buildInReviewStatusRow(0n, inReviewStatuses);

        const applicationStatus = {
          index: 0,
          statusRow: newState,
        }

        await expect(
          directStrategyProxy.connect(roundOperator).setApplicationsInReview([applicationStatus])
          ).to.emit(directStrategyProxy, 'ApplicationInReviewUpdated').withArgs(
            0,
            newState
          );

        expect(await directStrategyProxy.isApplicationInReview(grantee1IndexPending)).to.true
        expect(await directStrategyProxy.isApplicationInReview(grantee1IndexApproved)).to.false
      })
    })

    describe("test: payout", () => {
      const grantee1ProjectId = formatBytes32String("grantee1");
      const grantee1IndexPending = 0;
      const grantee1IndexApproved = 1;
      const grantee1GrantAmount = 1000000;
      let payment: Payment;

      before(async () => {
        await directStrategyProxy.connect(roundOperator).updateVaultAddress(safeVault.address);
        await mockERC20.transfer(vaultAddress, 10000000);
        await mockERC20.connect(vault).approve(directStrategyProxy.address, ethers.constants.MaxUint256);
        // 0
        await mockRound.applyToRound(
          grantee1ProjectId,
          {
            protocol: 1,
            pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          }
        );
        // 1
        await mockRound.applyToRound(
          grantee1ProjectId,
          {
            protocol: 1,
            pointer: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          }
        );

        const statuses = [
          { index: 0, status: ApplicationStatus.PENDING },
          { index: 1, status: ApplicationStatus.ACCEPTED }
        ]

        const newState = buildStatusRow(0n, statuses);

        const applicationStatus = {
          index: 0,
          statusRow: newState,
        }

        await mockRound.connect(roundOperator).setApplicationStatuses([applicationStatus]);
        expect(await mockRound.getApplicationStatus(0)).equal(
          ApplicationStatus.PENDING
        );

        expect(await mockRound.getApplicationStatus(1)).equal(
          ApplicationStatus.ACCEPTED
        );
      });

      describe("using transferFrom", () => {
        before(async () => {
          payment = {
            vault: vaultAddress,
            token: mockERC20.address,
            amount: grantee1GrantAmount,
            grantAddress: grantee1.address,
            projectId: grantee1ProjectId,
            applicationIndex: grantee1IndexPending,
            allowanceModule: ethers.constants.AddressZero,
            allowanceSignature: "0x"
          }
        });

        it("SHOULD revert when caller is not the round operator", async () => {
          await expect(directStrategyProxy.connect(notRoundOperator).payout(payment)).to.revertedWith("not round operator")
        })

        it("SHOULD revert if application is not APPROVED", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexPending)).to.eq(ApplicationStatus.PENDING)
          await expect(directStrategyProxy.connect(roundOperator).payout(payment)).to.revertedWith("DirectStrategy__payout_ApplicationNotAccepted")
        })

        it("SHOULD revert if token is native token", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          await expect(directStrategyProxy.connect(roundOperator).payout({
            ...payment,
            applicationIndex: grantee1IndexApproved,
            token: ethers.constants.AddressZero
          })).to.revertedWith("DirectStrategy__payout_NativeTokenNotAllowed")
        })

        it("SHOULD transfer indicated amount of ERC20 tokens from vault to grantee when application is APPROVED", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          const balanceGrantee1Before = await mockERC20.balanceOf(grantee1.address);
          const balanceVaultBefore = await mockERC20.balanceOf(vaultAddress);

          await directStrategyProxy.connect(roundOperator).payout({
            ...payment,
            applicationIndex: grantee1IndexApproved
          })

          expect(await mockERC20.balanceOf(grantee1.address)).to.eq(balanceGrantee1Before.add(grantee1GrantAmount))
          expect(await mockERC20.balanceOf(vaultAddress)).to.eq(balanceVaultBefore.sub(grantee1GrantAmount))
        })

        it("SHOULD transfer indicated amount and fees of ERC20 tokens from vault to grantee, protocol treasury and round fee address when application is APPROVED", async () => {
          alloSettingsContract.updateProtocolTreasury(protocolTreasury.address);
          alloSettingsContract.updateProtocolFeePercentage(100); // 0.1%
          mockRound.connect(roundOperator).updateRoundFeeAddress(roundFeeAddress.address); // 0.01%
          mockRound.connect(roundOperator).updateRoundFeePercentage(10); // 0.01%

          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          const balanceGrantee1Before = await mockERC20.balanceOf(grantee1.address);
          const balanceVaultBefore = await mockERC20.balanceOf(vaultAddress);
          const balanceProtocolTreasuryBefore = await mockERC20.balanceOf(protocolTreasury.address);
          const balanceRoundBefore = await mockERC20.balanceOf(roundFeeAddress.address);

          await directStrategyProxy.connect(roundOperator).payout({
            ...payment,
            applicationIndex: grantee1IndexApproved
          })

          const protocolFee = grantee1GrantAmount*100/100000;
          const roundFee = grantee1GrantAmount*10/100000;

          expect(await mockERC20.balanceOf(grantee1.address)).to.eq(balanceGrantee1Before.add(grantee1GrantAmount))
          expect(await mockERC20.balanceOf(vaultAddress)).to.eq((balanceVaultBefore.sub(grantee1GrantAmount).sub(protocolFee).sub(roundFee)))
          expect(await mockERC20.balanceOf(protocolTreasury.address)).to.eq(balanceProtocolTreasuryBefore.add(protocolFee))
          expect(await mockERC20.balanceOf(roundFeeAddress.address)).to.eq(balanceRoundBefore.add(roundFee))
        })

        it("SHOULD emit an event for each payment", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          await expect(
            directStrategyProxy.connect(roundOperator).payout({
              ...payment,
              applicationIndex: grantee1IndexApproved
            })
          ).to.emit(directStrategyProxy, 'PayoutMade').withArgs(
            vaultAddress,
            mockERC20.address,
            grantee1GrantAmount,
            0,
            0,
            grantee1.address,
            grantee1ProjectId,
            grantee1IndexApproved,
            ethers.constants.AddressZero
          );
        })
      });

      describe("using AllowanceModule", () => {
        before(async () => {
          payment = {
            vault: ethers.constants.AddressZero,
            token: mockERC20.address,
            amount: grantee1GrantAmount,
            grantAddress: grantee1.address,
            projectId: grantee1ProjectId,
            applicationIndex: grantee1IndexPending,
            allowanceModule: ALLOWANCE_MODULE,
            allowanceSignature: "0x"
          }
        });

        it("SHOULD revert when caller is not the round operator", async () => {
          await expect(directStrategyProxy.connect(notRoundOperator).payout(payment)).to.revertedWith("not round operator")
        })

        it("SHOULD revert if application is not APPROVED", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexPending)).to.eq(ApplicationStatus.PENDING)
          await expect(directStrategyProxy.connect(roundOperator).payout(payment)).to.revertedWith("DirectStrategy__payout_ApplicationNotAccepted")
        })

        it("SHOULD transfer indicated amount of ERC20 tokens from configured Safe vault to grantee when application is APPROVED", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          const balanceGrantee1Before = await mockERC20.balanceOf(grantee1.address);
          const balanceVaultBefore = await mockERC20.balanceOf(safeVault.address);

          // receiver is directStrategyProxy, funds (amount + protocolFee + roundFee) are collected and distributed
          let transactionHash = await directStrategyProxy.generateTransferHash(ALLOWANCE_MODULE, roundOperator.address, mockERC20.address, directStrategyProxy.address, grantee1GrantAmount)
          let sig = await signHash(roundOperator, transactionHash)

          await directStrategyProxy.connect(roundOperator).payout({...payment, applicationIndex: grantee1IndexApproved, allowanceSignature: sig.data})

          expect(await mockERC20.balanceOf(grantee1.address)).to.eq(balanceGrantee1Before.add(grantee1GrantAmount))
          expect(await mockERC20.balanceOf(safeVault.address)).to.eq(balanceVaultBefore.sub(grantee1GrantAmount))
        })

        it("SHOULD transfer indicated amount and fees of ERC20 tokens from vault to grantee, protocol treasury and round fee address when application is APPROVED", async () => {
          alloSettingsContract.updateProtocolTreasury(protocolTreasury.address);
          alloSettingsContract.updateProtocolFeePercentage(100); // 0.1%
          mockRound.connect(roundOperator).updateRoundFeeAddress(roundFeeAddress.address); // 0.01%
          mockRound.connect(roundOperator).updateRoundFeePercentage(10); // 0.01%

          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          const balanceGrantee1Before = await mockERC20.balanceOf(grantee1.address);
          const balanceVaultBefore = await mockERC20.balanceOf(safeVault.address);
          const balanceProtocolTreasuryBefore = await mockERC20.balanceOf(protocolTreasury.address);
          const balanceRoundBefore = await mockERC20.balanceOf(roundFeeAddress.address);

          // receiver is directStrategyProxy, funds (amount + protocolFee + roundFee) are collected and distributed
          let transactionHash = await directStrategyProxy.generateTransferHash(ALLOWANCE_MODULE, roundOperator.address, mockERC20.address, directStrategyProxy.address, grantee1GrantAmount)
          let sig = await signHash(roundOperator, transactionHash)

          await directStrategyProxy.connect(roundOperator).payout({...payment, applicationIndex: grantee1IndexApproved, allowanceSignature: sig.data})

          const protocolFee = grantee1GrantAmount*100/100000;
          const roundFee = grantee1GrantAmount*10/100000;

          expect(await mockERC20.balanceOf(grantee1.address)).to.eq(balanceGrantee1Before.add(grantee1GrantAmount))
          expect(await mockERC20.balanceOf(safeVault.address)).to.eq((balanceVaultBefore.sub(grantee1GrantAmount).sub(protocolFee).sub(roundFee)))
          expect(await mockERC20.balanceOf(protocolTreasury.address)).to.eq(balanceProtocolTreasuryBefore.add(protocolFee))
          expect(await mockERC20.balanceOf(roundFeeAddress.address)).to.eq(balanceRoundBefore.add(roundFee))
        })

        it("SHOULD transfer indicated amount of ETH from configured Safe vault to grantee when application is APPROVED", async () => {
          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          const balanceGrantee1Before = await grantee1.getBalance();
          const balanceVaultBefore = await ethers.provider.getBalance(safeVault.address);

          // receiver is directStrategyProxy, funds (amount + protocolFee + roundFee) are collected and distributed
          let transactionHash = await directStrategyProxy.generateTransferHash(ALLOWANCE_MODULE, roundOperator.address, ethers.constants.AddressZero, directStrategyProxy.address, grantee1GrantAmount)
          let sig = await signHash(roundOperator, transactionHash)

          const tx = await directStrategyProxy.connect(roundOperator).payout({...payment, applicationIndex: grantee1IndexApproved, token: ethers.constants.AddressZero, allowanceSignature: sig.data})

          expect(await grantee1.getBalance()).to.eq(balanceGrantee1Before.add(grantee1GrantAmount))
          expect(await ethers.provider.getBalance(safeVault.address)).to.eq(balanceVaultBefore.sub(grantee1GrantAmount))
        })

        it("SHOULD transfer indicated amount and fees of ETH from configured Safe vault to grantee, protocol treasury and round fee address when application is APPROVED", async () => {
          alloSettingsContract.updateProtocolTreasury(protocolTreasury.address);
          alloSettingsContract.updateProtocolFeePercentage(100); // 0.1%
          mockRound.connect(roundOperator).updateRoundFeeAddress(roundFeeAddress.address); // 0.01%
          mockRound.connect(roundOperator).updateRoundFeePercentage(10); // 0.01%

          expect(await mockRound.getApplicationStatus(grantee1IndexApproved)).to.eq(ApplicationStatus.ACCEPTED)

          const balanceGrantee1Before = await grantee1.getBalance();
          const balanceVaultBefore = await ethers.provider.getBalance(safeVault.address);
          const balanceProtocolTreasuryBefore = await ethers.provider.getBalance(protocolTreasury.address);
          const balanceRoundBefore = await ethers.provider.getBalance(roundFeeAddress.address);

          // receiver is directStrategyProxy, funds (amount + protocolFee + roundFee) are collected and distributed
          let transactionHash = await directStrategyProxy.generateTransferHash(ALLOWANCE_MODULE, roundOperator.address, ethers.constants.AddressZero, directStrategyProxy.address, grantee1GrantAmount)
          let sig = await signHash(roundOperator, transactionHash)

          const tx = await directStrategyProxy.connect(roundOperator).payout({...payment, applicationIndex: grantee1IndexApproved, token: ethers.constants.AddressZero, allowanceSignature: sig.data})

          const protocolFee = grantee1GrantAmount*100/100000;
          const roundFee = grantee1GrantAmount*10/100000;


          expect(await grantee1.getBalance()).to.eq(balanceGrantee1Before.add(grantee1GrantAmount))
          expect(await ethers.provider.getBalance(safeVault.address)).to.eq((balanceVaultBefore.sub(grantee1GrantAmount).sub(protocolFee).sub(roundFee)))
          expect(await ethers.provider.getBalance(protocolTreasury.address)).to.eq(balanceProtocolTreasuryBefore.add(protocolFee))
          expect(await ethers.provider.getBalance(roundFeeAddress.address)).to.eq(balanceRoundBefore.add(roundFee))
        })

        it("SHOULD emit an event for each payment", async () => {
          // receiver is directStrategyProxy, funds (amount + protocolFee + roundFee) are collected and distributed
          let transactionHash = await directStrategyProxy.generateTransferHash(ALLOWANCE_MODULE, roundOperator.address, ethers.constants.AddressZero, directStrategyProxy.address, grantee1GrantAmount)
          let sig = await signHash(roundOperator, transactionHash)

          await expect(
            directStrategyProxy.connect(roundOperator).payout({...payment, applicationIndex: grantee1IndexApproved, token: ethers.constants.AddressZero, allowanceSignature: sig.data})
          ).to.emit(directStrategyProxy, 'PayoutMade').withArgs(
            safeVault.address,
            ethers.constants.AddressZero,
            grantee1GrantAmount,
            0,
            0,
            grantee1.address,
            grantee1ProjectId,
            grantee1IndexApproved,
            ALLOWANCE_MODULE
          );

          // receiver is directStrategyProxy, funds (amount + protocolFee + roundFee) are collected and distributed
          let transactionHashERC20 = await directStrategyProxy.generateTransferHash(ALLOWANCE_MODULE, roundOperator.address, mockERC20.address, directStrategyProxy.address, grantee1GrantAmount)
          let sigERC20 = await signHash(roundOperator, transactionHashERC20)

          await expect(
            directStrategyProxy.connect(roundOperator).payout({...payment, applicationIndex: grantee1IndexApproved, allowanceSignature: sigERC20.data})
            ).to.emit(directStrategyProxy, 'PayoutMade').withArgs(
              safeVault.address,
              mockERC20.address,
              grantee1GrantAmount,
              0,
            0,
              grantee1.address,
              grantee1ProjectId,
              grantee1IndexApproved,
              ALLOWANCE_MODULE
            );
        })
      });
    });
  });
});
