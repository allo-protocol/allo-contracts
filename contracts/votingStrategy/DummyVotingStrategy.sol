// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "./IVotingStrategy.sol";

/**
 * Dummy Voting strategy used for creating Rounds without voting process
 */
contract DummyVotingStrategy is IVotingStrategy {
  function init() external override {}
  function vote(bytes[] calldata _encodedVotes, address _voterAddress) external override payable {}
}
