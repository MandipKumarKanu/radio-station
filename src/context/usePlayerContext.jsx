import { createContext, useContext, useState, useEffect } from "react";

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

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        streamId,
        setStreamId,
        loadingStates,
        setLoadingForStream,
        errorStates,
        setErrorForStream,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
