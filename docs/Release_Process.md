# Allo Contract Release Process

         +-------------------+
         |    Main Branch    |
         +-------------------+
                   |
                   | (1) Create version branch
                   |
                   V
         +-------------------+
         |   Version Branch  |
         +-------------------+
                   |
                   | (2) Contract changes linked to AIP
                   | (3) Test Contracts
                   | (4) Submit for audit
                   |
                   V
      +-----------------------+
      |  Implement Audit      |
      |  Changes on Version   |
      |       Branch          |
      +-----------------------+
                   |
                   | (5) Pull Request
                   |
                   V
         +-------------------+
         |    Main Branch    |
         +-------------------+
                   |
                   | (6) Update Change Log
                   | (7) Release Version
                   |
                   V
         +-------------------+
         |     Published     |
         |   Release Version |
         +-------------------+
                   |
                   | (9) Delete Version Branch
                   |
                   V
         +-------------------+
         |    Main Branch    |
         +-------------------+


This document provides an overview of the deployment process for the Allo contract, including version control, auditing, testing, and release management.

## Repository Structure

- **Main Branch**: The stable and audited code is always available on the main branch. This branch represents the production-ready version of the contract.

- **Version Branch**: Any changes made to the contract after an audit are merged into a version branch. This branch serves as a staging area for ongoing development and testing before the next audit.

## Development Workflow

1. **Version Branch Creation**: After completing an audit, a new version branch is created. All subsequent changes will be merged into this branch until the next audit.

2. **Testing Contracts**: The version branch contains its own set of contracts specifically used for testing purposes. Developers can make changes, add new features, or fix bugs on this branch.

3. **Associated AIP**: Every change made to the contracts is associated with an Allo Improvement Proposal (AIP). The AIP provides a clear documentation of the rationale, scope, and impact of the change.

4. **Audit Submission**: Once the version branch is considered ready for audit, it is submitted to the auditing team for a thorough review. The auditors examine the codebase, security measures, and overall compliance with best practices.

5. **Implementing Audit Changes**: If any issues or suggestions are raised during the audit, they are addressed and implemented on the version branch. The necessary modifications and fixes are made to enhance the contract's security and functionality.

6. **Pull Request to Main Branch**: After successfully addressing the audit changes, a pull request (PR) is initiated from the version branch to the main branch. This PR includes all the approved changes since the last audit.

7. **Change Log and AIPs**: The change log is updated to include the list of AIPs associated with the merged changes. This provides transparency and traceability for each modification made to the contract.

8. **Release Version**: Once the PR is merged into the main branch, a release version is published on GitHub. This version represents the latest audited and approved version of the contract, ready for production use.

9. **Version Branch Deletion**: After merging the changes into the main branch and publishing the release version, the version branch is deleted. This ensures a clean and organized repository structure.

## Conclusion

The deployment process for the Allo contract follows a systematic approach that prioritizes stability, auditing, and version control. By adhering to this process, we ensure that our contract remains secure, reliable, and compliant with industry standards.
