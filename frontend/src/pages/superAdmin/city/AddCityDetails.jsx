import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCity } from "../../../features/user/citySlice";
import { useNavigate } from "react-router-dom";

function AddCityDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, createSuccess } = useSelector((state) => state.city);

  /* ---------------- OPTIONS ---------------- */

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

  /* ---------------- STATE ---------------- */

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

  /* ---------------- INPUT CHANGE ---------------- */

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- TOGGLE FAMOUS ---------------- */

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

  /* ---------------- AUTO LOCATION ---------------- */

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

  /* ---------------- IMAGE CHANGE ---------------- */

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

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("state", formData.state);
    data.append("country", formData.country);
    data.append("description", formData.description);
    data.append("bestTimeToVisit", formData.bestTimeToVisit);
    data.append("avgDailyBudget", formData.avgDailyBudget);

    // convert array → string
    data.append("famousFor", formData.famousFor.join(","));

    const location = {
      type: "Point",
      coordinates: [
        Number(formData.longitude),
        Number(formData.latitude),
      ],
    };

    data.append("location", JSON.stringify(location));

    // append images
    formData.images
      .filter(Boolean)
      .forEach((img) => data.append("images", img));

    dispatch(createCity(data));
  };

  useEffect(() => {
    if(createSuccess === true){
      navigate("/superAdmin/superAdminDashboard")
    }
  }, [navigate, createSuccess])

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-all">
  
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Create City
      </h2>
  
      <form onSubmit={handleSubmit} className="space-y-6">
  
        {/* City Name */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">City Name</label>
          <input
            name="name"
            placeholder="Enter city name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
  
        {/* State & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">State</label>
            <input
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
  
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">Country</label>
            <input
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
  
        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">City Description</label>
          <textarea
            name="description"
            placeholder="Describe the city"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            rows={4}
            required
          />
        </div>
  
        {/* Best Time & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">Best Time to Visit</label>
            <select
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            >
              <option value="">Select best time</option>
              {bestTimeOptions.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">Average Daily Budget</label>
            <input
              name="avgDailyBudget"
              placeholder="Enter budget"
              value={formData.avgDailyBudget}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
  
        {/* Location */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Location</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <input
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              Get Location
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            Type coordinates manually or click "Get Location".
          </p>
        </div>
  
        {/* Famous For */}
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Famous For</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {famousOptions.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.famousFor.includes(item)}
                  onChange={() => toggleFamous(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
  
        {/* Images */}
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">City Images (Max 5)</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {formData.images.map((img, index) => (
              <label
                key={index}
                className="border h-24 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "+"
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, index)}
                />
              </label>
            ))}
          </div>
        </div>
  
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create City"}
        </button>
      </form>
    </div>
  );
}

export default AddCityDetails;