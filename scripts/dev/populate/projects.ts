import hre, { ethers } from "hardhat";
import fs from "fs";
import path from "path";

const pinataHost = process.env.PINATA_HOST;
const pinataPort = process.env.PINATA_PORT;
const pinataBaseUrl =
  pinataHost !== undefined && pinataPort !== undefined
    ? `http://${pinataHost}:${pinataPort}`
    : undefined;

function loadFixture(name: string): Buffer {
  const p = path.resolve(__dirname, "../fixtures", `${name}`);
  const data = fs.readFileSync(p);
  return data;
}

async function uploadJSONToPinata(content: any): Promise<string> {
  const { IpfsHash } = await fetch(`${pinataBaseUrl}/pinning/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      Origin: "http://localhost",
      "Content-Type": "application/json",
      Authorization: `Bearer development-token`,
    },
    body: JSON.stringify({
      pinataContent: content,
    }),
  }).then((r) => r.json());

  return IpfsHash;
}

async function uploadFileToPinata(b: Buffer): Promise<string> {
  const body = new FormData();
  body.append("file", new Blob([b]));

  const { IpfsHash } = await fetch(`${pinataBaseUrl}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Origin: "http://localhost",
      Authorization: `Bearer development-token`,
    },
    body,
  }).then((r) => r.json());

  return IpfsHash;
}

async function main() {
  console.log(`🟡 Creating projects (pinataBaseUrl ${pinataBaseUrl})`);
  const network = hre.network;

  const [account1, account2] = await ethers.getSigners();

  if (hre.network.name !== "dev") {
    console.error("This script can only be use in local dev environments");
    process.exit(1);
  }

  console.log("This script populates the local chain");
  const projectRegistry = await ethers.getContractAt(
    "ProjectRegistry",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );

  for (let i = 1; i < 4; i++) {
    let metadataCid = "";

    if (pinataBaseUrl !== undefined) {
      const logo = loadFixture(`projects/${i}/logo.png`);
      const logoCid = await uploadFileToPinata(logo);

      const banner = loadFixture(`projects/${i}/banner.png`);
      const bannerCid = await uploadFileToPinata(banner);

      const metadata = JSON.parse(
        loadFixture(`projects/${i}/metadata.json`).toString()
      );
      metadata.title = `${metadata.title} (${network.config.chainId})`;
      metadata.logoImg = logoCid;
      metadata.bannerImg = bannerCid;

      metadataCid = await uploadJSONToPinata(metadata);
    }

    await projectRegistry.connect(account1).createProject({
      protocol: 1,
      pointer: metadataCid,
    });
  }

  console.log("✅ Projects created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
