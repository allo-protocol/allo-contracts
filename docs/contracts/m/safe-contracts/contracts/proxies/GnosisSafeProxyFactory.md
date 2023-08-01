# GnosisSafeProxyFactory

*Stefan George - &lt;stefan@gnosis.pm&gt;*

> Proxy Factory - Allows to create new proxy contact and execute a message call to the new proxy within one transaction.





## Methods

### calculateCreateProxyWithNonceAddress

```solidity
function calculateCreateProxyWithNonceAddress(address _singleton, bytes initializer, uint256 saltNonce) external nonpayable returns (contract GnosisSafeProxy proxy)
```



*Allows to get the address for a new proxy contact created via `createProxyWithNonce`      This method is only meant for address calculation purpose when you use an initializer that would revert,      therefore the response is returned with a revert. When calling this method set `from` to the address of the proxy factory.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _singleton | address | Address of singleton contract. |
| initializer | bytes | Payload for message call sent to new proxy contract. |
| saltNonce | uint256 | Nonce that will be used to generate the salt to calculate the address of the new proxy contract. |

#### Returns

| Name | Type | Description |
|---|---|---|
| proxy | contract GnosisSafeProxy | undefined |

### createProxy

```solidity
function createProxy(address singleton, bytes data) external nonpayable returns (contract GnosisSafeProxy proxy)
```



*Allows to create new proxy contact and execute a message call to the new proxy within one transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| singleton | address | Address of singleton contract. |
| data | bytes | Payload for message call sent to new proxy contract. |

#### Returns

| Name | Type | Description |
|---|---|---|
| proxy | contract GnosisSafeProxy | undefined |

### createProxyWithCallback

```solidity
function createProxyWithCallback(address _singleton, bytes initializer, uint256 saltNonce, contract IProxyCreationCallback callback) external nonpayable returns (contract GnosisSafeProxy proxy)
```



*Allows to create new proxy contact, execute a message call to the new proxy and call a specified callback within one transaction*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _singleton | address | Address of singleton contract. |
| initializer | bytes | Payload for message call sent to new proxy contract. |
| saltNonce | uint256 | Nonce that will be used to generate the salt to calculate the address of the new proxy contract. |
| callback | contract IProxyCreationCallback | Callback that will be invoced after the new proxy contract has been successfully deployed and initialized. |

#### Returns

| Name | Type | Description |
|---|---|---|
| proxy | contract GnosisSafeProxy | undefined |

### createProxyWithNonce

```solidity
function createProxyWithNonce(address _singleton, bytes initializer, uint256 saltNonce) external nonpayable returns (contract GnosisSafeProxy proxy)
```



*Allows to create new proxy contact and execute a message call to the new proxy within one transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _singleton | address | Address of singleton contract. |
| initializer | bytes | Payload for message call sent to new proxy contract. |
| saltNonce | uint256 | Nonce that will be used to generate the salt to calculate the address of the new proxy contract. |

#### Returns

| Name | Type | Description |
|---|---|---|
| proxy | contract GnosisSafeProxy | undefined |

### proxyCreationCode

```solidity
function proxyCreationCode() external pure returns (bytes)
```



*Allows to retrieve the creation code used for the Proxy deployment. With this it is easily possible to calculate predicted address.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |

### proxyRuntimeCode

```solidity
function proxyRuntimeCode() external pure returns (bytes)
```



*Allows to retrieve the runtime code of a deployed Proxy. This can be used to check that the expected Proxy was deployed.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |



## Events

### ProxyCreation

```solidity
event ProxyCreation(contract GnosisSafeProxy proxy, address singleton)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| proxy  | contract GnosisSafeProxy | undefined |
| singleton  | address | undefined |



