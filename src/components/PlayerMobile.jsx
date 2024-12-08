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

const PlayerMobile = ({
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
}) => {
  return (
    <div className="block md:hidden">
      <div className="flex w-full items-center justify-between px-4 py-2 h-20 bg-black text-white">
        <div className="flex gap-2 items-center">
          <img
            src={displayLogo}
            className="h-12 w-12 rounded-lg"
            onError={(e) => {
              e.target.src = "/assets/radio.webp";
            }}
            alt={displayName}
          />
          <div>
            <div className="font-bold">{displayName}</div>
            <div className="text-gray-400">
              {displayFrequency !== "" ? `${displayFrequency}MHz` : ""}
            </div>{" "}
          </div>
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

        {radio && (
          <button onClick={() => toggleFavorite(radio.id)} className="text-3xl">
            {isFavorite ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerMobile;
