/**
 * GET /agent/:id
 *
 * Returns the Kumo registry profile for a specific agent namespace,
 * plus a summary of their recent memories (via MemWal recall).
 *
 * Query params:
 *   preview — number of recent memories to include (default: 3, max: 10)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { memwal } from "../lib/memwal.js";
import { getAgent } from "../lib/registry.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ error: "Agent namespace ID is required" });

  const entry = await getAgent(id);
  if (!entry) {
    return res.status(404).json({
      error: "Agent not found in Kumo registry",
      hint: "The agent must call POST /remember at least once to register.",
    });
  }

  const previewCount = Math.min(Number(req.query.preview ?? 3), 10);

  try {
    // Pull a sample of memories to show what the agent knows / has done
    const memories = await memwal.recall({
      query: entry.description ?? entry.name ?? "recent work",
      namespace: entry.namespaceId,
      limit: previewCount,
    });

    return res.status(200).json({
      ...entry,
      memoryPreview: memories,
    });
  } catch {
    // Return profile even if MemWal recall fails
    return res.status(200).json({
      ...entry,
      memoryPreview: [],
      memoryError: "Could not fetch memory preview",
    });
  }
}
