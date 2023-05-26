// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import { Test } from "forge-std/Test.sol";
import { ProgramFactory } from "../../contracts/program/ProgramFactory.sol";
import { ProgramImplementation } from "../../contracts/program/ProgramImplementation.sol";

contract ProgramFactoryTest is Test {
  ProgramFactory private programFactory;
  ProgramImplementation private programImplementation;

  // encode parameters for ProgramImplementation.initialize()
  uint8 private protocol = 1;
  string private constant POINTER = "bafybeif43xtcb7zfd6lx7rfq42wjvpkbqgoo7qxrczbj4j4iwfl5aaqv2q";

  bytes private _encodedParameters;

  function setUp() public {
    programFactory = new ProgramFactory();
    programFactory.initialize();
    programImplementation = new ProgramImplementation();

    address[] memory adminRoles = new address[](1);
    adminRoles[0] = 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42;
    address[] memory programOperators = new address[](2);
    programOperators[0] = 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42;
    programOperators[1] = 0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42;

    bytes memory encodedParameters = abi.encode(protocol, POINTER, adminRoles, programOperators);
    _encodedParameters = encodedParameters;
  }

  function testUpdateProgramContract() public {
    address newProgramContract = address(programImplementation);
    programFactory.updateProgramContract(newProgramContract);

    address updatedProgramContract = programFactory.programContract();
    assertTrue(
      updatedProgramContract == newProgramContract,
      "The updated program contract address does not match the new address"
    );
  }

  // todo: fails with a revert
  // function testCreate() public {
  //   programFactory.updateProgramContract(address(programImplementation));

  //   address programClone = programFactory.create(_encodedParameters);
  //   assertTrue(programClone != address(0), "Failed to create a new ProgramImplementation contract");

  //   // Check if the created contract is a clone of the programImplementation contract
  //   assertTrue(
  //     keccak256(abi.encodePacked(programClone)) == keccak256(abi.encodePacked(address(programImplementation))),
  //     "The cloned contract's bytecode does not match the original contract's bytecode"
  //   );
  // }
}
