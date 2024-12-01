import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebase.config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

const CustomStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    fetchStation();
    console.log(user);
  }, []);

  const fetchStation = async () => {
    if (user && user.uid) {
      const userDocRef = doc(db, "users", "trZORojs5rTzJ5T6lEXXgCxzPov1" );
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userStations = userDocSnap?.data()?.customStations;
        console.log(userDocSnap?.data());
        console.log(userStations);
        setStations(userStations);
        setLoading(false);
      } else {
        setError("User document does not exist.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {stations &&
        stations.map((station, index) => (
          <div
            key={index}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {station.stationName}
                </h3>
                <p className="text-neutral-400 text-sm truncate max-w-[300px]">
                  {station.streamUrl}
                </p>
              </div>
              <button
                onClick={() => removeStation(station.stationName)}
                className="text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
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
        ))}
    </div>
  );
};

export default CustomStations;
