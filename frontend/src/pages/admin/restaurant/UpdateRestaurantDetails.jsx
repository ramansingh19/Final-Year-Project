import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRestaurantById,
  updateRestaurant,
} from "../../../features/user/restaurantSlice";

function UpdateRestaurantDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { restaurant, loading } = useSelector((state) => state.restaurant);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    foodType: "",
    famousFood: "",
    avgCostForOne: "",
    bestTime: "",
    latitude: "",
    longitude: "",
    openingOpen: "",
    openingClose: "",
    images: [null, null, null, null, null],
  });

  /* -------- FETCH DATA -------- */
  useEffect(() => {
    if (id) dispatch(getRestaurantById(id));
  }, [dispatch, id]);

  /* -------- SET DATA -------- */
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        address: restaurant.address || "",
        foodType: restaurant.foodType || "",
        famousFood: restaurant.famousFood || "",
        avgCostForOne: restaurant.avgCostForOne || "",
        bestTime: restaurant.bestTime || "",
        latitude: restaurant.location?.coordinates?.[1] || "",
        longitude: restaurant.location?.coordinates?.[0] || "",
        openingOpen: restaurant.openingHours?.open?.slice(0, 5) || "",
        openingClose: restaurant.openingHours?.close?.slice(0, 5) || "",
        images: [null, null, null, null, null],
      });
    }
  }, [restaurant]);

  /* -------- HANDLERS -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData((prev) => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  };

  const handleImageChange = (index, file) => {
    const updated = [...formData.images];
    updated[index] = file;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  /* -------- SUBMIT -------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("foodType", formData.foodType);
    data.append("famousFood", formData.famousFood);
    data.append("avgCostForOne", formData.avgCostForOne);
    data.append("bestTime", formData.bestTime);

    // opening hours
    const openingHours = {
      open: formData.openingOpen,
      close: formData.openingClose,
    };
    data.append("openingHours", JSON.stringify(openingHours));

    // location
    const location = {
      type: "Point",
      coordinates: [formData.longitude, formData.latitude],
    };
    data.append("location", JSON.stringify(location));

    // images
    formData.images.forEach((img) => {
      if (img) data.append("images", img);
    });

    dispatch(updateRestaurant({ id, data }));
    alert("Restaurant Updated Successfully");
    // navigate("/admin/adminDashboard");
  };

  return (
<div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fffaf5] via-[#fef7f0] to-[#f8f5ff] py-8 md:py-12">
  {/* Background Blur Effects */}
  <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
  <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
  <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-100/50 blur-3xl" />

  <div className="ui-container relative z-10">
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-4xl border border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(251,146,60,0.08)] backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-orange-400 via-orange-500 to-amber-500 text-3xl text-white shadow-[0_10px_30px_rgba(251,146,60,0.35)] transition duration-500 hover:scale-105 hover:rotate-3">
              🍽️
            </div>

            <div>
              <span className="mb-2 inline-flex rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-600">
                Restaurant Dashboard
              </span>

              <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Update Restaurant
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                Edit your restaurant details, manage food information, upload
                photos and update timings with a cleaner and modern interface.
              </p>
            </div>
          </div>

          <div className="hidden rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 lg:flex lg:items-center lg:gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Everything looks good
              </p>
              <p className="text-xs text-emerald-500">
                Ready to save changes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        {/* Top Section */}
        <div className="border-b border-slate-100 bg-linear-to-r from-orange-50 via-white to-violet-50 px-6 py-6 md:px-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Restaurant Information
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fill all details carefully. Your restaurant profile will update
            instantly after saving.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
          {/* Basic Info */}
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Basic Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Main details about your restaurant
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="group">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter restaurant name"
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:shadow-[0_0_0_5px_rgba(251,146,60,0.12)]"
                />
              </div>

              <div className="group">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="Enter restaurant address"
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:shadow-[0_0_0_5px_rgba(251,146,60,0.12)]"
                />
              </div>
            </div>
          </div>

          {/* Food Details */}
          <div className="rounded-4xl border border-orange-100 bg-linear-to-br from-orange-50/70 via-white to-pink-50/60 p-5 md:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Food Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Information about dishes, cost and timing
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Food Type
                </label>
                <input
                  type="text"
                  name="foodType"
                  value={formData.foodType}
                  placeholder="Veg / Non-Veg"
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:shadow-[0_0_0_5px_rgba(251,146,60,0.12)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Famous Food
                </label>
                <input
                  type="text"
                  name="famousFood"
                  value={formData.famousFood}
                  placeholder="Special dish"
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:shadow-[0_0_0_5px_rgba(251,146,60,0.12)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Average Cost
                </label>
                <input
                  type="number"
                  name="avgCostForOne"
                  value={formData.avgCostForOne}
                  placeholder="₹ Average"
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:shadow-[0_0_0_5px_rgba(251,146,60,0.12)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Best Time
                </label>
                <select
                  name="bestTime"
                  value={formData.bestTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:shadow-[0_0_0_5px_rgba(251,146,60,0.12)]"
                >
                  <option value="">Select Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Evening">Evening</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="rounded-4xl border border-violet-100 bg-linear-to-br from-violet-50/60 via-white to-blue-50/60 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl">
                🕒
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Opening Hours
                </h3>
                <p className="text-sm text-slate-500">
                  Select restaurant opening and closing time
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <select
                name="openingOpen"
                value={formData.openingOpen}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-violet-400 focus:shadow-[0_0_0_5px_rgba(139,92,246,0.12)]"
              >
                <option value="">Open Time</option>
                <option value="06:00">06:00 AM</option>
                <option value="08:00">08:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>

              <select
                name="openingClose"
                value={formData.openingClose}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-violet-400 focus:shadow-[0_0_0_5px_rgba(139,92,246,0.12)]"
              >
                <option value="">Close Time</option>
                <option value="18:00">06:00 PM</option>
                <option value="20:00">08:00 PM</option>
                <option value="22:00">10:00 PM</option>
                <option value="23:00">11:00 PM</option>
                <option value="23:59">11:59 PM</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-4xl border border-emerald-100 bg-linear-to-br from-emerald-50/70 via-white to-cyan-50/60 p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Restaurant Location
                </h3>
                <p className="text-sm text-slate-500">
                  Add coordinates or detect automatically
                </p>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(16,185,129,0.35)]"
              >
                📍 Get Current Location
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-emerald-400 focus:shadow-[0_0_0_5px_rgba(16,185,129,0.12)]"
              />

              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-emerald-400 focus:shadow-[0_0_0_5px_rgba(16,185,129,0.12)]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="rounded-4xl border border-pink-100 bg-linear-to-br from-pink-50/60 via-white to-orange-50/60 p-5 md:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Restaurant Images
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Upload up to 5 beautiful photos of your restaurant
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {formData.images.map((img, i) => (
                <label
                  key={i}
                  className="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                >
                  {img ? (
                    <>
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 transition duration-300 group-hover:text-orange-500">
                      <span className="text-4xl font-light">+</span>
                      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.25em]">
                        Upload
                      </span>
                    </div>
                  )}

                  <input
                    hidden
                    type="file"
                    onChange={(e) => handleImageChange(i, e.target.files[0])}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-rose-500 px-6 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(249,115,22,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="relative z-10">
              {loading ? "Updating Restaurant..." : "Update Restaurant"}
            </span>

            <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
  );
}

export default UpdateRestaurantDetails;
