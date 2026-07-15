/**
 * GET /registry
 *
 * Returns all agents currently registered in the Kumo namespace registry.
 * Useful for debugging, dashboards, and admin views.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAllAgents, getAgentCount } from "../lib/registry.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const agents = await getAllAgents();

  return res.status(200).json({
    count: await getAgentCount(),
    agents,
  });
}
