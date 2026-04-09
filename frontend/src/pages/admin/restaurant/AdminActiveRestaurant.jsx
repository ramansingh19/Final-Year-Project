import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllActiveRestaurant,
  inactiveRestaurantByAdmin,
} from "../../../features/user/restaurantSlice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUtensils, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

function AdminActiveRestaurant() {
  const dispatch = useDispatch();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const { restaurants = [], loading } = useSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    dispatch(getAllActiveRestaurant());
  }, [dispatch]);

  const handleInactive = (id) => {
    dispatch(inactiveRestaurantByAdmin(id));
    setSelectedRestaurant(null);
  };

  return (
<div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] py-6 text-slate-800">
  {/* E-commerce style background */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-0 left-0 h-125 w-125 rounded-full bg-violet-300/30 blur-3xl" />
    <div className="absolute top-40 right-0 h-112.5 w-112.5 rounded-full bg-sky-300/30 blur-3xl" />
    <div className="absolute bottom-0 left-1/3 h-100 w-100 rounded-full bg-pink-200/30 blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(245,247,255,0.95))]" />
  </div>

  <div className="ui-container relative z-10">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 mb-6 rounded-4xl border border-white/70 bg-white/80 px-4 py-5 shadow-[0_10px_50px_rgba(99,102,241,0.12)] backdrop-blur-2xl md:px-8 md:py-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.06 }}
            className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-orange-400 via-pink-500 to-violet-600 text-2xl text-white shadow-xl"
          >
            <FaUtensils />
          </motion.div>

          <div>
            <h1 className="bg-linear-to-r from-slate-900 via-violet-700 to-blue-600 bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-4xl">
              Active Restaurants
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500 md:text-base">
              View and manage all currently active restaurants
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ y: -4 }}
          className="flex w-full items-center justify-center rounded-3xl border border-white/60 bg-linear-to-br from-white to-slate-100 px-6 py-4 shadow-lg sm:w-fit"
        >
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">
              {restaurants.length}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Restaurants
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>

    <div className="flex flex-col gap-6 xl:flex-row">
      {/* Table */}
      <motion.div
        layout
        className={`transition-all duration-500 ${
          selectedRestaurant ? "w-full xl:w-[68%]" : "w-full"
        }`}
      >
        <div className="overflow-hidden rounded-4xl border border-white/60 bg-white/80 shadow-[0_20px_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl">
          {/* Optional search row */}
          <div className="flex flex-col gap-4 border-b border-slate-200/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Restaurant List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select any restaurant to view more details
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search restaurant..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Restaurant
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    City
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Food Type
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Cost
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index} className="animate-pulse border-b border-slate-100">
                      <td className="px-6 py-5">
                        <div className="h-14 w-44 rounded-2xl bg-slate-200" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-24 rounded-xl bg-slate-200" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-28 rounded-xl bg-slate-200" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-16 rounded-xl bg-slate-200" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-8 w-24 rounded-full bg-slate-200" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-10 w-28 rounded-2xl bg-slate-200" />
                      </td>
                    </tr>
                  ))
                ) : restaurants.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-20 text-center text-base font-medium text-slate-400"
                    >
                      No active restaurants found.
                    </td>
                  </tr>
                ) : (
                  restaurants.map((restaurant, index) => (
                    <motion.tr
                      key={restaurant._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className={`group cursor-pointer border-b border-slate-100 transition-all duration-300 hover:bg-violet-50/70 ${
                        selectedRestaurant?._id === restaurant._id
                          ? "bg-violet-50"
                          : "bg-transparent"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <motion.img
                            whileHover={{ scale: 1.08 }}
                            src={restaurant.images?.[0] || "/no-image.jpg"}
                            alt={restaurant.name}
                            className="h-14 w-14 rounded-2xl border border-white object-cover shadow-md"
                          />

                          <div>
                            <p className="text-base font-bold text-slate-900 transition group-hover:text-violet-700">
                              {restaurant.name}
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                              {restaurant.famousFood}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {restaurant.city?.name}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {restaurant.foodType}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        ₹{restaurant.avgCostForOne}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                          {restaurant.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button className="rounded-2xl bg-linear-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Side Panel */}
{/* Right Side Panel */}
<AnimatePresence>
  {selectedRestaurant && (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.35 }}
      className="sticky top-28 h-fit w-full overflow-hidden rounded-4xl border border-white/70 bg-white/95 shadow-[0_25px_80px_rgba(99,102,241,0.12)] backdrop-blur-2xl xl:h-[calc(100vh-8rem)] xl:w-[34%] xl:overflow-y-auto"
    >
      {/* Hero Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={selectedRestaurant.images?.[0] || "/no-image.jpg"}
          alt={selectedRestaurant.name}
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
        />

        {/* soft overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* close btn */}
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-600 shadow-lg transition-all duration-300 hover:rotate-90 hover:bg-red-500 hover:text-white"
        >
          <IoClose />
        </button>

        {/* title */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="mb-3 inline-flex items-center rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-200 backdrop-blur-md">
            {selectedRestaurant.status}
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white">
            {selectedRestaurant.name}
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-200">
            {selectedRestaurant.city?.name}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Restaurant Type Section */}
        <div className="rounded-[28px] bg-linear-to-br from-[#faf5ff] via-[#ffffff] to-[#f5f7ff] p-5 shadow-[0_10px_30px_rgba(99,102,241,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">
                Restaurant Type
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {selectedRestaurant.foodType}
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-600 shadow-inner">
              <FaUtensils />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Famous Food
              </p>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-800">
                {selectedRestaurant.famousFood || "Not Available"}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Avg Cost
              </p>
              <p className="mt-2 text-sm font-bold text-emerald-600">
                ₹{selectedRestaurant.avgCostForOne} / Person
              </p>
            </div>
          </div>
        </div>

        {/* Small info cards */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <FaClock />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
              Opening Time
            </p>

            <p className="mt-2 text-sm font-bold text-slate-900">
              {selectedRestaurant.openingHours?.open || "--"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <FaClock />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
              Closing Time
            </p>

            <p className="mt-2 text-sm font-bold text-slate-900">
              {selectedRestaurant.openingHours?.close || "--"}
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
              <FaMapMarkerAlt />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Restaurant Address
              </p>
              <h4 className="text-sm font-semibold text-slate-900">
                Location Details
              </h4>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            {selectedRestaurant.address}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to={`/admin/get-All-Food/${selectedRestaurant._id}`}
            className="flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-lg"
          >
            Show Food Menu
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/admin/update-restaurant/${selectedRestaurant._id}`}
              className="flex items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Update
            </Link>

            <button
              onClick={() => handleInactive(selectedRestaurant._id)}
              className="rounded-2xl bg-linear-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  </div>
</div>
  );
}

export default AdminActiveRestaurant;