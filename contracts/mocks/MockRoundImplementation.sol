// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;
import "../round/RoundImplementation.sol";
import "../payoutStrategy/IPayoutStrategy.sol";

contract MockRoundImplementation is RoundImplementation {

  function mockSetReadyForPayout() external payable {
    IPayoutStrategy(payoutStrategy).setReadyForPayout();
  }
}