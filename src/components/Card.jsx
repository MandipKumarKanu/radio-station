import React from "react";
import PropTypes from "prop-types"; 
import PlayBtn from "./PlayBtn";

const Card = ({ name = "sasaa", frequency = "sas", imgId = "" }) => {
  const imageSrc = imgId
    ? `/assets/logo/${imgId}.jpg`
    : "/assets/logo/default.jpg"; 

  return (
    <div
      className="group relative flex flex-col p-3 sm:p-4 bg-gray-200 rounded-xl transition-colors duration-300 hover:bg-gray2 w-full mx-auto"
      title={name}
    >
      <div className="relative aspect-square w-full">
        <img
          src={imageSrc}
          alt={name} 
          className="h-full w-full object-cover rounded-lg"
        />
        <div className="absolute -bottom-3 -right-3 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <PlayBtn id={imgId} />
        </div>
      </div>

      <div className="mt-2 sm:mt-3 leading-tight">
        <h3 className="line-clamp-1 text-base sm:text-lg font-bold">{name}</h3>
        <span className="text-xs sm:text-sm opacity-65">{frequency} MHz</span>
      </div>
    </div>
  );
};

Card.propTypes = {
  name: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  imgId: PropTypes.string,
};

export default Card;
