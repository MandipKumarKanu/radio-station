import React, { useMemo } from "react";
import Slider from "react-slick";
import Card from "./Card";
import { RadioList } from "../../public/assets/radio_list";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Recommended = () => {
  const randomRadioList = useMemo(() => getRandomItems(RadioList, 12), []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: 6.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 5.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative overflow-hidden">
      <p className="text-2xl opacity-70 mb-4">Recommended Stations</p>
      <Slider {...settings}>
        {randomRadioList.map((radio) => (
          <div key={radio.id}>
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
