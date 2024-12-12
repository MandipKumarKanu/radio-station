import React, { useState, useEffect } from "react";
// import { RadioList } from "../../public/assets/radio_list";
import { useStation } from "../context/StationContext";

const RadioListPage = () => {
  const { radioList } = useStation();

  const [radioStations, setRadioStations] = useState([...radioList]);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const audioRef = React.useRef(null);

  useEffect(() => {
    handleCheckAllStations();
  }, []);

  const handlePlay = (station) => {
    setErrorMsg("");
    setSuccessMsg("");
    audioRef.current.src = station.streamUrl;

    audioRef.current
      .play()
      .then(() => {
        setSuccessMsg(`✅ Playing ${station.name}`);
      })
      .catch(() => {
        setErrorMsg(`❌ Failed to play ${station.name}`);
      });
  };

  const handlePlayWithStream = async (station) => {
    const newUrl = station.streamUrl.endsWith("/stream")
      ? station.streamUrl
      : `${station.streamUrl}/stream`;

    const isValid = await validateStream(newUrl);

    if (isValid) {
      updateStationUrl(station.id, newUrl);
      setSuccessMsg(`✅ Stream with /stream works for ${station.name}!`);
    } else {
      setErrorMsg(`❌ Stream with /stream failed for ${station.name}.`);
    }
  };

  const validateStream = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const updateStationUrl = (stationId, newUrl) => {
    setRadioStations((prevStations) =>
      prevStations.map((station) =>
        station.id === stationId ? { ...station, streamUrl: newUrl } : station
      )
    );
  };

  const handleCheckAllStations = async () => {
    setChecking(true);
    const updatedStations = [];

    for (let station of radioStations) {
      const isValid = await validateStream(station.streamUrl);
      if (isValid) {
        updatedStations.push(station);
      } else {
        const newUrl = station.streamUrl.endsWith("/stream")
          ? station.streamUrl
          : `${station.streamUrl}/stream`;

        const isValidWithStream = await validateStream(newUrl);
        if (isValidWithStream) {
          updateStationUrl(station.id, newUrl);
          updatedStations.push({ ...station, streamUrl: newUrl });
        }
      }
    }

    setRadioStations(updatedStations);
    setChecking(false);
    setSuccessMsg("✅ All stations checked and updated!");
    saveUpdatedList(updatedStations);
  };

  const saveUpdatedList = (updatedStations) => {
    const blob = new Blob([JSON.stringify(updatedStations, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "updatedRadioList.json";
    link.click();
  };

  const handleDelete = (stationId) => {
    setRadioStations((prevStations) =>
      prevStations.filter((station) => station.id !== stationId)
    );
  };

  return (
    <div>
      <h1>Radio Stream List</h1>

      {/* Error or success message */}
      {errorMsg && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {successMsg}
        </div>
      )}

      {checking && <p>⏳ Checking all stations...</p>}

      {radioStations.map((station) => (
        <div key={station.id} style={{ marginBottom: "20px" }}>
          <h3>{station.name}</h3>
          <p>
            Frequency: {station.frequency ? `${station.frequency} MHz` : "N/A"}
          </p>
          <button
            onClick={() => handlePlay(station)}
            style={{
              padding: "5px 10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            ▶️ Play
          </button>

          <button
            onClick={() => handlePlayWithStream(station)}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "orange",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            ▶️ Play with /stream
          </button>

          <button
            onClick={() => handleDelete(station.id)}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            ❌ Delete
          </button>
        </div>
      ))}

      <audio ref={audioRef} controls style={{ display: "none" }} />
    </div>
  );
};

export default RadioListPage;
