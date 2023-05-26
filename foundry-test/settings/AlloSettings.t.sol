// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import { Test } from "forge-std/Test.sol";
import { AlloSettings } from "../../contracts/settings/AlloSettings.sol";

contract AlloSettingsTest is Test {
  AlloSettings public alloSettings;
  address payable public newProtocolTreasury;

  function setUp() public {
    alloSettings = new AlloSettings();
    alloSettings.initialize();
    newProtocolTreasury = payable(address(0x123));
  }

  function testUpdateProtocolFeePercentage() public {
    uint24 newProtocolFeePercentage = 50000; // 50%
    alloSettings.updateProtocolFeePercentage(newProtocolFeePercentage);

    uint24 updatedProtocolFeePercentage = alloSettings.protocolFeePercentage();
    assertEq(
      updatedProtocolFeePercentage,
      newProtocolFeePercentage,
      "The updated protocol fee percentage does not match the new value"
    );
  }

  function testUpdateProtocolTreasury() public {
    alloSettings.updateProtocolTreasury(newProtocolTreasury);

    address updatedProtocolTreasury = alloSettings.protocolTreasury();
    assertEq(
      updatedProtocolTreasury,
      newProtocolTreasury,
      "The updated protocol treasury address does not match the new address"
    );
  }

  function testFailUpdateProtocolFeePercentageOverLimit() public {
    vm.expectRevert("value exceeds 100%");

    uint24 newProtocolFeePercentage = 150000; // 150%, should fail as it exceeds 100%
    alloSettings.updateProtocolFeePercentage(newProtocolFeePercentage);
  }
}