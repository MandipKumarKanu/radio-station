import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  // Improved localStorage reading with fallback
  const [isPlaying, setIsPlaying] = useState(() => {
    try {
      const saved = localStorage.getItem("isPlaying");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [streamId, setStreamId] = useState(
    () => localStorage.getItem("streamId") || ""
  );

  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("isPlaying", JSON.stringify(isPlaying));
    } catch (error) {
      console.error("Failed to save isPlaying", error);
    }
  }, [isPlaying]);

  useEffect(() => {
    try {
      localStorage.setItem("streamId", streamId);
    } catch (error) {
      console.error("Failed to save streamId", error);
    }
  }, [streamId]);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites", error);
    }
  }, [favorites]);

  // Memoized callbacks to prevent unnecessary re-renders
  const toggleFavorite = useCallback((id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((stationId) => stationId !== id)
        : [...prevFavorites, id]
    );
  }, []);

  const setLoadingForStream = useCallback((id, isLoading) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [id]: isLoading,
    }));
  }, []);

  const setErrorForStream = useCallback((id, hasError) => {
    setErrorStates((prevStates) => ({
      ...prevStates,
      [id]: hasError,
    }));
  }, []);

  // Memoize context value to optimize performance
  const contextValue = useMemo(
    () => ({
      isPlaying,
      setIsPlaying,
      streamId,
      setStreamId,
      loadingStates,
      errorStates,
      favorites,
      toggleFavorite,
      setLoadingForStream,
      setErrorForStream,
    }),
    [
      isPlaying,
      streamId,
      loadingStates,
      errorStates,
      favorites,
      toggleFavorite,
      setLoadingForStream,
      setErrorForStream,
    ]
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook with error handling
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerContextProvider");
  }
  return context;
};
