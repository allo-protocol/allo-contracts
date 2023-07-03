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
import "../../utils/MetaPtr.sol";

/**
 * @notice Direct Payout Strategy contract which is deployed once per round
 * and is used to handle IN REVIEW applications status and to pay grantees based on internal review process.
 *
 */
contract DirectPayoutStrategyImplementation is ReentrancyGuardUpgradeable, IPayoutStrategy {
  using SafeERC20Upgradeable for IERC20Upgradeable;
  using AddressUpgradeable for address;

  string public constant VERSION = "0.2.0";

  enum ApplicationStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELED
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

  struct Fees {
      address protocolTreasury;
      address roundFeeAddress;
      uint256 protocolFeeAmount;
      uint256 roundFeeAmount;
  }

  // --- Data ---

  /// @notice Funds vault address
  address public vaultAddress;

  /// @notice In Review Applications - applicationIndex -> is in review
  mapping(uint256 => bool) internal _inReviewApplications;

  // --- Errors ---

  error DirectStrategy__isConfigured();
  error DirectStrategy__notConfigured();
  error DirectStrategy__notImplemented();
  error DirectStrategy__vote_NotImplemented();
  error DirectStrategy__setApplicationInReview_applicationInWrongStatus();
  error DirectStrategy__payout_ApplicationNotAccepted();
  error DirectStrategy__payout_NativeTokenNotAllowed();
  error DirectStrategy__payout_NotImplementedYet();

  // --- Event ---

  /// @notice Emitted when a Vault address is updated
  event VaultAddressUpdated(address vaultAddress);

  /// @notice Emitted when a Round wallet address is updated
  event ApplicationInReview(uint256 indexed applicationIndex, address indexed operator);

  /// @notice Emitted when a payout is executed
  event PayoutMade(
      address indexed vault,
      address token,
      uint256 amount,
      uint256 protocolFee,
      uint256 roundFee,
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

  function initialize() external initializer {
    // empty initializer
  }

  // --- Core methods ---

  // @notice Update safe vault address (only by ROUND_OPERATOR_ROLE)
  /// @param _newVaultAddress new vault address
  function updateVaultAddress(address _newVaultAddress) external isRoundOperator roundHasNotEnded {
    vaultAddress = _newVaultAddress;
    emit VaultAddressUpdated(_newVaultAddress);
  }

  /**
   * @notice Invoked by a round operator to make signal that a pending application turns to IN REVIEW status.*
   *
   * @param _applicationIndex Application index
   */
  function setApplicationInReview(uint256 _applicationIndex) external isRoundOperator roundHasNotEnded {
    if (!_isPendingRoundApplication(_applicationIndex)) revert DirectStrategy__setApplicationInReview_applicationInWrongStatus();
    _inReviewApplications[_applicationIndex] = true;

    emit ApplicationInReview(_applicationIndex, msg.sender);
  }

  /**
   * @notice Invoked by a round operator to make direct payments of funds to a project application.
   *
   * @dev It can be used to pay from a given address using `ERC20.transferFrom`, or from
   * the configured vault in which case the AllowanceModule should be set as a Safe Module on the Safe Multisig vault,
   * and the caller as delegate on the AllowanceModule.
   *[AllowanceModule](https://github.com/safe-global/safe-modules/tree/master/allowances)
   *
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

    Fees memory fees = _getFees(_payment.amount);

    // use Safe multisig vault
    if (_payment.allowanceModule != address(0)) {
      _payWithSafe(_payment, fees);
    } else { // use transfer from
      _payWithWallet(_payment, fees);
    }

    emit PayoutMade(
      _payment.vault != address(0) ? _payment.vault : vaultAddress,
      _payment.token,
      _payment.amount,
      fees.protocolFeeAmount,
      fees.roundFeeAmount,
      _payment.grantAddress,
      _payment.projectId,
      _payment.applicationIndex,
      _payment.allowanceModule
    );
  }

  /// @dev Generates the transfer hash that should be signed by the delegate to authorize a transfer.
  /// This function add both protocol and round fees to the amount so they are included in the signature required for
  /// executing the `payout` function
  function generateTransferHash(
      address _allowanceModule,
      address _roundOperator,
      address _token,
      address _to,
      uint96 _amount
  ) public view returns (bytes32) {
      IAllowanceModule allowanceModule = IAllowanceModule(_allowanceModule);
      uint256[5] memory tokenAllowance = allowanceModule.getTokenAllowance(vaultAddress, _roundOperator, _token);

      Fees memory fees = _getFees(_amount);

      return allowanceModule.generateTransferHash(
        vaultAddress,
        _token,
        _to,
        _amount + uint96(fees.protocolFeeAmount + fees.roundFeeAmount),
        address(0),
        0,
        uint16(tokenAllowance[4])
      );
  }

  /// @dev Determines if a given application index on IN REVIEW status
  function isApplicationInReview(uint256 applicationIndex) public view returns (bool) {
    return _isPendingRoundApplication(applicationIndex) && _inReviewApplications[applicationIndex];
  }

  function _payWithWallet(Payment calldata _payment, Fees memory _fees) internal {
    if (_payment.token == address(0)) revert DirectStrategy__payout_NativeTokenNotAllowed();

    address vault = _payment.vault != address(0) ? _payment.vault : vaultAddress;

    /// @dev erc20 transfer to grant address
    // slither-disable-next-line arbitrary-send-erc20,reentrancy-events,
    IERC20Upgradeable(_payment.token).safeTransferFrom(
      vault,
      _payment.grantAddress,
      _payment.amount
    );

    if (_fees.protocolFeeAmount > 0 && _fees.protocolTreasury != address(0)) {
      IERC20Upgradeable(_payment.token).safeTransferFrom(
        vault,
        _fees.protocolTreasury,
        _fees.protocolFeeAmount
      );
    }

    // deduct round fee
    if (_fees.roundFeeAmount > 0 && _fees.roundFeeAddress != address(0)) {
      IERC20Upgradeable(_payment.token).safeTransferFrom(
        vault,
        _fees.roundFeeAddress,
        _fees.roundFeeAmount
      );
    }
  }
  function _payWithSafe(Payment calldata _payment,  Fees memory _fees) internal {
    address vault = _payment.vault != address(0) ? _payment.vault : vaultAddress;

    IAllowanceModule allowanceModule = IAllowanceModule(_payment.allowanceModule);
    allowanceModule.executeAllowanceTransfer(
        vault,
        _payment.token,
        payable(address(this)),
        uint96(_payment.amount + _fees.protocolFeeAmount + _fees.roundFeeAmount),
        address(0),
        0,
        msg.sender,
        _payment.allowanceSignature // allowanceSignature should contain _payment.amount + protocolFeeAmount + roundFeeAmount as the amount
    );

    _transferAmount(_payment.token, payable(_payment.grantAddress), _payment.amount);
    if (_fees.protocolFeeAmount > 0 && _fees.protocolTreasury != address(0)) {
      _transferAmount(_payment.token, payable(_fees.protocolTreasury), _fees.protocolFeeAmount);
    }
    if (_fees.roundFeeAmount > 0 && _fees.roundFeeAddress != address(0)) {
      _transferAmount(_payment.token, payable(_fees.roundFeeAddress), _fees.roundFeeAmount);
    }
  }

  function _getFees(uint256 _amount) internal view returns (Fees memory fees) {
    RoundImplementation round = RoundImplementation(roundAddress);
    AlloSettings alloSettings = round.alloSettings();

    uint32 denominator = alloSettings.DENOMINATOR();

    fees = Fees(
      alloSettings.protocolTreasury(),
      round.roundFeeAddress(),
      (_amount * alloSettings.protocolFeePercentage()) / denominator,
      (_amount * round.roundFeePercentage()) / denominator
    );
  }

  /// @dev Determines if a given application index on PENDING status
  function _isPendingRoundApplication(uint256 applicationIndex) internal view returns(bool) {
    RoundImplementation round = RoundImplementation(roundAddress);
    uint256 currentStatus = round.getApplicationStatus(applicationIndex);

    return currentStatus == uint256(ApplicationStatus.PENDING);
  }

  /// @notice Util function to transfer amount to recipient
  /// @param _recipient recipient address
  /// @param _amount amount to transfer
  function _transferAmount(address _token, address payable _recipient, uint256 _amount) private {
    if (_token == address(0)) {
      Address.sendValue(_recipient, _amount);
    } else {
      IERC20Upgradeable(_token).safeTransfer(_recipient, _amount);
    }
  }

  // not implemented functions
  function updateDistribution(bytes calldata) external override {
    revert DirectStrategy__notImplemented();
  }
  function isDistributionSet() public override pure returns (bool) {
    return true;
  }
}
