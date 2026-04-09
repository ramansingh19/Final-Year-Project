ShowRestaurantStatus.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantStatus } from "../../../features/user/restaurantSlice";
import { motion } from "framer-motion";
import { FaStoreAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function ShowRestaurantStatus() {
  const dispatch = useDispatch();
  const { restaurants = [], loading } = useSelector(
    (state) => state.restaurant
  );

  const [status, setStatus] = useState("active");

  useEffect(() => {
    dispatch(getRestaurantStatus(status));
  }, [dispatch, status]);

  return (
<div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fffaf5] via-[#fef8f4] to-[#f5f7ff] py-6 text-slate-800">
  {/* Background Blur Effects */}
  <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
  <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
  <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />

  <div className="ui-container relative z-10">
    {/* HEADER */}
    <div className="sticky top-0 z-30 mb-6 pt-1">
      <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/75 px-5 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:px-8 md:py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-start gap-4 md:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-orange-400 via-orange-500 to-rose-500 text-3xl text-white shadow-[0_15px_35px_rgba(251,146,60,0.35)] transition-all duration-500 hover:scale-105 hover:rotate-3">
              <FaStoreAlt />
            </div>

            <div>
              <span className="mb-2 inline-flex rounded-full bg-orange-100 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-orange-600">
                Restaurant Dashboard
              </span>

              <h1 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl">
                Restaurant Status
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                Monitor all pending, approved and rejected restaurants in one
                beautiful dashboard.
              </p>
            </div>
          </div>

          {/* Right Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatus("pending")}
              className={`group relative overflow-hidden rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                status === "pending"
                  ? "border-yellow-300 bg-yellow-100 text-yellow-700 shadow-[0_10px_25px_rgba(250,204,21,0.25)]"
                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-yellow-200 hover:bg-yellow-50"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaClock className="text-base" />
                Pending
              </span>
            </button>

            <button
              onClick={() => setStatus("active")}
              className={`group relative overflow-hidden rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                status === "active"
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700 shadow-[0_10px_25px_rgba(16,185,129,0.22)]"
                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaCheckCircle className="text-base" />
                Active
              </span>
            </button>

            <button
              onClick={() => setStatus("rejected")}
              className={`group relative overflow-hidden rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                status === "rejected"
                  ? "border-rose-300 bg-rose-100 text-rose-700 shadow-[0_10px_25px_rgba(244,63,94,0.2)]"
                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-rose-200 hover:bg-rose-50"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaTimesCircle className="text-base" />
                Rejected
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* TABLE CARD */}
    <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
      {/* Top Strip */}
      <div className="border-b border-slate-100 bg-linear-to-r from-orange-50 via-white to-violet-50 px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Restaurants List
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {restaurants.length}
              </span>{" "}
              restaurant{restaurants.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="hidden rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 md:flex md:items-center md:gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-orange-700">
              Live Restaurant Status
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-250">
          <thead className="sticky top-0 z-20 border-b border-slate-100 bg-slate-50/90 backdrop-blur-xl">
            <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <th className="px-8 py-5">Restaurant</th>
              <th className="px-6 py-5">City</th>
              <th className="px-6 py-5">Food Type</th>
              <th className="px-6 py-5">Address</th>
              <th className="px-6 py-5">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-slate-100">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                      <div>
                        <div className="mb-2 h-4 w-36 rounded bg-slate-200" />
                        <div className="h-3 w-24 rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>

                  <td className="px-6 py-6">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </td>

                  <td className="px-6 py-6">
                    <div className="h-4 w-44 rounded bg-slate-200" />
                  </td>

                  <td className="px-6 py-6">
                    <div className="h-8 w-24 rounded-full bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : restaurants.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-5xl shadow-inner">
                      🍽️
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      No Restaurants Found
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                      There are no restaurants available for this status right
                      now. Try selecting another filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              restaurants.map((restaurant, index) => (
                <motion.tr
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group border-b border-slate-100 transition-all duration-300 hover:bg-orange-50/40"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                        <img
                          src={restaurant.images?.[0] || "/no-image.jpg"}
                          alt={restaurant.name}
                          className="h-16 w-16 object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {restaurant.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          ID: {restaurant._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-sm font-medium text-slate-600">
                    {restaurant.city?.name || "N/A"}
                  </td>

                  <td className="px-6 py-6">
                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                      {restaurant.foodType || "N/A"}
                    </span>
                  </td>

                  <td className="max-w-xs px-6 py-6 text-sm leading-6 text-slate-500">
                    {restaurant.address}
                  </td>

                  <td className="px-6 py-6">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${
                        restaurant.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : restaurant.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {restaurant.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 lg:hidden">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
              </div>
            </div>
          ))
        ) : restaurants.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-5xl">🍽️</div>
            <h3 className="text-xl font-bold text-slate-900">
              No Restaurants Found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another filter to see more restaurants.
            </p>
          </div>
        ) : (
          restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_15px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
            >
              <div className="flex gap-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={restaurant.images?.[0] || "/no-image.jpg"}
                    alt={restaurant.name}
                    className="h-20 w-20 object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {restaurant.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        ID: {restaurant._id.slice(-8)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        restaurant.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : restaurant.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {restaurant.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">City</span>
                      <span className="font-medium text-slate-700">
                        {restaurant.city?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Food</span>
                      <span className="font-medium text-slate-700">
                        {restaurant.foodType || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-400">Address</span>
                      <span className="max-w-[65%] text-right font-medium text-slate-700">
                        {restaurant.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  </div>
</div>
  );
}

export default ShowRestaurantStatus;