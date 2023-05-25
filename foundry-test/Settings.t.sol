pragma solidity 0.8.17;

import "forge-std/Test.sol";

contract ContractBTest is Test {
    uint256 public testNumber;

    function setUp() public {
        testNumber = 42;
    }

    function testNumberIs42() public {
        assertEq(testNumber, 42);
    }

    function testFailSubtract43() public {
        testNumber -= 43;
    }
}
