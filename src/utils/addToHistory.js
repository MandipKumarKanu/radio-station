import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase.config";

export const addPlayedHistory = async (station, user) => {
  console.log(station)
  try {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    let playedHistory = [];
    if (userDocSnap.exists()) {
      playedHistory = userDocSnap.data().playedHistory || [];
    }

    const existingIndex = playedHistory.findIndex(
      (entry) => entry.streamUrl === station.streamUrl
    );

    if (existingIndex !== -1) {
      playedHistory[existingIndex].hits =
        (playedHistory[existingIndex].hits || 1) + 1;
      playedHistory[existingIndex].timestamp = Timestamp.now();
    } else {
      playedHistory.unshift({
        id: station.id,
        stationName: station.stationName,
        streamUrl: station.streamUrl,
        frequency: station.frequency,
        logoUrl: station.logoUrl,
        timestamp: Timestamp.now(),
        hits: 1,
      });
    }

    await updateDoc(userDocRef, { playedHistory });

    console.log("Played history updated successfully.");
  } catch (error) {
    console.error("Error adding to played history:", error);
  }
};
