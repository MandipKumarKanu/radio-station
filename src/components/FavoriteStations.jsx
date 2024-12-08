import { usePlayer } from "../context/usePlayerContext";
import PlayBtn from "./PlayBtn";
import WavyIcon from "./WavyIcon";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { RadioList } from "../../public/assets/radio_list";
import { useEffect, useState } from "react";

// Skeleton component for loading
const SkeletonLoader = () => (
  <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-4 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
      <div>
        <div className="w-32 h-6 bg-gray-600 rounded mb-2"></div>
        <div className="w-16 h-4 bg-gray-600 rounded"></div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
    </div>
  </div>
);

const FavoriteStations = () => {
  const {
    streamId,
    isPlaying,
    errorStates,
    isLoading,
    toggleFavorite: removeFavorite,
  } = usePlayer();

  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && favorites.length === 0) {
      fetchFavoriteStations();
    }
  }, []);

  const fetchFavoriteStations = async () => {
    setLoading(true);
    try {
      const stationsDoc = await getDoc(doc(db, "users", user.uid));
      if (stationsDoc.exists()) {
        const userData = stationsDoc.data();
        setFavorites(userData?.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorite stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const isThisPlaying = (id) => isPlaying && !isLoading && streamId === id;
  const isThisPause = (id) => !isPlaying && !isLoading && streamId === id;

  // Handle optimistic update on removing from favorites
  const handleRemoveFavorite = async (stationId) => {
    // Optimistic update: remove from favorites immediately
    setFavorites((prevFavorites) =>
      prevFavorites.filter((id) => id !== stationId)
    );

    try {
      // Update in Firebase as well
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        favorites: favorites.filter((id) => id !== stationId),
      });
    } catch (error) {
      console.error("Error removing favorite station:", error);
      // If update fails, revert the optimistic change
      setFavorites((prevFavorites) => [...prevFavorites, stationId]);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Your Favorite Radio Stations
      </h2>

      {loading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.length > 0 ? (
            favorites.map((id) => {
              const station = RadioList.find((station) => station.id === id);
              if (!station) return null;

              return (
                <div
                  key={station.id}
                  className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group"
                  title={station.name}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`/assets/logo/${station.id}.jpg`}
                      alt={station.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white line-clamp-1">
                        {station.name}
                      </h3>
                      <span className="text-sm text-gray-200">
                        {station.frequency} MHz
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {!isThisPlaying(station.id) && !isThisPause(station.id) && (
                      <PlayBtn id={station.id} />
                    )}

                    <div
                      onClick={() => handleRemoveFavorite(station.id)}
                      title="Remove from favorites"
                    >
                      <FaHeart className="text-2xl" />
                    </div>

                    {isThisPlaying(station.id) && (
                      <div className="">
                        <WavyIcon err={errorStates[streamId]} />
                      </div>
                    )}

                    {isThisPause(station.id) && (
                      <div className="">
                        <WavyIcon err={isThisPause} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg text-gray-600">
              <span role="img" aria-label="no favorites">
                🚫
              </span>&nbsp; 
              No favorite stations yet! Add some to see them here.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteStations;
