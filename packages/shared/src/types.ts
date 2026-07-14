export interface MemoryItem {
  id?: string;
  content: string;
  timestamp: string;
  tags?: string[];
}

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  rating: number;
  tasksCount: number;
  specialties: string[];
}

export interface RankedAgent extends AgentProfile {
  memoryScore: number;
  topMemories: MemoryItem[];
}

export interface DiscoverFilters {
  minRating?: number;
  specialty?: string;
}

export interface DiscoverRequest {
  query: string;
  filters?: DiscoverFilters;
  limit?: number;
}

export interface DiscoverResponse {
  agents: RankedAgent[];
}

export interface RememberRequest {
  content: string;
  tags?: string[];
  namespace: string;
}

export interface RememberResponse {
  id: string;
  status: string;
  namespace: string;
  timestamp: string;
}

export interface RecallRequest {
  query: string;
  namespace: string;
  limit?: number;
}

export interface RecallResponse {
  memories: MemoryItem[];
}

export interface AnalyzeRequest {
  content: string;
  namespace: string;
}

export interface FactItem {
  fact: string;
  value: string;
}

export interface AnalyzeResponse {
  facts: FactItem[];
}
