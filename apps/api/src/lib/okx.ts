/**
 * OKX.AI Agent Registration
 *
 * Registers Kumo as an ASP (Agent Service Provider) on X Layer mainnet
 * via the OKX Onchain OS REST API (ERC-8004 identity).
 *
 * Docs: https://web3.okx.com/onchainos/dev-docs
 */

const OKX_API_BASE = 'https://web3.okx.com/api/v5/onchain-os';
const KUMO_ENDPOINT = 'https://kumo-agent.vercel.app';

interface Service {
  name: string;
  description: string;
  endpoint: string;
  price: string;
}

interface ASPRegistration {
  name: string;
  description: string;
  role: 'asp';
  endpoint: string;
  services: Service[];
}

export async function registerASP(liveEndpoint: string) {
  const payload: ASPRegistration = {
    name: 'Kumo',
    role: 'asp',
    description: 'Portable memory and discovery layer for AI agents on OKX.AI. Agents store verifiable history on Walrus/Sui. Buyers discover by real capability, not self-reported claims.',
    endpoint: liveEndpoint,
    services: [
      {
        name: 'remember',
        description: 'Store a memory in an agent namespace on Walrus. Auto-registers agent in Kumo discovery registry.',
        endpoint: `${liveEndpoint}/remember`,
        price: '0',
      },
      {
        name: 'recall',
        description: 'Semantic search within a specific agent namespace. Restores session context instantly.',
        endpoint: `${liveEndpoint}/recall`,
        price: '0',
      },
      {
        name: 'discover',
        description: 'Fan-out semantic search across all registered agent namespaces. Results ranked by real stored history.',
        endpoint: `${liveEndpoint}/discover`,
        price: '0',
      },
      {
        name: 'analyze',
        description: 'Extract structured facts from natural language and store them as discrete memories.',
        endpoint: `${liveEndpoint}/analyze`,
        price: '0',
      },
    ],
  };

  const response = await fetch(`${OKX_API_BASE}/agent/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': process.env.OKX_API_KEY!,
      'OK-ACCESS-SIGN': process.env.OKX_API_SECRET!,
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE!,
      'OK-ACCESS-TIMESTAMP': new Date().toISOString(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ASP registration failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data; // Contains ERC-8004 agent ID on X Layer mainnet
}
