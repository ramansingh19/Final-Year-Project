import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCity } from "../../../features/user/citySlice";
import { useNavigate } from "react-router-dom";
import {
  FaCity,
  FaGlobeAsia,
  FaMapMarkerAlt,
  FaImage,
  FaLocationArrow,
} from "react-icons/fa";
import { motion } from "framer-motion";

function AddCityDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, createSuccess } = useSelector((state) => state.city);

  const famousOptions = [
    "tourism",
    "beaches",
    "mountains",
    "food",
    "history",
    "nightlife",
    "shopping",
  ];

  const bestTimeOptions = [
    "January - March",
    "April - June",
    "July - September",
    "October - December",
    "Winter",
    "Summer",
    "Monsoon",
    "All Year",
  ];

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "",
    description: "",
    bestTimeToVisit: "",
    avgDailyBudget: "",
    famousFor: [],
    latitude: "",
    longitude: "",
    images: [null, null, null, null, null],
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFamous = (item) => {
    setFormData((prev) => {
      const exists = prev.famousFor.includes(item);

      return {
        ...prev,
        famousFor: exists
          ? prev.famousFor.filter((f) => f !== item)
          : [...prev.famousFor, item],
      };
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setFormData((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = file;

      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("state", formData.state);
    data.append("country", formData.country);
    data.append("description", formData.description);
    data.append("bestTimeToVisit", formData.bestTimeToVisit);
    data.append("avgDailyBudget", formData.avgDailyBudget);
    data.append("famousFor", formData.famousFor.join(","));

    const location = {
      type: "Point",
      coordinates: [
        Number(formData.longitude),
        Number(formData.latitude),
      ],
    };

    data.append("location", JSON.stringify(location));

    formData.images
      .filter(Boolean)
      .forEach((img) => data.append("images", img));

    dispatch(createCity(data));
  };

  useEffect(() => {
    if (createSuccess === true) {
      navigate("/superAdmin/superAdminDashboard");
    }
  }, [navigate, createSuccess]);

  return (
<div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8 md:px-8 relative overflow-hidden">
  {/* Background Glow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />
    <div className="absolute bottom-0 right-1/4 h-52 w-52 rounded-full bg-blue-200/20 blur-3xl" />
  </div>

  <div className="mx-auto max-w-7xl">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-8 overflow-hidden rounded-3xl border border-gray-200/20 bg-linear-to-br from-white/90 via-gray-100/95 to-gray-50 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.1)]"
    >
      <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-cyan-300 to-blue-400 text-4xl shadow-xl shadow-cyan-200/40"
          >
            <FaCity />
          </motion.div>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-100/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
              Smart City Management
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Create a New
              <span className="ml-3 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                City Profile
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
              Add a city with detailed information, attractions, budget,
              location, and media. Create a polished destination profile for
              your platform in just a few steps.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-gray-200/20 bg-white/50 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                  Maximum Images
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900">5</p>
              </div>

              <div className="rounded-2xl border border-cyan-200/30 bg-cyan-100/30 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-600">
                  Location Support
                </p>
                <p className="mt-1 text-xl font-bold text-cyan-700">Enabled</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:w-90"
        >
          <div className="rounded-2xl border border-gray-200/20 bg-white/50 p-4 backdrop-blur-xl">
            <FaGlobeAsia className="mb-3 text-2xl text-cyan-500" />
            <p className="text-sm text-gray-600">Global Reach</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Add Cities Worldwide
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/20 bg-white/50 p-4 backdrop-blur-xl">
            <FaMapMarkerAlt className="mb-3 text-2xl text-blue-400" />
            <p className="text-sm text-gray-600">GPS Coordinates</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Auto Detect Available
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>

    {/* Form */}
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-gray-200/20 bg-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.1)] backdrop-blur-2xl"
    >
      <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              City Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter city name"
              className="w-full rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-cyan-400/50 focus:bg-white/20 focus:ring-4 focus:ring-cyan-400/10"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-cyan-400/50 focus:bg-white/20 focus:ring-4 focus:ring-cyan-400/10"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="w-full rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-cyan-400/50 focus:bg-white/20 focus:ring-4 focus:ring-cyan-400/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the city, attractions, atmosphere and culture..."
              className="w-full rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-cyan-400/50 focus:bg-white/20 focus:ring-4 focus:ring-cyan-400/10"
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Best Time to Visit
              </label>
              <select
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/20 focus:ring-4 focus:ring-cyan-400/10"
                required
              >
                <option value="">Select best time</option>
                {bestTimeOptions.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Average Daily Budget
              </label>
              <input
                name="avgDailyBudget"
                value={formData.avgDailyBudget}
                onChange={handleChange}
                placeholder="₹ Enter budget"
                className="w-full rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-cyan-400/50 focus:bg-white/20 focus:ring-4 focus:ring-cyan-400/10"
                required
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200/30 bg-white/10 p-5">
            <div className="mb-4 flex items-center gap-3">
              <FaLocationArrow className="text-cyan-500" />
              <h3 className="font-semibold text-gray-900">Location Details</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-cyan-400/50"
              />

              <input
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="rounded-2xl border border-gray-200/30 bg-white/10 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-cyan-400/50"
              />

              <button
                type="button"
                onClick={handleGetLocation}
                className="rounded-2xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-200/40"
              >
                Get Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Famous & Images */}
      <div className="border-t border-gray-200/30 p-6 lg:p-8">
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Famous For</h3>
          <div className="flex flex-wrap gap-3">
            {famousOptions.map((item) => {
              const active = formData.famousFor.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFamous(item)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-medium capitalize transition-all duration-300 ${
                    active
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-600 shadow-lg shadow-cyan-200/10"
                      : "border-gray-200/20 bg-white/10 text-gray-600 hover:border-gray-300 hover:bg-white/20 hover:text-gray-900"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <FaImage className="text-cyan-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              City Images (Max 5)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {formData.images.map((img, index) => (
              <motion.label
                whileHover={{ scale: 1.03 }}
                key={index}
                className="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-200/20 bg-white/10 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/20"
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-center text-gray-400 transition group-hover:text-cyan-600">
                    <div className="text-3xl">+</div>
                    <p className="mt-1 text-xs">Upload</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, index)}
                />
              </motion.label>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-linear-to-r from-emerald-400 to-green-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-200/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating City..." : "Create City"}
          </button>
        </div>
      </div>
    </motion.form>
  </div>
</div>
  );
}

export default AddCityDetails;