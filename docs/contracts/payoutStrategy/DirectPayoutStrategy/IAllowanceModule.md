# IAllowanceModule









## Methods

### addDelegate

```solidity
function addDelegate(address delegate) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| delegate | address | undefined |

### executeAllowanceTransfer

```solidity
function executeAllowanceTransfer(address safe, address token, address payable to, uint96 amount, address paymentToken, uint96 payment, address delegate, bytes signature) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| safe | address | undefined |
| token | address | undefined |
| to | address payable | undefined |
| amount | uint96 | undefined |
| paymentToken | address | undefined |
| payment | uint96 | undefined |
| delegate | address | undefined |
| signature | bytes | undefined |

### generateTransferHash

```solidity
function generateTransferHash(address safe, address token, address to, uint96 amount, address paymentToken, uint96 payment, uint16 nonce) external view returns (bytes32)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| safe | address | undefined |
| token | address | undefined |
| to | address | undefined |
| amount | uint96 | undefined |
| paymentToken | address | undefined |
| payment | uint96 | undefined |
| nonce | uint16 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### getAllowance

```solidity
function getAllowance(address safe, address delegate, address token) external view returns (struct IAllowanceModule.Allowance allowance)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| safe | address | undefined |
| delegate | address | undefined |
| token | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| allowance | IAllowanceModule.Allowance | undefined |

### getTokenAllowance

```solidity
function getTokenAllowance(address safe, address delegate, address token) external view returns (uint256[5])
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| safe | address | undefined |
| delegate | address | undefined |
| token | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256[5] | undefined |

### getTokens

```solidity
function getTokens(address safe, address delegate) external view returns (address[])
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| safe | address | undefined |
| delegate | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | undefined |

### setAllowance

```solidity
function setAllowance(address delegate, address token, uint96 allowanceAmount, uint16 resetTimeMin, uint32 resetBaseMin) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| delegate | address | undefined |
| token | address | undefined |
| allowanceAmount | uint96 | undefined |
| resetTimeMin | uint16 | undefined |
| resetBaseMin | uint32 | undefined |




