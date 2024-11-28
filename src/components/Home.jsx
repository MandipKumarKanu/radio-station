import React from "react";
import Made4U from "./Made4U";
import Recommended from "./Recommended";
import { usePlayer } from "../context/usePlayerContext";

const Home = () => {
  const { isPlaying, streamId } = usePlayer();

  const maxHeight =
    isPlaying || streamId
      ? "max-h-[calc(100dvh-100px-5rem)]"
      : "max-h-[calc(100dvh-100px)]";

  return (
    <div className={`${maxHeight} overflow-auto`}>
      <Made4U />
      <Recommended />
    </div>
  );
};

export default Home;
