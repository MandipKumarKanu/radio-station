import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { IoHomeOutline, IoHeartOutline } from "react-icons/io5";
import { IoIosRadio } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlayer } from "../../context/usePlayerContext";
import { getAuth } from "firebase/auth";
import { getFromLocalStorage } from "../../utils/useLocalStorage";
import AddCustomStationDialog from "../AddCustomStationDialog";
import { MdOutlinePersonOutline, MdLockOutline } from "react-icons/md";
import RecentHistory from "../RecentHistory";
import { motion } from "framer-motion"; // Import Framer Motion

const Sidebar = ({
  isSidebarOpen,
  isMobile,
  toggleSidebar,
  setIsSidebarOpen,
}) => {
  const { isPlaying, streamId } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const loc = localStorage.getItem("streamUrl");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const sidebarHeight =
    isPlaying || streamId || loc
      ? "h-[calc(100dvh-160px)]"
      : "h-[calc(100dvh-80px)]";

  const navigationItems = [
    {
      icon: <IoHomeOutline />,
      label: "Home",
      path: "/",
      onClick: () => {
        navigate("/");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      icon: <IoHeartOutline />,
      label: "Fav",
      path: "/favorites",
      onClick: () => {
        navigate("/favorites");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    ...(user || getFromLocalStorage("login") === true
      ? [
          {
            icon: <MdOutlinePersonOutline />,
            label: "Profile",
            path: "/profile",
            onClick: () => {
              navigate("/profile");
              if (isMobile) setIsSidebarOpen(false);
            },
          },
          {
            icon: <IoIosRadio />,
            label: "My Stations",
            path: "/mystation",
            onClick: () => {
              navigate("/mystation");
              if (isMobile) setIsSidebarOpen(false);
            },
          },
        ]
      : []),
  ];

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray text-white" : "text-gray-700";
  };

  const loggedIn = getFromLocalStorage("login") === true;

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`${
          isMobile
            ? "fixed left-0 top-0 z-50 w-[320px] h-[100dvh] sidebar-open"
            : "relative w-[350px] mx-2"
        } bg-bg ${sidebarHeight} overflow-hidden rounded-lg p-5 pr-0 ${
          isMobile && !isSidebarOpen ? "hidden" : ""
        }`}
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
            {navigationItems.map((item, index) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }} // Animation starts hidden and to the left
                animate={{ opacity: 1, x: 0 }} // Animates to visible and in place
                transition={{
                  duration: 0.4,
                  delay: index * 0.1, // Stagger effect for menu items
                }}
              >
                <span
                  onClick={item.onClick}
                  className={`cursor-pointer flex gap-2 items-center px-3 py-2 rounded-2xl transition-colors duration-300 ${isActive(
                    item.path
                  )}`}
                >
                  {item.icon}
                  {item.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between text-2xl mt-8">
          <div className="flex items-center justify-between mr-12 opacity-70">
            <div className="flex items-center gap-4 opacity-70">
              <IoIosRadio />
              <span>Recent Plays</span>
            </div>
            {user || loggedIn ? (
              <button
                className="text-3xl"
                onClick={() => setIsDialogOpen(true)}
              >
                +
              </button>
            ) : (
              <MdLockOutline className="text-3xl" />
            )}
          </div>
          <div
            className={`${
              isMobile ? "h-full" : "max-h-[calc(100dvh-510px)]"
            } overflow-auto mr-4 mt-5 no-scrollbar`}
          >
            {user || loggedIn ? (
              <RecentHistory />
            ) : (
              <p className="text-center text-gray-500">
                Log in to see recent history.
              </p>
            )}
          </div>
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
