import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import React from "react";

export const TerminalDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation values
  const windowScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  const windowOpacity = interpolate(frame, [0, 15], [0, 1]);

  // Typing logic
  const typeText = (text: string, startFrame: number, speed: number = 1) => {
    const chars = Math.max(0, Math.floor((frame - startFrame) / speed));
    return text.substring(0, chars);
  };

  const rememberCmd = `curl -X POST https://kumo-agent.vercel.app/remember \\
  -H "x-agent-id: agent-42" \\
  -d '{
       "content": "High-frequency DeFi Arbitrage Bot, 50ms latency",
       "tags": ["arbitrage", "defi", "mev"]
     }'`;

  const discoverCmd = `curl -X POST https://kumo-agent.vercel.app/discover \\
  -d '{ "query": "DeFi Arbitrage Bot" }'`;

  // Timing (35s total = 1050 frames)
  const REMEMBER_START = 30; // 1s
  const REMEMBER_DONE = REMEMBER_START + rememberCmd.length * 2;
  const REMEMBER_RESPONSE_START = REMEMBER_DONE + 30; // Wait 1s
  
  const DISCOVER_START = REMEMBER_RESPONSE_START + 120; // Wait 4s
  const DISCOVER_DONE = DISCOVER_START + discoverCmd.length * 2;
  const DISCOVER_RESPONSE_START = DISCOVER_DONE + 30; // Wait 1s

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
      <div className="bg-mesh" />
      
      <div style={{ transform: `scale(${windowScale})`, opacity: windowOpacity }} className="terminal-window">
        <div className="terminal-header">
          <div className="window-controls">
            <div className="control-dot dot-red" />
            <div className="control-dot dot-yellow" />
            <div className="control-dot dot-green" />
          </div>
          <div className="terminal-title">mateo@kumo ~ (zsh)</div>
        </div>

        <div className="terminal-body">
          {/* Remember Command */}
          {frame >= REMEMBER_START && (
            <div>
              <span className="cmd-prompt">❯</span>
              <span className="cmd-text">{typeText(rememberCmd, REMEMBER_START, 2)}</span>
              {frame > REMEMBER_START && frame < REMEMBER_DONE && <span style={{ opacity: frame % 15 < 7 ? 1 : 0 }}>_</span>}
            </div>
          )}

          {/* Remember Response */}
          {frame >= REMEMBER_RESPONSE_START && (
            <div style={{ marginTop: 20, color: '#a78bfa', opacity: interpolate(frame, [REMEMBER_RESPONSE_START, REMEMBER_RESPONSE_START + 10], [0, 1]) }}>
              {`{
  "id": "mem_01hqxyz",
  "status": "stored",
  "namespace": "agent-42",
  "timestamp": "2026-07-15T12:00:00.000Z"
}`}
            </div>
          )}

          {/* Discover Command */}
          {frame >= DISCOVER_START && (
            <div style={{ marginTop: 40 }}>
              <span className="cmd-prompt">❯</span>
              <span className="cmd-text">{typeText(discoverCmd, DISCOVER_START, 2)}</span>
              {frame > DISCOVER_START && frame < DISCOVER_DONE && <span style={{ opacity: frame % 15 < 7 ? 1 : 0 }}>_</span>}
            </div>
          )}

          {/* Discover Response */}
          {frame >= DISCOVER_RESPONSE_START && (
            <div style={{ marginTop: 20, color: '#34d399', opacity: interpolate(frame, [DISCOVER_RESPONSE_START, DISCOVER_RESPONSE_START + 10], [0, 1]) }}>
              {`{
  "agents": [
    {
      "agentId": "agent-42",
      "memoryScore": 9.8,
      "topMemories": [
        "High-frequency DeFi Arbitrage Bot, 50ms latency"
      ]
    }
  ]
}`}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
