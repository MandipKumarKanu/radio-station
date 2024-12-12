import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import PlayBtn from "./PlayBtn";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { usePlayer } from "../context/usePlayerContext";

const AllStations = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { favorites, toggleFavorite, isPlaying, streamId } = usePlayer();

  const loc = localStorage.getItem("streamUrl");

  const dynamicHeight =
    isPlaying || streamId || loc
      ? "h-[calc(100dvh-200px)]"
      : "h-[calc(100dvh-115px)]";

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredStations(
        stations.filter((station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredStations(stations);
    }
  }, [searchQuery, stations]);

  const fetchStations = async () => {
    try {
      const stationsCollectionRef = collection(db, "stations");
      const stationsSnapshot = await getDocs(stationsCollectionRef);
      const stationsList = stationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStations(stationsList);
      setFilteredStations(stationsList);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to fetch stations.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className={`space-y-4 ${dynamicHeight} overflow-auto no-scrollbar`}>
      <div className="flex justify-center mb-4 mt-1 sticky top-0 z-10 bg-bg py-4 ">
        <input
          type="text"
          placeholder="Search stations..."
          className="w-11/12 sm:w-1/2 px-4 py-2 border border-neutral-800 rounded-xl bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredStations.length > 0 ? (
        filteredStations.map((station) => (
          <div
            key={station.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={station.logoUrl}
                  alt={station.stationName}
                  className="w-16 h-16 object-cover rounded-full"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {station.name}
                  </h3>
                  <span className="text-xs opacity-65">
                    {station.frequency && station.frequency !== ""
                      ? `${station.frequency}MHz`
                      : ""}
                  </span>
                </div>
              </div>

              <div className="flex gap-6">
                <PlayBtn id={station.id} />
                <button
                  onClick={() => toggleFavorite(station.id)}
                  className={`text-neutral-500 hover:text-white transition-all duration-300 ${
                    favorites.includes(station.id) ? "text-red-500" : ""
                  }`}
                  aria-label="Toggle Favorite"
                >
                  {favorites.includes(station.id) ? (
                    <FaHeart className="h-6 w-6 text-2xl" />
                  ) : (
                    <FaRegHeart className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-neutral-500">No stations found.</p>
      )}
    </div>
  );
};

export default AllStations;
