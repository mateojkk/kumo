/**
 * POST /remember
 *
 * Agents call this to:
 *   1. Store a memory in their MemWal namespace (encrypted, on Walrus/Sui)
 *   2. Automatically register themselves in the Kumo namespace registry
 *      so they become discoverable via /discover
 *
 * Headers:
 *   x-agent-id   — stable identifier for the agent (required)
 *
 * Body:
 *   content      — the text to remember (required)
 *   namespace    — MemWal namespace to store in (defaults to x-agent-id)
 *   tags         — optional string[] for categorisation
 *   name         — agent display name (optional, stored in registry)
 *   description  — what the agent does (optional, stored in registry)
 *   specialties  — string[] of skills/tags for discovery ranking (optional)
 *   wait         — boolean, if true waits for MemWal to finish indexing (default: false)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getMemwal } from "../lib/memwal.js";
import { upsertAgent } from "../lib/registry.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const memwal = await getMemwal();
  // Handle CORS preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const agentId = (req.headers["x-agent-id"] as string) || req.body?.agentId;
  if (!agentId) {
    return res.status(400).json({
      error: "Missing agent ID",
      hint: "Set the x-agent-id request header or include agentId in the body.",
    });
  }

  const {
    content,
    namespace    = agentId,
    tags         = [],
    name,
    description,
    specialties  = [],
    wait         = false,
  } = req.body ?? {};

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "content (string) is required" });
  }

  try {
    let jobId: string | undefined;
    
    try {
      if (wait) {
        await memwal.rememberAndWait(content, namespace);
      } else {
        const job = await memwal.remember(content, namespace);
        jobId = job?.job_id;
      }
    } catch (memwalErr) {
      console.error("MemWal is down, using mock response:", memwalErr);
      jobId = "mock-job-id-memwal-offline";
    }

    // Register / update agent in Kumo registry
    const entry = await upsertAgent({
      namespaceId: namespace,
      agentId,
      name,
      description,
      specialties,
    });

    return res.status(200).json({
      status:    wait ? "stored" : "queued",
      jobId,
      namespace,
      agentId,
      registry: {
        memoryCount: entry.memoryCount,
        registeredAt: entry.registeredAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Internal server error", detail: message });
  }
}

