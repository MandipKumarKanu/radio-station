import React, { useMemo } from "react";
import Slider from "react-slick";
import Card from "./Card";
import { RadioList } from "../../public/assets/radio_list";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { settings } from "../utils/slick";

const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Recommended = () => {
  const randomRadioList = useMemo(() => getRandomItems(RadioList, 12), []);

  return (
    <div className="relative overflow-hidden">
      <p className="text-xl sm:text-2xl md:text-3xl opacity-70 mb-4">Recommended Stations</p>
      <Slider {...settings}>
        {randomRadioList.map((radio) => (
          <div key={radio.id} className="w-full">
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
