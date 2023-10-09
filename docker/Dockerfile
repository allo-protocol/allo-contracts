FROM node:20-slim

RUN apt-get clean && \
    apt-get update && \
    apt-get install -y python3 curl git build-essential psmisc

COPY ../ /app
WORKDIR /app

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

CMD ~/.foundry/bin/anvil --host 0.0.0.0
