// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Test } from "forge-std/Test.sol";
import { RoundFactory } from "../../contracts/round/RoundFactory.sol";
import { RoundImplementation } from "../../contracts/round/RoundImplementation.sol";

contract RoundFactoryTest is Test {
  RoundFactory private _roundFactory;
  RoundImplementation private _roundImplementation;

  // encode parameters for RoundImplementation.initialize()
  uint8 private _protocol = 1;
  string public constant POINTER = "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am";
  address private _alloSettings;
  address[] private _adminRoles;
  address[] private _programOperators;

  bytes private _encodedParameters;

  function setUp() public {
    _roundFactory = new RoundFactory();
    _roundFactory.initialize();
    _roundImplementation = new RoundImplementation();

    // Set up alloSettings
    // Put a valid AlloSettings contract address here.
    _alloSettings = address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0);
    _roundFactory.updateAlloSettings(_alloSettings);

    // setup dummy addresses for roles and operators
    _adminRoles = new address[](1);
    _adminRoles[0] = 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42;
    _programOperators = new address[](2);
    _programOperators[0] = 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42;
    _programOperators[1] = 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42;

    _encodedParameters = abi.encode(_protocol, POINTER, _adminRoles, _programOperators);
  }

  function testUpdateRoundImplementation() public {
    address newRoundImplementation = address(_roundImplementation);
    _roundFactory.updateRoundImplementation(payable(newRoundImplementation));

    address updatedRoundImplementation = _roundFactory.roundImplementation();
    assertTrue(
      updatedRoundImplementation == newRoundImplementation,
      "The updated round implementation address does not match the new address"
    );
  }

  // todo: fails with a revert
  // function testCreate() public {
  //   _roundFactory.updateRoundImplementation(payable(address(_roundImplementation)));

  //   address roundClone = _roundFactory.create(_encodedParameters, 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42);
  //   assertTrue(roundClone != address(0), "Failed to create a new RoundImplementation contract");

  //   // Check if the created contract is a clone of the roundImplementation contract
  //   assertTrue(
  //     keccak256(abi.encodePacked(roundClone)) == keccak256(abi.encodePacked(address(_roundImplementation))),
  //     "The cloned contract's bytecode does not match the original contract's bytecode"
  //   );
  // }
}
