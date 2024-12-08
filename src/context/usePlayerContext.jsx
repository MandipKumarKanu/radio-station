import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { useAuth } from "./AuthContext";

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("isPlaying") || "false");
    } catch {
      return false;
    }
  });

  const [streamId, setStreamId] = useState(
    () => localStorage.getItem("streamId") || ""
  );
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  const [streamUrl, setStreamUrl] = useState(
    () => localStorage.getItem("streamUrl") || ""
  );
  const [favorites, setFavorites] = useState([]);
  const [customStationNames, setCustomStationNames] = useState();

  const favoritesFetchedRef = useRef(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && !favoritesFetchedRef.current) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fetchedFavorites = docSnap.data().favorites || [];
            setFavorites(fetchedFavorites);
            favoritesFetchedRef.current = true;
          }
        } catch (error) {
          console.error("Error fetching favorites from Firestore:", error);
        }
      } else if (!user) {
        const saved = localStorage.getItem("favorites");
        setFavorites(saved ? JSON.parse(saved) : []);
        favoritesFetchedRef.current = false;
      }
    };

    fetchFavorites();
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("isPlaying", JSON.stringify(isPlaying));
    } catch (error) {
      console.error("Failed to save isPlaying to localStorage:", error);
    }
  }, [isPlaying]);

  useEffect(() => {
    try {
      localStorage.setItem("streamId", streamId);
    } catch (error) {
      console.error("Failed to save streamId to localStorage:", error);
    }
  }, [streamId]);

  useEffect(() => {
    try {
      localStorage.setItem("streamUrl", streamUrl);
    } catch (error) {
      console.error("Failed to save streamUrl to localStorage:", error);
    }
  }, [streamUrl]);

  const saveFavoritesToFirestore = useCallback(
    debounce(async (newFavorites) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, { favorites: newFavorites }, { merge: true });
        } catch (error) {
          console.error("Error saving favorites to Firestore:", error);
        }
      } else {
        try {
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
        } catch (error) {
          console.error("Failed to save favorites to localStorage:", error);
        }
      }
    }, 500),
    [user]
  );

  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((prevFavorites) => {
        const newFavorites = prevFavorites.includes(id)
          ? prevFavorites.filter((stationId) => stationId !== id)
          : [...prevFavorites, id];

        saveFavoritesToFirestore(newFavorites);
        return newFavorites;
      });
    },
    [saveFavoritesToFirestore]
  );

  const isStreamIdFavorite = useMemo(() => {
    return favorites.includes(streamId);
  }, [favorites, streamId]);

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

  const resetPlayback = useCallback(() => {
    setStreamId("");
    setStreamUrl("");
    setIsPlaying(false);
    try {
      localStorage.removeItem("streamId");
      localStorage.removeItem("streamUrl");
      localStorage.removeItem("isPlaying");
    } catch (error) {
      console.error("Failed to reset playback state:", error);
    }
  }, []);

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
      isStreamIdFavorite,
      setLoadingForStream,
      setErrorForStream,
      streamUrl,
      setStreamUrl,
      resetPlayback,
      setCustomStationNames,
      customStationNames,
    }),
    [
      isPlaying,
      streamId,
      loadingStates,
      errorStates,
      favorites,
      toggleFavorite,
      isStreamIdFavorite,
      setLoadingForStream,
      setErrorForStream,
      streamUrl,
      setStreamUrl,
      resetPlayback,
      setCustomStationNames,
      customStationNames,
    ]
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerContextProvider");
  }
  return context;
};
