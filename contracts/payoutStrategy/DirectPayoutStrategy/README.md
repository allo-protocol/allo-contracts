## In review applications

The `setApplicationsInReview` is used for indicating a group of applications starts the REVIEW process. For this, the function uses a mapping of packed array of booleans representing the status of 256 applications each row, similar to how the RoundImplementation contracts handles application statuses.

To determine if an application is IN REVIEW status, the `isApplicationInReview` function can be used which checks that the given `_applicationIndex` is on PENDING status on the round contract and flagged as 1 on `inReviewApplicationsBitMap` in this contract.

## Payout Flows

The `payout` function is used for paying grants in two different ways:
- From a given address using `ERC20.transferFrom`
- From a Safe multisig using the [AllowanceModule](https://github.com/safe-global/safe-modules/tree/master/allowances)

To complete any payment it is required for the project application to be on status ACCEPTED.

The `payout` function receives the `_payment` parameter which is typed as:

```
struct Payment {
  address vault;
  address token;
  uint96 amount;
  address grantAddress;
  bytes32 projectId;
  uint256 applicationIndex;
  address allowanceModule;
  bytes allowanceSignature;
}
```

- **vault**: Address where the funds to make the payment are deposited
- **token**: Token used for payment, address(0) represents ETH
- **amount**: Amount being paid
- **grantAddress**: Receiving address
- **projectId**: Project Id
- **applicationIndex**: Application index
- **allowanceModule**: AllowanceModule address
- **allowanceSignature**: Allowance delegate signature


### ERC20.transferFrom

Using `transferFrom` only allow to pay with ERC20 tokens, and requires the indicated vault previously approved this contract to use such ERC20 token on it behalf.

### Safe multisig + AllowanceModule

This flow is used when the `_payment.allowanceModule` is different from address(0), and it requires `_payment.vault` to be a Safe multisig and some previous setup.

The `AllowanceModule` contract is a registry of transfer allowances on a Safe that can be used by specific accounts. For this the contract needs to be enabled as a module on the Safe that holds the assets that should be transferred. The registry is written to be used with ERC20 tokens and Ether (represented by the zero address).

All transfer allowances are specific to a Safe, token and delegate. A delegate is an account that can authorize transfers (via a signature).

Note: This is not about allowances on an ERC20 token contract.

### **Setting up AllowancesModule**

The contract is designed as a single point registry. This way not every Safe needs to deploy their own module and it is possible that this module is shared between different Safes.

To set an allowance for a Safe it is first required that the Safe adds a delegate. For this a Safe transaction needs to be executed that calls addDelegate. This method will add the specified delegate for msg.sender, which is the Safe in case of a Safe transaction. The addDelegate method can be called multiple times with the same address for a delegate without failure.

Once a delegate has been enabled it is possible to set an allowance for that delegate. For this a Safe transaction needs to be executed that calls setAllowance.

### **Transfer authorization**

Transfer are authorized by the delegates and must be within their allowance. To authorize a transfer the delegate needs to generate a signature. The allowance module uses the same [signature scheme as the Gnosis Safe](https://docs.gnosis.io/safe/docs/contracts_signatures/), except that the allowance module does not support contract signatures or approved hashes.

The allowance module signatures are EIP-712 based. And uses the following scheme:

- EIP712Domain
```json
{
    "EIP712Domain": [
        { "type": "uint256", "name": "chainId" },
        { "type": "address", "name": "verifyingContract" }
    ]
}
```

- AllowanceTransfer
```json
{
    "AllowanceTransfer": [
        { "type": "address", "name": "safe" },
        { "type": "address", "name": "token" },
        { "type": "uint96", "name": "amount" },
        { "type": "address", "name": "paymentToken" },
        { "type": "uint96", "name": "payment" },
        { "type": "uint16", "name": "nonce" },
    ]
}
```
