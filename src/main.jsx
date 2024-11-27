import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PlayerContextProvider } from "./context/usePlayerContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <PlayerContextProvider>
      <App />
    </PlayerContextProvider>
  // </StrictMode>
);
