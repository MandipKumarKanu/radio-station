import React from "react";

const SkeletonCard = () => {
  return (
    <div className=" relative flex gap-2 items-center bg-gray2 p-3 rounded-lg animate-pulse mb-8">
      <div className="h-56 w-16 rounded-full bg-gray-300" />

      <div className="flex flex-col justify-center w-24">
        <div className="w-24 h-4 bg-gray-300 mb-1" />
        <div className="w-16 h-3 bg-gray-300" />
      </div>
    </div>
  );
};

export default SkeletonCard;
