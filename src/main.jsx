import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PlayerContextProvider } from "./context/usePlayerContext";
import { AuthContextProvider } from "./context/AuthContext";
import { StationProvider } from "./context/StationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <StationProvider>
        <PlayerContextProvider>
          <App />
        </PlayerContextProvider>
      </StationProvider>
    </AuthContextProvider>
  </StrictMode>
);
