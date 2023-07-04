# DirectPayoutStrategyImplementation





Direct Payout Strategy contract which is deployed once per round and is used to handle IN REVIEW applications status and to pay grantees based on internal review process.



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

### generateTransferHash

```solidity
function generateTransferHash(address _allowanceModule, address _roundOperator, address _token, address _to, uint96 _amount) external view returns (bytes32)
```



*Generates the transfer hash that should be signed by the delegate to authorize a transfer. This function add both protocol and round fees to the amount so they are included in the signature required for executing the `payout` function*

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
function initialize() external nonpayable
```






### isApplicationInReview

```solidity
function isApplicationInReview(uint256 applicationIndex) external view returns (bool)
```



*Determines if a given application index on IN REVIEW status*

#### Parameters

| Name | Type | Description |
|---|---|---|
| applicationIndex | uint256 | undefined |

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

### setApplicationInReview

```solidity
function setApplicationInReview(uint256 _applicationIndex) external nonpayable
```

Invoked by a round operator to make signal that a pending application turns to IN REVIEW status.*



#### Parameters

| Name | Type | Description |
|---|---|---|
| _applicationIndex | uint256 | Application index |

### setReadyForPayout

```solidity
function setReadyForPayout() external payable
```

Invoked by RoundImplementation to set isReadyForPayout

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

### updateVaultAddress

```solidity
function updateVaultAddress(address _newVaultAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _newVaultAddress | address | new vault address |

### vaultAddress

```solidity
function vaultAddress() external view returns (address)
```

Funds vault address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

### ApplicationInReview

```solidity
event ApplicationInReview(uint256 indexed applicationIndex, address indexed operator)
```

Emitted when a Round wallet address is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| applicationIndex `indexed` | uint256 | undefined |
| operator `indexed` | address | undefined |

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
event PayoutMade(address indexed vault, address token, uint256 amount, uint256 protocolFee, uint256 roundFee, address grantAddress, bytes32 indexed projectId, uint256 indexed applicationIndex, address allowanceModule)
```

Emitted when a payout is executed



#### Parameters

| Name | Type | Description |
|---|---|---|
| vault `indexed` | address | undefined |
| token  | address | undefined |
| amount  | uint256 | undefined |
| protocolFee  | uint256 | undefined |
| roundFee  | uint256 | undefined |
| grantAddress  | address | undefined |
| projectId `indexed` | bytes32 | undefined |
| applicationIndex `indexed` | uint256 | undefined |
| allowanceModule  | address | undefined |

### ReadyForPayout

```solidity
event ReadyForPayout()
```

Emitted when contract is ready for payout




### VaultAddressUpdated

```solidity
event VaultAddressUpdated(address vaultAddress)
```

Emitted when a Vault address is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| vaultAddress  | address | undefined |



## Errors

### DirectStrategy__payout_ApplicationNotAccepted

```solidity
error DirectStrategy__payout_ApplicationNotAccepted()
```






### DirectStrategy__payout_NativeTokenNotAllowed

```solidity
error DirectStrategy__payout_NativeTokenNotAllowed()
```






### DirectStrategy__setApplicationInReview_applicationInWrongStatus

```solidity
error DirectStrategy__setApplicationInReview_applicationInWrongStatus()
```







