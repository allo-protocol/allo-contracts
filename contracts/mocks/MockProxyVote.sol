// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "../round/RoundImplementation.sol";

contract MockProxyVote {
    RoundImplementation roundImplementation;

    constructor(address payable _roundImplementationAddress) {
        roundImplementation = RoundImplementation(_roundImplementationAddress);
    }

    function proxyVote(bytes[] memory encodedVotes) external payable {
        // Forward the call to the vote function of the RoundImplementation contract
        roundImplementation.vote{value: msg.value}(encodedVotes);
    }
}
