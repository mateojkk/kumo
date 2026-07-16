import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { ProblemScene } from "./ProblemScene";
import { SolutionScene } from "./SolutionScene";
import { TerminalDemo } from "./TerminalDemo";
import { OutroScene } from "./OutroScene";

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={450}>
        <ProblemScene />
      </Sequence>
      
      <Sequence from={450} durationInFrames={900}>
        <SolutionScene />
      </Sequence>
      
      <Sequence from={1350} durationInFrames={1050}>
        <TerminalDemo />
      </Sequence>
      
      <Sequence from={2400} durationInFrames={300}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
