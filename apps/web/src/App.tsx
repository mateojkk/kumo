import { useEffect, useRef } from 'react'

const ENDPOINTS = [
  { method:'POST', path:'/remember', desc:'Store a memory in an agent\'s namespace and auto-register it in the discovery registry.', tags:['memory','register'] },
  { method:'POST', path:'/discover', desc:'Search all registered agent namespaces in parallel. Ranked by actual stored history.', tags:['search','ranking'] },
  { method:'POST', path:'/recall',   desc:'Semantic search within a specific agent\'s namespace. Restores session context.', tags:['memory','context'] },
  { method:'POST', path:'/analyze',  desc:'Extract structured facts from text using LLM. Each fact stored as a discrete memory.', tags:['llm','extraction'] },
  { method:'GET',  path:'/registry', desc:'List all registered agents with profiles and memory counts.', tags:['registry'] },
  { method:'GET',  path:'/agent/:id',desc:'Agent profile from the registry plus a preview of their stored memories.', tags:['profile'] },
]

const STEPS = [
  {
    num:'01',
    title:'Agent calls POST /remember',
    body:'Any agent that wants to be discoverable stores a memory. Kumo registers them in the namespace registry automatically. No separate sign-up.',
    pill:'POST /remember  →  stored + registered',
  },
  {
    num:'02',
    title:'Memory lands on Walrus / Sui',
    body:'Content is encrypted via Seal, persisted as a blob on Walrus, and indexed on Sui. Ownership is verifiable on-chain.',
    pill:'Walrus blob  →  Sui index  →  semantic vector',
  },
  {
    num:'03',
    title:'Buyer calls POST /discover',
    body:'Kumo fans out parallel recall() calls across every registered namespace. The registry is what makes this possible; MemWal recall is namespace-scoped.',
    pill:'/discover  →  N parallel recalls  →  ranked',
  },
  {
    num:'04',
    title:'Results ranked by evidence',
    body:'Agents ranked by semantic relevance, depth of history, recency, and specialty match. Top memory excerpts are returned as proof.',
    pill:'50% semantic · 20% completeness · 15% recency · 15% match',
  },
]

export default function App() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = '/hero.jpg'
    img.onload = () => bgRef.current?.classList.add('loaded')
  }, [])

  return (
    <>
      {/* ── Nav ── */}
      <nav>
        <a href="#" className="logo">
          Kumo
        </a>
        <ul className="nav-links">
          <li><a href="#endpoints">API</a></li>
          <li><a href="#how">How it works</a></li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" ref={bgRef} />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-left">
            <div className="kicker fu">
              <span className="kicker-dot" />
              AI agent infrastructure
            </div>
            <h1 className="fu d1">Memory<br />that follows.</h1>
            <p className="tagline fu d2">Discovery that proves.</p>
            <a href="#endpoints" className="hero-btn fu d3">
              Explore the API →
            </a>
          </div>

          <div className="hero-right fu d2">
            <p>
              Agents start every session with zero context. Past work, preferences,
              communication style. All lost. Discovery means trusting self-reported claims.
            </p>
            <p>
              Kumo fixes both. Portable memory on Walrus and Sui.
              Discovery that searches what agents have actually done.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Endpoints ── */}
      <section className="section" id="endpoints">
        <div className="container">
          <div className="eyebrow">The API</div>
          <h2>Six endpoints.</h2>
          <p className="lead">
            POST /remember once to opt in. POST /discover to find agents by real capability.
            No SDK. No dashboard. Pure HTTP.
          </p>
          <div className="ep-grid">
            {ENDPOINTS.map(e => (
              <div className="ep-card" key={e.path}>
                <div className={`method ${e.method === 'POST' ? 'm-post' : 'm-get'}`}>{e.method}</div>
                <div className="ep-path">{e.path}</div>
                <div className="ep-desc">{e.desc}</div>
                <div className="tags">
                  {e.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code demo ── */}
      <section className="section" style={{ paddingTop: 0 }} id="demo">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="eyebrow">Example</div>
              <h2>One call to opt in.</h2>
              <p className="lead" style={{ marginBottom: 0 }}>
                POST /remember registers the agent and stores the memory in one request.
                It's immediately searchable via /discover.
              </p>
            </div>
            <div className="code-wrap">
              <div className="code-bar">
                <span className="dot dr"/><span className="dot dy"/><span className="dot dg"/>
                <span className="code-bar-label">shell</span>
              </div>
              <div className="code-body">
                <span className="cc"># Register + store memory</span>{'\n'}
                <span className="cm">curl</span>{' -X POST '}<span className="cu">https://kumo-agent.vercel.app/remember</span>{' \\\n'}
                {'  '}<span className="ck">-H</span>{' '}<span className="cs">"x-agent-id: agent-42"</span>{' \\\n'}
                {'  '}<span className="ck">-d</span>{' '}<span className="cb">{'{'}</span>{'\n'}
                {'       '}<span className="ck">"content"</span><span className="cb">:</span>{' '}<span className="cs">"Solidity dev, DeFi, 73 tasks done"</span><span className="cb">,</span>{'\n'}
                {'       '}<span className="ck">"specialties"</span><span className="cb">:</span>{' '}<span className="cb">["</span><span className="cs">DeFi</span><span className="cb">","</span><span className="cs">Solidity</span><span className="cb">"]</span>{'\n'}
                {'     '}<span className="cb">{'}'}</span>{'\n\n'}
                <span className="cc"># Discover by capability</span>{'\n'}
                <span className="cm">curl</span>{' -X POST '}<span className="cu">https://kumo-agent.vercel.app/discover</span>{' \\\n'}
                {'  '}<span className="ck">-d</span>{' '}<span className="cb">{'{'}</span>{' '}<span className="ck">"query"</span><span className="cb">:</span>{' '}<span className="cs">"DeFi Solidity developer"</span>{' '}<span className="cb">{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section" id="how">
        <div className="container">
          <div className="two-col two-col-top">
            <div>
              <div className="eyebrow">How it works</div>
              <h2>The namespace registry is the product.</h2>
              <p className="lead" style={{ marginBottom: 0 }}>
                MemWal recall() is scoped to a single namespace. There's no way to broadcast
                a query across all agents. Kumo's registry solves this: every agent who calls
                /remember is tracked, and /discover fans out across all of them.
              </p>
            </div>
            <div className="steps">
              {STEPS.map(s => (
                <div className="step" key={s.num}>
                  <div className="step-n">{s.num}</div>
                  <div className="step-body">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <span className="step-pill">{s.pill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="container footer-inner">
          <a href="#" className="footer-logo">
            Kumo
          </a>
          <ul className="footer-links">
            <li><a href="#endpoints">API</a></li>
            <li><a href="#how">How it works</a></li>

          </ul>
          <div className="footer-copy">Kumo · 2026</div>
        </div>
      </footer>
    </>
  )
}
