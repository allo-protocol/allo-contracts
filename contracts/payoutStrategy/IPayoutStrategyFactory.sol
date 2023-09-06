// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

interface IPayoutStrategyFactory {
    function initialize() external;

    function updatePayoutImplementation(
        address payable newPayoutImplementation
    ) external;

    function create() external returns (address);
}