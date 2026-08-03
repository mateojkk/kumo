import { getMemwal } from "./src/lib/memwal.ts";
process.env.MEMWAL_DELEGATE_KEY = "dummy_key";
process.env.MEMWAL_ACCOUNT_ID = "dummy_id";
async function test() {
  try {
    const m = await getMemwal();
    console.log("Success:", !!m);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
