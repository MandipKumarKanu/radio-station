import React, { useState, useRef, useEffect } from "react";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { FaUser, FaSearch, FaTimes, FaList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/usePlayerContext";
import { useStation } from "../../context/StationContext";

const Header = ({ setIsMobile, toggleSidebar }) => {
  const { streamId, setStreamId, isPlaying, setStreamUrl } = usePlayer();
  const { radioList } = useStation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isHomeActive = location.pathname === "/";

  useEffect(() => {
    setFilteredStations(
      radioList.filter((station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, radioList]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownVisible(query.length > 0);
  };

  const handleStationSelect = (station) => {
    setStreamUrl("");
    setStreamId(station.id);
    setIsDropdownVisible(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsDropdownVisible(false);
  };

  const toggleHomeIcon = () => {
    if (!isHomeActive) {
      navigate("/");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-black via-black to-gray-900 h-16 px-8 shadow-lg">
      <div className="flex justify-between items-center h-full gap-6">
        <div
          className="text-white font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center gap-4"
          onClick={toggleSidebar}
        >
          <span className="block md:hidden">
            <FaList />
          </span>
          <img
            src="/assets/NepTune.png"
            alt=""
            className="h-12 rotate-12 cursor-pointer"
            onClick={toggleHomeIcon}
          />
        </div>

        <div className="flex gap-2 items-center relative">
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
              className="rounded-full outline-none bg-gradient-to-br from-gray to-gray2 px-4 py-2.5 pr-12 w-full placeholder:opacity-95 placeholder-gray-400 text-white focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 border border-transparent focus:border-blue-500/30"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={handleSearchChange}
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
                filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="px-4 py-2 flex items-center gap-3 hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30 cursor-pointer transition-all duration-300 rounded-lg"
                    onClick={() => handleStationSelect(station)}
                  >
                    <img
                      src={station.logoUrl}
                      alt={station.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {station.name}
                      </div>
                      <div className="text-sm text-white">
                        {station.frequency} MHz
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white px-4 py-2 text-center italic bg-gray-900 rounded-lg">
                  No results found
                </p>
              )}
            </div>
          )}
        </div>

        <button
          className="bg-gray2 p-3 rounded-full text-xl text-white transition-all duration-300 transform hover:scale-105"
          title="User Profile"
          onClick={() => navigate("/login")}
        >
          <FaUser />
        </button>
      </div>
    </div>
  );
};

export default Header;
