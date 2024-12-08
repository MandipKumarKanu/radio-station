import React from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaSpinner,
  FaRedo,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";

const PlayerDesktop = ({
  radio,
  displayName,
  displayFrequency,
  displayLogo,
  isFavorite,
  isPlaying,
  loadingStates,
  errorStates,
  togglePlay,
  toggleFavorite,
  toggleMute,
  handleVolumeChange,
  volume,
  isMuted,
}) => {
  return (
    <div className="hidden md:block">
      <div className="flex w-full items-center justify-between px-10 py-2 h-20 bg-black text-white">
        <div className="flex gap-4 items-center">
          <img
            src={displayLogo}
            className="h-14 w-14 rounded-lg"
            onError={(e) => {
              e.target.src = "/assets/radio.webp";
            }}
            alt={displayName}
          />
          <div>
            <div className="font-bold">{displayName}</div>
            <div className="text-gray-400">
              {displayFrequency !== "" ? `${displayFrequency}MHz` : ""}
            </div>
          </div>

          {radio && (
            <button
              onClick={() => toggleFavorite(radio.id)}
              className="ml-6 text-3xl"
            >
              {isFavorite ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-500" />
              )}
            </button>
          )}
        </div>

        <div
          onClick={togglePlay}
          className="cursor-pointer p-4 bg-gray-800 rounded-full hover:bg-gray-700 relative"
        >
          {loadingStates[radio?.id] ? (
            <FaSpinner className="animate-spin text-2xl text-white" />
          ) : errorStates[radio?.id] ? (
            <FaRedo className="text-2xl text-red-500" />
          ) : isPlaying ? (
            <FaPause className="text-2xl text-white" />
          ) : (
            <FaPlay className="text-2xl text-white" />
          )}
        </div>

        <div className="flex items-center justify-between mt-6 px-6">
          <div onClick={toggleMute} className="cursor-pointer text-2xl">
            {isMuted ? (
              <FaVolumeMute className="text-gray-300" />
            ) : (
              <FaVolumeUp className="text-white" />
            )}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-2/3 bg-gray-700 accent-white rounded-full h-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerDesktop;
