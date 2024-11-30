import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import Slider from "react-slick";
import Card from "./Card";
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
    const stationsCollection = collection(db, "stations");
    const q = query(stationsCollection, orderBy("hits", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    const fetchedStations = [];
    querySnapshot.forEach((doc) => {
      fetchedStations.push({ id: doc.id, ...doc.data() });
    });

    setStations(fetchedStations);
    setLoading(false); 
  }

  return (
    <div className="relative overflow-hidden">
      <p className="text-xl sm:text-2xl md:text-3xl opacity-70 mb-4">
        Trending
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
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
                imgId={radio.id}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Trending;
