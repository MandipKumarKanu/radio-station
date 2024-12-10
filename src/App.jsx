import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import MainLayout from "./components/layout/MainLayout";
import Home from "./components/Home";
import Player from "./components/Player";
import FavoriteStations from "./components/FavoriteStations";
import { usePlayer } from "./context/usePlayerContext";
import { useAuth } from "./context/AuthContext";
import { auth, db } from "./utils/firebase.config";
import { collection, doc, getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import RadioListPage from "./components/RadioListPage";
import Login from "./components/Login";
import CustomStations from "./components/CustomStations";
import PlayedHistory from "./components/PlayedHistory";
import AllStations from "./components/AllStations";
import Loader from "./components/Loader";

const App = () => {
  const { streamId, streamUrl } = usePlayer();
  const { updatedUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUserUpdate = useCallback(
    async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(
            doc(collection(db, "users"), authUser.uid)
          );
          if (userDoc.exists()) {
            const userData = { ...userDoc.data(), uid: authUser.uid };
            updatedUser(userData);
            setUser(authUser);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUser(null);
          updatedUser(null);
        }
      } else {
        updatedUser(null);
        setUser(null);
      }
      setLoading(false);
    },
    [user]
  );

  useEffect(() => {
    let unsubscribe;
    const setupAuthListener = () => {
      unsubscribe = onAuthStateChanged(auth, handleUserUpdate);
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [handleUserUpdate]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<FavoriteStations />} />
          <Route path="/mystation" element={<CustomStations />} />
          <Route path="/check" element={<RadioListPage />} />
          <Route path="/all" element={<AllStations />} />
          <Route
            path="/history"
            element={user ? <PlayedHistory /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/profile" /> : <Login />}
          />
          <Route
            path="/profile"
            element={user ? <Login /> : <Navigate to="/login" />}
          />
        </Routes>
        <ToastContainer />
      </MainLayout>

      {(streamId || streamUrl) && <Player />}
      {/* <Player /> */}
    </Router>
  );
};

export default App;
