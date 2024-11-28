import { createContext, useContext, useState, useEffect, useMemo } from "react";

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(
    () => JSON.parse(localStorage.getItem("isPlaying")) || false
  );
  const [streamId, setStreamId] = useState(
    () => localStorage.getItem("streamId") || ""
  );
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  useEffect(() => {
    localStorage.setItem("isPlaying", JSON.stringify(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem("streamId", streamId);
  }, [streamId]);

  const setLoadingForStream = (id, isLoading) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [id]: isLoading,
    }));
  };

  const setErrorForStream = (id, hasError) => {
    setErrorStates((prevStates) => ({
      ...prevStates,
      [id]: hasError,
    }));
  };

  // Memoize context value to optimize re-renders
  const value = useMemo(
    () => ({
      isPlaying,
      setIsPlaying,
      streamId,
      setStreamId,
      loadingStates,
      setLoadingForStream,
      errorStates,
      setErrorForStream,
    }),
    [isPlaying, streamId, loadingStates, errorStates] // Only recompute value when these change
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
