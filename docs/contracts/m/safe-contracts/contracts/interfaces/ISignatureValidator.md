# ISignatureValidator









## Methods

### isValidSignature

```solidity
function isValidSignature(bytes _data, bytes _signature) external view returns (bytes4)
```



*Should return whether the signature provided is valid for the provided data*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _data | bytes | Arbitrary length data signed on the behalf of address(this) |
| _signature | bytes | Signature byte array associated with _data MUST return the bytes4 magic value 0x20c13b0b when function passes. MUST NOT modify state (using STATICCALL for solc &lt; 0.5, view modifier for solc &gt; 0.5) MUST allow external calls |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes4 | undefined |




