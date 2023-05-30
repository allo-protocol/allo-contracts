// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "../SimpleStrategy.sol";
import "../../round/RoundImplementation.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../../utils/MetaPtr.sol";

contract MerklePayoutStrategy is SimpleStrategy {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @notice Token address
    address public tokenAddress;

    /// @notice Amount of tokens to be matched by the round
    uint256 public matchAmount;

    // @notice
    bool public isReadyForPayout;

    /// @notice merkle root generated from distribution
    bytes32 public merkleRoot;

    /// @notice packed array of booleans to keep track of claims
    mapping(uint256 => uint256) private distributedBitMap;

    /// MetaPtr containing the distribution
    MetaPtr public distributionMetaPtr;

    // --- Types ---
    struct Distribution {
        uint256 index;
        address grantee;
        uint256 amount;
        bytes32[] merkleProof;
        bytes32 projectId;
    }

    /// @notice modifier to check if round has ended.
    modifier roundHasEnded() {
        uint roundEndTime = RoundImplementation(roundAddress).roundEndTime();
        require(block.timestamp > roundEndTime, "round has not ended");
        _;
    }

    function _version() internal pure override returns (string memory) {
        return "0.3.0";
    }

    // use internal initialize function to initialize token addresss
    // parse bytes to address and initialize tokenAddress
    function _initialize(bytes calldata _data) internal override {
        (address _tokenAddress, uint256 _matchAmount) = abi.decode(
            _data,
            (address, uint256)
        );
        tokenAddress = _tokenAddress;
        matchAmount = _matchAmount;
        isReadyForPayout = false;
    }

    /// @dev Can only be called once and (by default) cannot be changed once called
    function setReadyForPayout()
        external
        payable
        virtual
        isRoundOperator
        roundHasEnded
    {
        require(isReadyForPayout == false, "isReadyForPayout already set");
        require(isDistributionSet(), "distribution not set");

        uint256 fundsInContract = _getTokenBalance();

        if (fundsInContract < matchAmount) {
            if (tokenAddress == address(0)) {
                require(
                    msg.value >= matchAmount - fundsInContract,
                    "not enough funds"
                );
            } else {
                IERC20Upgradeable(tokenAddress).safeTransferFrom(
                    msg.sender,
                    address(this),
                    matchAmount - fundsInContract
                );
            }
        }

        isReadyForPayout = true;
        emit ReadyForPayout();
    }

    /// @notice Invoked by round operator to update the merkle root and distribution MetaPtr
    /// @param encodedDistribution encoded distribution
    function updateDistribution(
        bytes calldata encodedDistribution
    ) external roundHasEnded isRoundOperator {
        require(isReadyForPayout == false, "Payout: Already ready for payout");

        (bytes32 _merkleRoot, MetaPtr memory _distributionMetaPtr) = abi.decode(
            encodedDistribution,
            (bytes32, MetaPtr)
        );

        merkleRoot = _merkleRoot;
        distributionMetaPtr = _distributionMetaPtr;

        emit DistributionUpdated(merkleRoot, distributionMetaPtr);
    }

    /// @notice function to check if distribution is set
    function isDistributionSet() public view returns (bool) {
        return merkleRoot != "";
    }

    /// @notice Util function to check if distribution is done
    /// @param _index index of the distribution
    function hasBeenDistributed(uint256 _index) public view returns (bool) {
        uint256 distributedWordIndex = _index / 256;
        uint256 distributedBitIndex = _index % 256;
        uint256 distributedWord = distributedBitMap[distributedWordIndex];
        uint256 mask = (1 << distributedBitIndex);

        return distributedWord & mask == mask;
    }

    /**
     * @notice Invoked by RoundImplementation to withdraw funds to
     * withdrawAddress from the payout contract
     *
     * @param withdrawAddress withdraw funds address
     */
    function withdrawFunds(
        address payable withdrawAddress
    ) external payable isRoundOperator roundHasEnded {
        uint balance = _getTokenBalance();

        if (tokenAddress == address(0)) {
            /// @dev native token
            AddressUpgradeable.sendValue(withdrawAddress, balance);
        } else {
            /// @dev ERC20 token
            IERC20Upgradeable(tokenAddress).safeTransfer(
                withdrawAddress,
                balance
            );
        }

        emit FundsWithdrawn(tokenAddress, balance, withdrawAddress);
    }

    /// @notice function to distribute funds to recipient
    /// @dev can be invoked only by round operator
    /// @param _distributions encoded distribution
    function payout(
        Distribution[] calldata _distributions
    ) external payable isRoundOperator {
        require(isReadyForPayout == true, "Payout: Not ready for payout");

        for (uint256 i = 0; i < _distributions.length; ++i) {
            _distribute(_distributions[i]);
        }

        emit BatchPayoutSuccessful(msg.sender);
    }

    /// @notice Util function to distribute funds to recipient
    /// @param _distribution encoded distribution
    function _distribute(Distribution calldata _distribution) private {
        uint256 _index = _distribution.index;
        address _grantee = _distribution.grantee;
        uint256 _amount = _distribution.amount;
        bytes32 _projectId = _distribution.projectId;
        bytes32[] memory _merkleProof = _distribution.merkleProof;

        require(!hasBeenDistributed(_index), "Payout: Already distributed");

        /* We need double hashing to prevent second preimage attacks */
        bytes32 node = keccak256(
            bytes.concat(
                keccak256(abi.encode(_index, _grantee, _amount, _projectId))
            )
        );

        require(
            MerkleProof.verify(_merkleProof, merkleRoot, node),
            "Payout: Invalid proof"
        );

        _setDistributed(_index);

        _transferAmount(payable(_grantee), _amount);

        emit FundsDistributed(_amount, _grantee, tokenAddress, _projectId);
    }

    /// @notice Util function to mark distribution as done
    /// @param _index index of the distribution
    function _setDistributed(uint256 _index) private {
        uint256 distributedWordIndex = _index / 256;
        uint256 distributedBitIndex = _index % 256;
        distributedBitMap[distributedWordIndex] |= (1 << distributedBitIndex);
    }

    /// @notice Util function to transfer amount to recipient
    /// @param _recipient recipient address
    /// @param _amount amount to transfer
    function _transferAmount(
        address payable _recipient,
        uint256 _amount
    ) private {
        if (tokenAddress == address(0)) {
            Address.sendValue(_recipient, _amount);
        } else {
            IERC20Upgradeable(tokenAddress).safeTransfer(_recipient, _amount);
        }
    }

    /**
     * Util function to get token balance in the contract
     */
    function _getTokenBalance() internal view returns (uint) {
        if (tokenAddress == address(0)) {
            return address(this).balance;
        } else {
            return IERC20Upgradeable(tokenAddress).balanceOf(address(this));
        }
    }

    receive() external payable {}

    // --- Events ---

    /// @notice Emitted when funds are withdrawn from the payout contract
    event FundsWithdrawn(
        address indexed tokenAddress,
        uint256 amount,
        address withdrawAddress
    );

    /// @notice Emitted when the distribution is updated
    event DistributionUpdated(bytes32 merkleRoot, MetaPtr distributionMetaPtr);

    /// @notice Emitted when funds are distributed
    event FundsDistributed(
        uint256 amount,
        address grantee,
        address indexed token,
        bytes32 indexed projectId
    );

    /// @notice Emitted when batch payout is successful
    event BatchPayoutSuccessful(address indexed sender);

    /// @notice Emitted when contract is ready for payout
    event ReadyForPayout();
}
