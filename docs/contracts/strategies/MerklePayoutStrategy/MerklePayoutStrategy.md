# MerklePayoutStrategy









## Methods

### VERSION

```solidity
function VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### distributionMetaPtr

```solidity
function distributionMetaPtr() external view returns (uint256 protocol, string pointer)
```

MetaPtr containing the distribution




#### Returns

| Name | Type | Description |
|---|---|---|
| protocol | uint256 | undefined |
| pointer | string | undefined |

### hasBeenDistributed

```solidity
function hasBeenDistributed(uint256 _index) external view returns (bool)
```

Util function to check if distribution is done



#### Parameters

| Name | Type | Description |
|---|---|---|
| _index | uint256 | index of the distribution |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### initialize

```solidity
function initialize(bytes _encodedParams) external nonpayable
```

Invoked by RoundImplementation on creation to set the round for which the voting contracts is to be used



#### Parameters

| Name | Type | Description |
|---|---|---|
| _encodedParams | bytes | undefined |

### isDistributionSet

```solidity
function isDistributionSet() external view returns (bool)
```

function to check if distribution is set




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isReadyForPayout

```solidity
function isReadyForPayout() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### matchAmount

```solidity
function matchAmount() external view returns (uint256)
```

Amount of tokens to be matched by the round




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### merkleRoot

```solidity
function merkleRoot() external view returns (bytes32)
```

merkle root generated from distribution




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### payout

```solidity
function payout(MerklePayoutStrategy.Distribution[] _distributions) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _distributions | MerklePayoutStrategy.Distribution[] | undefined |

### roundAddress

```solidity
function roundAddress() external view returns (address payable)
```

Round address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### setReadyForPayout

```solidity
function setReadyForPayout() external payable
```



*Can only be called once and (by default) cannot be changed once called*


### tokenAddress

```solidity
function tokenAddress() external view returns (address)
```

Token address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### updateDistribution

```solidity
function updateDistribution(bytes encodedDistribution) external nonpayable
```

Invoked by round operator to update the merkle root and distribution MetaPtr



#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedDistribution | bytes | encoded distribution |

### version

```solidity
function version() external pure returns (string)
```

Returns the version of the contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### vote

```solidity
function vote(bytes[] encodedVotes, address voterAddress) external payable
```

Invoked by RoundImplementation which allows a voted to cast weighted votes to multiple grants during a round

*- more voters -&gt; higher the gas - this would be triggered when a voter casts their vote via grant explorer - can be invoked by the round - supports ERC20 and Native token transfer*

#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedVotes | bytes[] | encoded list of votes |
| voterAddress | address | voter address |

### withdrawFunds

```solidity
function withdrawFunds(address payable withdrawAddress) external payable
```

Invoked by RoundImplementation to withdraw funds to withdrawAddress from the payout contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| withdrawAddress | address payable | withdraw funds address |



## Events

### BatchPayoutSuccessful

```solidity
event BatchPayoutSuccessful(address indexed sender)
```

Emitted when batch payout is successful



#### Parameters

| Name | Type | Description |
|---|---|---|
| sender `indexed` | address | undefined |

### DistributionUpdated

```solidity
event DistributionUpdated(bytes32 merkleRoot, MetaPtr distributionMetaPtr)
```

Emitted when the distribution is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| merkleRoot  | bytes32 | undefined |
| distributionMetaPtr  | MetaPtr | undefined |

### FundsDistributed

```solidity
event FundsDistributed(uint256 amount, address grantee, address indexed token, bytes32 indexed projectId)
```

Emitted when funds are distributed



#### Parameters

| Name | Type | Description |
|---|---|---|
| amount  | uint256 | undefined |
| grantee  | address | undefined |
| token `indexed` | address | undefined |
| projectId `indexed` | bytes32 | undefined |

### FundsWithdrawn

```solidity
event FundsWithdrawn(address indexed tokenAddress, uint256 amount, address withdrawAddress)
```

Emitted when funds are withdrawn from the payout contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress `indexed` | address | undefined |
| amount  | uint256 | undefined |
| withdrawAddress  | address | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### ReadyForPayout

```solidity
event ReadyForPayout()
```

Emitted when contract is ready for payout




### Voted

```solidity
event Voted(address token, uint256 amount, address indexed voter, address grantAddress, bytes32 indexed projectId, uint256 applicationIndex, address indexed roundAddress)
```

Emitted when a new vote is sent



#### Parameters

| Name | Type | Description |
|---|---|---|
| token  | address | undefined |
| amount  | uint256 | undefined |
| voter `indexed` | address | undefined |
| grantAddress  | address | undefined |
| projectId `indexed` | bytes32 | undefined |
| applicationIndex  | uint256 | undefined |
| roundAddress `indexed` | address | undefined |



