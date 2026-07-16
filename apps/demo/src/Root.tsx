import { Composition } from "remotion";
import { Main } from "./Main";
import "./global.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KumoDemo"
        component={Main}
        durationInFrames={2700} // 90 seconds
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
