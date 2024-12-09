import { usePlayer } from "../context/usePlayerContext";
import PlayBtn from "./PlayBtn";
import WavyIcon from "./WavyIcon";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { RadioList } from "../../public/assets/radio_list";
import { useEffect, useState } from "react";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stationToRemove, setStationToRemove] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavoriteStationsFromFirestore();
    } else {
      fetchFavoriteStationsFromLocalStorage();
    }
  }, [user]);

  const fetchFavoriteStationsFromFirestore = async () => {
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

  const fetchFavoriteStationsFromLocalStorage = () => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    setFavorites(savedFavorites);
    setLoading(false);
  };

  const isThisPlaying = (id) => isPlaying && !isLoading && streamId === id;
  const isThisPause = (id) => !isPlaying && !isLoading && streamId === id;

  const confirmRemoveFavorite = (stationId) => {
    setStationToRemove(stationId);
    setIsDialogOpen(true);
  };

  const handleRemoveFavorite = async () => {
    if (!stationToRemove) return;
    setIsDialogOpen(false);
    setFavorites((prevFavorites) =>
      prevFavorites.filter((id) => id !== stationToRemove)
    );

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          favorites: favorites.filter((id) => id !== stationToRemove),
        });
      } catch (error) {
        console.error("Error removing favorite station:", error);
        setFavorites((prevFavorites) => [...prevFavorites, stationToRemove]);
      }
    } else {
      const updatedFavorites = favorites.filter((id) => id !== stationToRemove);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }

    setStationToRemove(null);
  };

  return (
    <div className="container mx-auto py-8">
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
          {favorites && favorites.length > 0 ? (
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
                    <div
                      onClick={() => confirmRemoveFavorite(station.id)}
                      title="Remove from favorites"
                      className="cursor-pointer"
                    >
                      <FaHeart className="text-2xl" />
                    </div>

                    {!isThisPlaying(station.id) && !isThisPause(station.id) && (
                      <PlayBtn id={station.id} />
                    )}

                    {isThisPlaying(station.id) && (
                      <div>
                        <WavyIcon err={errorStates[streamId]} />
                      </div>
                    )}

                    {isThisPause(station.id) && (
                      <div>
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
              </span>
              &nbsp; No favorite stations yet! Add some to see them here.
            </div>
          )}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">
              Remove from Favorites?
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove this station from your favorites?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                onClick={handleRemoveFavorite}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteStations;
