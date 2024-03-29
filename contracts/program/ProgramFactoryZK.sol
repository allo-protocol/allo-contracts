// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ProgramImplementation.sol";

contract ProgramFactoryZk is OwnableUpgradeable {
 
  // --- Event ---

  /// @notice Emitted when a new Program is created
  event ProgramCreated(address indexed programContractAddress, address indexed programImplementation);

  /// @notice constructor function which ensure deployer is set as owner
  function initialize() external initializer {
    __Context_init_unchained();
    __Ownable_init_unchained();
  }

  // --- Core methods ---

  /**
   * @notice Clones ProgramImplmentation and deployed a program and emits an event
   *
   * @param encodedParameters Encoded parameters for creating a program
   */
  function create(
    bytes calldata encodedParameters
  ) external returns (address) {

    address impl = address(new ProgramImplementation());
    emit ProgramCreated(impl, address(0));
    ProgramImplementation(impl).initialize(encodedParameters);

    return impl;
  }
}
