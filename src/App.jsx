import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAuth } from "firebase/auth";
import MainLayout from "./components/layout/MainLayout";
import Home from "./components/Home";
import Player from "./components/Player";
import FavoriteStations from "./components/FavoriteStations";
import { usePlayer } from "./context/usePlayerContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RadioListPage from "./components/RadioListPage";
import Login from "./components/Login";
import CustomStations from "./components/CustomStations";

const App = () => {
  const { streamId } = usePlayer();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<FavoriteStations />} />
          <Route path="/mystation" element={<CustomStations />} />
          <Route path="/check" element={<RadioListPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/profile" /> : <Login />}
          />
          <Route
            path="/profile"
            element={
              user ? (
                <>
                  <Login />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        <ToastContainer />
      </MainLayout>

      {streamId && <Player />}
    </Router>
  );
};

export default App;
