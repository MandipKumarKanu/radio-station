import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaList } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { IoHomeOutline, IoHeartOutline, IoPerson } from "react-icons/io5";
import { IoIosRadio } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlayer } from "../../context/usePlayerContext";
import { getAuth } from "firebase/auth";
import { getFromLocalStorage } from "../../utils/useLocalStorage";
import AddCustomStationDialog from "../AddCustomStationDialog";
import { MdOutlinePersonOutline, MdLockOutline } from "react-icons/md";
import CustomStations from "../CustomStations";
import RecentHistory from "../RecentHistory";

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
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSidebarOpen ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 bg-black z-40 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
          onClick={toggleSidebar}
        />
      )}

      <motion.div
        initial={{ x: isMobile ? "-100%" : 0 }}
        animate={{
          x: isMobile ? (isSidebarOpen ? 0 : "-100%") : 0,
        }}
        transition={{ type: "tween", duration: 0.3 }}
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
                ? "translate-x-0 sidebar-open"
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
            <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
              <FaTimes
                onClick={toggleSidebar}
                className="opacity-70 cursor-pointer hover:opacity-100 transition ease-in-out duration-300"
              />
            </motion.div>
          )}
        </div>

        <div className="mt-6 text-xl flex flex-col gap-2 ml-2 pr-5">
          <motion.ul initial="hidden" animate="visible">
            {navigationItems.map((item, index) => (
              <motion.li
                key={item.path}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                    },
                  },
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
          </motion.ul>
        </div>

        <div className="flex flex-col justify-between text-2xl mt-8">
          <div className="flex items-center justify-between mr-12 opacity-70">
            <div className="flex items-center gap-4 opacity-70">
              <IoIosRadio />
              <span>Recent Plays</span>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
            </motion.div>
          </div>
          <div
            className={`${isMobile? "h-full": "max-h-[calc(100dvh-510px)]"} overflow-auto mr-4 mt-5 no-scrollbar`}
          >
            {user || loggedIn ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RecentHistory />
              </motion.div>
            ) : (
              <p className="text-center text-gray-500">
                Log in to see recent history.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <AddCustomStationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default Sidebar;
