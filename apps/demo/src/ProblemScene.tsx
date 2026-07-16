import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity1 = interpolate(frame, [0, 15, 120, 135], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity2 = interpolate(frame, [150, 165, 270, 285], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity3 = interpolate(frame, [300, 315, 420, 435], [0, 1, 1, 0], {
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
        fontSize: "80px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      <div style={{ position: "absolute", opacity: opacity1 }}>
        Every AI agent starts with amnesia.
      </div>
      <div style={{ position: "absolute", opacity: opacity2 }}>
        No memory. No context. No trust.
      </div>
      <div style={{ position: "absolute", opacity: opacity3 }}>
        Discovery is broken.
      </div>
    </AbsoluteFill>
  );
};
