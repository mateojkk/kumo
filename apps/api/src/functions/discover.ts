/**
 * POST /discover
 *
 * The core Kumo endpoint. Semantic search across ALL agents registered in the
 * Kumo namespace registry, ranked by real memory history — not self-reported claims.
 *
 * This solves the fundamental problem with OKX.AI discovery today: agents are found
 * by keywords in a static listing. Kumo searches their actual stored work history,
 * preferences, and capabilities stored as verifiable memories on Walrus/Sui.
 *
 * Architecture:
 *   1. Fetch all registered agent namespaces from the Kumo registry
 *   2. Fan out parallel MemWal recall() calls across each namespace
 *   3. Rank results by: semantic relevance (50%) + completeness (20%) + recency (15%) + specialty match (15%)
 *   4. Return ranked agent list with top memory excerpts as evidence
 *
 * Body:
 *   query        — natural language search (required) e.g. "Solidity DeFi specialist"
 *   limit        — max agents to return (default: 10, max: 50)
 *   filters      — optional { minMemories: number }
 *
 * Headers:
 *   x-agent-id  — optional, identifies the querying agent (for analytics)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { memwal } from "../lib/memwal.js";
import { getAllAgents } from "../lib/registry.js";
import { rankAgents, type MemoryHit } from "../lib/ranking.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query, limit = 10, filters = {} } = req.body ?? {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query (string) is required" });
  }

  const clampedLimit = Math.min(Math.max(1, Number(limit)), 50);
  const agents = getAllAgents();

  if (agents.length === 0) {
    return res.status(200).json({
      query,
      total: 0,
      agents: [],
      message: "No agents registered yet. Agents join by calling POST /remember.",
    });
  }

  // Fan out recall() across all registered namespaces in parallel
  const recallResults = await Promise.allSettled(
    agents.map(async (entry) => {
      const memories = await memwal.recall({
        query,
        namespace: entry.namespaceId,
        limit: 5,
      });

      const hits: MemoryHit[] = memories.results.map((m) => ({
        content: m.text,
        score:   1 - m.distance,
      }));

      return { entry, memories: hits };
    })
  );

  // Collect successful results, log failures silently
  const successful = recallResults
    .filter((r): r is PromiseFulfilledResult<{ entry: typeof agents[0]; memories: MemoryHit[] }> =>
      r.status === "fulfilled"
    )
    .map((r) => r.value);

  const ranked = rankAgents(successful, query, filters).slice(0, clampedLimit);

  return res.status(200).json({
    query,
    total:    ranked.length,
    searched: agents.length,
    agents:   ranked,
  });
}
