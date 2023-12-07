// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../utils/MetaPtr.sol";
import "./QuadraticFundingVotingStrategyImplementation.sol";

contract QuadraticFundingVotingStrategyFactoryZk is OwnableUpgradeable {

  // --- Event ---

  /// @notice Emitted when a new Voting is created
  event VotingContractCreated(address indexed votingContractAddress, address indexed votingImplementation);


  /// @notice constructor function which ensure deployer is set as owner
  function initialize() external initializer {
    __Context_init_unchained();
    __Ownable_init_unchained();
  }

  // --- Core methods ---

  /**
   * @notice Clones QuadraticFundingVotingStrategyImplementation and deploys a contract
   * and emits an event
   */
  function create() external returns (address) {

    address impl = address(new QuadraticFundingVotingStrategyImplementation());
    emit VotingContractCreated(impl, address(0));
    QuadraticFundingVotingStrategyImplementation(impl).initialize();

    return impl;
  }
}
