import 'dotenv/config';
import { memwal } from './src/lib/memwal.js';

async function run() {
  try {
    const job = await memwal.remember("Test developer, 10 yrs experience", "test-agent-1");
    console.log("Remember accepted:", job);
    
    const results = await memwal.recall({ query: "developer", namespace: "test-agent-1" });
    console.log("Recall results:", results.results.length);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
