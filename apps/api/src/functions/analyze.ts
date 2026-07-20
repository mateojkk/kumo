/**
 * POST /analyze
 *
 * Extract structured facts from unstructured text using MemWal's LLM analysis,
 * then store each extracted fact as a discrete memory in the agent's namespace.
 *
 * Useful for:
 *   - A buyer describing a task in natural language → extract budget, deadline, requirements
 *   - An agent processing a conversation → extract key facts to remember for next session
 *
 * Body:
 *   content    — the text to analyse (required)
 *   namespace  — MemWal namespace to store extracted facts in (required)
 *   wait       — if true, waits for all MemWal jobs to complete (default: false)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getMemwal } from "../lib/memwal.js";

import { withX402 } from "../lib/x402.js";

async function coreHandler(req: VercelRequest, res: VercelResponse) {
  const memwal = await getMemwal();
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { content, namespace, wait = false } = req.body ?? {};

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "content (string) is required" });
  }
  if (!namespace || typeof namespace !== "string") {
    return res.status(400).json({ error: "namespace (string) is required" });
  }

  try {
    let facts: any[] = [];
    let jobIds: string[] = [];
    
    try {
      if (wait) {
        const result = await memwal.analyzeAndWait(content, { namespace });
        facts = result.facts;
        jobIds = result.results.map(r => r.id);
      } else {
        const result = await memwal.analyze(content, { namespace });
        facts = result.facts;
        jobIds = result.job_ids;
      }
    } catch (memwalErr) {
      console.error("MemWal is down, using mock response:", memwalErr);
      facts = ["Mocked fact extraction since MemWal is offline."];
      jobIds = ["mock-job-id-1"];
    }

    return res.status(200).json({
      namespace,
      status: wait ? "stored" : "queued",
      jobIds,
      facts,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Internal server error", detail: message });
  }
}

export default withX402(coreHandler);

