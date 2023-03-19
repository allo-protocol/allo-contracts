# RoundFactory





Invoked by a RoundOperator to enable creation of a round by cloning the RoundImplementation contract. The factory contract emits an event anytime a round is created which can be used to derive the round registry.

*RoundFactory is deployed once per chain and stores a reference to the deployed RoundImplementation.RoundFactory uses openzeppelin Clones to reduce deploy costs and also allows upgrading RoundImplementationUpdated.This contract is Ownable thus supports ownership transfership*

## Methods

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
function alloSettings() external view returns (address)
```

Address of the Allo settings contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### create

```solidity
function create(bytes encodedParameters, address ownedBy) external nonpayable returns (address)
```

Clones RoundImplementation a new round and emits event



#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedParameters | bytes | Encoded parameters for creating a round |
| ownedBy | address | Program which created the contract |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### roundImplementation

```solidity
function roundImplementation() external view returns (address)
```

Address of the RoundImplementation contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateAlloSettings

```solidity
function updateAlloSettings(address newAlloSettings) external nonpayable
```

Allows the owner to update the allo settings contract.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAlloSettings | address | New allo settings contract address |

### updateRoundImplementation

```solidity
function updateRoundImplementation(address payable newRoundImplementation) external nonpayable
```

Allows the owner to update the RoundImplementation. This provides us the flexibility to upgrade RoundImplementation contract while relying on the same RoundFactory to get the list of rounds.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newRoundImplementation | address payable | New RoundImplementation contract address |



## Events

### AlloSettingsUpdated

```solidity
event AlloSettingsUpdated(address alloSettings)
```

Emitted when allo settings contract is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| alloSettings  | address | undefined |

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

### RoundCreated

```solidity
event RoundCreated(address indexed roundAddress, address indexed ownedBy, address indexed roundImplementation)
```

Emitted when a new Round is created



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundAddress `indexed` | address | undefined |
| ownedBy `indexed` | address | undefined |
| roundImplementation `indexed` | address | undefined |

### RoundImplementationUpdated

```solidity
event RoundImplementationUpdated(address roundImplementation)
```

Emitted when a Round implementation contract is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundImplementation  | address | undefined |



