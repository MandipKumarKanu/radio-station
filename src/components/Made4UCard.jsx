import React from "react";
import PlayBtn from "./PlayBtn";
import WavyIcon from "./WavyIcon";
import { usePlayer } from "../context/usePlayerContext";

const Made4UCard = ({ name = "", frequency = "", imgId = "" }) => {
  const { streamId, isPlaying, loadingStates, errorStates, setStreamId } =
    usePlayer();
  const isLoading = loadingStates[streamId] || false;
  const imageSrc = imgId ? `/assets/logo/${imgId}.jpg` : "/assets/radio.webp";
  const isThisPlaying = isPlaying && !isLoading && streamId === imgId;
  const isThisPause = !isPlaying && !isLoading && streamId === imgId;

  return (
    <div
      className="group  cursor-pointer  relative flex gap-2 items-center bg-gray2 p-3 rounded-lg transition-all duration-300 hover:bg-gray-200"
      title={name}
      onClick={() => setStreamId(imgId)}
    >
      <img
        src={imageSrc}
        alt={name}
        className="h-16 w-16 object-cover rounded-full"
      />
      <div>
        <h3
          className={`line-clamp-1 text-sm font-semibold ${
            isThisPlaying ? "text-green-600 font-semibold" : ""
          }`}
        >
          {name}
        </h3>
        <span className="text-xs opacity-65">{frequency} MHz</span>
      </div>

      <div className="absolute top-1/2 -right-2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-200">
        {!isThisPlaying && !isThisPause && <PlayBtn id={imgId} />}
      </div>

      {isThisPlaying && (
        <div className="absolute top-1/2 right-2 transform -translate-x-1/2 -translate-y-1/2">
          <WavyIcon err={errorStates[streamId]} />
        </div>
      )}

      {isThisPause && (
        <div className="absolute top-1/2 right-2 transform -translate-x-1/2 -translate-y-1/2">
          <WavyIcon err={isThisPause} />
        </div>
      )}
    </div>
  );
};

export default Made4UCard;
