export SKIP_CONFIRMATIONS=true

TIMEFORMAT='(🟢 %3R seconds)';

time pnpm run deploy-project-registry dev && \
time pnpm hardhat run scripts/dev/populate/projects.ts --network dev && \
\
time pnpm run deploy-program-factory dev && \
time pnpm run deploy-program-implementation dev && \
time pnpm run link-program-implementation dev && \
\
time pnpm run deploy-qf-factory dev && \
time pnpm run deploy-qf-implementation dev && \
time pnpm run link-qf-implementation dev && \
\
time pnpm run deploy-merkle-factory dev && \
time pnpm run deploy-merkle-implementation dev && \
time pnpm run link-merkle-implementation dev && \
\
time pnpm run deploy-direct-factory dev && \
time pnpm run deploy-direct-implementation dev && \
time pnpm run link-direct-implementation dev && \
\
time pnpm run deploy-allo-settings dev && \
time pnpm run set-protocol-fee dev && \
\
time pnpm run deploy-round-factory dev && \
time pnpm run deploy-round-implementation dev && \
time pnpm run link-round-implementation dev && \
time pnpm run link-allo-settings dev

# pnpm run create-program dev
# pnpm run create-qf-contract dev
# pnpm run create-merkle-contract dev
# pnpm run create-round dev
