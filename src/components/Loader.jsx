import React from "react";
import "./Loader.css";
import { usePlayer } from "../context/usePlayerContext";

const Loader = () => {
  const { isPlaying, streamId } = usePlayer();
  const loc = localStorage.getItem("streamUrl");

  const dynamicHeight =
    isPlaying || streamId || loc
      ? "h-[calc(100dvh-160px)]"
      : "h-[calc(100dvh-80px)]";
  return (
    <div
      className={`soundwave-loader             h-[100dvh]
items-center justify-center flex`}
    >
      <div className="soundwaves">
        <span style={{ "--i": 1 }}></span>
        <span style={{ "--i": 2 }}></span>
        <span style={{ "--i": 3 }}></span>
        <span style={{ "--i": 4 }}></span>
        <span style={{ "--i": 5 }}></span>
      </div>
    </div>
  );
};

export default Loader;
