// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "./IRoundFactory.sol";
import "./IRoundImplementation.sol";
import "../strategies/BaseStrategy.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import "../utils/MetaPtr.sol";

/**
 * @notice Invoked by a RoundOperator to enable creation of a
 * round by cloning the RoundImplementation contract.
 * The factory contract emits an event anytime a round is created
 * which can be used to derive the round registry.
 *
 * @dev RoundFactory is deployed once per chain and stores
 * a reference to the deployed RoundImplementation.
 * @dev RoundFactory uses openzeppelin Clones to reduce deploy
 * costs and also allows upgrading RoundImplementationUpdated.
 * @dev This contract supports Access Control via AccessControlEnumerableUpgradeable
 *
 */
contract RoundFactory is IRoundFactory, AccessControlEnumerableUpgradeable {
    string public constant VERSION = "0.2.0";

    // --- Data ---

    /// @notice Address of the RoundImplementation contract
    address public roundImplementation;

    /// @notice Address of the Allo settings contract
    IAlloSettings public alloSettings;

    /// @notice Nonce used to generate deterministic salt for Clones
    uint256 public nonce;

    // --- Event ---

    /// @notice Emitted when allo settings contract is updated
    event AlloSettingsUpdated(IAlloSettings alloSettings);

    /// @notice Emitted when a Round implementation contract is updated
    event RoundImplementationUpdated(address roundImplementation);

    /// @notice Emitted when a new Round is created
    event RoundCreated(
        bytes32 indexed projectID,
        address indexed roundAddress,
        address indexed roundImplementation,
        address registry
    );

    /// @notice Emitted when a new Voting is created
    event StrategyContractCreated(
        address indexed roundAddress,
        address indexed strategyAddress,
        address indexed strategyImplementation
    );

    /// @notice constructor function which ensure deployer is set as owner
    function initialize() external initializer {
        __Context_init_unchained();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // --- Core methods ---

    /**
     * @notice Allows the owner to update the allo settings contract.
     *
     * @param newAlloSettings New allo settings contract address
     */
    function updateAlloSettings(
        IAlloSettings newAlloSettings
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        alloSettings = newAlloSettings;

        emit AlloSettingsUpdated(alloSettings);
    }

    /**
     * @notice Allows the owner to update the RoundImplementation.
     * This provides us the flexibility to upgrade RoundImplementation
     * contract while relying on the same RoundFactory to get the list of
     * rounds.
     *
     * @param newRoundImplementation New RoundImplementation contract address
     */
    function updateRoundImplementation(
        address payable newRoundImplementation
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            newRoundImplementation != address(0),
            "roundImplementation is 0x"
        );

        roundImplementation = newRoundImplementation;

        emit RoundImplementationUpdated(roundImplementation);
    }

    /**
     * @notice Clones RoundImplementation a new round and emits event
     *
     * @param projectIdentifier ID of project on the registry creating the round
     * @param strategyImplementation Address of the strategy implementation contract
     * @param encodedRoundParameters Encoded parameters for creating a round
     * @param encodedStrategyParameters Encoded parameters for creating a strategy
     */
    function create(
        bytes32 projectIdentifier,
        address strategyImplementation,
        bytes calldata encodedRoundParameters,
        bytes calldata encodedStrategyParameters
    ) external returns (address) {
        require(roundImplementation != address(0), "roundImplementation is 0x");
        require(address(alloSettings) != address(0), "alloSettings is 0x");
        require(
            alloSettings.isTrustedRegistry(msg.sender),
            "not trusted registry"
        );

        address roundClone = _createClone(roundImplementation);

        emit RoundCreated(
            projectIdentifier,
            roundClone,
            payable(roundImplementation),
            msg.sender
        );

        address strategyClone = _createClone(strategyImplementation);

        emit StrategyContractCreated(roundClone, strategyClone, strategyImplementation);

        IRoundImplementation(payable(roundClone)).initialize(
            encodedRoundParameters,
            encodedStrategyParameters,
            alloSettings,
            strategyClone
        );

        return roundClone;
    }

    function _createClone(address _impl) internal returns (address clone) {
        require(isContract(_impl), "not a contract");
        nonce++;
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, nonce));
        clone = ClonesUpgradeable.cloneDeterministic(_impl, salt);
    }

    function isContract(address _implementation) internal view returns (bool) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(_implementation)
        }
        return codeSize > 0;
    }
}
