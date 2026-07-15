export async function getMemwal() {
  if (!process.env.MEMWAL_DELEGATE_KEY || !process.env.MEMWAL_ACCOUNT_ID) {
    throw new Error(
      "Missing MEMWAL_DELEGATE_KEY or MEMWAL_ACCOUNT_ID env vars. " +
      "Get them from https://memory.walrus.xyz dashboard."
    );
  }

  // Bypass Vercel esbuild's CJS bundling to force a native ESM import
  const { MemWal } = await new Function('return import("@mysten-incubation/memwal")')();
  
  return MemWal.create({
    key: process.env.MEMWAL_DELEGATE_KEY,
    accountId: process.env.MEMWAL_ACCOUNT_ID,
    serverUrl: "https://relayer.memory.walrus.xyz",
  });
}
