// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "./RoundImplementation.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../utils/MetaPtr.sol";


contract RoundFactoryZk is OwnableUpgradeable {

  // --- Data ---

  /// @notice Address of the Allo settings contract
  address public alloSettings;

  // --- Event ---

  /// @notice Emitted when allo settings contract is updated
  event AlloSettingsUpdated(address alloSettings);

  /// @notice Emitted when a new Round is created
  event RoundCreated(
    address indexed roundAddress,
    address indexed ownedBy,
    address indexed roundImplementation
  );

  /// @notice constructor function which ensure deployer is set as owner
  function initialize() external initializer {
    __Context_init_unchained();
    __Ownable_init_unchained();
  }

  // --- Core methods ---

  /**
   * @notice Allows the owner to update the allo settings contract.
   *
   * @param newAlloSettings New allo settings contract address
   */
  function updateAlloSettings(address newAlloSettings) external onlyOwner {
    alloSettings = newAlloSettings;

    emit AlloSettingsUpdated(alloSettings);
  }

  /**
   * @notice Clones RoundImplementation a new round and emits event
   *
   * @param encodedParameters Encoded parameters for creating a round
   * @param ownedBy Program which created the contract
   */
  function create(
    bytes calldata encodedParameters,
    address ownedBy
  ) external returns (address) {

    require(alloSettings != address(0), "alloSettings is 0x");

    address impl = address(new RoundImplementation());
    emit RoundCreated(impl, ownedBy, address(0));
    RoundImplementation(payable(impl)).initialize(
      encodedParameters,
      alloSettings
    );

    return impl;
  }
}
