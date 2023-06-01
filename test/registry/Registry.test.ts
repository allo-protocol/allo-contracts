import { AddressZero } from "@ethersproject/constants";
import hre, { network } from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";
import { randomBytes } from "crypto";
import { keccak256 } from "ethers/lib/utils";
import { BigNumberish } from "ethers";

type MetaPtr = {
  protocol: BigNumberish;
  pointer: string;
};

const emptyMetadata: MetaPtr = { protocol: 0, pointer: "" };
const testMetadata: MetaPtr = { protocol: 1, pointer: "test-metadata" };
const programTestMetadata: MetaPtr = { protocol: 1, pointer: "test-program-metadata" };
const updatedMetadata: MetaPtr = { protocol: 1, pointer: "updated-metadata" };

describe("Registry", function () {
  before(async function () {
    [this.owner, this.anotherOwner, this.nonOwner, ...this.accounts] = await ethers.getSigners();

    const Registry = await hre.ethers.getContractFactory(
      "Registry",
      this.owner
    );
    this.contract = await Registry.deploy();
    await this.contract.deployed();
  });

  describe("test: initialize", async function () {
    it("allows to initilize once", async function () {
      await this.contract.connect(this.owner).initialize();
    });

    it("doesn't allow to initilize again", async function () {
      await expect(
        this.contract.connect(this.owner).initialize()
      ).to.be.revertedWith("contract is already initialized");
    });
  });

  describe("test: createProject", async function () {
    it("creates a new project and adds it to the projects list with 1 owner", async function () {
      const tx = await this.contract.createProject([], testMetadata, programTestMetadata);
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      const projectID = event.args.projectID;

      expect(await this.contract.getRoleMemberCount(projectID)).to.equal(1);

      const project = await this.contract.projects(projectID);

      expect(project.projectID).to.equal(projectID);

      const [protocol, pointer] = project.projectMetadata;
      expect(protocol).to.equal(testMetadata.protocol);
      expect(pointer).to.equal(testMetadata.pointer);

      const [programProtocol, programPointer] = project.programMetadata;
      expect(programProtocol).to.equal(programTestMetadata.protocol);
      expect(programPointer).to.equal(programTestMetadata.pointer);

      const ownerCounts = await this.contract.getRoleMemberCount(projectID);
      expect(ownerCounts).to.equal(1);

      const owner = await this.contract.getRoleMember(projectID, 0);
      expect(owner).to.equal(this.owner.address);

      it('ensure events are emitted', () => {
        expect(tx).to.emit(this.contract, 'ProjectCreated').withArgs(projectID, this.owner.address);
        expect(tx).to.emit(this.contract, 'MetadataUpdated').withArgs(projectID, project.projectMetadata, 0);
        expect(tx).to.emit(this.contract, 'MetadataUpdated').withArgs(projectID, project.programMetadata, 1);
      })
    });


    it("creates a new project and adds it to the projects list with 2 owners", async function () {

      const tx = await this.contract.createProject(
        [this.anotherOwner.address],
        testMetadata,
        programTestMetadata
      );
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      const projectID = event.args.projectID

      const ownerCounts = await this.contract.getRoleMemberCount(projectID);
      expect(ownerCounts).to.equal(2);

      const owner = await this.contract.getRoleMember(projectID, 0);
      expect(owner).to.equal(this.owner.address);

      const anotherOwner = await this.contract.getRoleMember(projectID, 1);
      expect(anotherOwner).to.equal(this.anotherOwner.address);
    });
  });

  describe("test: updateProjectMetadata", async function () {

    let projectID: any;

    this.beforeAll(async function () {
      const tx = await this.contract.createProject([], testMetadata, programTestMetadata);
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      projectID = event.args.projectID;
    });

    it("SHOULD revert WHEN caller is not owner", async function () {
      await expect(
        this.contract
          .connect(this.nonOwner)
          .updateProjectMetadata(projectID, updatedMetadata)
      ).to.be.revertedWith(`AccessControl: account ${this.nonOwner.address.toLowerCase()} is missing role ${projectID.toLowerCase()}`);
    });

    it("updates project metadata", async function () {
      const tx = await this.contract
        .connect(this.owner)
        .updateProjectMetadata(projectID, updatedMetadata);

      const updatedProject = await this.contract.projects(projectID);
      const [protocol, pointer] = updatedProject.projectMetadata;

      expect(protocol).to.equal(updatedMetadata.protocol);
      expect(pointer).to.equal(updatedMetadata.pointer);

      expect(tx).to.emit(this.contract, 'MetadataUpdated').withArgs(projectID, updatedProject.projectMetadata, 0);
    });
  });

  describe("test: updateProgramMetadata", async function () {

    let projectID: any;

    this.beforeAll(async function () {
      const tx = await this.contract.createProject([], testMetadata, programTestMetadata);
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      projectID = event.args.projectID;
    });

    it("SHOULD revert WHEN caller is not owner", async function () {
      await expect(
        this.contract
          .connect(this.nonOwner)
          .updateProgramMetadata(projectID, updatedMetadata)
      ).to.be.revertedWith(
        `AccessControl: account ${this.nonOwner.address.toLowerCase()} is missing role ${projectID.toLowerCase()}`
      );
    });

    it("updates project metadata", async function () {
      const tx = await this.contract
        .connect(this.owner)
        .updateProgramMetadata(projectID, updatedMetadata);

      const updatedProject = await this.contract.projects(projectID);
      const [protocol, pointer] = updatedProject.programMetadata;

      expect(protocol).to.equal(updatedMetadata.protocol);
      expect(pointer).to.equal(updatedMetadata.pointer);

      expect(tx).to.emit(this.contract, 'MetadataUpdated').withArgs(projectID, updatedProject.programMetadata, 1);
    });
  });


  describe("test: addOwner", () => {
    let projectID: any;

    this.beforeAll(async function () {
      const tx = await this.contract.createProject([], testMetadata, programTestMetadata);
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      projectID = event.args.projectID;
    });

    it("SHOULD revert WHEN caller is not owner", async function () {
      await expect(
        this.contract
          .connect(this.nonOwner)
          .addOwner(projectID, this.anotherOwner.address)
      ).to.be.revertedWith(
        `AccessControl: account ${this.nonOwner.address.toLowerCase()} is missing role ${projectID.toLowerCase()}`
      );
    });

    it("adds owner to project", async function () {

      expect(await this.contract.getRoleMemberCount(projectID)).to.equal(1);
      expect(await this.contract.hasRole(projectID, this.anotherOwner.address)).to.equal(false);

      await this.contract
        .connect(this.owner)
        .addOwner(projectID, this.anotherOwner.address);

      expect(await this.contract.getRoleMemberCount(projectID)).to.equal(2);
      expect(await this.contract.getRoleMember(projectID, 1)).to.equal(this.anotherOwner.address);
      expect(await this.contract.hasRole(projectID, this.anotherOwner.address)).to.equal(true);

    });
  });

  describe("test: removeOwner", () => {
    let projectID: any;

    this.beforeAll(async function () {
      const tx = await this.contract.createProject(
        [this.anotherOwner.address], testMetadata, programTestMetadata
      );
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      projectID = event.args.projectID;
    });

    it("SHOULD revert WHEN caller is not owner", async function () {
      await expect(
        this.contract
          .connect(this.nonOwner)
          .removeOwner(projectID, this.anotherOwner.address)
      ).to.be.revertedWith(
        `AccessControl: account ${this.nonOwner.address.toLowerCase()} is missing role ${projectID.toLowerCase()}`
      );
    });

    it("removes owner to project", async function () {
      expect(await this.contract.getRoleMemberCount(projectID)).to.equal(2);
      expect(await this.contract.hasRole(projectID, this.anotherOwner.address)).to.equal(true);

      await this.contract
        .connect(this.owner)
        .removeOwner(projectID, this.anotherOwner.address);

      expect(await this.contract.getRoleMemberCount(projectID)).to.equal(1);
      expect(await this.contract.hasRole(projectID, this.anotherOwner.address)).to.equal(false);

    });
  });

  describe("test: createRound", () => {

    let projectID: any;

    beforeEach(async function () {
      [this.owner, this.nonOwner, ...this.accounts] = await ethers.getSigners();

      const Registry = await hre.ethers.getContractFactory(
        "Registry",
        this.owner
      );
      this.contract = await Registry.deploy();
      await this.contract.deployed();

      const RoundFactory = await hre.ethers.getContractFactory(
        "RoundFactory",
        this.owner
      );
      this.roundFactoryContract = await RoundFactory.deploy();
      await this.roundFactoryContract.deployed();

      const tx = await this.contract.createProject([], testMetadata, programTestMetadata);
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      projectID = event.args.projectID;
    });

    it("SHOULD revert WHEN caller is not project owner", async function () {
      const data = randomBytes(32);
      const tx = this.contract
        .connect(this.nonOwner)
        .createRound(this.roundFactoryContract.address, projectID, data);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.nonOwner.address.toLowerCase()} is missing role ${projectID.toLowerCase()}`
      );
    });

    it("SHOULD revert WHEN program metadata is not set", async function () {

      const tx = await this.contract.createProject([], testMetadata, emptyMetadata);
      const receipt = await tx.wait();

      // Access the emitted event
      const event = receipt.events.find((event: any) => event.event === 'ProjectCreated');
      const projectID = event.args.projectID;

      const data = randomBytes(32);
      const createRoundTx = this.contract
        .connect(this.owner)
        .createRound(this.roundFactoryContract.address, projectID, data);

      await expect(createRoundTx).to.be.revertedWith("ProgramMetadataIsEmpty");
    });
  });
});
