import dotenv from "dotenv";
import { MemWal } from "@mysten-incubation/memwal";

dotenv.config();

class MemWalHardenedAdapter {
  private memwalClient: any;

  constructor(memwalClient: any) {
    this.memwalClient = memwalClient;
  }

  async remember(content: string, namespace: string) {
    console.log(`[MemWal SDK] remember for namespace: ${namespace}`);
    let res: any;
    let lastErr: any;
    
    // Retry loop to harden API writes
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        res = await this.memwalClient.remember(content, namespace);
        break; // Success
      } catch (err: any) {
        lastErr = err;
        console.warn(`[MemWal SDK] Upload attempt ${attempt} failed:`, err.message);
        if (attempt < 3) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`[MemWal SDK] Retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    if (!res) {
      throw new Error(`Failed to upload after 3 attempts. Last error: ${lastErr?.message}`);
    }
    
    console.log(`[MemWal SDK] Success! Job ID: ${res.job_id || res.id || 'unknown'}`);
    return res;
  }
  
  async rememberAndWait(content: string, namespace: string) {
    console.log(`[MemWal SDK] rememberAndWait for namespace: ${namespace}`);
    let res: any;
    let lastErr: any;
    
    // Retry loop to harden API writes
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        res = await this.memwalClient.rememberAndWait(content, namespace);
        break; // Success
      } catch (err: any) {
        lastErr = err;
        console.warn(`[MemWal SDK] Upload attempt ${attempt} failed:`, err.message);
        if (attempt < 3) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`[MemWal SDK] Retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    if (!res) {
      throw new Error(`Failed to upload after 3 attempts. Last error: ${lastErr?.message}`);
    }
    
    console.log(`[MemWal SDK] Success!`);
    return res;
  }

  async recall(opts: { query?: string, namespace: string, limit?: number }) {
    console.log(`[MemWal SDK] recall from namespace: ${opts.namespace}`);
    let res: any;
    let lastErr: any;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        res = await this.memwalClient.recall(opts);
        break; 
      } catch (err: any) {
        lastErr = err;
        console.warn(`[MemWal SDK] Recall attempt ${attempt} failed:`, err.message);
        if (attempt < 3) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`[MemWal SDK] Retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    if (!res) {
      throw new Error(`Failed to recall after 3 attempts. Last error: ${lastErr?.message}`);
    }
    return res;
  }

  async analyze(content: string, opts: { namespace: string }) {
    console.log(`[MemWal SDK] analyze for namespace: ${opts.namespace}`);
    let res: any;
    let lastErr: any;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        res = await this.memwalClient.analyze(content, opts);
        break; 
      } catch (err: any) {
        lastErr = err;
        console.warn(`[MemWal SDK] Analyze attempt ${attempt} failed:`, err.message);
        if (attempt < 3) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`[MemWal SDK] Retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    if (!res) {
      throw new Error(`Failed to analyze after 3 attempts. Last error: ${lastErr?.message}`);
    }
    return res;
  }

  async analyzeAndWait(content: string, opts: { namespace: string }) {
    console.log(`[MemWal SDK] analyzeAndWait for namespace: ${opts.namespace}`);
    let res: any;
    let lastErr: any;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        res = await this.memwalClient.analyzeAndWait(content, opts);
        break; 
      } catch (err: any) {
        lastErr = err;
        console.warn(`[MemWal SDK] Analyze attempt ${attempt} failed:`, err.message);
        if (attempt < 3) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.log(`[MemWal SDK] Retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    if (!res) {
      throw new Error(`Failed to analyze after 3 attempts. Last error: ${lastErr?.message}`);
    }
    return res;
  }
}

let instance: MemWalHardenedAdapter;

export async function getMemwal() {
  if (!instance) {
    const key = process.env.MEMWAL_PRIVATE_KEY || process.env.SUI_PRIVATE_KEY;
    if (!key || !process.env.MEMWAL_ACCOUNT_ID) {
      throw new Error(
        "Missing MEMWAL_PRIVATE_KEY or MEMWAL_ACCOUNT_ID env vars. " +
        "Get them from https://memory.walrus.xyz dashboard."
      );
    }
    
    const client = MemWal.create({
      key: key,
      accountId: process.env.MEMWAL_ACCOUNT_ID,
      serverUrl: process.env.MEMWAL_SERVER_URL || "https://relayer.memory.walrus.xyz",
    });

    instance = new MemWalHardenedAdapter(client);
  }
  return instance;
}
