import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { IoHomeOutline, IoHeartOutline, IoPerson } from "react-icons/io5";
import { IoIosRadio } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlayer } from "../../context/usePlayerContext";
import { getAuth } from "firebase/auth";
import { getFromLocalStorage } from "../../utils/useLocalStorage";
import AddCustomStationDialog from "../AddCustomStationDialog";

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar }) => {
  const { isPlaying, streamId } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const sidebarHeight =
    isPlaying || streamId ? "h-[calc(100dvh-160px)]" : "h-[calc(100dvh-80px)]";

  const handleFavClick = () => {
    navigate("/favorites");
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    if (isMobile) setIsSidebarOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray text-white" : "text-gray-700";
  };

  const loggedIn = getFromLocalStorage("login") === true;

  // useEffect(() => {
  //   const handleResize = () => {
  //     const currentWidth = window.innerWidth;
  //     setIsMobile(currentWidth <= 768);

  //     if (currentWidth <= 768) {
  //       setIsSidebarOpen(false);
  //     } else {
  //       setIsSidebarOpen(true);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   handleResize();

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  // useEffect(() => {
  //   if (isMobile) {
  //     setIsSidebarOpen(false);
  //   }
  // }, [location.pathname, isMobile]);

  // if (!isSidebarOpen && isMobile) {
  //   return (
  //     <div
  //       onClick={toggleSidebar}
  //       className="fixed left-2 top-24 z-50 bg-bg p-2 rounded-full cursor-pointer h-[100dvh]"
  //     >
  //       <FaList />
  //     </div>
  //   );
  // }

  return (
    <>
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
            ${
              isMobile
                ? "fixed left-0 top-0 z-50 w-[280px] h-[100dvh] transform transition-transform duration-300"
                : "relative"
            }
            bg-bg ${sidebarHeight} overflow-hidden 
            ${
              isMobile
                ? isSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : "w-[350px] mx-2"
            }
            rounded-lg p-5 pr-0
          `}
      >
        <div className="flex items-center justify-between text-2xl pr-5">
          <div className="flex items-center gap-4 opacity-70">
            <span>Menu</span>
          </div>
          {isMobile && (
            <FaTimes
              onClick={toggleSidebar}
              className="opacity-70 cursor-pointer hover:opacity-100 transition ease-in-out duration-300"
            />
          )}
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
            {(user || loggedIn) && (
              <li
                onClick={handleProfileClick}
                className={`cursor-pointer flex gap-2 items-center px-3 py-2 rounded-2xl transition-colors duration-300 ${isActive(
                  "/profile"
                )}`}
              >
                <IoPerson />
                Profile
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col justify-between text-2xl mt-8">
          <div className="flex items-center justify-between mr-12 opacity-70">
            <div className="flex items-center gap-4 opacity-70">
              <IoIosRadio />
              <span>Your Library</span>
            </div>
            <div>
              <button
                className="text-3xl "
                onClick={() => setIsDialogOpen(true)}
              >
                +
              </button>
            </div>
          </div>
          <div className="max-h-[calc(100dvh-320px)] overflow-auto"></div>
        </div>
      </div>

      <AddCustomStationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default Sidebar;
