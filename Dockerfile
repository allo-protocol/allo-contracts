FROM node:20-slim

RUN apt-get update && \
    apt-get install -y python3 curl git build-essential psmisc && \
    apt-get clean

COPY . /app
WORKDIR /app

ENV DEV_CHAIN_ID=313371
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Check when foundry supports dumping events
# https://github.com/foundry-rs/foundry/issues/5906
RUN curl -L https://foundry.paradigm.xyz | bash
RUN ~/.foundry/bin/foundryup

RUN pnpm install
RUN pnpm hardhat compile

EXPOSE 8545/tcp

ENTRYPOINT ./docker/start-chain.sh
