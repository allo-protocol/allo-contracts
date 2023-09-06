// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "./DirectPayoutStrategyImplementation.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../../utils/MetaPtr.sol";

contract DirectPayoutStrategyFactory is OwnableUpgradeable {

  // --- Data ---

  address payable public payoutImplementation;

  uint256 public nonce;

  // --- Event ---

  /// @notice Emitted when payoutImplementation is updated
  event PayoutImplementationUpdated(address directPayoutStrategyAddress);

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
   * @notice Allows the owner to update the payoutImplementation.
   * This provides us the flexibility to upgrade DirectPayoutStrategyImplementation
   * contract while relying on the same DirectPayoutStrategyFactory to get the list of
   * DirectPayout contracts.
   *
   * @param newPayoutImplementation - address of the new payoutImplementation
   */
  function updatePayoutImplementation(address payable newPayoutImplementation) external onlyOwner {

    payoutImplementation = newPayoutImplementation;

    emit PayoutImplementationUpdated(newPayoutImplementation);
  }

  /**
   * @notice Clones DirectPayoutStrategyImplementation and deploys a contract
   * and emits an event
   */
  function create() external returns (address) {

    nonce++;

    bytes32 salt = keccak256(abi.encodePacked(msg.sender, nonce));
    address clone = ClonesUpgradeable.cloneDeterministic(payoutImplementation, salt);

    DirectPayoutStrategyImplementation(payable(clone)).initialize();
    emit PayoutContractCreated(clone, payoutImplementation);

    return clone;
  }

}
