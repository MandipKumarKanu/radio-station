import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePlayer } from "../../context/usePlayerContext";

const MainLayout = ({ children }) => {
  const { isPlaying, streamId } = usePlayer();

  const loc = localStorage.getItem("streamUrl");

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const dynamicHeight =
    isPlaying || streamId || loc
      ? "h-[calc(100dvh-160px)]"
      : "h-[calc(100dvh-80px)]";

  return (
    <div>
      <Header setIsMobile={setIsMobile} toggleSidebar={toggleSidebar} />
      <div className="flex relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div
          className={`flex-1 bg-bg ${dynamicHeight} overflow-hidden w-full md:w-[calc(100%-350px)] mx-2 rounded-lg p-5`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
