import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { usePlayer } from "../context/usePlayerContext";
import { motion, AnimatePresence } from "framer-motion";

const RecentHistory = () => {
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { streamId, isPlaying, setStreamId } = usePlayer();

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const historyData = docSnap.data().playedHistory || [];

            const sortedHistory = historyData.sort(
              (a, b) => b.timestamp.seconds - a.timestamp.seconds
            );

            setRecentHistory(sortedHistory.slice(0, 5));
          } else {
            console.log("User document does not exist.");
            setRecentHistory([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching real-time data:", error);
          setLoading(false);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const displayLogo = (radio) =>
    radio.id ? `/assets/logo/${radio.id}.jpg` : "/assets/radio.webp";

  const handleStationSelect = (stationId) => {
    setStreamId(stationId);
  };

  return (
    <div>
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3, 4, 5].map((_, index) => (
            <motion.div
              key={index}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 animate-pulse flex items-center justify-between cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-md" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-700 rounded-md" />
                  <div className="w-16 h-3 bg-gray-700 rounded-md" />
                </div>
              </div>
            </motion.div>
          ))
        ) : recentHistory.length > 0 ? (
          <AnimatePresence>
            {recentHistory.map((history, index) => {
              const isThisPlaying = isPlaying && streamId === history.id;

              return (
                <motion.div
                  key={index}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group flex items-center justify-between cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div
                    className="flex items-center space-x-4"
                    onClick={() => handleStationSelect(history.id)}
                  >
                    <img
                      src={history.logoUrl}
                      alt={history.stationName || "Station Logo"}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <h4
                        className={`${
                          isThisPlaying ? "text-green-600 font-semibold" : ""
                        } line-clamp-1`}
                      >
                        {history.stationName || "Unnamed Station"}
                      </h4>
                      <span className="text-sm opacity-65">
                        {history.frequency && history.frequency !== ""
                          ? `${history.frequency}MHz`
                          : ""} 
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.p
            className="text-neutral-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No recent history available.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default RecentHistory;
