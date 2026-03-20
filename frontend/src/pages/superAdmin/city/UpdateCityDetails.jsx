import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCityById, updateCity } from "../../../features/user/citySlice";
import { useNavigate, useParams } from "react-router-dom";
import { FaCity } from "react-icons/fa";

function UpdateCityDetails() {
  const { id: cityId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { city, loading, error, success } = useSelector((state) => state.city);

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "",
    description: "",
    bestTimeToVisit: "",
    avgDailyBudget: "",
    famousFor: "",
    images: [],
  });

  // Fetch city by ID
  useEffect(() => {
    if (cityId) dispatch(getCityById(cityId));
  }, [cityId, dispatch]);

  // When city is loaded, fill form
  useEffect(() => {
    if (city) {
      setFormData({
        name: city.name || "",
        state: city.state || "",
        country: city.country || "",
        description: city.description || "",
        bestTimeToVisit: city.bestTimeToVisit || "",
        avgDailyBudget: city.avgDailyBudget || "",
        famousFor: Array.isArray(city.famousFor) ? city.famousFor.join(", ") : city.famousFor || "",
        images: city.images || [],
      });
    }
  }, [city]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === "images") {
        for (let i = 0; i < formData.images.length; i++) {
          data.append("images", formData.images[i]);
        }
      } else if (key === "famousFor") {
        // Send as array
        data.append(key, JSON.stringify(formData[key].split(",").map((s) => s.trim())));
      } else {
        data.append(key, formData[key]);
      }
    }

    dispatch(updateCity({ id: cityId, data }));
    alert("city details update successful")
    navigate("/superAdmin/get-all-active-cities")
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-all">
  
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaCity className="text-3xl text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Update City Details
        </h2>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-6">
  
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
  
        {/* State & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>
  
        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          ></textarea>
        </div>
  
        {/* Best Time & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Best Time To Visit</label>
            <input
              type="text"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Average Daily Budget</label>
            <input
              type="number"
              name="avgDailyBudget"
              value={formData.avgDailyBudget}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>
  
        {/* Famous For */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Famous For (comma separated)</label>
          <input
            type="text"
            name="famousFor"
            value={formData.famousFor}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
  
        {/* Images */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {Array.from(formData.images || []).map((img, i) => {
              const src = typeof img === "string" ? img : URL.createObjectURL(img);
              return (
                <img
                  key={i}
                  src={src}
                  alt="city"
                  className="w-24 h-24 object-cover rounded-lg shadow-sm"
                />
              );
            })}
          </div>
        </div>
  
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="loader border-t-white border-blue-500 animate-spin rounded-full w-5 h-5"></span>
              Updating...
            </span>
          ) : (
            "Update City"
          )}
        </button>
      </form>
    </div>
  );
}

export default UpdateCityDetails;