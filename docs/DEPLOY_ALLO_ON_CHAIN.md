# Deployment Process for Allo Contracts on a New Chain

This document provides a comprehensive guide on deploying the Allo contracts onto a new chain. The purpose of this document is to facilitate the sharing of the deployment process with different chains interested in deploying Allo. It also serves as a reference for estimating the timeline required for the deployment.

## Prerequisites

Before proceeding with the deployment, ensure that the new chain meets the following prerequisites:

- Solidity Support: The chain should support Solidity for deploying smart contracts.
- Development/Deployment via Hardhat: The chain should support development and deployment using Hardhat, a popular development environment for Ethereum.
- Contract Upgrades: The chain should support contract upgrades, either through the use of `@openzeppelin/hardhat-upgrades` or an equivalent library.
- Graph Integration: The chain should support indexing events through The Graph or a similar indexing solution.
- Test Network: The chain should have a test network available for deploying and testing the Allo contracts.

## Deployment Process

                      +-------------------+
                      |  Deploy Registry  |
                      +-------------------+
                               |
                               | 
                               V
                   +--------------------------+
                   | Deploy Factory Contracts |
                   +--------------------------+
                               |
                               |
                               V
                    +----------------------+
                    | Deploy Allo Settings |
                    +----------------------+
                               |
                               |
                               V
                 +---------------------------------+
                 | Deploy Implementation Contracts |
                 +---------------------------------+
                               |
                               |
                               V
            +-------------------------------------------+
            | Link Factory Contracts to Implementations |
            +-------------------------------------------+
                               |
                               |
                               V
              +------------------------------------+
              | Verify Contracts on Block Explorer |
              +------------------------------------+
                               |
                               |
                               V
                    +----------------------+
                    | Update Documentation |
                    +----------------------+
                               |
                               |
                               V
               +-------------------------------+
               | Test on Chain's Test Network  |
               +-------------------------------+
                               |
                               |
                               V
               +--------------------------------+
               | Repeat Process on Main Network |
               +--------------------------------+
                               |
                               |
                               V
       +-----------------------------------------------------+
       | Client Applications Adapted to Support New Networks |
       +-----------------------------------------------------+


Follow the steps below to deploy the Allo contracts onto the new chain:

1. **Deploy Registry Contract**: Start by deploying the registry contract, which will serve as the storage for all Allo projects.

2. **Deploy Factory Contracts**: Deploy the necessary factory contracts, including the round and allocation strategy factories. These factories will be responsible for creating instances of rounds and allocation strategies.

3. **Deploy Allo Settings Contract**: Deploy the Allo settings contract, which will hold various configuration parameters for Allo.

4. **Deploy Implementation Contracts**: Deploy the implementation contracts for the round and allocation strategy. These contracts contain the logic and functionality required for Allo operations.

5. **Link Factory Contracts to Implementations**: Establish the connection between the factory contracts and their corresponding implementation contracts. This linkage enables the creation of new instances of rounds and allocation strategies using the deployed implementations.

6. **Verify Contracts on Block Explorer**: Ensure that all deployed contracts are verified on the block explorer of the new chain. Verification provides transparency and allows users to inspect the contract code and its interactions.

7. **Update Documentation**: Update the relevant documentation to reflect the deployment of Allo contracts on the new chain. Include details about the deployed contracts, their addresses, and any specific instructions or considerations related to the new chain.

## Testing and Mainnet Deployment

Before deploying the contracts on the mainnet, it is essential to thoroughly test the deployment process on the test network of the new chain. This ensures that the contracts function correctly and the deployment flow works as expected. The testing phase also provides an opportunity for the team to validate that the client applications, such as Grants Stack, can support the newly deployed contracts on the new chain.

Once the testing phase on the test network is successfully completed and the team confirms that the deployment flow works seamlessly, the process can be repeated on the mainnet. 

## Timeline

The deployment process typically takes approximately two weeks to allow ample time for testing the contracts and ensuring the client applications can accommodate the new networks. However, the actual timeline may vary depending on the complexity of the deployment and any specific requirements or challenges posed by the new chain.

## Client Considerations

After the contracts are successfully deployed, client applications, such as Grants Stack, need to make the necessary changes to support the new networks. This may include updating network configurations, adjusting contract interaction logic, and ensuring compatibility with the deployed Allo contracts on the new chain.

By following this deployment process and considering the client integration, the Allo contracts can be effectively deployed on a new chain, enabling wider adoption and usage of the Allo protocol.

## Deploy Steps

The actual steps of deploying Allo onto a new chain can be found [HERE](./DEPLOY_STEPS.md)
