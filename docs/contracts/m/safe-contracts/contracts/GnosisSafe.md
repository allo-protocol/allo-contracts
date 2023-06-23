# GnosisSafe

*Stefan George - &lt;stefan@gnosis.io&gt;Richard Meissner - &lt;richard@gnosis.io&gt;*

> Gnosis Safe - A multisignature wallet with support for confirmations using signed messages based on ERC191.





## Methods

### VERSION

```solidity
function VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### addOwnerWithThreshold

```solidity
function addOwnerWithThreshold(address owner, uint256 _threshold) external nonpayable
```

Adds the owner `owner` to the Safe and updates the threshold to `_threshold`.

*Allows to add a new owner to the Safe and update the threshold at the same time.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | New owner address. |
| _threshold | uint256 | New threshold. |

### approveHash

```solidity
function approveHash(bytes32 hashToApprove) external nonpayable
```



*Marks a hash as approved. This can be used to validate a hash that is used by a signature.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| hashToApprove | bytes32 | The hash that should be marked as approved for signatures that are verified by this contract. |

### approvedHashes

```solidity
function approvedHashes(address, bytes32) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### changeThreshold

```solidity
function changeThreshold(uint256 _threshold) external nonpayable
```

Changes the threshold of the Safe to `_threshold`.

*Allows to update the number of required confirmations by Safe owners.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _threshold | uint256 | New threshold. |

### checkNSignatures

```solidity
function checkNSignatures(bytes32 dataHash, bytes data, bytes signatures, uint256 requiredSignatures) external view
```



*Checks whether the signature provided is valid for the provided data, hash. Will revert otherwise.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| dataHash | bytes32 | Hash of the data (could be either a message hash or transaction hash) |
| data | bytes | That should be signed (this is passed to an external validator contract) |
| signatures | bytes | Signature data that should be verified. Can be ECDSA signature, contract signature (EIP-1271) or approved hash. |
| requiredSignatures | uint256 | Amount of required valid signatures. |

### checkSignatures

```solidity
function checkSignatures(bytes32 dataHash, bytes data, bytes signatures) external view
```



*Checks whether the signature provided is valid for the provided data, hash. Will revert otherwise.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| dataHash | bytes32 | Hash of the data (could be either a message hash or transaction hash) |
| data | bytes | That should be signed (this is passed to an external validator contract) |
| signatures | bytes | Signature data that should be verified. Can be ECDSA signature, contract signature (EIP-1271) or approved hash. |

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

### domainSeparator

```solidity
function domainSeparator() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

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

### encodeTransactionData

```solidity
function encodeTransactionData(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) external view returns (bytes)
```



*Returns the bytes that are hashed to be signed by owners.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Destination address. |
| value | uint256 | Ether value. |
| data | bytes | Data payload. |
| operation | enum Enum.Operation | Operation type. |
| safeTxGas | uint256 | Gas that should be used for the safe transaction. |
| baseGas | uint256 | Gas costs for that are independent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund) |
| gasPrice | uint256 | Maximum gas price that should be used for this transaction. |
| gasToken | address | Token address (or 0 if ETH) that is used for the payment. |
| refundReceiver | address | Address of receiver of gas payment (or 0 if tx.origin). |
| _nonce | uint256 | Transaction nonce. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | Transaction hash bytes. |

### execTransaction

```solidity
function execTransaction(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address payable refundReceiver, bytes signatures) external payable returns (bool success)
```



*Allows to execute a Safe transaction confirmed by required number of owners and then pays the account that submitted the transaction.      Note: The fees are always transferred, even if the user transaction fails.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Destination address of Safe transaction. |
| value | uint256 | Ether value of Safe transaction. |
| data | bytes | Data payload of Safe transaction. |
| operation | enum Enum.Operation | Operation type of Safe transaction. |
| safeTxGas | uint256 | Gas that should be used for the Safe transaction. |
| baseGas | uint256 | Gas costs that are independent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund) |
| gasPrice | uint256 | Gas price that should be used for the payment calculation. |
| gasToken | address | Token address (or 0 if ETH) that is used for the payment. |
| refundReceiver | address payable | Address of receiver of gas payment (or 0 if tx.origin). |
| signatures | bytes | Packed signature data ({bytes32 r}{bytes32 s}{uint8 v}) |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

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

### getChainId

```solidity
function getChainId() external view returns (uint256)
```



*Returns the chain id used by this contract.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### getOwners

```solidity
function getOwners() external view returns (address[])
```



*Returns array of owners.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | Array of Safe owners. |

### getStorageAt

```solidity
function getStorageAt(uint256 offset, uint256 length) external view returns (bytes)
```



*Reads `length` bytes of storage in the currents contract*

#### Parameters

| Name | Type | Description |
|---|---|---|
| offset | uint256 | - the offset in the current contract&#39;s storage in words to start reading from |
| length | uint256 | - the number of words (32 bytes) of data to read |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | the bytes that were read. |

### getThreshold

```solidity
function getThreshold() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getTransactionHash

```solidity
function getTransactionHash(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) external view returns (bytes32)
```



*Returns hash to be signed by owners.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Destination address. |
| value | uint256 | Ether value. |
| data | bytes | Data payload. |
| operation | enum Enum.Operation | Operation type. |
| safeTxGas | uint256 | Fas that should be used for the safe transaction. |
| baseGas | uint256 | Gas costs for data used to trigger the safe transaction. |
| gasPrice | uint256 | Maximum gas price that should be used for this transaction. |
| gasToken | address | Token address (or 0 if ETH) that is used for the payment. |
| refundReceiver | address | Address of receiver of gas payment (or 0 if tx.origin). |
| _nonce | uint256 | Transaction nonce. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | Transaction hash. |

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

### isOwner

```solidity
function isOwner(address owner) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### nonce

```solidity
function nonce() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### removeOwner

```solidity
function removeOwner(address prevOwner, address owner, uint256 _threshold) external nonpayable
```

Removes the owner `owner` from the Safe and updates the threshold to `_threshold`.

*Allows to remove an owner from the Safe and update the threshold at the same time.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| prevOwner | address | Owner that pointed to the owner to be removed in the linked list |
| owner | address | Owner address to be removed. |
| _threshold | uint256 | New threshold. |

### requiredTxGas

```solidity
function requiredTxGas(address to, uint256 value, bytes data, enum Enum.Operation operation) external nonpayable returns (uint256)
```

Deprecated in favor of common/StorageAccessible.sol and will be removed in next version.

*Allows to estimate a Safe transaction.      This method is only meant for estimation purpose, therefore the call will always revert and encode the result in the revert data.      Since the `estimateGas` function includes refunds, call this method to get an estimated of the costs that are deducted from the safe with `execTransaction`*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Destination address of Safe transaction. |
| value | uint256 | Ether value of Safe transaction. |
| data | bytes | Data payload of Safe transaction. |
| operation | enum Enum.Operation | Operation type of Safe transaction. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Estimate without refunds and overhead fees (base transaction and payload data gas costs). |

### setFallbackHandler

```solidity
function setFallbackHandler(address handler) external nonpayable
```



*Allows to add a contract to handle fallback calls.      Only fallback calls without value and with data will be forwarded.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| handler | address | contract to handle fallbacks calls. |

### setGuard

```solidity
function setGuard(address guard) external nonpayable
```



*Set a guard that checks transactions before execution*

#### Parameters

| Name | Type | Description |
|---|---|---|
| guard | address | The address of the guard to be used or the 0 address to disable the guard |

### setup

```solidity
function setup(address[] _owners, uint256 _threshold, address to, bytes data, address fallbackHandler, address paymentToken, uint256 payment, address payable paymentReceiver) external nonpayable
```



*Setup function sets initial storage of contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _owners | address[] | List of Safe owners. |
| _threshold | uint256 | Number of required confirmations for a Safe transaction. |
| to | address | Contract address for optional delegate call. |
| data | bytes | Data payload for optional delegate call. |
| fallbackHandler | address | Handler for fallback calls to this contract |
| paymentToken | address | Token that should be used for the payment (0 is ETH) |
| payment | uint256 | Value that should be paid |
| paymentReceiver | address payable | Adddress that should receive the payment (or 0 if tx.origin) |

### signedMessages

```solidity
function signedMessages(bytes32) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### simulateAndRevert

```solidity
function simulateAndRevert(address targetContract, bytes calldataPayload) external nonpayable
```



*Performs a delegetecall on a targetContract in the context of self. Internally reverts execution to avoid side effects (making it static). This method reverts with data equal to `abi.encode(bool(success), bytes(response))`. Specifically, the `returndata` after a call to this method will be: `success:bool || response.length:uint256 || response:bytes`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| targetContract | address | Address of the contract containing the code to execute. |
| calldataPayload | bytes | Calldata that should be sent to the target contract (encoded method name and arguments). |

### swapOwner

```solidity
function swapOwner(address prevOwner, address oldOwner, address newOwner) external nonpayable
```

Replaces the owner `oldOwner` in the Safe with `newOwner`.

*Allows to swap/replace an owner from the Safe with another address.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| prevOwner | address | Owner that pointed to the owner to be replaced in the linked list |
| oldOwner | address | Owner address to be replaced. |
| newOwner | address | New owner address. |



## Events

### AddedOwner

```solidity
event AddedOwner(address owner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner  | address | undefined |

### ApproveHash

```solidity
event ApproveHash(bytes32 indexed approvedHash, address indexed owner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| approvedHash `indexed` | bytes32 | undefined |
| owner `indexed` | address | undefined |

### ChangedFallbackHandler

```solidity
event ChangedFallbackHandler(address handler)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| handler  | address | undefined |

### ChangedGuard

```solidity
event ChangedGuard(address guard)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| guard  | address | undefined |

### ChangedThreshold

```solidity
event ChangedThreshold(uint256 threshold)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| threshold  | uint256 | undefined |

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

### ExecutionFailure

```solidity
event ExecutionFailure(bytes32 txHash, uint256 payment)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| txHash  | bytes32 | undefined |
| payment  | uint256 | undefined |

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

### ExecutionSuccess

```solidity
event ExecutionSuccess(bytes32 txHash, uint256 payment)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| txHash  | bytes32 | undefined |
| payment  | uint256 | undefined |

### RemovedOwner

```solidity
event RemovedOwner(address owner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner  | address | undefined |

### SafeReceived

```solidity
event SafeReceived(address indexed sender, uint256 value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender `indexed` | address | undefined |
| value  | uint256 | undefined |

### SafeSetup

```solidity
event SafeSetup(address indexed initiator, address[] owners, uint256 threshold, address initializer, address fallbackHandler)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| initiator `indexed` | address | undefined |
| owners  | address[] | undefined |
| threshold  | uint256 | undefined |
| initializer  | address | undefined |
| fallbackHandler  | address | undefined |

### SignMsg

```solidity
event SignMsg(bytes32 indexed msgHash)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| msgHash `indexed` | bytes32 | undefined |



