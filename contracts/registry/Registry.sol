// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../round/IRoundFactory.sol";
import "../utils/MetaPtr.sol";

import "hardhat/console.sol";

/**
 * @title Registry
 */
contract Registry is Initializable {
    // Types

    // The project structs contains the minimal data we need for a project
    struct Project {
        uint256 id;
        MetaPtr projectMetadata;
        MetaPtr programMetadata;
    }

    // A linked list of owners of a project
    // The use of a linked list allows us to easily add and remove owners,
    // access them directly in O(1), and loop through them.
    //
    // {
    //     count: 3,
    //     list: {
    //         OWNERS_LIST_SENTINEL => owner1Address,
    //         owner1Address => owner2Address,
    //         owner2Address => owner3Address,
    //         owner3Address => OWNERS_LIST_SENTINEL
    //     }
    // }
    struct OwnerList {
        uint256 count;
        mapping(address => address) list;
    }

    // State variables

    // Used as sentinel value in the owners linked list.
    address constant OWNERS_LIST_SENTINEL = address(0x1);

    // The number of projects created, used to give an incremental id to each one
    uint256 public projectsCount;

    // The mapping of projects, from projectID to Project
    mapping(uint256 => Project) public projects;

    // The mapping projects owners, from projectID to OwnerList
    mapping(uint256 => OwnerList) public projectsOwners;

    // Events

    /**
     * @dev Emitted when a project is created.
     * @param projectID The ID of the project.
     * @param owner The address of the owner of the project.
     */
    event ProjectCreated(uint256 indexed projectID, address indexed owner);

    /**
     * @dev Emitted when metadata is updated for a project or program.
     * @param projectID The ID of the project or program.
     * @param metadata The metadata pointer.
     * @param metadataType The type of metadata: 0 for projectMetadata, 1 for programMetadata.
     */
    event MetadataUpdated(
        uint256 indexed projectID,
        MetaPtr metadata,
        uint8 metadataType
    );

    /**
     * @dev Emitted when an owner is added to a project.
     * @param projectID The ID of the project.
     * @param owner The address of the owner added.
     */
    event OwnerAdded(uint256 indexed projectID, address indexed owner);

    /**
     * @dev Emitted when an owner is removed from a project.
     * @param projectID The ID of the project.
     * @param owner The address of the owner removed.
     */
    event OwnerRemoved(uint256 indexed projectID, address indexed owner);

    // Modifiers

    modifier onlyProjectOwner(uint256 projectID) {
        require(
            projectsOwners[projectID].list[msg.sender] != address(0),
            "PR000"
        );
        _;
    }

    /**
     * @notice Initializes the contract after an upgrade
     * @dev In future deploys of the implementation, an higher version should be passed to reinitializer
     */
    function initialize() public reinitializer(1) {}

    // External functions

    /**
     * @notice Check if an address is an owner of a project
     * @param projectID ID of previously created project
     * @param owner address to check
     */
    function isProjectOwner(
        uint256 projectID,
        address owner
    ) external view returns (bool) {
        return projectsOwners[projectID].list[owner] != address(0);
    }

    /**
     * @notice Creates a new project with a metadata pointer
     * @param projectMetadata the metadata pointer
     * @param programMetadata the program metadata pointer
     */
    function createProject(
        MetaPtr calldata projectMetadata,
        MetaPtr calldata programMetadata
    ) external returns (uint256 projectID) {
        projectID = projectsCount++;

        Project storage project = projects[projectID];
        project.id = projectID;

        initProjectOwners(projectID);

        if (projectMetadata.protocol != 0) {
            project.projectMetadata = projectMetadata;
            emit MetadataUpdated(projectID, projectMetadata, 0);
        }

        if (programMetadata.protocol != 0) {
            project.programMetadata = programMetadata;
            emit MetadataUpdated(projectID, programMetadata, 1);
        }

        emit ProjectCreated(projectID, msg.sender);
    }

    /**
     * @notice Updates Metadata for singe project
     * @param projectID ID of previously created project
     * @param projectMetadata Updated pointer to project metadata
     */
    function updateProjectMetadata(
        uint256 projectID,
        MetaPtr calldata projectMetadata
    ) external onlyProjectOwner(projectID) {
        projects[projectID].projectMetadata = projectMetadata;
        emit MetadataUpdated(projectID, projectMetadata, 0);
    }

    /**
     * @notice Updates Metadata for singe project
     * @param projectID ID of previously created project
     * @param programMetadata Updated pointer to project programMetadata
     */
    function updateProgramMetadata(
        uint256 projectID,
        MetaPtr calldata programMetadata
    ) external onlyProjectOwner(projectID) {
        projects[projectID].programMetadata = programMetadata;
        emit MetadataUpdated(projectID, programMetadata, 1);
    }

    /**
     * @notice Associate a new owner with a project
     * @param projectID ID of previously created project
     * @param newOwner address of new project owner
     */
    function addProjectOwner(
        uint256 projectID,
        address newOwner
    ) external onlyProjectOwner(projectID) {
        require(
            newOwner != address(0) &&
                newOwner != OWNERS_LIST_SENTINEL &&
                newOwner != address(this),
            "PR001"
        );

        OwnerList storage owners = projectsOwners[projectID];

        require(owners.list[newOwner] == address(0), "PR002");

        owners.list[newOwner] = owners.list[OWNERS_LIST_SENTINEL];
        owners.list[OWNERS_LIST_SENTINEL] = newOwner;
        owners.count++;

        emit OwnerAdded(projectID, newOwner);
    }

    /**
     * @notice Disassociate an existing owner from a project
     * @param projectID ID of previously created project
     * @param prevOwner Address of previous owner in OwnerList
     * @param owner Address of new Owner
     */
    function removeProjectOwner(
        uint256 projectID,
        address prevOwner,
        address owner
    ) external onlyProjectOwner(projectID) {
        require(owner != address(0) && owner != OWNERS_LIST_SENTINEL, "PR001");

        OwnerList storage owners = projectsOwners[projectID];

        require(owners.list[prevOwner] == owner, "PR003");
        require(owners.count > 1, "PR004");

        owners.list[prevOwner] = owners.list[owner];
        delete owners.list[owner];
        owners.count--;

        emit OwnerRemoved(projectID, owner);
    }

    // Public functions

    /**
     * @notice Retrieve count of existing project owners
     * @param projectID ID of project
     * @return Count of owners for given project
     */
    function projectOwnersCount(
        uint256 projectID
    ) external view returns (uint256) {
        return projectsOwners[projectID].count;
    }

    /**
     * @notice Retrieve list of project owners
     * @param projectID ID of project
     * @return List of current owners of given project
     */
    function getProjectOwners(
        uint256 projectID
    ) external view returns (address[] memory) {
        OwnerList storage owners = projectsOwners[projectID];

        address[] memory list = new address[](owners.count);

        uint256 index = 0;
        address current = owners.list[OWNERS_LIST_SENTINEL];

        if (current == address(0x0)) {
            return list;
        }

        while (current != OWNERS_LIST_SENTINEL) {
            list[index] = current;
            current = owners.list[current];
            index++;
        }

        return list;
    }

    // Internal functions

    /**
     * @notice Create initial OwnerList for passed project
     * @param projectID ID of project
     */
    function initProjectOwners(uint256 projectID) internal {
        OwnerList storage owners = projectsOwners[projectID];

        owners.list[OWNERS_LIST_SENTINEL] = msg.sender;
        owners.list[msg.sender] = OWNERS_LIST_SENTINEL;
        owners.count = 1;

        emit OwnerAdded(projectID, msg.sender);
    }

    /**
     * @notice Create a new round for a project
     * @param projectID project creating the round
     * @param encodedParameters Encoded parameters for round creation
     */
    function createRound(
        IRoundFactory roundFactory,
        uint256 projectID,
        bytes calldata encodedParameters
    ) external onlyProjectOwner(projectID) returns (address) {
        require(projects[projectID].programMetadata.protocol != 0, "PR005");
        return
            roundFactory.create(createProjectId(projectID), encodedParameters);
    }

    /**
     * @dev Creates a unique identifier for a project.
     * @param projectId The ID of the project.
     * @return The computed unique identifier (bytes32).
     */
    function createProjectId(
        uint256 projectId
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(block.chainid, address(this), projectId)
            );
    }
}
