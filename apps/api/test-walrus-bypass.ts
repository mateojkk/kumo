import { getMemwal } from './src/lib/memwal.js';

async function main() {
  const memwal = await getMemwal();
  console.log("Testing direct Walrus bypass...");

  try {
    const job = await memwal.remember("Kumo is reviving with a direct HTTP bypass to Walrus!", "kumo-test-bypass");
    console.log("Stored successfully. Blob ID:", job.id);

    console.log("Recalling from Walrus...");
    const results = await memwal.recall({ namespace: "kumo-test-bypass" });
    console.log("Recalled results:", results);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

main();
