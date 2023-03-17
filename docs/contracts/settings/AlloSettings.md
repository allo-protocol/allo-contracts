# AlloSettings









## Methods

### DENOMINATOR

```solidity
function DENOMINATOR() external view returns (uint24)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint24 | undefined |

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
function initialize() external nonpayable
```

constructor function which ensure deployer is set as owner




### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### protocolFeePercentage

```solidity
function protocolFeePercentage() external view returns (uint24)
```

Protocol fee percentage 100% = 100_000 | 10% = 10_000 | 1% = 1_000 | 0.1% = 100 | 0.01% = 10




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint24 | undefined |

### protocolTreasury

```solidity
function protocolTreasury() external view returns (address payable)
```

Address of the protocol treasury




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateProtocolFeePercentage

```solidity
function updateProtocolFeePercentage(uint24 _protocolFeePercentage) external nonpayable
```

Set the protocol fee percentage



#### Parameters

| Name | Type | Description |
|---|---|---|
| _protocolFeePercentage | uint24 | The new protocol fee percentage |

### updateProtocolTreasury

```solidity
function updateProtocolTreasury(address payable _protocolTreasury) external nonpayable
```

Set the protocol treasury address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _protocolTreasury | address payable | The new protocol treasury address |



## Events

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### ProtocolFeePercentageUpdated

```solidity
event ProtocolFeePercentageUpdated(uint24 protocolFeePercentage)
```

Emitted when protocol fee percentage is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| protocolFeePercentage  | uint24 | undefined |

### ProtocolTreasuryUpdated

```solidity
event ProtocolTreasuryUpdated(address protocolTreasuryAddress)
```

Emitted when a protocol wallet address is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| protocolTreasuryAddress  | address | undefined |



