// Walrus Mainnet Authenticated SDK Adapter
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { WalrusClient } from "@mysten/walrus";
import dotenv from "dotenv";

dotenv.config();

const localIndex = new Map<string, string[]>();

class WalrusMainnetAdapter {
  private walrusClient;
  private signer;

  constructor() {
    const rawKey = process.env.SUI_PRIVATE_KEY;
    if (!rawKey) {
      throw new Error("Missing SUI_PRIVATE_KEY in .env");
    }

    try {
      // The CLI keystore exports base64 strings with a 1-byte flag prefix (0x00 for ed25519)
      const secretKey = new Uint8Array(Buffer.from(rawKey, "base64")).slice(1);
      this.signer = Ed25519Keypair.fromSecretKey(secretKey);
      console.log(`[Walrus-Mainnet] Initialized with wallet: ${this.signer.toSuiAddress()}`);
    } catch(e: any) {
      throw new Error(`Failed to parse SUI_PRIVATE_KEY: ${e.message}`);
    }

    // Use a community RPC node instead of Mysten's deprecated public fullnode
    const client = new SuiClient({ url: "https://sui-mainnet-endpoint.blockvision.org" });
    this.walrusClient = new WalrusClient({ network: "mainnet", suiClient: client as any });
  }

  async remember(content: string, namespace: string) {
    console.log(`[Walrus-Mainnet] Uploading to Walrus for namespace: ${namespace}`);
    try {
      const blob = new TextEncoder().encode(content);
      let res: any;
      let lastErr: any;
      
      // Retry loop to harden Walrus direct P2P writes
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          res = await this.walrusClient.writeBlob({ blob, epochs: 2, deletable: true, signer: this.signer as any });
          break; // Success
        } catch (err: any) {
          lastErr = err;
          console.warn(`[Walrus-Mainnet] Upload attempt ${attempt} failed:`, err.message);
          if (attempt < 3) {
            const backoff = Math.pow(2, attempt) * 1000;
            console.log(`[Walrus-Mainnet] Retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
          }
        }
      }

      if (!res) {
        throw new Error(`Failed to upload after 3 attempts. Last error: ${lastErr?.message}`);
      }

      if (res.blobId) {
        const arr = localIndex.get(namespace) || [];
        arr.push(res.blobId);
        localIndex.set(namespace, arr);
        console.log(`[Walrus-Mainnet] Success! Blob ID: ${res.blobId}`);
        return { id: res.blobId, job_id: res.blobId };
      } else {
        throw new Error("Finished but no Blob ID was returned");
      }
    } catch(err: any) {
      console.error("[Walrus-Mainnet] Upload Failed:", err.message);
      throw err;
    }
  }
  
  async rememberAndWait(content: string, namespace: string) {
    return this.remember(content, namespace);
  }

  async recall({ query, namespace, limit }: { query?: string, namespace: string, limit?: number }) {
    console.log(`[Walrus-Mainnet] Recalling from namespace: ${namespace}`);
    const blobIds = localIndex.get(namespace) || [];
    const results = [];
    
    for (const blobId of blobIds) {
      try {
        const data = await this.walrusClient.readBlob({ blobId });
        const content = new TextDecoder().decode(data);
        if (!query || content.toLowerCase().includes(query.toLowerCase())) {
          results.push({ text: content, id: blobId, distance: 0 });
        }
      } catch(e: any) {
        console.error(`Failed to read blob ${blobId}`, e.message);
      }
    }
    if (limit && results.length > limit) {
      results.length = limit;
    }
    return { results };
  }

  async analyze(content: string, { namespace }: { namespace: string }) {
    const res = await this.remember(content, namespace);
    return { analysis: "Walrus Mainnet analysis complete.", facts: [], results: [{ id: res.id }], job_ids: [res.id] };
  }

  async analyzeAndWait(content: string, { namespace }: { namespace: string }) {
    return this.analyze(content, { namespace });
  }
}

let instance: WalrusMainnetAdapter;

export async function getMemwal() {
  if (!instance) instance = new WalrusMainnetAdapter();
  return instance;
}
