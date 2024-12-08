import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebase.config";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import PlayBtn from "./PlayBtn";

const SkeletonLoader = () => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="w-2/3">
        <div className="w-32 h-6 bg-gray-600 rounded mb-2"></div>
        <div className="w-40 h-4 bg-gray-600 rounded"></div>
      </div>
      <div className="flex gap-4">
        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  </div>
);

const CustomStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchStations();
    } else {
      setLoading(false);
      setError("User not authenticated.");
    }
  }, [user]);

  const fetchStations = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userStations = userDocSnap.data().customStations || [];
        setStations(userStations);
      } else {
        setError("User document does not exist.");
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to fetch stations.");
    } finally {
      setLoading(false);
    }
  };

  const removeStation = async (stationName) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        customStations: arrayRemove(
          stations.find((station) => station.stationName === stationName)
        ),
      });

      setStations((prev) =>
        prev.filter((station) => station.stationName !== stationName)
      );
    } catch (err) {
      console.error("Error removing station:", err);
      setError("Failed to remove station.");
    }
  };


  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Your Custom Radio Stations
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <>
          {stations.length > 0 ? (
            stations.map((station, index) => (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group"
                title={station.stationName}
              >
                <div className="flex justify-between items-center">
                  <div className="w-2/3 line-clamp-1">
                    <h3 className="text-white font-semibold text-lg">
                      {station.stationName}
                    </h3>
                    <p className="text-neutral-400 text-sm truncate max-w-[300px]">
                      {station.streamUrl}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <PlayBtn
                      streamUrl={station.streamUrl}
                      name={station.stationName}
                    />
                    <button
                      onClick={() => removeStation(station.stationName)}
                      className="text-neutral-500 hover:text-red-600 transition-all duration-300"
                      aria-label="Remove station"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">
              No custom stations found. Add some to see them here!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CustomStations;
