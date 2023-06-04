# Registry



> Registry





## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### addOwner

```solidity
function addOwner(bytes32 projectID, address owner) external nonpayable
```

Adds Owner to Project



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | ID of project |
| owner | address | new owner |

### createProject

```solidity
function createProject(address[] projectOwners, MetaPtr projectMetadata, MetaPtr programMetadata) external nonpayable returns (bytes32 projectID)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectOwners | address[] | undefined |
| projectMetadata | MetaPtr | undefined |
| programMetadata | MetaPtr | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | undefined |

### createRound

```solidity
function createRound(contract IRoundFactory roundFactory, bytes32 projectID, address strategyImplementation, bytes encodedRoundParameters, bytes encodedStrategyParameters) external nonpayable returns (address)
```

Create a new round for a project



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundFactory | contract IRoundFactory | Address of round factory |
| projectID | bytes32 | ID of project creating the round |
| strategyImplementation | address | undefined |
| encodedRoundParameters | bytes | Encoded parameters for round creation |
| encodedStrategyParameters | bytes | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32)
```



*Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role&#39;s admin, use {_setRoleAdmin}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### getRoleMember

```solidity
function getRoleMember(bytes32 role, uint256 index) external view returns (address)
```



*Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getRoleMemberCount

```solidity
function getRoleMemberCount(bytes32 role) external view returns (uint256)
```



*Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### grantRole

```solidity
function grantRole(bytes32 role, address account) external nonpayable
```



*Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``&#39;s admin role. May emit a {RoleGranted} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### hasRole

```solidity
function hasRole(bytes32 role, address account) external view returns (bool)
```



*Returns `true` if `account` has been granted `role`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### initialize

```solidity
function initialize() external nonpayable
```

Initializes the contract after an upgrade

*In future deploys of the implementation, an higher version should be passed to reinitializer*


### projects

```solidity
function projects(bytes32) external view returns (bytes32 projectID, struct MetaPtr projectMetadata, struct MetaPtr programMetadata)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | undefined |
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

### removeOwner

```solidity
function removeOwner(bytes32 projectID, address owner) external nonpayable
```

Remove owner from Project



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | ID of project |
| owner | address | owner to be removed |

### renounceRole

```solidity
function renounceRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function&#39;s purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``&#39;s admin role. May emit a {RoleRevoked} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### updateProgramMetadata

```solidity
function updateProgramMetadata(bytes32 projectID, MetaPtr programMetadata) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | undefined |
| programMetadata | MetaPtr | undefined |

### updateProjectMetadata

```solidity
function updateProjectMetadata(bytes32 projectID, MetaPtr projectMetadata) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID | bytes32 | undefined |
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
event MetadataUpdated(bytes32 indexed projectID, MetaPtr metadata, enum Registry.MetadataType metadataType)
```



*Emitted when metadata is updated for a project or program.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | bytes32 | The ID of the project or program. |
| metadata  | MetaPtr | The metadata pointer. |
| metadataType  | enum Registry.MetadataType | The type of metadata: 0 for projectMetadata, 1 for programMetadata. |

### ProjectCreated

```solidity
event ProjectCreated(bytes32 indexed projectID, address indexed owner)
```



*Emitted when a project is created.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | bytes32 | The ID of the project. |
| owner `indexed` | address | The address of the owner of the project. |

### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| previousAdminRole `indexed` | bytes32 | undefined |
| newAdminRole `indexed` | bytes32 | undefined |

### RoleGranted

```solidity
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### RoleRevoked

```solidity
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |



## Errors

### ProgramMetadataIsEmpty

```solidity
error ProgramMetadataIsEmpty()
```







