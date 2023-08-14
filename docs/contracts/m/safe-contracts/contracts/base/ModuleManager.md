# ModuleManager

*Stefan George - &lt;stefan@gnosis.pm&gt;Richard Meissner - &lt;richard@gnosis.pm&gt;*

> Module Manager - A contract that manages modules that can execute transactions via this contract





## Methods

### disableModule

```solidity
function disableModule(address prevModule, address module) external nonpayable
```

Disables the module `module` for the Safe.

*Allows to remove a module from the whitelist.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| prevModule | address | Module that pointed to the module to be removed in the linked list |
| module | address | Module to be removed. |

### enableModule

```solidity
function enableModule(address module) external nonpayable
```

Enables the module `module` for the Safe.

*Allows to add a module to the whitelist.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| module | address | Module to be whitelisted. |

### execTransactionFromModule

```solidity
function execTransactionFromModule(address to, uint256 value, bytes data, enum Enum.Operation operation) external nonpayable returns (bool success)
```



*Allows a Module to execute a Safe transaction without any further confirmations.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Destination address of module transaction. |
| value | uint256 | Ether value of module transaction. |
| data | bytes | Data payload of module transaction. |
| operation | enum Enum.Operation | Operation type of module transaction. |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### execTransactionFromModuleReturnData

```solidity
function execTransactionFromModuleReturnData(address to, uint256 value, bytes data, enum Enum.Operation operation) external nonpayable returns (bool success, bytes returnData)
```



*Allows a Module to execute a Safe transaction without any further confirmations and return data*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Destination address of module transaction. |
| value | uint256 | Ether value of module transaction. |
| data | bytes | Data payload of module transaction. |
| operation | enum Enum.Operation | Operation type of module transaction. |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |
| returnData | bytes | undefined |

### getModulesPaginated

```solidity
function getModulesPaginated(address start, uint256 pageSize) external view returns (address[] array, address next)
```



*Returns array of modules.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| start | address | Start of the page. |
| pageSize | uint256 | Maximum number of modules that should be returned. |

#### Returns

| Name | Type | Description |
|---|---|---|
| array | address[] | Array of modules. |
| next | address | Start of the next page. |

### isModuleEnabled

```solidity
function isModuleEnabled(address module) external view returns (bool)
```



*Returns if an module is enabled*

#### Parameters

| Name | Type | Description |
|---|---|---|
| module | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the module is enabled |



## Events

### DisabledModule

```solidity
event DisabledModule(address module)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| module  | address | undefined |

### EnabledModule

```solidity
event EnabledModule(address module)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| module  | address | undefined |

### ExecutionFromModuleFailure

```solidity
event ExecutionFromModuleFailure(address indexed module)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| module `indexed` | address | undefined |

### ExecutionFromModuleSuccess

```solidity
event ExecutionFromModuleSuccess(address indexed module)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| module `indexed` | address | undefined |



