import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import { db } from "../utils/firebase.config";
import { usePlayer } from "../context/usePlayerContext";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddRadioStation = () => {
  const { isPlaying, streamId } = usePlayer();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
  }, [user]);

  const loc = localStorage.getItem("streamUrl");

  const dynamicHeight =
    isPlaying || streamId || loc
      ? "h-[calc(100dvh-160px)]"
      : "h-[calc(100dvh-80px)]";

  const [stationData, setStationData] = useState({
    name: "",
    streamUrl: "",
    frequency: "",
    address: "",
    province: "",
    logoType: "file",
    logoFile: null,
    logoPreview: null,
    logoUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState({
    uploading: false,
    success: false,
    error: null,
  });

  const validateForm = () => {
    const newErrors = {};

    if (!stationData.name.trim()) {
      newErrors.name = "Station name is required";
    }

    if (!stationData.streamUrl.trim()) {
      newErrors.streamUrl = "Stream URL is required";
    } else {
      const urlPattern =
        /^(https?:\/\/)([a-zA-Z\d-]+(\.[a-zA-Z\d-]+)*)(:\d+)?(\/[^\s]*)?$/;
      if (!urlPattern.test(stationData.streamUrl)) {
        newErrors.streamUrl = "Invalid URL format";
      }
    }

    if (stationData.frequency) {
      const frequencyNum = parseFloat(stationData.frequency);
      if (isNaN(frequencyNum) || frequencyNum <= 0) {
        newErrors.frequency = "Frequency must be a positive number";
      }
    }

    if (stationData.logoType === "file" && stationData.logoFile) {
      const maxSize = 5 * 1024 * 1024;
      if (stationData.logoFile.size > maxSize) {
        newErrors.logoFile = "Logo file must be smaller than 5MB";
      }
    }

    if (stationData.logoType === "url" && stationData.logoUrl) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(stationData.logoUrl)) {
        newErrors.logoUrl = "Invalid logo URL format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleLogoTypeChange = (e) => {
    const logoType = e.target.value;
    setStationData((prev) => ({
      ...prev,
      logoType,
      logoFile: null,
      logoPreview: null,
      logoUrl: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setStationData((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: previewUrl,
      }));

      if (errors.logoFile) {
        setErrors((prev) => ({
          ...prev,
          logoFile: undefined,
        }));
      }
    }
  };

  const handleRemoveLogo = () => {
    if (stationData.logoPreview) {
      URL.revokeObjectURL(stationData.logoPreview);
    }

    setStationData((prev) => ({
      ...prev,
      logoFile: null,
      logoPreview: null,
      logoUrl: "",
    }));

    if (errors.logoFile) {
      setErrors((prev) => ({
        ...prev,
        logoFile: undefined,
      }));
    }

    const fileInput = document.getElementById("logoFile");
    if (fileInput) {
      fileInput.value = "";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setUploadStatus({
      uploading: true,
      success: false,
      error: null,
    });

    try {
      let logoUrl = null;
      if (stationData.logoType === "file" && stationData.logoFile) {
        logoUrl = await uploadLogoToImgBB(stationData.logoFile);
      } else if (stationData.logoType === "url" && stationData.logoUrl) {
        logoUrl = await uploadLogoToImgBB(stationData.logoUrl);
      }

      const stationToAdd = {
        name: stationData.name,
        streamUrl: stationData.streamUrl,
        frequency: stationData.frequency || null,
        address: stationData.address || "",
        province: stationData.province || "",
        hits: 0,
        logoUrl: logoUrl,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "stations"), stationToAdd);

      setUploadStatus({
        uploading: false,
        success: true,
        error: null,
      });

      setStationData({
        name: "",
        streamUrl: "",
        frequency: "",
        address: "",
        province: "",
        logoType: "file",
        logoFile: null,
        logoPreview: null,
        logoUrl: "",
      });

      if (stationData.logoPreview) {
        URL.revokeObjectURL(stationData.logoPreview);
      }

      console.log("Station added with ID: ", docRef.id);
    } catch (error) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: error.message,
      });
      console.error("Error adding station:", error);
    }
  };

  if (user?.role === "admin")
    return (
      <div
        className={`${dynamicHeight} overflow-auto flex items-center justify-center no-scrollbar`}
      >
        <div
          className={`max-w-md mx-auto mt-10 p-6 bg-black text-white rounded-lg shadow-mdoverflow-auto`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add New Radio Station
          </h2>

          <form onSubmit={handleSubmit} className="h-fit">
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Station Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={stationData.name}
                  onChange={handleInputChange}
                  className={`w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                      border border-neutral-800 focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/30 
                      transition-all duration-300 
                      placeholder-neutral-600 
                ${errors.name ? "border-red-500" : "border-gray-700"}
                bg-gray-900 text-white`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="frequency"
                >
                  Frequency (Optional)
                </label>
                <input
                  type="number"
                  id="frequency"
                  name="frequency"
                  value={stationData.frequency}
                  onChange={handleInputChange}
                  step="0.1"
                  className={`w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                      border border-neutral-800 focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/30 
                      transition-all duration-300 
                      placeholder-neutral-600 
                ${errors.frequency ? "border-red-500" : "border-gray-700"}
                bg-gray-900 text-white`}
                />
                {errors.frequency && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {errors.frequency}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address (Optional)
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={stationData.address}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                      border border-neutral-800 focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/30 
                      transition-all duration-300 
                      placeholder-neutral-600"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="province"
                >
                  Province (Optional)
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={stationData.province}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                      border border-neutral-800 focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/30 
                      transition-all duration-300 
                      placeholder-neutral-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="streamUrl"
              >
                Stream URL *
              </label>
              <input
                type="url"
                id="streamUrl"
                name="streamUrl"
                value={stationData.streamUrl}
                onChange={handleInputChange}
                className={`w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                    border border-neutral-800 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-500/30 
                    transition-all duration-300 
                    placeholder-neutral-600 
              ${errors.streamUrl ? "border-red-500" : "border-gray-700"}
              bg-gray-900 text-white`}
                required
              />
              {errors.streamUrl && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.streamUrl}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Logo (Optional)
              </label>
              <div className="flex space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="logoType"
                    value="file"
                    checked={stationData.logoType === "file"}
                    onChange={handleLogoTypeChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Upload File</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="logoType"
                    value="url"
                    checked={stationData.logoType === "url"}
                    onChange={handleLogoTypeChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Upload URL</span>
                </label>
              </div>

              {stationData.logoType === "file" && (
                <div className="flex items-center">
                  <input
                    type="file"
                    id="logoFile"
                    name="logoFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={`w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                        border border-neutral-800 focus:border-blue-500 
                        focus:ring-2 focus:ring-blue-500/30 
                        transition-all duration-300 
                        placeholder-neutral-600 
                  ${errors.logoFile ? "border-red-500" : "border-gray-700"}
                  bg-gray-900 text-white`}
                  />
                  {stationData.logoPreview && (
                    <div className="ml-4 relative">
                      <img
                        src={stationData.logoPreview}
                        alt="Logo Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                      >
                        <FaTimes className="text-2xl" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {stationData.logoType === "url" && (
                <input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  value={stationData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="Enter logo image URL"
                  className={`w-full px-2 py-2.5 rounded-xl bg-neutral-900 text-white 
                      border border-neutral-800 focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/30 
                      transition-all duration-300 
                      placeholder-neutral-600 
                ${errors.logoUrl ? "border-red-500" : "border-gray-700"}
                bg-gray-900 text-white`}
                />
              )}

              {(errors.logoFile || errors.logoUrl) && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.logoFile || errors.logoUrl}
                </p>
              )}
            </div>

            {uploadStatus.error && (
              <div className="mb-4 text-red-500 text-sm">
                {uploadStatus.error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={uploadStatus.uploading}
                className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-0 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {uploadStatus.uploading ? "Adding..." : "Add Station"}
              </button>
            </div>
          </form>

          {uploadStatus.success && (
            <div className="mt-4 text-green-500 text-sm text-center">
              Station added successfully!
            </div>
          )}
        </div>
      </div>
    );
};

export default AddRadioStation;
