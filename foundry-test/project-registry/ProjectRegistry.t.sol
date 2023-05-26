// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Test } from "forge-std/Test.sol";
import { ProjectRegistry } from "../../contracts/projectRegistry/ProjectRegistry.sol";
import { MetaPtr } from "../../contracts/utils/MetaPtr.sol";

contract ExpectEmit {
  event ProjectCreated(uint256 projectID, MetaPtr metadata);
  event MetadataUpdated(uint256 projectID, MetaPtr metadata);
  event OwnerAdded(uint256 projectID, address owner);
  event OwnerRemoved(uint256 projectID, address owner);

  function project() public {
    emit ProjectCreated(0, MetaPtr(1, "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am"));
    emit MetadataUpdated(0, MetaPtr(1, "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am"));
  }

  function owner() public {
    emit OwnerAdded(0, address(0x123));
    emit OwnerRemoved(0, address(0x123));
  }
}

contract ProjectRegistryTest is Test, ExpectEmit {
  ProjectRegistry private _projectRegistry;

  function setUp() public {
    _projectRegistry = new ProjectRegistry();
    _projectRegistry.initialize();
  }

  function createProject() public {
    // MetaPtr memory metadata = MetaPtr(1, "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am");
    // _projectRegistry.createProject(metadata);
    // uint256 projectId = 0;
    // ProjectRegistry.Project memory project = _projectRegistry.projects(projectId);
    // assertTrue(project.id == projectId, "Project id does not match");
    // assertTrue(project.metadata.protocol == 1, "Metadata protocol does not match");
    // assertTrue(keccak256(bytes(project.metadata.pointer)) ==
    //   keccak256(bytes("bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am")), "Metadata pointer does not match");
  }

  function testCreateProject() public {
    createProject();
  }

  function testExpectEmitProjectCreated() public {
    MetaPtr memory metadata = MetaPtr(1, "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am");
    _projectRegistry.createProject(metadata);

    ExpectEmit emitter = new ExpectEmit();
    
    vm.expectEmit(true, true, false, true);
    emit ProjectCreated(0, metadata);
    emitter.project();
  }


  function testExpectEmitMetadataUpdated() public {
     MetaPtr memory metadata = MetaPtr(1, "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am");
    _projectRegistry.createProject(metadata);

    ExpectEmit emitter = new ExpectEmit();
    
    vm.expectEmit(true, true, false, true);
    emit MetadataUpdated(0, metadata);
    emitter.project();
  }

  // todo: revert if not the owner
  function testUpdateProjectMetadataRevert() public {
    // vm.prank(address(0));
    // MetaPtr memory newMetadata = MetaPtr(1, "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetoqaaa2fxqryzysaia");
    // _projectRegistry.updateProjectMetadata(0, newMetadata);

    // vm.expectRevert("ProjectRegistry: Only owner can update project metadata");
  }

  function testUpdateProjectMetadataOnlyOwner() public {
    // MetaPtr memory metadata = MetaPtr(1, "bafybeif43xtcb7zfd6lx7q3knx7m6yecywtzxlh2d2jxqcgktvj4z2o3am");
    // _projectRegistry.createProject(metadata);
    // MetaPtr memory newMetadata = MetaPtr(1, "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetoqaaa2fxqryzysaia");
    // _projectRegistry.updateProjectMetadata(0, newMetadata);
    // uint256 projectId = 0;
    // ProjectRegistry.Project memory project = _projectRegistry.projects(projectId);
    // assertTrue(project.metadata.protocol == 1, "Updated metadata protocol does not match");
    // assertTrue(keccak256(bytes(project.metadata.pointer)) ==
    //   keccak256(bytes("bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetoqaaa2fxqryzysaia")), "Updated metadata pointer does not match");
  }

  function testAddProjectOwner() public {
    // todo: test addProjectOwner
    // uint256 projectID = 0;
    // address newOwner = address(0x123);
    // _projectRegistry.addProjectOwner(projectID, newOwner);
  }

  function testExpectEmitAddOwner() public {
    uint256 projectID = 0;
    address newOwner = address(0x123);
    ExpectEmit emitter = new ExpectEmit();
    
    vm.expectEmit(true, true, false, true);
    emit OwnerAdded(projectID, newOwner);
    emitter.owner();
  }

  function testRemoveProjectOwner() public {
    // todo: test removeProjectOwner
  }

  function testExpectEmitRemoveOwner() public {
    uint256 projectID = 0;
    address removedOwner = address(0x123);
    ExpectEmit emitter = new ExpectEmit();
    
    vm.expectEmit(true, true, false, true);
    emit OwnerRemoved(projectID, removedOwner);
    emitter.owner();
  }

  function testProjectOwnersCount() public {
    // todo: test projectOwnersCount
  }

  function testGetProjectOwner() public {
    // todo: test getProjectOwner
  }

  function testInitProjectOwners() public {
    // todo: test initProjectOwners
  }
}
