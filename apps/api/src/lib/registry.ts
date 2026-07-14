/**
 * Kumo Namespace Registry
 *
 * MemWal recall() is scoped to a single namespace — you can't broadcast
 * a query across all agents' memories without knowing their namespace IDs.
 *
 * This registry is Kumo's core value: agents opt in by calling POST /remember,
 * and the registry tracks their namespace IDs so /discover can fan out across them.
 *
 * For the hackathon: in-memory store (survives across requests on Vercel via
 * module-level state, but resets on cold starts). For production: back this
 * with a persistent store (Redis, Upstash, or even a MemWal namespace for Kumo itself).
 *
 * We also store a lightweight agent profile alongside the namespace ID so
 * /discover can return useful metadata without a second MemWal roundtrip.
 */

export interface RegistryEntry {
  namespaceId: string;       // The agent's MemWal namespace
  agentId: string;           // Stable agent identifier (set by agent via x-agent-id header)
  name?: string;             // Display name (optional, agent-provided)
  description?: string;      // What the agent does (optional, agent-provided)
  specialties?: string[];    // Tags / skill areas (optional)
  registeredAt: string;      // ISO timestamp of first /remember call
  lastSeen: string;          // ISO timestamp of most recent /remember call
  memoryCount: number;       // Running count of stored memories
}

// In-memory store — module-level so it survives warm requests
const registry = new Map<string, RegistryEntry>();

export function upsertAgent(entry: Omit<RegistryEntry, "registeredAt" | "lastSeen" | "memoryCount"> & { memoryCount?: number }): RegistryEntry {
  const existing = registry.get(entry.namespaceId);
  const now = new Date().toISOString();

  const updated: RegistryEntry = {
    ...entry,
    registeredAt: existing?.registeredAt ?? now,
    lastSeen: now,
    memoryCount: (existing?.memoryCount ?? 0) + (entry.memoryCount ?? 1),
  };

  registry.set(entry.namespaceId, updated);
  return updated;
}

export function getAgent(namespaceId: string): RegistryEntry | undefined {
  return registry.get(namespaceId);
}

export function getAllAgents(): RegistryEntry[] {
  return Array.from(registry.values());
}

export function getAgentCount(): number {
  return registry.size;
}
