import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { WalrusClient } from "@mysten/walrus";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const rawKey = process.env.SUI_PRIVATE_KEY!;
  const secretKey = new Uint8Array(Buffer.from(rawKey, "base64")).slice(1);
  const signer = Ed25519Keypair.fromSecretKey(secretKey);

  const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
  const walrus = new WalrusClient({ network: "mainnet", suiClient: client }); 

  console.log("Wallet:", signer.toSuiAddress());
  
  const blob = new TextEncoder().encode("Hello Walrus test!");
  console.log("Uploading blob...");
  const res = await walrus.writeBlob({ blob, epochs: 2, deletable: true, signer });
  console.log("Success! Blob ID:", res.blobId);
}
run().catch(console.error);
