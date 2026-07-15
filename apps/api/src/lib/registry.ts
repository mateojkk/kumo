/**
 * Kumo Namespace Registry (Decentralized)
 *
 * For the hackathon, we use MemWal itself as the global registry database!
 * Kumo tracks registered agents in a shared namespace: `kumo-global-registry`.
 * 
 * Every time an agent calls POST /remember, we store their identity profile
 * into the global registry.
 * 
 * When /discover is called, Kumo searches the global registry to find the agents,
 * and then fans out to search their individual namespaces.
 */

import { memwal } from "./memwal.js";

export interface RegistryEntry {
  namespaceId: string;       // The agent's MemWal namespace
  agentId: string;           // Stable agent identifier
  name?: string;             // Display name
  description?: string;      // What the agent does
  specialties?: string[];    // Tags / skill areas
  registeredAt: string;      
  lastSeen: string;          
  memoryCount: number;       
}

export async function upsertAgent(entry: Omit<RegistryEntry, "registeredAt" | "lastSeen" | "memoryCount"> & { memoryCount?: number }): Promise<RegistryEntry> {
  const now = new Date().toISOString();
  
  const updated: RegistryEntry = {
    ...entry,
    registeredAt: now,
    lastSeen: now,
    memoryCount: entry.memoryCount ?? 1,
  };

  // Decentralized storage: Save the agent profile in the Kumo global registry namespace
  const content = `Agent Profile: ${updated.agentId}. Namespace: ${updated.namespaceId}. Description: ${updated.description || 'none'}. Specialties: ${(updated.specialties || []).join(', ')}`;
  
  // Fire and forget so we don't block the endpoint
  memwal.remember(content, "kumo-global-registry").catch(console.error);

  return updated;
}

export async function getAllAgents(): Promise<RegistryEntry[]> {
  // Decentralized fetch: Ask MemWal for the top 50 registered agents
  const results = await memwal.recall({
    query: "Agent Profile Namespace",
    namespace: "kumo-global-registry",
    limit: 50
  });

  const agents: RegistryEntry[] = [];
  
  // Parse the unstructured memory back into structured profiles
  for (const memory of results.results) {
    const text = memory.text;
    const agentIdMatch = text.match(/Agent Profile: ([^\.]+)/);
    const namespaceMatch = text.match(/Namespace: ([^\.]+)/);
    
    if (agentIdMatch && namespaceMatch) {
      agents.push({
        agentId: agentIdMatch[1].trim(),
        namespaceId: namespaceMatch[1].trim(),
        registeredAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        memoryCount: 1
      });
    }
  }

  // Deduplicate agents (since an agent might have called /remember multiple times)
  const uniqueAgents = Array.from(new Map(agents.map(a => [a.agentId, a])).values());
  return uniqueAgents;
}

export async function getAgent(namespaceId: string): Promise<RegistryEntry | undefined> {
  const agents = await getAllAgents();
  return agents.find(a => a.namespaceId === namespaceId);
}

export async function getAgentCount(): Promise<number> {
  const agents = await getAllAgents();
  return agents.length;
}
