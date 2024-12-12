import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import Slider from "react-slick";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { settings } from "../utils/slick";

const Trending = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRadioStations();
  }, []);

  async function getRadioStations() {
    try {
      setLoading(true);
      const stationsCollection = collection(db, "stations");
      const q = query(stationsCollection, orderBy("hits", "desc"), limit(10));
      const querySnapshot = await getDocs(q);

      const fetchedStations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStations(fetchedStations);
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-200 mb-4">
        Trending
      </p>

      {loading ? (
        <Slider {...settings}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-full px-2">
              <SkeletonCard />
            </div>
          ))}
        </Slider>
      ) : (
        <Slider {...settings}>
          {stations.map((radio, index) => (
            <div key={radio.id} className="relative">
              <div className="absolute top-0 left-2 bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center text-lg font-bold z-10">
                {index + 1}
              </div>

              <Card
                name={radio.name}
                frequency={radio.frequency}
                id={radio.id}
                logoUrl={radio.logoUrl}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Trending;
