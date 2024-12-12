import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import { db } from "../utils/firebase.config";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaImage,
  FaSearch,
} from "react-icons/fa";
import { usePlayer } from "../context/usePlayerContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StationSkeleton = () => {
  return (
    <div className="bg-neutral-800 rounded-lg shadow-md p-4 animate-pulse">
      <div className="flex items-center space-x-4 h-20"></div>
    </div>
  );
};

const ManageStations = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
  }, [user]);

  const { isPlaying, streamId } = usePlayer();

  const loc = localStorage.getItem("streamUrl");

  const dynamicHeight =
    isPlaying || streamId || loc
      ? "h-[calc(100dvh-160px)] overflow-y-auto"
      : "h-[calc(100dvh-80px)]";

  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [editingStation, setEditingStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchStations();
      return;
    }
  }, []);

  useEffect(() => {
    const filtered = stations.filter((station) => {
      const stationName = station.name || "";
      return stationName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredStations(filtered);
  }, [searchTerm, stations]);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const stationsCollection = collection(db, "stations");
      const stationsSnapshot = await getDocs(stationsCollection);
      const stationsList = stationsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setStations(stationsList);
      setFilteredStations(stationsList);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch stations");
      setLoading(false);
      console.error("Error fetching stations:", err);
    }
  };

  const handleDelete = async (stationId) => {
    try {
      await deleteDoc(doc(db, "stations", stationId));
      setStations(stations.filter((station) => station.id !== stationId));
    } catch (err) {
      setError("Failed to delete station");
      console.error("Error deleting station:", err);
    }
  };

  const uploadLogoToImgBB = async (logo) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const url = "https://api.imgbb.com/1/upload";

    try {
      const formData = new FormData();

      if (logo instanceof File) {
        formData.append("image", logo);
      } else if (typeof logo === "string") {
        formData.append("image", logo);
      }

      const uploadResponse = await axios.post(
        `${url}?key=${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.success) {
        return uploadResponse.data.data.url;
      } else {
        throw new Error("Failed to upload image to ImgBB");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      throw error;
    }
  };

  const startEditing = (station) => {
    setEditingStation({
      id: station.id,
      name: station.name,
      streamUrl: station.streamUrl,
      frequency: station.frequency || "",
      address: station.address || "",
      province: station.province || "",
      logoType: "existing",
      logoUrl: station.logoUrl || "",
      logoFile: null,
      logoPreview: station.logoUrl || null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoTypeChange = (e) => {
    const logoType = e.target.value;
    setEditingStation((prev) => ({
      ...prev,
      logoType,
      logoFile: null,
      logoPreview: logoType === "existing" ? prev.logoUrl : null,
      logoUrl: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setEditingStation((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: previewUrl,
      }));
    }
  };

  const handleRemoveLogo = () => {
    if (editingStation.logoPreview) {
      URL.revokeObjectURL(editingStation.logoPreview);
    }

    setEditingStation((prev) => ({
      ...prev,
      logoFile: null,
      logoPreview: null,
      logoUrl: "",
      logoType: "existing",
    }));

    const fileInput = document.getElementById("logoFile");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const saveEdit = async () => {
    try {
      let logoUrl = editingStation.logoUrl;

      if (editingStation.logoType === "file" && editingStation.logoFile) {
        logoUrl = await uploadLogoToImgBB(editingStation.logoFile);
      } else if (editingStation.logoType === "url" && editingStation.logoUrl) {
        logoUrl = await uploadLogoToImgBB(editingStation.logoUrl);
      } else if (editingStation.logoType === "remove") {
        logoUrl = null;
      }

      const stationRef = doc(db, "stations", editingStation.id);
      await updateDoc(stationRef, {
        name: editingStation.name,
        streamUrl: editingStation.streamUrl,
        frequency: editingStation.frequency || null,
        address: editingStation.address || "",
        province: editingStation.province || "",
        logoUrl: logoUrl,
      });

      setStations(
        stations.map((station) =>
          station.id === editingStation.id
            ? { ...station, ...editingStation, logoUrl }
            : station
        )
      );
      setEditingStation(null);
    } catch (err) {
      setError("Failed to update station");
      console.error("Error updating station:", err);
    }
  };

  if (loading && user?.role === "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Manage Radio Stations
        </h2>
        <div className="grid gap-4">
          {[...Array(6)].map((_, index) => (
            <StationSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container mx-auto  bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded relative"
        role="alert"
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Manage Radio Stations
        </h2>
        {error}
      </div>
    );
  }

  if (user?.role === "admin")
    return (
      <div className={` container ${dynamicHeight} no-scrollbar`}>
        <div className=" mx-auto py-8 space-y-6 ">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-3">
            Manage Radio Stations
          </h2>

          <div className="flex justify-center mb-4 mt-1 sticky top-0 z-10 bg-bg py-4 ">
            <input
              type="text"
              placeholder="Search stations..."
              className="w-11/12 sm:w-1/2 px-4 py-2 border border-neutral-800 rounded-xl bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredStations.length === 0 ? (
            <div className="text-center text-gray-500 p-8 rounded-lg">
              <p>No stations found matching your search.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 mt-2 py-3 rounded-xl transition-all duration-300 bg-white text-black hover:bg-neutral-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-md group mb-4"
                >
                  {editingStation && editingStation.id === station.id ? (
                    <div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          name="name"
                          value={editingStation.name}
                          onChange={handleEditChange}
                          placeholder="Station Name"
                          className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white border border-neutral-700 focus:border-blue-500 transition-colors"
                        />
                        <input
                          name="streamUrl"
                          value={editingStation.streamUrl}
                          onChange={handleEditChange}
                          placeholder="Stream URL"
                          className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white border border-neutral-700 focus:border-blue-500 transition-colors"
                        />
                        <input
                          name="frequency"
                          value={editingStation.frequency}
                          onChange={handleEditChange}
                          placeholder="Frequency (Optional)"
                          className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white border border-neutral-700 focus:border-blue-500 transition-colors"
                        />
                        <input
                          name="address"
                          value={editingStation.address}
                          onChange={handleEditChange}
                          placeholder="Address (Optional)"
                          className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white border border-neutral-700 focus:border-blue-500 transition-colors"
                        />
                        <input
                          name="province"
                          value={editingStation.province}
                          onChange={handleEditChange}
                          placeholder="Province (Optional)"
                          className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white border border-neutral-700 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-bold mb-2 text-neutral-300">
                          Logo (Optional)
                        </label>
                        <div className="flex space-x-4 mb-4  flex-wrap">
                          {["existing", "file", "url", "remove"].map((type) => (
                            <label
                              key={type}
                              className="inline-flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="logoType"
                                value={type}
                                checked={editingStation.logoType === type}
                                onChange={handleLogoTypeChange}
                                className="form-radio text-blue-500"
                              />
                              <span className="ml-2 capitalize">
                                {type === "url" ? "Upload URL" : type}
                              </span>
                            </label>
                          ))}
                        </div>

                        {editingStation.logoType === "file" && (
                          <div className="flex items-center">
                            <input
                              type="file"
                              id="logoFile"
                              name="logoFile"
                              onChange={handleFileChange}
                              accept="image/*"
                              className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 text-white 
                            border border-neutral-800 focus:border-blue-500"
                            />
                            {editingStation.logoPreview && (
                              <div className="ml-4 relative">
                                <img
                                  src={editingStation.logoPreview}
                                  alt="Logo Preview"
                                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveLogo}
                                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {editingStation.logoType === "url" && (
                          <input
                            type="url"
                            name="logoUrl"
                            value={editingStation.logoUrl}
                            onChange={handleEditChange}
                            placeholder="Enter logo image URL"
                            className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 text-white 
                          border border-neutral-800 focus:border-blue-500 transition-colors"
                          />
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 rounded-md flex items-center transition-all duration-300 bg-white text-black hover:bg-neutral-200"
                        >
                          <FaSave className="mr-2" /> Save
                        </button>
                        <button
                          onClick={() => setEditingStation(null)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition-colors"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-row items-center justify-between mb-4 space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-4  w-3/4">
                          {station.logoUrl ? (
                            <img
                              src={station.logoUrl}
                              alt={`${station.name} logo`}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-700 rounded-full flex items-center justify-center">
                              <FaImage className="text-neutral-500" />
                            </div>
                          )}
                          <div className="flex-grow overflow-hidden">
                            <h2 className="text-lg sm:text-xl font-bold truncate">
                              {station.name}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 truncate">
                              {station.streamUrl}
                            </p>
                            {station.frequency && (
                              <p className="text-xs sm:text-sm text-neutral-400">
                                {station.frequency} Mhz
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEditing(station)}
                            className="relative overflow-hidden flex items-center justify-center 
                              w-10 h-10 rounded-full 
                              bg-blue-500/10 text-blue-500 
                              hover:bg-blue-500/20 transition-all 
                              duration-300 transform hover:scale-105 active:scale-95"
                          >
                            <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          <button
                            onClick={() => handleDelete(station.id)}
                            className="relative overflow-hidden flex items-center justify-center 
                              w-10 h-10 rounded-full 
                              bg-red-500/10 text-red-500 
                              hover:bg-red-500/20 transition-all 
                              duration-300 transform hover:scale-105 active:scale-95"
                          >
                            <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
};

export default ManageStations;
