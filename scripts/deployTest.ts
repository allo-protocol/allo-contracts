import hre, {ethers, upgrades} from "hardhat";
import {encodeProgramParameters, encodeRoundParameters} from "./utils";
import {AddressZero} from "@ethersproject/constants";
// import chalk from "chalk";

async function deployEverything() {
    const account = (await ethers.getSigners())[0];
    const networkName = hre.network.name;

    // console.log(
    //     `${chalk.bold("Deploy test round on ")} ${networkName} as ${
    //         account.address
    //     }`
    // );

    console.log("Deploying ProjectRegistry...");
    const projectRegistryFactory = await ethers.getContractFactory(
        "ProjectRegistry",
        account
    );
    const projectRegistry = await upgrades.deployProxy(
        projectRegistryFactory,
        []
    );
    await projectRegistry.deployed();
    console.log("Project registry deployed at: ", projectRegistry.address);

    /* Program */
    console.log("Deploying ProgramFactory...");
    const programFactory = await ethers.getContractFactory("ProgramFactory");
    const programFactoryDeployment = await programFactory.deploy();
    await programFactoryDeployment.initialize();
    console.log(
        "Program Factory deployed at: ",
        programFactoryDeployment.address
    );

    console.log("Deploying ProgramImplementation...");
    const programImplementation = await ethers.getContractFactory(
        "ProgramImplementation"
    );
    const programImplementationDeployment = await programImplementation.deploy();
    console.log(
        "Program Implementation deployed at: ",
        programImplementationDeployment.address
    );

    console.log("Linking ProgramFactory to ProgramImplementation");
    const programFactoryInstance = await ethers.getContractAt(
        "ProgramFactory",
        programFactoryDeployment.address
    );
    const updateTx = await programFactoryInstance.updateProgramContract(
        programImplementationDeployment.address
    );
    await updateTx.wait();
    console.log(
        "ProgramFactory to ProgramImplementation linked in tx",
        updateTx.hash
    );

    /* Voting Strategy */
    const quadraticFundingVotingStrategyFactory = await ethers.getContractFactory(
        "QuadraticFundingVotingStrategyFactory"
    );
    const quadraticFundingVotingStrategyFactoryContract =
        await upgrades.deployProxy(quadraticFundingVotingStrategyFactory);
    console.log(
        `Deployed Upgradable QuadraticFundingVotingStrategyFactory to ${quadraticFundingVotingStrategyFactoryContract.address}`
    );

    const qfVotingImplFactory = await ethers.getContractFactory(
        "QuadraticFundingVotingStrategyImplementation"
    );
    const qfVotingImplContract = await qfVotingImplFactory.deploy();
    await qfVotingImplContract.initialize();
    console.log(
        `Deployed QuadraticFundingVotingStrategyImplementation to ${qfVotingImplContract.address}`
    );

    let qflink =
        await quadraticFundingVotingStrategyFactoryContract.updateVotingContract(
            qfVotingImplContract.address
        );
    console.log("QFFactory to QFImpl linked in tx", qflink.hash);

    /* Payout */
    const merklePayoutStrategyFactory = await ethers.getContractFactory(
        "MerklePayoutStrategyFactory"
    );
    const merklePayoutStrategyFactoryContract = await upgrades.deployProxy(
        merklePayoutStrategyFactory
    );
    console.log(
        `Deployed Upgradable MerklePayoutStrategyFactory to ${merklePayoutStrategyFactoryContract.address}`
    );

    const merklePayoutStrategyImpl = await ethers.getContractFactory(
        "MerklePayoutStrategyImplementation"
    );
    const merklePayoutStrategyImplContract =
        await merklePayoutStrategyImpl.deploy();
    await merklePayoutStrategyImplContract.initialize();
    console.log(
        `Deployed MerklePayoutStrategyImplementation to ${qfVotingImplContract.address}`
    );

    let payoutLink =
        await merklePayoutStrategyFactoryContract.updatePayoutImplementation(
            merklePayoutStrategyImplContract.address
        );
    console.log("Payout link tx", payoutLink.hash);

    /* Round */
    const roundFactory = await ethers.getContractFactory("RoundFactory");
    const roundFactoryContract = await upgrades.deployProxy(roundFactory);

    const roundImpl = await ethers.getContractFactory("RoundImplementation");
    const roundImplContract = await roundImpl.deploy();

    const linkRoundTx = await roundFactoryContract.updateRoundImplementation(
        roundImplContract.address
    );
    await linkRoundTx.wait();

    /* Create rojects */
    const registry = await ethers.getContractAt(
        "ProjectRegistry",
        projectRegistry.address
    );
    const projects = [
        {
            project: "0x5cdb35fADB8262A3f88863254c870c2e6A848CcA",
            metaPtr: {
                protocol: 1,
                pointer: "bafybeiekytxwrrfzxvuq3ge5glfzlhkuxjgvx2qb4swodhqd3c3mtc5jay",
            },
        },

        {
            project: "0x1bCD46B724fD4C08995CEC46ffd51bD45feDE200",
            metaPtr: {
                protocol: 1,
                pointer: "bafybeih2pise44gkkzj7fdws3knwotppnh4x2gifnbxjtttuv7okw4mjzu",
            },
        },

        {
            project: "0x500Df079BEBE24A9f6FFa2c70fb58000A4722784",
            metaPtr: {
                protocol: 1,
                pointer: "bafybeiceggy6uzfxsn3z6b2rraptp3g2kx2nrwailkjnx522yah43g5tyu",
            },
        },
    ];

    await Promise.all(
        projects.map((project) => {
            return registry.createProject(project.metaPtr);
        })
    );

    /* Create a program */
    const params = [
        {
            protocol: 1,
            pointer: "bafybeif43xtcb7zfd6lx7rfq42wjvpkbqgoo7qxrczbj4j4iwfl5aaqv2q",
        }, // _metaPtr
        [account.address], // _adminRoles
        [account.address], // _programOperators
    ];
    const encodedProgramParameters = encodeProgramParameters(params);

    const programTx = await programFactoryDeployment.create(
        encodedProgramParameters
    );
    const programReceipt = await programTx.wait();
    let programAddress;

    if (programReceipt.events) {
        const event = programReceipt.events.find(
            (e) => e.event === "ProgramCreated"
        );
        if (event && event.args) {
            programAddress = event.args.programContractAddress;
        }
    }

    /* Create a round */
    const encodedParameters = generateAndEncodeRoundParam(
        qfVotingImplContract.address,
        merklePayoutStrategyImplContract.address,
        account.address
    );

    const roundTx = await roundFactoryContract.create(
        encodedParameters,
        programAddress // _ownedBy (Program)
    );

    const receipt = await roundTx.wait();
    /* Clock starts ticking here */
    let roundAddress;

    if (receipt.events) {
        const event = receipt.events.find(
            (e: { event: string }) => e.event === "RoundCreated"
        );
        if (event && event.args) {
            roundAddress = event.args.roundAddress;
        }
    }

    const round = await ethers.getContractAt("RoundImplementation", roundAddress);

    // /* Apply to round */
    // await Promise.all(
    //     projects.map((project) => {
    //         return round.applyToRound(
    //             ethers.utils.hexZeroPad(project.project, 32),
    //             project.metaPtr
    //         );
    //     })
    // );
    //
    // /* Approve 2 applications, reject last */
    // await Promise.all(
    //     projects.slice(0, 2).map((project) => {
    //         return round.setApplicationStatuses(
    //
    //         );
    //     })
    // );

    /* Wait until round starts */

    /* Cast 3-4 votes for each project */
}

const generateAndEncodeRoundParam = async (
    votingContract: string,
    payoutContract: string,
    adminAddress: string
) => {
    const _currentTimestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;

    const roundMetaPtr = {
        protocol: 1,
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
    };

    const applicationMetaPtr = {
        protocol: 1,
        pointer: "bafkreih3mbwctlrnimkiizqvu3zu3blszn5uylqts22yvsrdh5y2kbxaia",
    };

    const roles = [adminAddress];

    const matchAmount = 100;
    const token = AddressZero;
    const roundFeePercentage = 0;
    const roundFeeAddress = AddressZero;

    const initAddress = [
        votingContract, // votingStrategy
        payoutContract, // payoutStrategy
    ];

    /* This is 12 seconds on mainnet, but 15 on Goerli. On local networks it will be instant */
    const SECONDS_PER_SLOT = 15;

    /* All timestamps are in seconds*/
    const initRoundTime = [
        _currentTimestamp, // immediate  appStartTime
        _currentTimestamp + SECONDS_PER_SLOT * 2, // 2 slots, roughly 30 secodns on goerli  appEndTime
        _currentTimestamp + SECONDS_PER_SLOT * 2 + 1, // immediately after applications end  roundStartTime
        _currentTimestamp + SECONDS_PER_SLOT * 5, // 75 seconds   roundEndTime
    ];

    const initMetaPtr = [roundMetaPtr, applicationMetaPtr];

    const initRoles = [
        roles, // adminRoles
        roles, // roundOperators
    ];

    let params = [
        initAddress,
        initRoundTime,
        matchAmount,
        token,
        roundFeePercentage,
        roundFeeAddress,
        initMetaPtr,
        initRoles,
    ];

    return encodeRoundParameters(params);
};

deployEverything();
