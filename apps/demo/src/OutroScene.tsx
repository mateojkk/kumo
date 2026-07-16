import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        opacity,
      }}
    >
      <div style={{ fontSize: "120px", fontWeight: "900", letterSpacing: "-0.05em" }}>
        Kumo <span style={{ color: "#a78bfa" }}>雲</span>
      </div>
      <div style={{ fontSize: "40px", color: "#9ca3af", marginTop: "20px" }}>
        Memory that follows.
      </div>
      <div style={{ fontSize: "30px", color: "#34d399", marginTop: "60px", padding: "10px 30px", border: "2px solid #34d399", borderRadius: "50px" }}>
        Live on OKX AI Mainnet
      </div>
    </AbsoluteFill>
  );
};
