import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../utils/firebase.config";

const AddStationDialog = ({ isOpen, onClose }) => {
  const [stationName, setStationName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [uid, setUid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveStation = async () => {
    if (!stationName || !streamUrl) {
      toast.error("Please fill in both fields!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (uid) {
      setIsSubmitting(true);
      const userRef = doc(db, "users", uid);
      const customStation = { stationName, streamUrl };

      try {
        await updateDoc(userRef, {
          customStations: arrayUnion(customStation),
        });

        const customStationsCollection = collection(db, "customStations");
        await addDoc(customStationsCollection, {
          addedBy: uid,
          stationName,
          streamUrl,
        });

        toast.success("Station added successfully!");

        setStationName("");
        setStreamUrl("");
        onClose();
      } catch (error) {
        console.error("Error adding station: ", error);
        toast.error("Failed to add station. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md bg-black rounded-2xl shadow-2xl border border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-red-500 transition-all duration-300 group"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:rotate-90 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-6 pt-8">
            <h2 className="text-2xl font-semibold text-center text-white mb-6">
              Add Custom Radio Station
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="stationName"
                  className="block text-neutral-400 mb-2 text-sm"
                >
                  Station Name
                </label>
                <input
                  id="stationName"
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 text-white 
                    border border-neutral-800 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-500/30 
                    transition-all duration-300 
                    placeholder-neutral-600"
                  placeholder="Enter station name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="streamUrl"
                  className="block text-neutral-400 mb-2 text-sm"
                >
                  Stream URL
                </label>
                <input
                  id="streamUrl"
                  type="text"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 text-white 
                    border border-neutral-800 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-500/30 
                    transition-all duration-300 
                    placeholder-neutral-600"
                  placeholder="Enter stream URL"
                  required
                />
              </div>

              <button
                onClick={handleSaveStation}
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl transition-all duration-300 
                  ${
                    isSubmitting
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save Station"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddStationDialog;
