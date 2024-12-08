import { usePlayer } from "../context/usePlayerContext";
import PlayBtn from "./PlayBtn";
import WavyIcon from "./WavyIcon";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { RadioList } from "../../public/assets/radio_list";
import { useEffect, useState } from "react";

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
        console.log(userData);
        setFavorites(userData?.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorite stations:", error);
    } finally {
      setLoading(false)
    }
  };

  const isThisPlaying = (id) => isPlaying && !isLoading && streamId === id;
  const isThisPause = (id) => !isPlaying && !isLoading && streamId === id;

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Your Favorite Radio Stations
      </h2>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.length > 0 ? (
            favorites.map((id) => {
              const station = RadioList.find((station) => station.id === id);
              if (!station) return null;

              return (
                <div
                  key={station.id}
                  className="relative bg-gradient-to-r from-gray via-gray2 to-black rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  title={station.name}
                >
                  <img
                    src={`/assets/logo/${station.id}.jpg`}
                    alt={station.name}
                    className="w-full h-40 object-cover rounded-t-xl transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold text-white line-clamp-1">
                      {station.name}
                    </h3>
                    <span className="text-sm text-gray-200">
                      {station.frequency} MHz
                    </span>
                  </div>

                  {!isThisPlaying(station.id) && !isThisPause(station.id) && (
                    <div
                      className="absolute top-2 right-2 transition duration-200"
                      title="Play"
                    >
                      <PlayBtn id={station.id} />
                    </div>
                  )}

                  <div
                    onClick={() => removeFavorite(station.id)}
                    className="absolute top-2 left-2 p-3 bg-btn rounded-full shadow-md cursor-pointer opacity-100 transition-opacity duration-200 hover:text-red-600"
                    title="Remove from favorites"
                  >
                    <FaHeart className="text-2xl" />
                  </div>

                  {isThisPlaying(station.id) && (
                    <div className="absolute top-4 right-4">
                      <WavyIcon err={errorStates[streamId]} />
                    </div>
                  )}

                  {isThisPause(station.id) && (
                    <div className="absolute top-4 right-4">
                      <WavyIcon err={isThisPause} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-lg text-gray-600">
              No favorite stations yet! Add some to see them here.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteStations;
