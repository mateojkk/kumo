import type { RegistryEntry } from "./registry.js";

export interface MemoryHit {
  content: string;
  score?: number;
}

export interface RankedResult {
  agentId: string;
  namespaceId: string;
  name?: string;
  description?: string;
  specialties?: string[];
  memoryCount: number;
  lastSeen: string;
  relevanceScore: number;   // Combined ranking score (0–1)
  topMemories: MemoryHit[];
}

/**
 * Score a single agent based on:
 *  - Memory relevance (from MemWal semantic search — the primary signal)
 *  - Memory completeness (more stored memories = better established agent)
 *  - Recency (agents who used Kumo recently rank higher)
 *  - Specialty match (bonus if query words appear in agent's self-reported specialties)
 */
export function scoreAgent(
  entry: RegistryEntry,
  memories: MemoryHit[],
  query: string
): number {
  if (memories.length === 0) return 0;

  // 1. Relevance: average semantic score from MemWal (if provided), else presence bonus
  const memRelevance = memories.reduce((sum, m) => sum + (m.score ?? 0.5), 0) / memories.length;

  // 2. Completeness: log-scaled memory count (diminishing returns past 50)
  const completeness = Math.min(Math.log10(entry.memoryCount + 1) / Math.log10(51), 1);

  // 3. Recency: decay over 7 days
  const ageMs = Date.now() - new Date(entry.lastSeen).getTime();
  const recency = Math.max(0, 1 - ageMs / (7 * 24 * 60 * 60 * 1000));

  // 4. Specialty match bonus
  const queryTokens = query.toLowerCase().split(/\s+/);
  const specialtyTokens = (entry.specialties ?? []).map(s => s.toLowerCase());
  const matchCount = queryTokens.filter(t => specialtyTokens.some(s => s.includes(t))).length;
  const specialtyBonus = Math.min(matchCount / Math.max(queryTokens.length, 1), 1);

  // Weighted sum
  return (
    memRelevance   * 0.50 +
    completeness   * 0.20 +
    recency        * 0.15 +
    specialtyBonus * 0.15
  );
}

export function rankAgents(
  results: Array<{ entry: RegistryEntry; memories: MemoryHit[] }>,
  query: string,
  filters: { minMemories?: number } = {}
): RankedResult[] {
  return results
    .filter(({ entry }) => entry.memoryCount >= (filters.minMemories ?? 0))
    .map(({ entry, memories }) => ({
      agentId:        entry.agentId,
      namespaceId:    entry.namespaceId,
      name:           entry.name,
      description:    entry.description,
      specialties:    entry.specialties,
      memoryCount:    entry.memoryCount,
      lastSeen:       entry.lastSeen,
      relevanceScore: scoreAgent(entry, memories, query),
      topMemories:    memories.slice(0, 3),
    }))
    .filter(r => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
