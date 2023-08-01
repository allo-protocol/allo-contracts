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

  enum RoundStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELED
  }

  enum Status {
    PENDING,
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

  struct Fees {
      address protocolTreasury;
      address roundFeeAddress;
      uint256 protocolFeeAmount;
      uint256 roundFeeAmount;
  }

  struct ApplicationStatus {
      uint256 index;
      uint256 statusRow;
  }

  // --- Data ---

  /// @notice Funds vault address
  address public vaultAddress;


  // This is a packed array of booleans.
  // inReviewApplicationsBitMap[0] is the first row of the bitmap and allows to store 256 bits to describe
  // the status of 256 applications.
  // statuses[1] is the second row, and so on.
  // 0: pending
  // 1: in review
  // Since it's a mapping the storage it's pre-allocated with zero values,
  // so if we check the status of an existing application, the value is by default 0 (pending).
  // If we want to check the status of an application, we take its index from the `applications` array
  // and convert it to the 1-bits position in the bitmap.
  mapping(uint256 => uint256) public inReviewApplicationsBitMap;

  // --- Errors ---

  error DirectStrategy__payout_ApplicationNotAccepted();
  error DirectStrategy__payout_NativeTokenNotAllowed();

  // --- Event ---

  /// @notice Emitted when a Vault address is updated
  event VaultAddressUpdated(address vaultAddress);

/// @notice Emitted when a Application statuses are updated
  event ApplicationInReviewUpdated(uint256 indexed index, uint256 indexed status);

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
   * @notice Invoked by a round operator to signal that a pending applications turn into IN REVIEW status.
   *
   * Statuses:
   * 0 - pending
   * 1 - in review
   *
   * @param statuses New statuses
   */
  function setApplicationsInReview(ApplicationStatus[] memory statuses) external isRoundOperator roundHasNotEnded {
    for (uint256 i = 0; i < statuses.length;) {
      uint256 rowIndex = statuses[i].index;
      uint256 fullRow = statuses[i].statusRow;

      inReviewApplicationsBitMap[rowIndex] = fullRow;

      emit ApplicationInReviewUpdated(rowIndex, fullRow);

      unchecked {
        i++;
      }
    }
  }

  /**
   * @notice Invoked by a round operator to make direct payments of funds to a project application.
   *
   * @dev The `payout` function can be used to pay grants in two different ways:
   * - From a given address using `ERC20.transferFrom`
   * - From a Safe multisig using the [AllowanceModule](https://github.com/safe-global/safe-modules/tree/master/allowances)
   *
   * Using `transferFrom` only allow to pay with ERC20 tokens, and requires the indicated vault previously approved this
   * contract to use such ERC20 token on it behalf.
   *
   * The decision wether which flow it is used is handled by the `_payment.allowanceModule` parameter.
   * If the parameter is set to the address(0) then the function execute the `ERC20.transferFrom` flow, if not then it
   * follows the Safe multisig + AllowanceModule path.
   *
   * To complete the payment it is required for the project application to be on status ACCEPTED.
   *
   * @param _payment payment data
   */
  function payout(Payment calldata _payment) external nonReentrant isRoundOperator {
    uint256 currentStatus = RoundImplementation(roundAddress).getApplicationStatus(_payment.applicationIndex);
    if (currentStatus != uint256(RoundStatus.ACCEPTED)) revert DirectStrategy__payout_ApplicationNotAccepted();

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
    return _isPendingRoundApplication(applicationIndex)
      && _getApplicationInReviewStatus(applicationIndex) == uint256(Status.IN_REVIEW);
  }

  /// @notice Get application status
  /// @param applicationIndex index of the application
  /// @return status status of the application
  function _getApplicationInReviewStatus(uint256 applicationIndex) internal view returns(uint256) {
    uint256 rowIndex = applicationIndex / 256;
    uint256 colIndex = (applicationIndex % 256);

    uint256 currentRow = inReviewApplicationsBitMap[rowIndex];
    uint256 status = (currentRow >> colIndex) & 1;

    return status;
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

    return currentStatus == uint256(Status.PENDING);
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
}
