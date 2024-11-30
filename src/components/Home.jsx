import React from "react";
import Made4U from "./Made4U";
import Recommended from "./Recommended";
import { usePlayer } from "../context/usePlayerContext";
import Trending from "./Trending";

const Home = () => {
  const { isPlaying, streamId } = usePlayer();

  const maxHeight =
    isPlaying || streamId
      ? "h-[calc(100vh-100px-5rem)]"
      : "h-[calc(100vh-100px)]";

  return (
    <div className={`${maxHeight} overflow-auto pr-5 pt-5 pb-5 no-scrollbar`}>
      <Made4U />
      <Recommended />
      <Trending />
    </div>
  );
};

export default Home;
