import React from "react";

const WavyIcon = ({ err }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div
        className={`bar h-6 w-1 bg-gradient-to-t from-blue-500 to-cyan-300 ${
          !err && "animate-bar1"
        }`}
      ></div>
      <div
        className={`bar h-6 w-1 bg-gradient-to-t from-green-500 to-teal-300 ${
          !err && "animate-bar2"
        }`}
      ></div>
      <div
        className={`bar h-6 w-1 bg-gradient-to-t from-purple-500 to-indigo-300 ${
          !err && "animate-bar3"
        }`}
      ></div>
      <div
        className={`bar h-6 w-1 bg-gradient-to-t from-pink-500 to-red-300 ${
          !err && "animate-bar4"
        }`}
      ></div>
      <div
        className={`bar h-6 w-1 bg-gradient-to-t from-yellow-500 to-orange-300 ${
          !err && "animate-bar5"
        }`}
      ></div>
    </div>
  );
};

export default WavyIcon;
