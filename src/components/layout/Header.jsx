import React, { useState } from "react";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [isHomeActive, setIsHomeActive] = useState(true);

  const toggleHomeIcon = () => setIsHomeActive((prev) => !prev);

  return (
    <div className="w-full bg-black h-16 px-8">
      <div className="flex justify-between items-center h-full">
        <div className="text-white font-bold text-2xl">LR</div>

        <div className="flex gap-2 items-center">
          <button
            className="bg-gray p-3 rounded-full text-xl text-white"
            onClick={toggleHomeIcon}
            aria-label="Home"
            title="Toggle Home Icon"
          >
            {isHomeActive ? <IoHome /> : <IoHomeOutline />}
          </button>

          <input
            type="text"
            className="rounded-full outline-none bg-gray px-4 py-2.5 w-96 placeholder:opacity-95 placeholder-white text-white"
            placeholder="What you want to play?"
          />
        </div>

        <button
          className="bg-gray p-3 rounded-full text-xl text-white"
          title="User Profile"
        >
          <FaUser />
        </button>
      </div>
    </div>
  );
};

export default Header;
