import React, { useState, useEffect, useRef, useMemo } from "react";
import { db, auth } from "../utils/firebase.config";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import PlayBtn from "./PlayBtn";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { usePlayer } from "../context/usePlayerContext";
import { FaEdit, FaTrash } from "react-icons/fa";

const CustomStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ stationName: "", streamUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = auth.currentUser;
  const { streamUrl: playingStreamUrl, streamId, isPlaying } = usePlayer();
  const loc = localStorage.getItem("streamUrl");
  const isPlayerActive = isPlaying || streamId || loc;

  const dropdownRefs = useRef(
    new Array(stations.length).fill(null).map(() => React.createRef())
  );

  useEffect(() => {
    const handleClickOutside = (event, index) => {
      const ref = dropdownRefs.current[index];
      if (ref && ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    const globalClickListener = (event) => {
      if (showDropdown !== null) {
        handleClickOutside(event, showDropdown);
      }
    };

    document.addEventListener("mousedown", globalClickListener);
    return () => {
      document.removeEventListener("mousedown", globalClickListener);
    };
  }, [showDropdown]);

  const fetchStations = async () => {
    if (!user) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userStations = userDocSnap.data().customStations || [];
        setStations(userStations);
        dropdownRefs.current = userStations.map(() => React.createRef());
      } else {
        setError("User document does not exist.");
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to fetch stations.");
    } finally {
      setLoading(false);
    }
  };

  const removeStation = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        customStations: arrayRemove(selectedStation),
      });

      setStations((prev) =>
        prev.filter(
          (station) => station.stationName !== selectedStation.stationName
        )
      );
      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Error removing station:", err);
      setError("Failed to remove station.");
    }
  };

  const editStation = async () => {
    try {
      setIsSubmitting(true);
      const userDocRef = doc(db, "users", user.uid);
      const updatedStations = stations.map((station) =>
        station.stationName === selectedStation.stationName ? editData : station
      );

      await updateDoc(userDocRef, { customStations: updatedStations });
      setStations(updatedStations);
      setEditMode(false);
    } catch (err) {
      console.error("Error editing station:", err);
      setError("Failed to edit station.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, [user]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className={`container mx-auto py-8 space-y-6 ${
        isPlayerActive
          ? "h-[calc(100dvh-100px-5rem)]"
          : "h-[calc(100dvh-100px)]"
      } overflow-y-auto no-scrollbar`}
    >
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Your Custom Radio Stations
      </h2>
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <div className="w-32 h-6 bg-gray-600 rounded mb-2"></div>
                  <div className="w-40 h-4 bg-gray-600 rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {stations.length > 0 ? (
            stations.map((station, index) => (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group relative"
                title={station.stationName}
              >
                <div className="flex justify-between items-center">
                  <div className="w-2/3 line-clamp-1">
                    <h3
                      className={`font-semibold text-lg ${
                        playingStreamUrl === station.streamUrl && !streamId
                          ? "text-green-600 font-semibold"
                          : ""
                      }`}
                    >
                      {station.stationName}
                    </h3>
                    <p className="text-neutral-400 text-sm truncate max-w-[300px]">
                      {station.streamUrl}
                    </p>
                  </div>
                  <div className="flex gap-4 items-center relative">
                    <PlayBtn
                      streamUrl={station.streamUrl}
                      name={station.stationName}
                    />
                    <div ref={dropdownRefs.current[index]} className="relative">
                      <BiDotsVerticalRounded
                        className="text-2xl cursor-pointer"
                        onClick={() =>
                          setShowDropdown((prev) =>
                            prev === index ? null : index
                          )
                        }
                      />
                      {showDropdown === index && (
                        <div className="absolute right-2 top-8 bg-gray2 rounded-lg shadow-2xl border border-neutral-600 text-sm text-white z-50 overflow-hidden">
                          <button
                            className="flex items-center px-4 py-3 w-full hover:bg-neutral-600 transition-colors"
                            onClick={() => {
                              setEditMode(true);
                              setEditData(station);
                              setSelectedStation(station);
                              setShowDropdown(null);
                            }}
                          >
                            <FaEdit className="mr-2" size={16} />
                            Edit
                          </button>
                          <button
                            className="flex items-center px-4 py-3 w-full hover:bg-neutral-600 text-red-400 hover:text-red-300 transition-colors"
                            onClick={() => {
                              setSelectedStation(station);
                              setShowDeleteDialog(true);
                              setShowDropdown(null);
                            }}
                          >
                            <FaTrash className="mr-2" size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">
              No custom stations found. Add some to see them here!
            </p>
          )}
        </>
      )}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl border border-neutral-800 p-6 space-y-4">
            <h3 className="text-xl font-semibold">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedStation?.stationName}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
                onClick={removeStation}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {editMode && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl border border-neutral-800 p-6 space-y-4">
            <h3 className="text-xl font-semibold">Edit Station</h3>
            <div className="space-y-2">
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 text-white 
                    border border-neutral-800 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-500/30 
                    transition-all duration-300 
                    placeholder-neutral-600"
                value={editData.stationName}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    stationName: e.target.value,
                  }))
                }
                placeholder="Station Name"
              />
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 text-white 
                    border border-neutral-800 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-500/30 
                    transition-all duration-300 
                    placeholder-neutral-600"
                value={editData.streamUrl}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    streamUrl: e.target.value,
                  }))
                }
                placeholder="Stream URL"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                className={`w-44 py-3 rounded-xl transition-all duration-300 
                  ${
                    isSubmitting
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                onClick={editStation}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomStations;
