# StorageAccessible



> StorageAccessible - generic base contract that allows callers to access all internal storage.

See https://github.com/gnosis/util-contracts/blob/bb5fe5fb5df6d8400998094fb1b32a178a47c3a1/contracts/StorageAccessible.sol



## Methods

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




