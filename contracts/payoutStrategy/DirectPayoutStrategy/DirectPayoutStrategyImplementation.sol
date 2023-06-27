// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "../IPayoutStrategy.sol";
import {AlloSettings} from "../../settings/AlloSettings.sol";
import {RoundImplementation} from "../../round/RoundImplementation.sol";
import {IAllowanceModule} from "./IAllowanceModule.sol";

/**
 * Allows voters to cast multiple weighted votes to grants with one transaction
 * This is inspired from BulkCheckout documented over at:
 * https://github.com/gitcoinco/BulkTransactions/blob/master/contracts/BulkCheckout.sol
 *
 * Emits event upon every transfer.
 */
contract DirectPayoutStrategyImplementation is ReentrancyGuardUpgradeable, IPayoutStrategy {
  using SafeERC20Upgradeable for IERC20Upgradeable;
  using AddressUpgradeable for address;

  string public constant VERSION = "0.2.0";

  enum ApplicationStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELED,
    IN_REVIEW
  }

  struct Payment {
      address vault;
      address token;
      uint96 amount;
      address grantAddress;
      bytes32 projectId;
      uint256 applicationIndex;
      address allowanceModule;
      bytes allowanceSignature;
  }

  // --- Data ---

  /// @notice Funds vault address
  address public vaultAddress;

   /// @notice Allo Config Contract Address
  AlloSettings public alloSettings;

  /// @notice Round fee percentage
  uint32 public roundFeePercentage;

  /// @notice Round fee address
  address payable public roundFeeAddress;

  // Errors

  error DirectStrategy__isConfigured();
  error DirectStrategy__notConfigured();
  error DirectStrategy__notImplemented();
  error DirectStrategy__vote_NotImplemented();
  error DirectStrategy__payout_ApplicationNotAccepted();
  error DirectStrategy__payout_NativeTokenNotAllowed();
  error DirectStrategy__payout_NotImplementedYet();

  // --- Event ---

  /// @notice Emitted when a Round fee percentage is updated
  event RoundFeePercentageUpdated(uint32 roundFeePercentage);

  /// @notice Emitted when a Round wallet address is updated
  event RoundFeeAddressUpdated(address roundFeeAddress);

  /// @notice Emitted when a payout is executed
  event PayoutMade(
      address indexed vault,
      address token,
      uint256 amount,
      address grantAddress,
      bytes32 indexed projectId,
      uint256 indexed applicationIndex,
      address allowanceModule
  );

  // --- Modifier ---

  /// @notice modifier to check if round has not ended.
  modifier roundHasNotEnded() {
    // slither-disable-next-line timestamp
    require(RoundImplementation(roundAddress).roundEndTime() >= block.timestamp, "round has ended");
     _;
  }

  /// @notice modifier to check if some address is round operator.
  modifier isCallerRoundOperator(address _caller) {
    require(
      RoundImplementation(roundAddress).hasRole(ROUND_OPERATOR_ROLE, _caller),
      "not round operator"
    );
    _;
  }

  function initialize(
    address _alloSettings,
    address _vaultAddress,
    uint32  _roundFeePercentage,
    address _roundFeeAddress
  ) external initializer {
    alloSettings = AlloSettings(_alloSettings);
    vaultAddress = _vaultAddress;
    roundFeePercentage = _roundFeePercentage;
    roundFeeAddress = payable(_roundFeeAddress);
  }

  // --- Core methods ---

  // @notice Update round fee percentage (only by ROUND_OPERATOR_ROLE)
  /// @param _newFeePercentage new fee percentage
  function updateRoundFeePercentage(uint32 _newFeePercentage) external isCallerRoundOperator(msg.sender) roundHasNotEnded {
    roundFeePercentage = _newFeePercentage;
    emit RoundFeePercentageUpdated(roundFeePercentage);
  }

  // @notice Update round fee address (only by ROUND_OPERATOR_ROLE)
  /// @param _newFeeAddress new fee address
  function updateRoundFeeAddress(address payable _newFeeAddress) external isCallerRoundOperator(msg.sender) roundHasNotEnded {
    roundFeeAddress = _newFeeAddress;
    emit RoundFeeAddressUpdated(roundFeeAddress);
  }

  /**
   * @notice Invoked by a round operator to make direct payments of funds to a project application.
   *
   * @dev It can be used to pay from a given address using `ERC20.transferFrom`, or from
   * the configured vault in which case the AllowanceModule should be set as a Safe Module on the Safe Multisig vault,
   * and the caller as delegate on the AllowanceModule.
   * Using `transferFrom` only allow to pay with ERC20 tokens, and requires the indicated vault previously approved this
   * contract to use such ERC20 token on it behalf.
   * This 2 options are handled by the `payment.vault` parameter, if it set to an address different from address(0) then
   * the function will follow the `transferFrom` path.
   *
   * To complete the payment it is required for the project application to be on status ACCEPTED.
   *
   * @param _payment payment data
   */
  function payout(Payment calldata _payment) external nonReentrant isRoundOperator {
    uint256 currentStatus = RoundImplementation(roundAddress).getApplicationStatus(_payment.applicationIndex);
    if (currentStatus != uint256(ApplicationStatus.ACCEPTED)) revert DirectStrategy__payout_ApplicationNotAccepted();

    address usedVault = vaultAddress;

    // use transfer from
    if (_payment.vault != address(0)) {
      if (_payment.token == address(0)) revert DirectStrategy__payout_NativeTokenNotAllowed();
      /// @dev erc20 transfer to grant address
      // slither-disable-next-line arbitrary-send-erc20,reentrancy-events,
      SafeERC20Upgradeable.safeTransferFrom(
        IERC20Upgradeable(_payment.token),
        _payment.vault,
        _payment.grantAddress,
        _payment.amount
      );
      usedVault = _payment.vault;
    } else { // use Safe multisig vault
      IAllowanceModule allowanceModule = IAllowanceModule(_payment.allowanceModule);
      allowanceModule.executeAllowanceTransfer(
          vaultAddress,
          _payment.token,
          payable(_payment.grantAddress),
          uint96(_payment.amount),
          address(0),
          0,
          msg.sender,
          _payment.allowanceSignature
      );
    }

    // TODO - implement round fee

    emit PayoutMade(usedVault, _payment.token, _payment.amount, _payment.grantAddress, _payment.projectId, _payment.applicationIndex, _payment.allowanceModule);
  }

  /// @dev Generates the transfer hash that should be signed by the delegate to authorize a transfer
  function generateTransferHash(
      address _allowanceModule,
      address _roundOperator,
      address _token,
      address _to,
      uint96 _amount
  ) public view returns (bytes32) {
      IAllowanceModule allowanceModule = IAllowanceModule(_allowanceModule);
      uint256[5] memory tokenAllowance = allowanceModule.getTokenAllowance(vaultAddress, _roundOperator, _token);

      return allowanceModule.generateTransferHash(
        vaultAddress,
        _token,
        _to,
        _amount,
        address(0),
        0,
        uint16(tokenAllowance[4])
      );
  }

  // not implemented functions
  function updateDistribution(bytes calldata _encodedDistribution) external override {
    revert DirectStrategy__notImplemented();
  }
  function isDistributionSet() public override pure returns (bool) {
    return true;
  }
}
