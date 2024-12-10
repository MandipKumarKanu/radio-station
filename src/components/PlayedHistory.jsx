import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { usePlayer } from "../context/usePlayerContext";
import WavyIcon from "./WavyIcon";
import PlayBtn from "./PlayBtn";

const PlayedHistory = () => {
  const [playedHistory, setPlayedHistory] = useState([]);
  const { user } = useAuth();
  const { streamId, isPlaying, loadingStates, errorStates } = usePlayer();

  useEffect(() => {
    if (user) {
      fetchPlayedHistory();
    }
  }, [user]);

  const fetchPlayedHistory = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        let historyData = userDocSnap.data().playedHistory || [];

        historyData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        setPlayedHistory(historyData);
      } else {
        console.log("User document does not exist.");
      }
    } catch (err) {
      console.error("Error fetching played history:", err);
    }
  };

  const convertTimestamp = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleDateString("en-US", {
      month: "short", 
      day: "2-digit", 
    });
  };

  const groupByDate = (history) => {
    return history.reduce((groups, item) => {
      const date = convertTimestamp(item.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };

  const groupedHistory = groupByDate(playedHistory);

  const displayLogo = (radio) =>
    radio.id ? `/assets/logo/${radio.id}.jpg` : "/assets/radio.webp";

  return (
    <div>
      <h3 className="text-white text-lg font-semibold">Played History</h3>
      <div className="space-y-6">
        {Object.keys(groupedHistory).map((date, idx) => (
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
