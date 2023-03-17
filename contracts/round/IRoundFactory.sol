// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

interface IRoundFactory {
    function initialize() external;

    function updateProtocolFeePercentage(
        uint8 newProtocolFeePercentage
    ) external;

    function updateProtocolTreasury(
        address payable newProtocolTreasury
    ) external;

    function updateRoundContract(address payable newRoundContract) external;

    function create(
        bytes calldata encodedParameters,
        address ownedBy
    ) external returns (address);

    function getRoundContract() external view returns (address);

    function getProtocolTreasury() external view returns (address payable);

    function getProtocolFeePercentage() external view returns (uint8);
}
