import React from "react";
import PropTypes from "prop-types";
import PlayBtn from "./PlayBtn";
import { usePlayer } from "../context/usePlayerContext";
import WavyIcon from "./WavyIcon";

const Card = ({ name = "", frequency = "", imgId = "" }) => {
  const { streamId, isPlaying, setStreamId, errorStates, loadingStates } = usePlayer();
  const imageSrc = imgId ? `/assets/logo/${imgId}.jpg` : "/assets/radio.webp";
  const isLoading = loadingStates[imgId] || false;
  const isThisPlaying = isPlaying && !isLoading && streamId === imgId;

  return (
    <div
      className="group relative flex flex-col p-3 sm:p-4 bg-gray-200 rounded-xl transition-colors duration-300 hover:bg-gray2 w-full mx-auto cursor-pointer"
      title={name}
      onClick={() => setStreamId(imgId)}
    >
      <div className="relative aspect-square w-full">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover rounded-lg"
        />
        {!isThisPlaying && (
          <div className="absolute bottom-2 right-2 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <PlayBtn id={imgId} />
          </div>
        )}
        {isThisPlaying && (
          <div className="absolute bottom-2 right-2 transform bg-black/90 h-12 w-12 flex items-center rounded-full justify-center transition-opacity duration-300 ease-in-out">
            <WavyIcon err={errorStates[imgId]} />
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-3 leading-tight">
        <h3
          className={`line-clamp-1 text-base sm:text-lg font-bold ${
            isThisPlaying ? "text-green-600 font-semibold" : ""
          }`}
        >
          {name}
        </h3>
        <span className="text-xs sm:text-sm opacity-65">{frequency} MHz</span>
      </div>
    </div>
  );
};

export default Card;
