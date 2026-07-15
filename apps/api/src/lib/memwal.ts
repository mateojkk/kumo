export async function getMemwal() {
  if (!process.env.MEMWAL_DELEGATE_KEY || !process.env.MEMWAL_ACCOUNT_ID) {
    throw new Error(
      "Missing MEMWAL_DELEGATE_KEY or MEMWAL_ACCOUNT_ID env vars. " +
      "Get them from https://memory.walrus.xyz dashboard."
    );
  }

  // Use dynamic import to bypass Vercel's CJS bundling issue with ESM-only packages
  const { MemWal } = await import("@mysten-incubation/memwal");
  
  return MemWal.create({
    key: process.env.MEMWAL_DELEGATE_KEY,
    accountId: process.env.MEMWAL_ACCOUNT_ID,
    serverUrl: "https://relayer.memory.walrus.xyz",
  });
}
