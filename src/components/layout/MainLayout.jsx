import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePlayer } from "../../context/usePlayerContext";

const MainLayout = ({ children }) => {
  const { isPlaying, streamId } = usePlayer();

  const dynamicHeight =
    isPlaying || streamId
      ? "h-[calc(100dvh-80px-5rem)]"
      : "h-[calc(100dvh-80px)]";

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <div
          className={`flex-1 bg-bg ${dynamicHeight} overflow-hidden w-full md:w-[350px] mr-2 rounded-lg p-5`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
