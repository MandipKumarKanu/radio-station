import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
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
    favorites,
    toggleFavorite,
  } = usePlayer();

  const radio = useMemo(
    () => RadioList.find((r) => r.id === streamId),
    [streamId]
  );

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const loadStream = useCallback(() => {
    if (!radio || !audioRef.current) return;

    setLoadingForStream(radio.id, true);
    setErrorForStream(radio.id, false);

    audioRef.current.src = radio.streamUrl;

    const playPromise = audioRef.current.play();

    playPromise
      .then(() => {
        setLoadingForStream(radio.id, false);
        setIsPlaying(true);
        setErrorForStream(radio.id, false);
      })
      .catch((error) => {
        console.error("Stream playback error:", error);
        setErrorForStream(radio.id, true);
        setLoadingForStream(radio.id, false);
        setIsPlaying(false);
      });
  }, [radio, setLoadingForStream, setErrorForStream, setIsPlaying]);

  useEffect(() => {
    if (radio) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      loadStream();
    }
  }, [radio, loadStream, setIsPlaying]);

  const togglePlay = useCallback(() => {
    if (!radio || !audioRef.current) return;

    if (errorStates[radio.id]) {
      loadStream();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setErrorForStream(radio.id, true));
    }
  }, [radio, isPlaying, errorStates, loadStream, setErrorForStream]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioRef.current.muted = newMuteState;
  }, [isMuted]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const isFavorite = radio && favorites.includes(radio.id);

  if (!radio) return null;

  return (
    <>
      <div className="hidden md:block">
        <div className=" flex w-full items-center justify-between px-10 py-2 h-20 bg-black text-white">
          <div className="flex gap-4 items-center">
            <img
              src={`/assets/logo/${radio.id}.jpg`}
              className="h-14 w-14 rounded-lg"
              onError="this.src='../../public/assets/radio.webp'"
              alt={radio.name}
            />
            <div>
              <div className="font-bold">{radio.name}</div>
              <div className="text-gray-400">{radio.frequency || ""} MHz</div>
            </div>

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
            preload="auto"
            onPlay={() => {
              setIsPlaying(true);
              setErrorForStream(radio.id, false);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setErrorForStream(radio.id, true);
              setIsPlaying(false);
            }}
          />

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

          <audio
            ref={audioRef}
            preload="auto"
            onPlay={() => {
              setIsPlaying(true);
              setErrorForStream(radio.id, false);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setErrorForStream(radio.id, true);
              setIsPlaying(false);
            }}
          />
        </div>
      </div>

      <div className="block md:hidden">
        <div className="flex w-full items-center justify-between px-4 py-2 h-20 bg-black text-white">
          <div className="flex gap-2 items-center">
            <img
              src={`/assets/logo/${radio.id}.jpg`}
              className="h-12 w-12 rounded-lg"
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

          <button onClick={() => toggleFavorite(radio.id)} className="text-3xl">
            {isFavorite ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Player;
