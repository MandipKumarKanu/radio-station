import React, { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaSpinner,
  FaRedo,
} from "react-icons/fa";
import { RadioList } from "../../public/assets/radio_list";
import { usePlayer } from "../context/usePlayerContext";

const Player = () => {
  const {
    streamId,
    setStreamId,
    isPlaying,
    setIsPlaying,
    loadingStates,
    setLoadingForStream,
    errorStates,
    setErrorForStream,
  } = usePlayer();
  const [radio, setRadio] = useState();
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const selectedRadio = RadioList.find((radio) => radio.id === streamId);
    setRadio(selectedRadio);

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [streamId]);

  useEffect(() => {
    if (radio) {
      loadStream();
    }
  }, [radio]);

  const loadStream = () => {
    if (radio && audioRef.current) {
      setLoadingForStream(radio.id, true);
      setErrorForStream(radio.id, false);

      audioRef.current.src = radio.streamUrl;
      audioRef.current
        .play()
        .then(() => {
          setLoadingForStream(radio.id, false);
          setIsPlaying(true);
        })
        .catch(() => {
          setErrorForStream(radio.id, true);
          setLoadingForStream(radio.id, false);
        });
    }
  };

  const togglePlay = () => {
    if (!radio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setErrorForStream(radio.id, true));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    radio && (
      <div className="flex w-full items-center justify-between px-10 py-2 h-20 bg-black text-white">
        <div className="flex gap-4 items-center">
          <img
            src={`/assets/logo/${radio.id}.jpg`}
            className="h-14 w-14 rounded-lg"
            alt={radio.name}
          />
          <div>
            <div className="font-bold">{radio.name}</div>
            <div className="text-gray-400">{radio.frequency || ""} MHz</div>
          </div>
        </div>
        <div
          onClick={togglePlay}
          className="cursor-pointer p-4 bg-gray-800 rounded-full hover:bg-gray-700 relative"
        >
          {loadingStates[radio.id] ? (
            <FaSpinner className="animate-spin text-2xl text-white" />
          ) : errorStates[radio.id] ? (
            <FaRedo className="text-2xl text-red-500" />
          ) : isPlaying ? (
            <FaPause className="text-2xl text-white" />
          ) : (
            <FaPlay className="text-2xl text-white" />
          )}
        </div>
        <audio
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="flex items-center gap-2">
          <div onClick={toggleMute} className="cursor-pointer">
            {isMuted ? (
              <FaVolumeMute className="text-xl text-gray-500" />
            ) : (
              <FaVolumeUp className="text-xl text-white" />
            )}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full bg-gray-700 accent-white"
          />
        </div>
      </div>
    )
  );
};

export default Player;
