import React from "react";
import { FaPlay, FaPause, FaSpinner, FaRedo } from "react-icons/fa";
import { usePlayer } from "../context/usePlayerContext";

const PlayBtn = ({ id }) => {
  const { streamId, setStreamId, isPlaying, loadingStates, errorStates } =
    usePlayer();

  const handleClick = () => {
    if (streamId !== id) {
      setStreamId(id);
    }
  };

  const isLoading = loadingStates[id] || false;
  const hasError = errorStates[id] || false;
  const isThisPlaying = isPlaying && streamId === id;

  return (
    <div
      className="h-12 w-12 p-4 bg-btn rounded-full flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      aria-label={`Play ${id} stream`}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin text-2xl text-white" />
      ) : hasError ? (
        <FaRedo className="text-2xl text-red-500" />
      ) : isThisPlaying ? (
        <FaPause className="text-2xl text-black" />
      ) : (
        <FaPlay className="text-2xl text-black" />
      )}
    </div>
  );
};

export default PlayBtn;
