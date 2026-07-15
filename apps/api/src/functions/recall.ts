/**
 * POST /recall
 *
 * Semantic search over a specific agent's stored memories.
 * Use this when an agent wants to load its own context, or when
 * one agent wants to read another agent's public memory namespace.
 *
 * Body:
 *   query      — natural language search query (required)
 *   namespace  — MemWal namespace to search (required)
 *   limit      — max results to return (default: 5, max: 20)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getMemwal } from "../lib/memwal.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const memwal = await getMemwal();
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query, namespace, limit = 5 } = req.body ?? {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query (string) is required" });
  }
  if (!namespace || typeof namespace !== "string") {
    return res.status(400).json({
      error: "namespace (string) is required",
      hint: "Use the agentId or namespace you used when calling /remember.",
    });
  }

  const clampedLimit = Math.min(Math.max(1, Number(limit)), 20);

  try {
    const memories = await memwal.recall({
      query,
      namespace,
      limit: clampedLimit,
    });

    return res.status(200).json({
      namespace,
      query,
      count:   memories.results.length,
      memories: memories.results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "MemWal error", detail: message });
  }
}
