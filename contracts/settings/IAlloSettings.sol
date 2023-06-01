// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

interface IAlloSettings {
    function initialize() external;

    function getDenominator() external view returns (uint24);

    function getProtocolFeePercentage() external view returns (uint24);

    function getProtocolTreasury() external view returns (address payable);

    function updateProtocolFeePercentage(uint24 _protocolFeePercentage) external;

    function updateProtocolTreasury(uint24 _protocolFeePercentage) external;

    function isTrustedRegistry(address _registry) external view returns (bool);

}
