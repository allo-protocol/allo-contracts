# Registry



> Registry





## Methods

### addProjectOwner

```solidity
function addProjectOwner(uint256 projectID, address newOwner) external nonpayable
```

Associate a new owner with a project



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | ID of previously created project |
| newOwner | address | address of new project owner |

### createProject

```solidity
function createProject(MetaPtr projectMetadata, MetaPtr programMetadata) external nonpayable returns (uint256 projectID)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectMetadata | MetaPtr | undefined |
| programMetadata | MetaPtr | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | undefined |

### createRound

```solidity
function createRound(contract IRoundFactory roundFactory, uint256 projectID, bytes encodedParameters) external nonpayable returns (address)
```

Create a new round for a project



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundFactory | contract IRoundFactory | undefined |
| projectID | uint256 | ID of project creating the round |
| encodedParameters | bytes | Encoded parameters for round creation |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getProjectOwners

```solidity
function getProjectOwners(uint256 projectID) external view returns (address[])
```

Retrieve list of project owners



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | ID of project |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | List of current owners of given project |

### initialize

```solidity
function initialize() external nonpayable
```

Initializes the contract after an upgrade

*In future deploys of the implementation, an higher version should be passed to reinitializer*


### isProjectOwner

```solidity
function isProjectOwner(uint256 projectID, address owner) external view returns (bool)
```

Check if an address is an owner of a project



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | ID of previously created project |
| owner | address | address to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### projectOwnersCount

```solidity
function projectOwnersCount(uint256 projectID) external view returns (uint256)
```

Retrieve count of existing project owners



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | ID of project |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Count of owners for given project |

### projects

```solidity
function projects(uint256) external view returns (uint256 id, struct MetaPtr projectMetadata, struct MetaPtr programMetadata)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| id | uint256 | undefined |
| projectMetadata | MetaPtr | undefined |
| programMetadata | MetaPtr | undefined |

### projectsCount

```solidity
function projectsCount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### projectsOwners

```solidity
function projectsOwners(uint256) external view returns (uint256 count)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| count | uint256 | undefined |

### removeProjectOwner

```solidity
function removeProjectOwner(uint256 projectID, address prevOwner, address owner) external nonpayable
```

Disassociate an existing owner from a project



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | ID of previously created project |
| prevOwner | address | Address of previous owner in OwnerList |
| owner | address | Address of new Owner |

### updateProgramMetadata

```solidity
function updateProgramMetadata(uint256 projectID, MetaPtr programMetadata) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | undefined |
| programMetadata | MetaPtr | undefined |

### updateProjectMetadata

```solidity
function updateProjectMetadata(uint256 projectID, MetaPtr projectMetadata) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | uint256 | undefined |
| projectMetadata | MetaPtr | undefined |



## Events

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### MetadataUpdated

```solidity
event MetadataUpdated(uint256 indexed projectID, MetaPtr metadata, uint8 metadataType)
```



*Emitted when metadata is updated for a project or program.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | uint256 | The ID of the project or program. |
| metadata  | MetaPtr | The metadata pointer. |
| metadataType  | uint8 | The type of metadata: 0 for projectMetadata, 1 for programMetadata. |

### OwnerAdded

```solidity
event OwnerAdded(uint256 indexed projectID, address indexed owner)
```



*Emitted when an owner is added to a project.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | uint256 | The ID of the project. |
| owner `indexed` | address | The address of the owner added. |

### OwnerRemoved

```solidity
event OwnerRemoved(uint256 indexed projectID, address indexed owner)
```



*Emitted when an owner is removed from a project.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | uint256 | The ID of the project. |
| owner `indexed` | address | The address of the owner removed. |

### ProjectCreated

```solidity
event ProjectCreated(uint256 indexed projectID, address indexed owner)
```



*Emitted when a project is created.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | uint256 | The ID of the project. |
| owner `indexed` | address | The address of the owner of the project. |



