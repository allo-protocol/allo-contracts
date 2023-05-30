import { BytesLike } from "ethers";
import { ethers } from "hardhat";

export type Vote = {
  token: string;
  amount: string;
  grantAddress: string;
  projectId: string;
  applicationIndex: number;
};

export const encodeVotes = (votes: Vote[]): BytesLike[] => {
  let encodedVotes: BytesLike[] = [];
  for (let i = 0; i < votes.length; i++) {
    encodedVotes.push(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "address", "bytes32", "uint256"],
        [
          votes[i].token,
          votes[i].amount,
          votes[i].grantAddress,
          votes[i].projectId,
          votes[i].applicationIndex,
        ]
      )
    );
  }
  return encodedVotes;
};

export const encodeMerklePayoutStrategyInitParams = (
  token: string,
  amount: string,
): BytesLike => {
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint256"],
    [
      token,
      amount,
    ]
  );
};

export function encodeDistributionParameters(
  merkleRoot: string,
  protocol: number,
  pointer: string
) {
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "tuple(uint256 protocol, string pointer)"],
    [merkleRoot, { protocol, pointer }]
  );
}

export const convertToBytes32 = (value: string): string => {
  const isBytes32 = /^0x[0-9a-fA-F]{64}$/;

  if (isBytes32.test(value)) {
    return value;
  }

  // Convert the string to a bytes32 value
  const bytes32Value = ethers.utils.formatBytes32String(value);
  return bytes32Value;
}