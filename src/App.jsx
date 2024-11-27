import React from "react";
import MainLayout from "./components/layout/MainLayout";
import Home from "./components/Home";
import Player from "./components/Player";
import { usePlayer } from "./context/usePlayerContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { streamId } = usePlayer();
  return (
    <>
      <MainLayout>
        <Home />
      </MainLayout>
      {streamId && <Player />}
    </>
  );
};

export default App;
