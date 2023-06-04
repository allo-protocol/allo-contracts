# RoundFactory





Invoked by a RoundOperator to enable creation of a round by cloning the RoundImplementation contract. The factory contract emits an event anytime a round is created which can be used to derive the round registry.

*RoundFactory is deployed once per chain and stores a reference to the deployed RoundImplementation.RoundFactory uses openzeppelin Clones to reduce deploy costs and also allows upgrading RoundImplementationUpdated.This contract supports Access Control via AccessControlEnumerableUpgradeable*

## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### VERSION

```solidity
function VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### alloSettings

```solidity
function alloSettings() external view returns (contract IAlloSettings)
```

Address of the Allo settings contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IAlloSettings | undefined |

### create

```solidity
function create(bytes32 projectIdentifier, address strategyImplementation, bytes encodedRoundParameters, bytes encodedStrategyParameters) external nonpayable returns (address)
```

Clones RoundImplementation a new round and emits event



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectIdentifier | bytes32 | ID of project on the registry creating the round |
| strategyImplementation | address | Address of the strategy implementation contract |
| encodedRoundParameters | bytes | Encoded parameters for creating a round |
| encodedStrategyParameters | bytes | Encoded parameters for creating a strategy |

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

constructor function which ensure deployer is set as owner




### nonce

```solidity
function nonce() external view returns (uint256)
```

Nonce used to generate deterministic salt for Clones




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### roundImplementation

```solidity
function roundImplementation() external view returns (address)
```

Address of the RoundImplementation contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### updateAlloSettings

```solidity
function updateAlloSettings(contract IAlloSettings newAlloSettings) external nonpayable
```

Allows the owner to update the allo settings contract.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAlloSettings | contract IAlloSettings | New allo settings contract address |

### updateRoundImplementation

```solidity
function updateRoundImplementation(address payable newRoundImplementation) external nonpayable
```

Allows the owner to update the RoundImplementation. This provides us the flexibility to upgrade RoundImplementation contract while relying on the same RoundFactory to get the list of rounds.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newRoundImplementation | address payable | New RoundImplementation contract address |



## Events

### AlloSettingsUpdated

```solidity
event AlloSettingsUpdated(contract IAlloSettings alloSettings)
```

Emitted when allo settings contract is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| alloSettings  | contract IAlloSettings | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

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

### RoundCreated

```solidity
event RoundCreated(bytes32 indexed projectID, address indexed roundAddress, address indexed roundImplementation, address registry)
```

Emitted when a new Round is created



#### Parameters

| Name | Type | Description |
|---|---|---|
| projectID `indexed` | bytes32 | undefined |
| roundAddress `indexed` | address | undefined |
| roundImplementation `indexed` | address | undefined |
| registry  | address | undefined |

### RoundImplementationUpdated

```solidity
event RoundImplementationUpdated(address roundImplementation)
```

Emitted when a Round implementation contract is updated



#### Parameters

| Name | Type | Description |
|---|---|---|
| roundImplementation  | address | undefined |

### VotingContractCreated

```solidity
event VotingContractCreated(address indexed round, address indexed votingImplementation)
```

Emitted when a new Voting is created



#### Parameters

| Name | Type | Description |
|---|---|---|
| round `indexed` | address | undefined |
| votingImplementation `indexed` | address | undefined |



