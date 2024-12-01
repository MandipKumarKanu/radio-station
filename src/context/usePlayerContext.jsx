import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
// import { auth, db } from "./firebase"; // Make sure the path is correct
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase.config";

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
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

  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch user from Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load favorites from Firebase or localStorage
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        const docRef = doc(db, "users", user.uid); // Assuming user ID is the document ID
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      };
      fetchFavorites();
    } else {
      const saved = localStorage.getItem("favorites");
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  // Save to localStorage or Firebase based on user status
  useEffect(() => {
    if (user) {
      // Save favorites to Firestore
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, { favorites }, { merge: true }).catch(console.error);
    } else {
      // Save favorites to localStorage when logged out
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites", error);
      }
    }
  }, [favorites, user]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(id)
        ? prevFavorites.filter((stationId) => stationId !== id)
        : [...prevFavorites, id];

      return newFavorites;
    });
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

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerContextProvider");
  }
  return context;
};
