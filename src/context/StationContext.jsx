import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../utils/firebase.config";
import { collection, getDocs } from "firebase/firestore";

const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const [radioList, setRadioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRadioStations = async () => {
      try {
        setLoading(true);
        const radioCollectionRef = collection(db, "stations");
        const querySnapshot = await getDocs(radioCollectionRef);
        const fetchedRadioList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRadioList(fetchedRadioList);
      } catch (err) {
        setError("Failed to load radio stations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioStations();
  }, []);

  return (
    <StationContext.Provider value={{ radioList, loading, error }}>
      {children}
    </StationContext.Provider>
  );
};

export const useStation = () => {
  return useContext(StationContext);
};
