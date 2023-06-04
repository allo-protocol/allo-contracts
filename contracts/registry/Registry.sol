// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import "../round/IRoundFactory.sol";
import "../utils/MetaPtr.sol";

/**
 * @title Registry
 */
contract Registry is Initializable, AccessControlEnumerableUpgradeable {
    // Types

    // The project structs contains the minimal data we need for a project
    struct Project {
        bytes32 projectID;
        MetaPtr projectMetadata;
        MetaPtr programMetadata;
    }

    enum MetadataType {
        ProjectMetadata,
        ProgramMetadata
    }

    // State variables

    // The number of projects in the registry
    uint256 public projectsCount;

    // The mapping from projectID to Project
    mapping(bytes32 => Project) public projects;

    // Errors

    error ProgramMetadataIsEmpty();

    // Events

    /**
     * @dev Emitted when a project is created.
     * @param projectID The ID of the project.
     * @param owner The address of the owner of the project.
     */
    event ProjectCreated(bytes32 indexed projectID, address indexed owner);

    /**
     * @dev Emitted when metadata is updated for a project or program.
     * @param projectID The ID of the project or program.
     * @param metadata The metadata pointer.
     * @param metadataType The type of metadata: 0 for projectMetadata, 1 for programMetadata.
     */
    event MetadataUpdated(
        bytes32 indexed projectID,
        MetaPtr metadata,
        MetadataType metadataType
    );

    /**
     * @notice Initializes the contract after an upgrade
     * @dev In future deploys of the implementation, an higher version should be passed to reinitializer
     */
    function initialize() public reinitializer(1) {}

    // External functions

    /**
     * @notice Creates a new project with a metadata pointer
     * @param projectOwners the owners of the project
     * @param projectMetadata the metadata pointer
     * @param programMetadata the program metadata pointer
     */
    function createProject(
        address[] memory projectOwners,
        MetaPtr calldata projectMetadata,
        MetaPtr calldata programMetadata
    ) external returns (bytes32 projectID) {
        projectID = createProjectIdentifier();

        Project storage project = projects[projectID];

        project.projectID = projectID;

        // Initialize project owners
        _grantRole(projectID, msg.sender);
        for (uint256 i = 0; i < projectOwners.length; i++) {
            _grantRole(projectID, projectOwners[i]);
        }

        if (projectMetadata.protocol != 0) {
            project.projectMetadata = projectMetadata;
            emit MetadataUpdated(
                projectID,
                projectMetadata,
                MetadataType.ProjectMetadata
            );
        }

        if (programMetadata.protocol != 0) {
            project.programMetadata = programMetadata;
            emit MetadataUpdated(
                projectID,
                programMetadata,
                MetadataType.ProgramMetadata
            );
        }

        emit ProjectCreated(projectID, msg.sender);
    }

    /**
     * @notice Updates Metadata for project
     * @param projectID ID of project
     * @param projectMetadata Updated pointer to project metadata
     */
    function updateProjectMetadata(
        bytes32 projectID,
        MetaPtr calldata projectMetadata
    ) external onlyRole(projectID) {
        projects[projectID].projectMetadata = projectMetadata;
        emit MetadataUpdated(
            projectID,
            projectMetadata,
            MetadataType.ProjectMetadata
        );
    }

    /**
     * @notice Updates Metadata for singe project
     * @param projectID ID of project
     * @param programMetadata Updated pointer to project programMetadata
     */
    function updateProgramMetadata(
        bytes32 projectID,
        MetaPtr calldata programMetadata
    ) external onlyRole(projectID) {
        projects[projectID].programMetadata = programMetadata;
        emit MetadataUpdated(
            projectID,
            programMetadata,
            MetadataType.ProgramMetadata
        );
    }

    /**
     * @notice Adds Owner to Project
     * @param projectID ID of project
     * @param owner new owner
     */
    function addOwner(
        bytes32 projectID,
        address owner
    ) external onlyRole(projectID) {
        _grantRole(projectID, owner);
    }

    /**
     * @notice Remove owner from Project
     * @param projectID ID of project
     * @param owner owner to be removed
     */
    function removeOwner(
        bytes32 projectID,
        address owner
    ) external onlyRole(projectID) {
        _revokeRole(projectID, owner);
    }

    /**
     * @notice Create a new round for a project
     * @param roundFactory Address of round factory
     * @param projectID ID of project creating the round
     * @param encodedRoundParameters Encoded parameters for round creation
     * @param encodedStrategyParameters Encoded parameters for strategy creation
     */
    function createRound(
        IRoundFactory roundFactory,
        bytes32 projectID,
        address strategyImplementation,
        bytes calldata encodedRoundParameters,
        bytes calldata encodedStrategyParameters
    ) external onlyRole(projectID) returns (address) {
        if (projects[projectID].programMetadata.protocol == 0) {
            revert ProgramMetadataIsEmpty();
        }

        return
            roundFactory.create(
                projectID,
                strategyImplementation,
                encodedRoundParameters,
                encodedStrategyParameters
            );
    }

    /**
     * @dev Creates a unique project identifier based on the registry, chainId and projectID.
     * @return The computed unique identifier (bytes32).
     */
    function createProjectIdentifier() internal returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(block.chainid, address(this), projectsCount++)
            );
    }
}
