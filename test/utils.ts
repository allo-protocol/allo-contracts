import { ethers } from 'hardhat';
import { Contract, utils, BigNumber, Signer } from "ethers"

export function send(method: string, params?: Array<any>) {
  return ethers.provider.send(method, params === undefined ? [] : params);
}

export function mineBlock() {
  return send('evm_mine', []);
}

/**
 *  Gets the time of the last block.
 */
export async function currentTime() {
  const { timestamp } = await ethers.provider.getBlock('latest');
  return timestamp;
}

/**
 *  Increases the time in the EVM.
 *  @param seconds Number of seconds to increase the time by
 */
export async function advanceTime(seconds: number) {
  const method = 'evm_increaseTime';
  const params = [seconds];

  await send(method, params);

  await mineBlock();
}

/**
 *  Increases the time in the EVM to as close to a specific timestamp as possible
 */
export async function advanceTimeTo(time: number) {
  const timestamp = await currentTime();
  if (time < timestamp) {
    throw new Error(
      `Time parameter (${time}) is less than now ${timestamp}. You can only fast forward to times in the future.`,
    );
  }

  const secondsBetween = Math.floor(time - timestamp);
  await advanceTime(secondsBetween);
}

/**
 *  Takes a snapshot and returns the ID of the snapshot for restoring later.
 */
export async function takeSnapshot(): Promise<number> {
  const result = await send('evm_snapshot');
  await mineBlock();
  return result;
}

/**
 *  Restores a snapshot that was previously taken with takeSnapshot
 *  @param id The ID that was returned when takeSnapshot was called.
 */
export async function restoreSnapshot(id: number) {
  await send('evm_revert', [id]);
  await mineBlock();
}

export interface MetaTransaction {
  to: string,
  value: string | number | BigNumber,
  data: string,
  operation: number,
}

export interface SafeTransaction extends MetaTransaction {
  safeTxGas: string | number,
  baseGas: string | number,
  gasPrice: string | number,
  gasToken: string,
  refundReceiver: string,
  nonce: string | number
}

export interface SafeSignature {
  signer: string,
  data: string
}

export const signHash = async (signer: Signer, hash: string): Promise<SafeSignature> => {
  const typedDataHash = utils.arrayify(hash)
  const signerAddress = await signer.getAddress()
  return {
      signer: signerAddress,
      data: (await signer.signMessage(typedDataHash)).replace(/1b$/, "1f").replace(/1c$/, "20")
  }
}

export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
  signatures.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()))
  let signatureBytes = "0x"
  for (const sig of signatures) {
      signatureBytes += sig.data.slice(2)
  }
  return signatureBytes
}

export const executeTx = async (safe: Contract, safeTx: SafeTransaction, signatures: SafeSignature[], overrides?: any): Promise<any> => {
  const signatureBytes = buildSignatureBytes(signatures)
  return safe.execTransaction(safeTx.to, safeTx.value, safeTx.data, safeTx.operation, safeTx.safeTxGas, safeTx.baseGas, safeTx.gasPrice, safeTx.gasToken, safeTx.refundReceiver, signatureBytes, overrides || {})
}
