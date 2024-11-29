import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import MainLayout from "./components/layout/MainLayout";
import Home from "./components/Home";
import Player from "./components/Player";
import FavoriteStations from "./components/FavoriteStations";
import { usePlayer } from "./context/usePlayerContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import RadioListPage from "./components/RadioListPage";

const App = () => {
  const { streamId } = usePlayer();

  return (
    <Router>
      <ToastContainer />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<FavoriteStations />} />{" "}
          {/* <Route path="/chegick" element={<RadioListPage />} />{" "} */}
        </Routes>
      </MainLayout>
      {streamId && <Player />}
    </Router>
  );
};

export default App;
