# GuardManager

*Richard Meissner - &lt;richard@gnosis.pm&gt;*

> Fallback Manager - A contract that manages fallback calls made to this contract





## Methods

### setGuard

```solidity
function setGuard(address guard) external nonpayable
```



*Set a guard that checks transactions before execution*

#### Parameters

| Name | Type | Description |
|---|---|---|
| guard | address | The address of the guard to be used or the 0 address to disable the guard |



## Events

### ChangedGuard

```solidity
event ChangedGuard(address guard)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| guard  | address | undefined |



