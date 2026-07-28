import { getMemwal } from "./apps/api/src/lib/memwal.js";
import { getAllAgents } from "./apps/api/src/lib/registry.js";
import { rankAgents, type MemoryHit } from "./apps/api/src/lib/ranking.js";

async function run() {
  const query = "crypto data charting/visualization";
  const limit = 10;
  const filters = {};

  const memwal = {
    recall: async () => {
      throw new Error("mock error to trigger fallback");
    }
  };
  const agents = await getAllAgents();

  const recallResults = await Promise.allSettled(
    agents.map(async (entry) => {
      let hits: MemoryHit[] = [];
      try {
        const memories = await memwal.recall({
          query,
          namespace: entry.namespaceId,
          limit: 5,
        });

        hits = memories.results.map((m) => ({
          content: m.text,
          score:   1 - m.distance,
        }));
      } catch (err) {
        hits = [{
          content: "Mocked verifiable memory for agent capabilities since MemWal is upgrading.",
          score: 0.95
        }];
      }

      return { entry, memories: hits };
    })
  );

  const successful = recallResults
    .filter((r): r is PromiseFulfilledResult<{ entry: typeof agents[0]; memories: MemoryHit[] }> =>
      r.status === "fulfilled"
    )
    .map((r) => r.value);

  const ranked = rankAgents(successful, query, filters).slice(0, limit);

  console.log(JSON.stringify({
    query,
    total: ranked.length,
    searched: agents.length,
    agents: ranked,
  }, null, 2));
}

run().catch(console.error);
