import React from "react";
import Made4U from "./Made4U";
import Recommended from "./Recommended";
import { usePlayer } from "../context/usePlayerContext";
import Trending from "./Trending";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isPlaying, streamId } = usePlayer();
  const { user } = useAuth();

  const isPlayerActive = isPlaying || streamId;

  return (
    <div
      className={`overflow-auto no-scrollbar ${
        isPlayerActive ? "h-[calc(100vh-100px-5rem)]" : "h-[calc(100vh-100px)]"
      }`}
      aria-label="Home Content"
    >
      {<Made4U />}
      <Recommended />
      <Trending />
    </div>
  );
};

export default Home;
