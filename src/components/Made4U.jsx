import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase.config";
import {
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
import Made4UCard from "./Made4UCard";

const Made4U = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [userData, setUserData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user]);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());

        const sortedRadioList =
          userDocSnap.data().playedHistory &&
          userDocSnap.data().playedHistory.sort((a, b) => b.hits - a.hits);

        console.log(sortedRadioList);
        fetchHistoryData(sortedRadioList);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setLoading(false);
    }
  };

  const fetchHistoryData = async (playedHistory) => {
    try {
      if (playedHistory && playedHistory.length > 0) {
        const top8History = playedHistory.slice(0, 8);
        setHistoryData(top8History);
      } else {
        fetchTopRadioStations();
      }
    } catch (err) {
      console.error("Error fetching history data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRadioStations = async () => {
    try {
      const radioCollectionRef = collection(db, "radioStations");
      const radioQuery = query(radioCollectionRef, limit(8));
      const querySnapshot = await getDocs(radioQuery);
      const fetchedRadioList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistoryData(fetchedRadioList);
    } catch (err) {
      console.error("Error fetching top radio stations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-12" aria-label="Made For You Section">
      <header>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-200 mb-4">
          Made For You
        </p>
      </header>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: isMobile ? 4 : 8 }).map((_, index) => (
            <div
              key={index}
              className="group relative flex gap-2 items-center bg-gray2 p-3 rounded-lg animate-pulse"
            >
              <div className="h-16 w-16 rounded-full bg-gray-300" />

              <div className="flex flex-col justify-center w-24">
                <div className="w-24 h-4 bg-gray-300 mb-1" />
                <div className="w-16 h-3 bg-gray-300" />
              </div>
            </div>
          ))
        ) : historyData.length > 0 ? (
          historyData
            .slice(0, isMobile ? 4 : 8)
            .map((radio) => (
              <Made4UCard
                key={radio.id}
                name={radio.stationName}
                frequency={radio.frequency}
                imgId={radio.id}
              />
            ))
        ) : (
          <p className="text-center col-span-full">
            No radio stations available.
          </p>
        )}
      </div>
    </section>
  );
};

export default Made4U;
