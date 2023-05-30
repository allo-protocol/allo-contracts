// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "../round/IRoundImplementation.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @notice Defines the abstract contract for voting algorithms on grants
 * within a round. Any new voting algorithm would be expected to
 * extend this abstract contract.
 * Every BaseStrategy contract would be unique to RoundImplementation
 * and would be deployed before creating a round
 */
abstract contract BaseStrategy is Initializable {
    // --- Data ---

    /// @notice Round address
    address payable public roundAddress;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // --- Modifier ---

    /// @notice modifier to check if sender is round contract.
    modifier isRoundContract() {
        require(
            roundAddress != address(0),
            "error: voting contract not linked to a round"
        );
        require(
            msg.sender == roundAddress,
            "error: can be invoked only by round contract"
        );
        _;
    }

    /// @notice modifier to check if sender is round operator.
    modifier isRoundOperator() {
        require(
            IRoundImplementation(roundAddress).isRoundOperator(msg.sender),
            "not round operator"
        );
        _;
    }

    // --- Core methods ---

    /**
     * @notice Invoked by RoundImplementation on creation to
     * set the round for which the voting contracts is to be used
     *
     */
    function initialize(bytes calldata _encodedParams) external initializer {
        require(roundAddress == address(0), "init: roundAddress already set");
        roundAddress = payable(msg.sender);
        _initialize(_encodedParams);
    }

    /**
     * @notice This function can be overwritten by derived contracts.
     *  It is used to initialize the strategy with any additional parameters that may be required.
     *  The parameters can be passed during the creation of each round.
     * @param _encodedParams The encoded parameters passed during round creation.
     */
    function _initialize(bytes calldata _encodedParams) internal virtual {
        _encodedParams; // silence unused variable compiler warning
    }

    /**
     * @notice Invoked by RoundImplementation to allow voter to case
     * vote for grants during a round.
     *
     * @dev
     * - allows contributor to do cast multiple votes which could be weighted.
     * - should be invoked by RoundImplementation contract
     * - ideally BaseStrategy implementation should emit events after a vote is cast
     * - this would be triggered when a voter casts their vote via grant explorer
     *
     * @param _encodedVotes encoded votes
     * @param _voterAddress voter address
     */
    function vote(
        bytes[] calldata _encodedVotes,
        address _voterAddress
    ) external payable virtual;

    /**
     * @notice Returns the version of the contract
     * @dev This function needs to be implemented by the child contract
     */
    function _version() internal pure virtual returns (string memory);

    /**
     * @notice Returns the version of the contract
     */
    function version() external pure returns (string memory) {
        return _version();
    }

    /// @notice Emitted when a new vote is sent
    event Voted(
        address token, // voting token
        uint256 amount, // voting amount
        address indexed voter, // voter address
        address grantAddress, // grant address
        bytes32 indexed projectId, // project id
        uint256 applicationIndex, // application index
        address indexed roundAddress // round address
    );
}
