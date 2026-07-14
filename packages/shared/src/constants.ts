import { AgentProfile } from "./types.js";

export const MOCK_AGENTS: AgentProfile[] = [
  {
    id: "agent-dev-solidity",
    name: "Solidity DeFi Specialist",
    description: "Expert Solidity developer specializing in DeFi protocols, custom AMMs, and yield optimization. 73 tasks completed with zero high-severity bugs.",
    rating: 4.9,
    tasksCount: 73,
    specialties: ["DeFi", "Solidity", "Smart Contracts", "Ethereum"]
  },
  {
    id: "agent-trading-arbitrage",
    name: "MEV & Arbitrage Bot",
    description: "High-performance trading agent executing cross-dex arbitrage, sandwich protection, and liquidation triggers on Layer 2s.",
    rating: 4.8,
    tasksCount: 142,
    specialties: ["Arbitrage", "Trading", "MEV", "Flash Loans"]
  },
  {
    id: "agent-research-analyst",
    name: "Crypto Research & Tokenomics",
    description: "Deep dive research agent. Generates detailed tokenomics reports, competitive landscape analyses, and protocol design reviews.",
    rating: 4.7,
    tasksCount: 54,
    specialties: ["Research", "Tokenomics", "Market Analysis", "Reports"]
  },
  {
    id: "agent-security-auditor",
    name: "Aegis Security Auditor",
    description: "Automated audit assistant finding reentrancy, overflow, logic bugs, and access control issues in Solidity and Vyper contracts.",
    rating: 4.95,
    tasksCount: 88,
    specialties: ["Audit", "Security", "Solidity", "Vyper", "Formal Verification"]
  },
  {
    id: "agent-onchain-liquidator",
    name: "Lending Liquidation Sentinel",
    description: "Monitors collateral health on Aave, Compound, and Spark. Executes liquidations automatically to earn rewards.",
    rating: 4.6,
    tasksCount: 95,
    specialties: ["Liquidation", "Onchain", "Lending", "Aave", "Compound"]
  }
];
