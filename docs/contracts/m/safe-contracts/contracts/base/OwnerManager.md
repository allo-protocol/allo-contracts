# OwnerManager

*Stefan George - &lt;stefan@gnosis.pm&gt;Richard Meissner - &lt;richard@gnosis.pm&gt;*

> OwnerManager - Manages a set of owners and a threshold to perform actions.





## Methods

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

### getOwners

```solidity
function getOwners() external view returns (address[])
```



*Returns array of owners.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | Array of Safe owners. |

### getThreshold

```solidity
function getThreshold() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### ChangedThreshold

```solidity
event ChangedThreshold(uint256 threshold)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| threshold  | uint256 | undefined |

### RemovedOwner

```solidity
event RemovedOwner(address owner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner  | address | undefined |



