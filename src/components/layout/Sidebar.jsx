import React from "react";
import { FaList } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { IoHomeOutline, IoHeartOutline } from "react-icons/io5";
import { IoIosRadio } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom"; 
import { usePlayer } from "../../context/usePlayerContext";

const Sidebar = () => {
  const { isPlaying, streamId } = usePlayer();
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const sidebarHeight =
    isPlaying || streamId
      ? "h-[calc(100dvh-80px-5rem)]"
      : "h-[calc(100dvh-80px)]";

  const handleFavClick = () => {
    navigate("/favorites");
  };

  const handleHomeClick = () => {
    navigate("/"); 
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gray text-white"
      : "text-gray-700"; 
  };

  return (
    <div
      className={`bg-bg ${sidebarHeight} overflow-hidden w-[350px] mx-2 rounded-lg p-5 pr-0`}
    >
      <div className="flex items-center justify-between text-2xl pr-5">
        <div className="flex items-center gap-4 opacity-70">
          <FaList /> <span>Menu</span>
        </div>
        <FaTimes className="opacity-70 cursor-pointer hover:opacity-100 transition ease-in-out duration-300" />
      </div>

      <div className="mt-6 text-xl flex flex-col gap-2 ml-2 pr-5">
        <ul>
          <li
            onClick={handleHomeClick} 
            className={`cursor-pointer flex gap-2 items-center px-3 py-2 rounded-2xl transition-colors duration-300 ${isActive(
              "/"
            )}`}
          >
            <IoHomeOutline />
            Home
          </li>
          <li
            onClick={handleFavClick}
            className={`cursor-pointer flex gap-2 items-center px-3 py-2 rounded-2xl transition-colors duration-300 ${isActive(
              "/favorites"
            )}`}
          >
            <IoHeartOutline />
            Fav
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-between text-2xl mt-8">
        <div className="flex items-center gap-4 opacity-70">
          <IoIosRadio /> <span>Your Library</span>
        </div>
        <div className="max-h-[calc(100dvh-320px)] overflow-auto"></div>
      </div>
    </div>
  );
};

export default Sidebar;
