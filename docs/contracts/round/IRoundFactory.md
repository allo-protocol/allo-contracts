# IRoundFactory









## Methods

### create

```solidity
function create(bytes encodedParameters, address ownedBy) external nonpayable returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedParameters | bytes | undefined |
| ownedBy | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getProtocolFeePercentage

```solidity
function getProtocolFeePercentage() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### getProtocolTreasury

```solidity
function getProtocolTreasury() external view returns (address payable)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### getRoundContract

```solidity
function getRoundContract() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### initialize

```solidity
function initialize() external nonpayable
```






### updateProtocolFeePercentage

```solidity
function updateProtocolFeePercentage(uint8 newProtocolFeePercentage) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newProtocolFeePercentage | uint8 | undefined |

### updateProtocolTreasury

```solidity
function updateProtocolTreasury(address payable newProtocolTreasury) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newProtocolTreasury | address payable | undefined |

### updateRoundContract

```solidity
function updateRoundContract(address payable newRoundContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newRoundContract | address payable | undefined |




