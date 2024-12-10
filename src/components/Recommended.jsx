import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { settings } from "../utils/slick";
import { db } from "../utils/firebase.config";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Recommended = () => {
  const [randomRadioList, setRandomRadioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRandomRadioStations();
  }, []);

  const fetchRandomRadioStations = async () => {
    try {
      setLoading(true);
      const radioCollectionRef = collection(db, "stations");
      const radioQuery = query(radioCollectionRef, limit(12));
      const querySnapshot = await getDocs(radioQuery);

      const fetchedRadioList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const shuffledList = fetchedRadioList.sort(() => 0.5 - Math.random());
      setRandomRadioList(shuffledList);
    } catch (error) {
      console.error("Error fetching random radio stations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-200">
          Recommended Stations
        </p>
        <p
          className="text-sm sm:text-lg text-blue-600 hover:underline font-medium cursor-pointer "
          onClick={() => navigate("/all")}
        >
          All Stations
        </p>
      </div>

      <Slider {...settings}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="w-full px-2">
                <SkeletonCard />
              </div>
            ))
          : randomRadioList.map((radio) => (
              <div key={radio.id} className="w-full px-2">
                <Card
                  name={radio.name}
                  frequency={radio.frequency}
                  imgId={radio.id}
                />
              </div>
            ))}
      </Slider>
    </div>
  );
};

export default Recommended;
