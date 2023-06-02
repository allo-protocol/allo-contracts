# SimpleStrategy









## Methods

### VERSION

```solidity
function VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### initialize

```solidity
function initialize(bytes _encodedParams) external nonpayable
```

Invoked by RoundImplementation on creation to set the round for which the voting contracts is to be used



#### Parameters

| Name | Type | Description |
|---|---|---|
| _encodedParams | bytes | undefined |

### roundAddress

```solidity
function roundAddress() external view returns (address payable)
```

Round address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

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



## Events

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

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


