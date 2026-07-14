import { MemWal } from "@mysten-incubation/memwal";

if (!process.env.MEMWAL_DELEGATE_KEY || !process.env.MEMWAL_ACCOUNT_ID) {
  throw new Error(
    "Missing MEMWAL_DELEGATE_KEY or MEMWAL_ACCOUNT_ID env vars. " +
    "Get them from https://memory.walrus.xyz dashboard."
  );
}

export const memwal = MemWal.create({
  key: process.env.MEMWAL_DELEGATE_KEY,
  accountId: process.env.MEMWAL_ACCOUNT_ID,
  serverUrl: "https://relayer.memory.walrus.xyz",
});
