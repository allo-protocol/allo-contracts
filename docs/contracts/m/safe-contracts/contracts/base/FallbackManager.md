# FallbackManager

*Richard Meissner - &lt;richard@gnosis.pm&gt;*

> Fallback Manager - A contract that manages fallback calls made to this contract





## Methods

### setFallbackHandler

```solidity
function setFallbackHandler(address handler) external nonpayable
```



*Allows to add a contract to handle fallback calls.      Only fallback calls without value and with data will be forwarded.      This can only be done via a Safe transaction.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| handler | address | contract to handle fallbacks calls. |



## Events

### ChangedFallbackHandler

```solidity
event ChangedFallbackHandler(address handler)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| handler  | address | undefined |



