// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "../utils/MetaPtr.sol";
import "../round/RoundImplementation.sol";

/**
 * @notice Defines the abstract contract for payout strategies
 * for a round. Any new payout strategy would be expected to
 * extend this abstract contract.
 *
 * Every PayoutStrategyImplementation contract would be unique to RoundImplementation
 * and would be deployed before creating a round.
 *
 * @dev
 *  - Deployed before creating a round
 *  - Funds are transferred to the payout contract from round only during payout
 */
abstract contract IPayoutStrategy {

  // --- Constants ---

  /// @notice round operator role
  bytes32 public constant ROUND_OPERATOR_ROLE = keccak256("ROUND_OPERATOR");

  // --- Data ---

  /// @notice RoundImplementation address
  address payable public roundAddress;

  /// @notice Token address
  address public tokenAddress;

  // @notice
  bool public isReadyForPayout;

  // --- Event ---

  /// @notice Emitted when contract is ready for payout
  event ReadyForPayout();

  // --- Modifier ---

  /// @notice modifier to check if sender is round contract.
  modifier isRoundContract() {
    require(roundAddress != address(0), "not linked to a round");
    require(msg.sender == roundAddress, "not invoked by round");
    _;
  }

  /// @notice modifier to check if sender is round operator.
  modifier isRoundOperator() {
    require(
      RoundImplementation(roundAddress).hasRole(ROUND_OPERATOR_ROLE, msg.sender),
      "not round operator"
    );
    _;
  }

  /// @notice modifier to check if round has ended.
  modifier roundHasEnded() {
    uint roundEndTime = RoundImplementation(roundAddress).roundEndTime();
    require(block.timestamp > roundEndTime, "round has not ended");
    _;
  }

  // --- Core Methods ---

  /**
   * @notice Invoked by RoundImplementation on creation to
   * set the round for which the payout strategy is to be used
   */
  function init() external virtual {
    require(roundAddress == address(0x0), "roundAddress already set");
    roundAddress = payable(msg.sender);

    // set the token address
    tokenAddress = RoundImplementation(roundAddress).token();

    isReadyForPayout = false;
  }

  /// @notice Invoked by RoundImplementation to set isReadyForPayout
  /// @dev Can only be called once and (by default) cannot be changed once called
  function setReadyForPayout() virtual external payable isRoundContract roundHasEnded {
    require(isReadyForPayout == false, "isReadyForPayout already set");

    isReadyForPayout = true;
    emit ReadyForPayout();
  }

  receive() external payable {}
}
