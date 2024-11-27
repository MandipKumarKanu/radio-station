import React, { useState } from "react";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [isHomeActive, setIsHomeActive] = useState(true);

  return (
    <div className="w-full bg-black h-16 px-8">
      <div className="flex justify-between items-center h-full">
        <div>LR</div>
        <div className="flex gap-2 items-center">
          <div
            className="bg-gray p-3 rounded-full text-xl"
            onClick={() => setIsHomeActive(!isHomeActive)}
          >
            {isHomeActive ? <IoHome /> : <IoHomeOutline />}
          </div>
          <input
            type="text"
            className="rounded-full outline-none bg-gray px-4 py-2.5 w-96 placeholder:opacity-95"
            placeholder="What you want to play?"
          />
        </div>
        <div className="bg-gray p-3 rounded-full text-xl">
          <FaUser />
        </div>
      </div>
    </div>
  );
};

export default Header;
