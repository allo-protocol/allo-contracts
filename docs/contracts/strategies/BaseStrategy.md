# BaseStrategy





Defines the abstract contract for voting algorithms on grants within a round. Any new voting algorithm would be expected to extend this abstract contract. Every BaseStrategy contract would be unique to RoundImplementation and would be deployed before creating a round



## Methods

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
function vote(bytes[] _encodedVotes, address _voterAddress) external payable
```

Invoked by RoundImplementation to allow voter to case vote for grants during a round.

*- allows contributor to do cast multiple votes which could be weighted. - should be invoked by RoundImplementation contract - ideally BaseStrategy implementation should emit events after a vote is cast - this would be triggered when a voter casts their vote via grant explorer*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _encodedVotes | bytes[] | encoded votes |
| _voterAddress | address | voter address |



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



