import React, { useState, useEffect } from "react";
import { FaClock, FaSync } from "react-icons/fa";

const MaintenancePage = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black transition-all duration-300">
      <div
        className={`
          text-center p-8 rounded-lg shadow-2xl 
          transform transition-all duration-300 
          relative
        `}
      >
        <div className="absolute top-4 right-4 text-white">
          <FaClock className="inline-block mr-2" />
          <span>
            {formatTime(timeRemaining.hours)}:
            {formatTime(timeRemaining.minutes)}:
            {formatTime(timeRemaining.seconds)}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <FaSync className="mr-4 text-blue-400 animate-spin" />
          We'll Be Back Soon!
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Our site is currently under maintenance. We're working hard to bring
          it back online. Please check back later.
        </p>
        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
          <p className="text-sm text-gray-200 italic">
            Estimated Downtime: Approximately {timeRemaining.hours} hours
          </p>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
