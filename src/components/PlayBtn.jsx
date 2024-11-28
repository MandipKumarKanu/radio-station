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

  let icon;
  if (isLoading) {
    icon = <FaSpinner className="animate-spin text-2xl text-white" />;
  } else if (hasError) {
    icon = <FaRedo className="text-2xl text-red-500" />;
  } else {
    icon = isThisPlaying ? (
      <FaPause className="text-2xl text-black" />
    ) : (
      <FaPlay className="text-2xl text-black" />
    );
  }

  return (
    <div
      className="h-12 w-12 p-4 bg-btn rounded-full flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      aria-label={`Play ${id} stream`}
    >
      {icon}
    </div>
  );
};

export default PlayBtn;
