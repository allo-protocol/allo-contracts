// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AlloSettings is OwnableUpgradeable {

  string public constant VERSION = "1.0.0";

  // --- Data ---

  /// @notice Address of the protocol treasury
  address payable public protocolTreasury;

  /// @notice Protocol fee percentage
  uint8 public protocolFeePercentage;

  // --- Event ---

  /// @notice Emitted when protocol fee percentage is updated
  event ProtocolFeePercentageUpdated(uint8 protocolFeePercentage);

  /// @notice Emitted when a protocol wallet address is updated
  event ProtocolTreasuryUpdated(address protocolTreasuryAddress);

  /// @notice constructor function which ensure deployer is set as owner
  function initialize() external initializer {
    __Context_init_unchained();
    __Ownable_init_unchained();
  }

  // --- Core methods ---

  /// @notice Set the protocol fee percentage
  /// @param _protocolFeePercentage The new protocol fee percentage
  function updateProtocolFeePercentage(uint8 _protocolFeePercentage) external onlyOwner {
    protocolFeePercentage = _protocolFeePercentage;
    emit ProtocolFeePercentageUpdated(protocolFeePercentage);
  }

  /// @notice Set the protocol treasury address
  /// @param _protocolTreasury The new protocol treasury address
  function updateProtocolTreasury(address payable _protocolTreasury) external onlyOwner {
    protocolTreasury = _protocolTreasury;
    emit ProtocolTreasuryUpdated(protocolTreasury);
  }

}