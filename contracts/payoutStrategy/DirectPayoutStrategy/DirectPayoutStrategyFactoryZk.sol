// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "./DirectPayoutStrategyImplementation.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../../utils/MetaPtr.sol";

contract DirectPayoutStrategyFactoryZk is OwnableUpgradeable {

  // --- Event ---

  /// @notice Emitted when a new payout contract is created
  event PayoutContractCreated(
    address indexed payoutContractAddress,
    address indexed payoutImplementation
  );

  /// @notice constructor function which ensure deployer is set as owner
  function initialize() external initializer {
    __Context_init_unchained();
    __Ownable_init_unchained();
  }

  // --- Core methods ---

  /**
   * @notice Clones DirectPayoutStrategyImplementation and deploys a contract
   * and emits an event
   */
  function create() external returns (address) {

    address impl = address(new DirectPayoutStrategyImplementation());
    DirectPayoutStrategyImplementation(payable(impl)).initialize();
    emit PayoutContractCreated(impl, address(0));

    return impl;
  }

}
