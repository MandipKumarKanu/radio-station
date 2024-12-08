import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { RadioList } from "../../public/assets/radio_list";
import { usePlayer } from "../context/usePlayerContext";
import PlayerDesktop from "./PlayerDesktop";
import PlayerMobile from "./PlayerMobile";
import { addPlayedHistory } from "../utils/addToHistory";
import { useAuth } from "../context/AuthContext";

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
    streamUrl,
    setStreamUrl,
    customStationNames,
  } = usePlayer();

  const { user } = useAuth();

  useEffect(() => {
    console.log("Player Debug:", {
      streamId,
      streamUrl,
      radio: radio ? radio.name : null,
    });
  }, [streamId, streamUrl]);

  const radio = useMemo(
    () => RadioList.find((r) => r.id === streamId),
    [streamId]
  );

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const loadStream = useCallback(() => {
    const currentStreamUrl = streamUrl || (radio ? radio.streamUrl : null);

    console.log("Loading Stream URL:", currentStreamUrl);

    if (!currentStreamUrl || !audioRef.current) {
      console.error("No stream URL available");
      return;
    }

    const streamIdentifier = radio ? radio.id : streamUrl;

    const historyData = {
      id: radio ? radio.id : "",
      stationName: radio ? radio.name : customStationNames || "",
      streamUrl: radio ? radio.streamUrl : streamUrl || "",
      frequency: radio ? radio.frequency : "",
    };

    setLoadingForStream(streamIdentifier, true);
    setErrorForStream(streamIdentifier, false);

    audioRef.current.src = currentStreamUrl;

    const playPromise = audioRef.current.play();

    playPromise
      .then(() => {
        setLoadingForStream(streamIdentifier, false);
        setIsPlaying(true);
        setErrorForStream(streamIdentifier, false);

        if (radio && radio.name) {
          addPlayedHistory(historyData, user);
        }
      })
      .catch((error) => {
        console.error("Stream playback error:", error);
        setErrorForStream(streamIdentifier, true);
        setLoadingForStream(streamIdentifier, false);
        setIsPlaying(false);
      });
  }, [radio, streamUrl, setLoadingForStream, setErrorForStream, setIsPlaying]);

  const togglePlay = useCallback(() => {
    const streamIdentifier = radio ? radio.id : streamUrl;

    if (!audioRef.current) return;

    if (errorStates[streamIdentifier]) {
      loadStream();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch(() => setErrorForStream(streamIdentifier, true));
    }
  }, [radio, isPlaying, errorStates, loadStream, setErrorForStream, streamUrl]);

  useEffect(() => {
    if (radio || streamUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      loadStream();
    }
  }, [radio, loadStream, setIsPlaying, streamUrl]);

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

  const displayName = radio ? radio.name : customStationNames || "";
  const displayFrequency = radio ? radio.frequency : "";
  const displayLogo = radio
    ? `/assets/logo/${radio.id}.jpg`
    : "/assets/radio.webp";

  const isFavorite = radio && favorites.includes(radio.id);

  const playerProps = {
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
  };

  if (!radio && !streamUrl) return null;

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setErrorForStream(radio?.id || streamUrl, false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setErrorForStream(radio?.id || streamUrl, true);
          setIsPlaying(false);
        }}
      />

      <PlayerDesktop {...playerProps} />
      <PlayerMobile {...playerProps} />
    </>
  );
};

export default Player;
