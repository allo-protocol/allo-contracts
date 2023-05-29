import { ethers } from "ethers";

export const createProjectId = (
  projectChainId: number,
  projectRegistryAddress: string,
  projectNumber: number
) =>
  ethers.utils.solidityKeccak256(
    ["uint256", "address", "uint256"],
    [projectChainId, projectRegistryAddress, projectNumber]
  );
