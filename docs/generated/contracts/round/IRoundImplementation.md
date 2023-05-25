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
function initialize(bytes encodedParameters, address _alloSettings) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedParameters | bytes | undefined |
| _alloSettings | address | undefined |

### setApplicationStatuses

```solidity
function setApplicationStatuses(IRoundImplementation.ApplicationStatus[] statuses) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| statuses | IRoundImplementation.ApplicationStatus[] | undefined |

### setReadyForPayout

```solidity
function setReadyForPayout() external payable
```






### updateApplicationMetaPtr

```solidity
function updateApplicationMetaPtr(MetaPtr newApplicationMetaPtr) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newApplicationMetaPtr | MetaPtr | undefined |

### updateMatchAmount

```solidity
function updateMatchAmount(uint256 newAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAmount | uint256 | undefined |

### updateRoundFeeAddress

```solidity
function updateRoundFeeAddress(address payable newFeeAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newFeeAddress | address payable | undefined |

### updateRoundFeePercentage

```solidity
function updateRoundFeePercentage(uint32 newFeePercentage) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newFeePercentage | uint32 | undefined |

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




