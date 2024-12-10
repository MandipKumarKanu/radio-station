import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { usePlayer } from "../context/usePlayerContext";
import WavyIcon from "./WavyIcon";
import PlayBtn from "./PlayBtn";

const SkeletonCard = () => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-neutral-700 rounded-md"></div>
      <div>
        <div className="h-4 bg-neutral-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-neutral-800 rounded w-20"></div>
      </div>
    </div>
    <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
  </div>
);

const PlayedHistory = () => {
  const [playedHistory, setPlayedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { streamId, isPlaying, errorStates } = usePlayer();

  const loc = localStorage.getItem("streamUrl");

  const isPlayerActive = isPlaying || streamId || loc;

  const convertTimestamp = useCallback((timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  }, []);

  const groupByDate = useCallback(
    (history) => {
      return history.reduce((groups, item) => {
        const date = convertTimestamp(item.timestamp);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
        return groups;
      }, {});
    },
    [convertTimestamp]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchPlayedHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (isMounted) {
          if (userDocSnap.exists()) {
            let historyData = userDocSnap.data().playedHistory || [];
            historyData.sort(
              (a, b) => b.timestamp.seconds - a.timestamp.seconds
            );
            setPlayedHistory(historyData);
          } else {
            console.log("User document does not exist.");
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching played history:", err);
          setLoading(false);
        }
      }
    };

    fetchPlayedHistory();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const groupedHistory = useMemo(
    () => groupByDate(playedHistory),
    [playedHistory, groupByDate]
  );

  const displayLogo = (radio) =>
    radio.id ? `/assets/logo/${radio.id}.jpg` : "/assets/radio.webp";

  return (
    <div
      className={`container mx-auto py-8 space-y-6 ${
        isPlayerActive ? "h-[calc(100dvh-100px-5rem)]" : "h-[calc(100dvh-100px)]"
      } overflow-y-auto no-scrollbar`}
    >
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Played History
      </h2>
      <div className="space-y-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : Object.keys(groupedHistory).map((date, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-white text-xl font-semibold">{date}</h3>
                <div className="space-y-2">
                  {groupedHistory[date].map((history, index) => {
                    const isThisPlaying = isPlaying && streamId === history.id;
                    const isThisPause = !isPlaying && streamId === history.id;

                    return (
                      <div
                        key={index}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group flex items-center justify-between"
                      >
                        <div className="flex items-center relative space-x-4">
                          <img
                            src={displayLogo(history)}
                            alt={history.stationName || "Station Logo"}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <h4 className="text-white">
                              {history.stationName || "Unnamed Station"}
                            </h4>
                            <span className="text-sm opacity-65">
                              {history.frequency} MHz
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!isThisPlaying && !isThisPause && (
                            <PlayBtn id={history.id} />
                          )}

                          {isThisPlaying && (
                            <WavyIcon err={errorStates[history.id]} />
                          )}

                          {isThisPause && <WavyIcon err={isThisPause} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PlayedHistory;
