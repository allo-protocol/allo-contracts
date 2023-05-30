// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "../settings/IAlloSettings.sol";
import "../utils/MetaPtr.sol";
import "../strategies/BaseStrategy.sol";

interface IRoundImplementation {
    struct ApplicationStatus {
        uint256 index;
        uint256 statusRow;
    }

    function initialize(
        bytes calldata _encodedRoundParameters,
        bytes calldata _encodedStrategyParameters,
        IAlloSettings _alloSettings,
        address _strategy
    ) external;

    function updateRoundMetaPtr(MetaPtr memory newRoundMetaPtr) external;

    function updateApplicationMetaPtr(
        MetaPtr memory newApplicationMetaPtr
    ) external;

    function updateStartAndEndTimes(
        uint256 newApplicationsStartTime,
        uint256 newApplicationsEndTime,
        uint256 newRoundStartTime,
        uint256 newRoundEndTime
    ) external;

    function applyToRound(
        bytes32 projectID,
        MetaPtr calldata newApplicationMetaPtr
    ) external;

    function getApplicationIndexesByProjectID(
        bytes32 projectID
    ) external view returns (uint256[] memory);

    function setApplicationStatuses(
        ApplicationStatus[] memory statuses
    ) external;

    function getApplicationStatus(
        uint256 applicationIndex
    ) external view returns (uint256);

    function vote(bytes[] memory encodedVotes) external payable;

    function withdraw(address tokenAddress, address payable recipent) external;

    function isRoundOperator(address operator) external view returns (bool);
}
