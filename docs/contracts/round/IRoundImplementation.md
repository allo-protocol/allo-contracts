# IRoundImplementation









## Methods

### applyToRound

```solidity
function applyToRound(bytes32 projectID, MetaPtr newApplicationMetaPtr) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | undefined |
| newApplicationMetaPtr | MetaPtr | undefined |

### getApplicationIndexesByProjectID

```solidity
function getApplicationIndexesByProjectID(bytes32 projectID) external view returns (uint256[])
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256[] | undefined |

### getApplicationStatus

```solidity
function getApplicationStatus(uint256 applicationIndex) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| applicationIndex | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### initialize

```solidity
function initialize(bytes _encodedRoundParameters, bytes _encodedStrategyParameters, contract IAlloSettings _alloSettings, address _strategy) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _encodedRoundParameters | bytes | undefined |
| _encodedStrategyParameters | bytes | undefined |
| _alloSettings | contract IAlloSettings | undefined |
| _strategy | address | undefined |

### isRoundOperator

```solidity
function isRoundOperator(address operator) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### setApplicationStatuses

```solidity
function setApplicationStatuses(IRoundImplementation.ApplicationStatus[] statuses) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| statuses | IRoundImplementation.ApplicationStatus[] | undefined |

### updateApplicationMetaPtr

```solidity
function updateApplicationMetaPtr(MetaPtr newApplicationMetaPtr) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newApplicationMetaPtr | MetaPtr | undefined |

### updateRoundMetaPtr

```solidity
function updateRoundMetaPtr(MetaPtr newRoundMetaPtr) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newRoundMetaPtr | MetaPtr | undefined |

### updateStartAndEndTimes

```solidity
function updateStartAndEndTimes(uint256 newApplicationsStartTime, uint256 newApplicationsEndTime, uint256 newRoundStartTime, uint256 newRoundEndTime) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newApplicationsStartTime | uint256 | undefined |
| newApplicationsEndTime | uint256 | undefined |
| newRoundStartTime | uint256 | undefined |
| newRoundEndTime | uint256 | undefined |

### vote

```solidity
function vote(bytes[] encodedVotes) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedVotes | bytes[] | undefined |

### withdraw

```solidity
function withdraw(address tokenAddress, address payable recipent) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress | address | undefined |
| recipent | address payable | undefined |




