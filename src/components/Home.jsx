import React from "react";
import Made4U from "./Made4U";
import Recommended from "./Recommended";
import { usePlayer } from "../context/usePlayerContext";
import Trending from "./Trending";

const Home = () => {
  const { isPlaying, streamId } = usePlayer();
  const loc = localStorage.getItem("streamUrl");

  const isPlayerActive = isPlaying || streamId || loc;

  return (
    <div
      className={`overflow-auto no-scrollbar pb-2 ${
        isPlayerActive
          ? "h-[calc(100dvh-100px-5rem)]"
          : "h-[calc(100dvh-100px)]"
      }`}
      aria-label="Home Content"
    >
      <Made4U />
      <Recommended />
      <Trending />
    </div>
  );
};

export default Home;
