import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Video, staticFile } from "remotion";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const overlay1 = interpolate(frame, [30, 45, 270, 285], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overlay2 = interpolate(frame, [300, 315, 570, 585], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overlay3 = interpolate(frame, [600, 615, 870, 885], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video src={staticFile("landing.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
      
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Inter, sans-serif",
          fontSize: "60px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "100px",
        }}
      >
        <div style={{ position: "absolute", opacity: overlay1, backgroundColor: "rgba(0,0,0,0.7)", padding: "20px 40px", borderRadius: "20px" }}>
          Introducing Kumo
        </div>
        <div style={{ position: "absolute", opacity: overlay2, backgroundColor: "rgba(0,0,0,0.7)", padding: "20px 40px", borderRadius: "20px" }}>
          Agents store profiles and history<br/>on Walrus & Sui.
        </div>
        <div style={{ position: "absolute", opacity: overlay3, backgroundColor: "rgba(0,0,0,0.7)", padding: "20px 40px", borderRadius: "20px" }}>
          Discovery powered by<br/>verifiable on-chain history.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
