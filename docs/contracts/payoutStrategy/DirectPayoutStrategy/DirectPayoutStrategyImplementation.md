# DirectPayoutStrategyImplementation





Allows voters to cast multiple weighted votes to grants with one transaction This is inspired from BulkCheckout documented over at: https://github.com/gitcoinco/BulkTransactions/blob/master/contracts/BulkCheckout.sol Emits event upon every transfer.



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

### VERSION

```solidity
function VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### alloSettings

```solidity
function alloSettings() external view returns (contract AlloSettings)
```

Allo Config Contract Address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract AlloSettings | undefined |

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

### generateTransferHash

```solidity
function generateTransferHash(address _allowanceModule, address _roundOperator, address _token, address _to, uint96 _amount) external view returns (bytes32)
```



*Generates the transfer hash that should be signed by the delegate to authorize a transfer*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _allowanceModule | address | undefined |
| _roundOperator | address | undefined |
| _token | address | undefined |
| _to | address | undefined |
| _amount | uint96 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### init

```solidity
function init() external nonpayable
```

Invoked by RoundImplementation on creation to set the round for which the payout strategy is to be used




### initialize

```solidity
function initialize(address _alloSettings, address _vaultAddress, uint32 _roundFeePercentage, address _roundFeeAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _alloSettings | address | undefined |
| _vaultAddress | address | undefined |
| _roundFeePercentage | uint32 | undefined |
| _roundFeeAddress | address | undefined |

### isDistributionSet

```solidity
function isDistributionSet() external pure returns (bool)
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

### payout

```solidity
function payout(DirectPayoutStrategyImplementation.Payment _payment) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _payment | DirectPayoutStrategyImplementation.Payment | undefined |

### roundAddress

```solidity
function roundAddress() external view returns (address payable)
```

RoundImplementation address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### roundFeeAddress

```solidity
function roundFeeAddress() external view returns (address payable)
```

Round fee address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### roundFeePercentage

```solidity
function roundFeePercentage() external view returns (uint32)
```

Round fee percentage




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | undefined |

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

### updateRoundFeeAddress

```solidity
function updateRoundFeeAddress(address payable _newFeeAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _newFeeAddress | address payable | new fee address |

### updateRoundFeePercentage

```solidity
function updateRoundFeePercentage(uint32 _newFeePercentage) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _newFeePercentage | uint32 | new fee percentage |

### vaultAddress

```solidity
function vaultAddress() external view returns (address)
```

Funds vault address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### PayoutMade

```solidity
event PayoutMade(address indexed vault, address token, uint256 amount, address grantAddress, bytes32 indexed projectId, uint256 indexed applicationIndex, address allowanceModule)
```

Emitted when a payout is executed



#### Parameters

| Name | Type | Description |
|---|---|---|
| vault `indexed` | address | undefined |
| token  | address | undefined |
| amount  | uint256 | undefined |
| grantAddress  | address | undefined |
| projectId `indexed` | bytes32 | undefined |
| applicationIndex `indexed` | uint256 | undefined |
| allowanceModule  | address | undefined |

### ReadyForPayout

```solidity
event ReadyForPayout()
```

Emitted when contract is ready for payout




### RoundFeeAddressUpdated

```solidity
event RoundFeeAddressUpdated(address roundFeeAddress)
```

Emitted when a Round wallet address is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundFeeAddress  | address | undefined |

### RoundFeePercentageUpdated

```solidity
event RoundFeePercentageUpdated(uint32 roundFeePercentage)
```

Emitted when a Round fee percentage is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundFeePercentage  | uint32 | undefined |



## Errors

### DirectStrategy__isConfigured

```solidity
error DirectStrategy__isConfigured()
```






### DirectStrategy__notConfigured

```solidity
error DirectStrategy__notConfigured()
```






### DirectStrategy__notImplemented

```solidity
error DirectStrategy__notImplemented()
```






### DirectStrategy__payout_ApplicationNotAccepted

```solidity
error DirectStrategy__payout_ApplicationNotAccepted()
```






### DirectStrategy__payout_NativeTokenNotAllowed

```solidity
error DirectStrategy__payout_NativeTokenNotAllowed()
```






### DirectStrategy__payout_NotImplementedYet

```solidity
error DirectStrategy__payout_NotImplementedYet()
```






### DirectStrategy__vote_NotImplemented

```solidity
error DirectStrategy__vote_NotImplemented()
```







