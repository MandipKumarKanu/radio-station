import React, { useState, useEffect, useRef } from "react";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { FaUser, FaSearch, FaTimes, FaList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { RadioList } from "../../../public/assets/radio_list";
import { usePlayer } from "../../context/usePlayerContext";

const Header = ({ setIsMobile, toggleSidebar }) => {
  const { streamId, setStreamId, isPlaying, loadingStates, errorStates } =
    usePlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isHomeActive = location.pathname === "/";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleHomeIcon = () => {
    if (!isHomeActive) {
      navigate("/");
    }
  };

  const filteredStations = RadioList.filter((station) => {
    const searchLowerCase = searchQuery.toLowerCase();
    const stationName = station.name ? station.name.toLowerCase() : "";
    const stationFrequency = station.frequency
      ? station.frequency.toString()
      : "";

    return (
      stationName.includes(searchLowerCase) ||
      stationFrequency.includes(searchLowerCase)
    );
  });

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownVisible(query.length > 0);
    setHighlightedIndex(-1);
  };

  const handleStationSelect = (station) => {
    setStreamId(station.id);
    setIsDropdownVisible(false);
    setSearchQuery("");
    // playStream(station);
    // console.log(station);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsDropdownVisible(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredStations.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleStationSelect(filteredStations[highlightedIndex]);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-black via-black to-gray-900 h-16 px-8 shadow-lg">
      <div className="flex justify-between items-center h-full gap-6">
        <div
          className="text-white font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center gap-4 "
          onClick={toggleSidebar}
        >
          <span className="block md:hidden">
            <FaList />
          </span>
          NT
        </div>

        <div className="flex gap-2 items-center relative" ref={dropdownRef}>
          <button
            className="bg-gray2 p-3 rounded-full text-xl text-white transition-all duration-300 transform hover:scale-105 hidden sm:block"
            onClick={toggleHomeIcon}
            aria-label="Home"
            title="Toggle Home Icon"
          >
            {isHomeActive ? <IoHome /> : <IoHomeOutline />}
          </button>

          <div className="relative">
            <input
              type="text"
              className="rounded-full outline-none bg-gradient-to-br from-gray to-gray2 px-4 py-2.5 max-w-96 w-full placeholder:opacity-95 placeholder-gray-400 text-white focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 border border-transparent focus:border-blue-500/30 "
              placeholder="What you want to play?"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />

            {searchQuery ? (
              <FaTimes
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white hover:text-red-500 transition-colors"
                onClick={clearSearch}
              />
            ) : (
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-50" />
            )}
          </div>

          {isDropdownVisible && searchQuery && (
            <div className="absolute bg-gradient-to-br from-gray2 to-black text-gray w-96 right-0 top-full mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto no-scrollbar z-50 border border-gray-800 animate-slide-down p-1">
              {filteredStations.length > 0 ? (
                filteredStations.map((station, index) => (
                  <div
                    key={station.id}
                    className={`
                      px-4 py-2 flex items-center gap-3 
                      ${
                        index === highlightedIndex
                          ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50"
                          : "hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30"
                      }
                      cursor-pointer transition-all duration-300 rounded-lg
                      group relative overflow-hidden
                    `}
                    onClick={() => handleStationSelect(station)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <img
                      src={`/assets/logo/${station.id}.jpg`}
                      alt={station.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500/50 transition-all"
                    />
                    <div className="z-10">
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {station.name}
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">
                        {station.frequency} MHz
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-center italic bg-gray-900 rounded-lg">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="bg-gray2 p-3 rounded-full text-xl text-white transition-all duration-300 transform hover:scale-105"
          title="User Profile"
          onClick={navigateToLogin}
        >
          <FaUser />
        </button>
      </div>
    </div>
  );
};

export default Header;
