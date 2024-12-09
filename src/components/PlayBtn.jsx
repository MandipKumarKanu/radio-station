import React from "react";
import { FaPlay, FaPause, FaSpinner, FaRedo } from "react-icons/fa";
import { usePlayer } from "../context/usePlayerContext";
import { db } from "../utils/firebase.config";
import { doc, increment, updateDoc } from "firebase/firestore";
import { RadioList } from "../../public/assets/radio_list";

const PlayBtn = ({ id, streamUrl: btnStrmUrl, name }) => {
  const {
    streamId,
    setStreamId,
    isPlaying,
    loadingStates,
    errorStates,
    setStreamUrl,
    setCustomStationNames,
    streamUrl,
  } = usePlayer();

  const incrementHits = async (stationId) => {
    try {
      if (stationId) {
        const stationRef = doc(db, "stations", stationId);
        await updateDoc(stationRef, { hits: increment(1) });
      }
    } catch (error) {
      console.error(`Error incrementing hits for station ${stationId}:`, error);
    }
  };

  const handleClick = () => {
    const isRadioListStation = RadioList.some((station) => station.id === id);

    if (isRadioListStation) {
      setStreamUrl("");
      setStreamId(id);
      setCustomStationNames("");
      incrementHits(id);
    } else {
      setStreamId("");
      setStreamUrl(btnStrmUrl);
      setCustomStationNames(name);
    }
  };

  const isThisPlaying =
    ((id && streamId === id) || (streamUrl && streamUrl === btnStrmUrl && !id && !streamId)) &&
    isPlaying;

  const isLoading = loadingStates[id || btnStrmUrl] || false;
  const hasError = errorStates[id || btnStrmUrl] || false;

  let icon;
  if (isLoading) {
    icon = <FaSpinner className="animate-spin text-2xl text-white" />;
  } else if (hasError) {
    icon = (
      <FaRedo
        className="text-2xl text-red-500"
        title="Retry"
        onClick={() => handleClick()}
      />
    );
  } else {
    icon = isThisPlaying ? (
      <FaPause className="text-2xl text-white" />
    ) : (
      <FaPlay className="text-2xl text-white" />
    );
  }

  return (
    <div
      className={`h-12 w-12 p-4 bg-btn rounded-full flex items-center justify-center cursor-pointer ${
        isLoading ? "cursor-wait" : "hover:bg-btn-hover"
      }`}
      onClick={handleClick}
      aria-label={isThisPlaying ? `Pause stream` : `Play stream`}
      role="button"
    >
      {icon}
    </div>
  );
};

export default PlayBtn;
