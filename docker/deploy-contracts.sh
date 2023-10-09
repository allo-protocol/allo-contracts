export SKIP_CONFIRMATIONS=true

pnpm run deploy-project-registry dev

pnpm run deploy-program-factory dev
pnpm run deploy-program-implementation dev
pnpm run link-program-implementation dev

pnpm run deploy-qf-factory dev
pnpm run deploy-qf-implementation dev
pnpm run link-qf-implementation dev

pnpm run deploy-merkle-factory dev
pnpm run deploy-merkle-implementation dev
pnpm run link-merkle-implementation dev

pnpm run deploy-direct-factory dev
pnpm run deploy-direct-implementation dev
pnpm run link-direct-implementation dev

pnpm run deploy-allo-settings dev
pnpm run set-protocol-fee dev

pnpm run deploy-round-factory dev
pnpm run deploy-round-implementation dev
pnpm run link-round-implementation dev
pnpm run link-allo-settings dev

# pnpm run create-program dev
# pnpm run create-qf-contract dev
# pnpm run create-merkle-contract dev
# pnpm run create-round dev

pnpm hardhat run scripts/dev/populate.ts --network dev
