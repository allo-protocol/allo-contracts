# IPayoutStrategyInitializable





Defines the abstract contract for payout strategies for a round. Any new payout strategy would be expected to extend this abstract contract. Every PayoutStrategyImplementation contract would be unique to RoundImplementation and would be deployed before creating a round. Functions that are marked as `virtual` are expected to be overridden by the implementation contract. - updateDistribution - payout

*- Deployed before creating a round  - Funds are transferred to the payout contract from round only during payout*

## Methods

### ROUND_OPERATOR_ROLE

```solidity
function ROUND_OPERATOR_ROLE() external view returns (bytes32)
```

round operator role




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

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

### init

```solidity
function init(bytes _encodedParams) external nonpayable
```

Invoked by RoundImplementation on creation to set the round for which the payout strategy is to be used



#### Parameters

| Name | Type | Description |
|---|---|---|
| _encodedParams | bytes | undefined |

### isDistributionSet

```solidity
function isDistributionSet() external view returns (bool)
```

checks that distribution is set before setReadyForPayout




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

### roundAddress

```solidity
function roundAddress() external view returns (address payable)
```

RoundImplementation address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### setReadyForPayout

```solidity
function setReadyForPayout() external payable
```

Invoked by RoundImplementation to set isReadyForPayout




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
function updateDistribution(bytes _encodedDistribution) external nonpayable
```

sInvoked by RoundImplementation to upload distribution to the payout strategy

*- ideally IPayoutStrategy implementation should emit events after   distribution is updated - would be invoked at the end of the round Modifiers:  - isRoundOperator  - roundHasEnded*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _encodedDistribution | bytes | encoded distribution |

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

### ReadyForPayout

```solidity
event ReadyForPayout()
```

Emitted when contract is ready for payout






