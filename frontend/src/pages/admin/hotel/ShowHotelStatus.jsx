import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHotelsStatus } from "../../../features/user/hotelSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHotel,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

function ShowHotelStatus() {
  const dispatch = useDispatch();
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getHotelsStatus(status));
  }, [dispatch, status]);

  const filteredHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        hotel.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel.city?.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(search.toLowerCase())
    );
  }, [hotels, search]);

  const statusButtons = [
    {
      key: "pending",
      label: "Pending",
      icon: <FaClock />,
      activeClass:
        "bg-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.35)]",
      idleClass:
        "bg-white/70 text-slate-600 border border-slate-200 hover:bg-white",
    },
    {
      key: "active",
      label: "Active",
      icon: <FaCheckCircle />,
      activeClass:
        "bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)]",
      idleClass:
        "bg-white/70 text-slate-600 border border-slate-200 hover:bg-white",
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <FaTimesCircle />,
      activeClass:
        "bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.35)]",
      idleClass:
        "bg-white/70 text-slate-600 border border-slate-200 hover:bg-white",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] px-4 py-5 sm:px-6 lg:px-8">
      {/* Ecommerce Style Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-[-120px] h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute top-1/3 right-[-120px] h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/3 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-7 rounded-[32px] border border-white/60 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-7"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 text-3xl text-white shadow-xl">
                <FaHotel />
              </div>

              <div>
                <p className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                  Admin Dashboard
                </p>

                <h1 className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                  Hotel Status Overview
                </h1>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
                  Monitor all hotel requests with a clean overview of pending,
                  active, and rejected properties.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Showing
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-800">
                  {filteredHotels.length}
                </h3>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Current
                </p>
                <h3 className="mt-2 capitalize text-2xl font-black text-slate-800">
                  {status}
                </h3>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Total
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-800">
                  {hotels.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {statusButtons.map((btn) => (
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={btn.key}
                  onClick={() => setStatus(btn.key)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300 ${
                    status === btn.key ? btn.activeClass : btn.idleClass
                  }`}
                >
                  {btn.icon}
                  {btn.label}
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-[320px]">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                type="text"
                placeholder="Search hotel, city, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>
        </motion.div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-[32px] border border-white/70 bg-white/75 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-6">Hotel</th>
                  <th className="px-6 py-6">City</th>
                  <th className="px-6 py-6">Address</th>
                  <th className="px-6 py-6">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-8 py-6">
                        <div className="flex animate-pulse items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                          <div>
                            <div className="mb-2 h-4 w-40 rounded bg-slate-200" />
                            <div className="h-3 w-24 rounded bg-slate-100" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
                      </td>
                    </tr>
                  ))
                ) : filteredHotels.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-24 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-auto max-w-md"
                      >
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
                          🏨
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">
                          No Hotels Found
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          No hotels match the selected status or search term.
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  filteredHotels.map((hotel, index) => (
                    <motion.tr
                      key={hotel._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="group border-b border-slate-100 transition-all duration-300 hover:bg-violet-50/50"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={hotel.images?.[0] || "/no-image.jpg"}
                              alt={hotel.name}
                              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-lg transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                          </div>

                          <div>
                            <h3 className="text-base font-extrabold tracking-tight text-slate-800">
                              {hotel.name}
                            </h3>
                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              ID: {hotel._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <FaMapMarkerAlt className="text-violet-500" />
                          {hotel.city?.name || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-6 max-w-sm">
                        <p className="truncate text-sm font-medium text-slate-500">
                          {hotel.address || "N/A"}
                        </p>
                      </td>

                      <td className="px-6 py-6">
                        <span
                          className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                            hotel.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : hotel.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {hotel.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Tablet Cards */}
        <div className="space-y-4 lg:hidden">
          <AnimatePresence>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="mb-2 h-4 w-40 rounded bg-slate-200" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="mb-3 h-3 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                </div>
              ))
            ) : filteredHotels.length === 0 ? (
              <div className="rounded-3xl border border-white/70 bg-white/80 px-6 py-16 text-center shadow-sm">
                <div className="mb-4 text-5xl">🏨</div>
                <h3 className="text-xl font-black text-slate-800">
                  No Hotels Found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing the selected status or search keyword.
                </p>
              </div>
            ) : (
              filteredHotels.map((hotel, index) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={hotel.images?.[0] || "/no-image.jpg"}
                      alt={hotel.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-md"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="truncate text-lg font-black text-slate-800">
                            {hotel.name}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-slate-400">
                            ID: {hotel._id.slice(-8)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                            hotel.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : hotel.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {hotel.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <FaMapMarkerAlt className="text-violet-500" />
                          {hotel.city?.name || "N/A"}
                        </div>

                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {hotel.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ShowHotelStatus;