import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllActiveHotels,
  inactiveHotelByAdmin,
} from "../../../features/user/hotelSlice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHotel,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaDoorOpen,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function AdminHotelDashBoard() {
  const dispatch = useDispatch();
  const [selectedHotel, setSelectedHotel] = useState(null);

  const { hotels = [], loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getAllActiveHotels());
  }, [dispatch]);

  const handleInactive = (id) => {
    dispatch(inactiveHotelByAdmin(id));
    setSelectedHotel(null);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-[#f8f5f1] via-[#f5ebe0] to-[#ede0d4] px-4 py-6 sm:px-6 lg:px-8">
      {/* soft background blur */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 rounded-4xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-amber-400 via-orange-400 to-rose-400 text-3xl text-white shadow-lg">
                <FaHotel />
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
                  Hotel Management
                </p>

                <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                  Active Hotels Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Manage active hotels, monitor room availability and quickly
                  update hotel details from your admin panel.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="min-w-35 rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50 to-white px-6 py-4 text-center shadow-sm">
                <p className="text-3xl font-black text-slate-800">
                  {hotels.length}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Total Hotels
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Hotels Table */}
          <motion.div
            layout
            className={`transition-all duration-500 ${
              selectedHotel ? "xl:w-[68%]" : "w-full"
            }`}
          >
            <div className="overflow-hidden rounded-4xl border border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-2xl font-bold text-slate-800">
                  All Active Hotels
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Click any hotel to view detailed information
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-225 w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                        Hotel
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                        City
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                        Rooms
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      [...Array(6)].map((_, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-100 animate-pulse"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                              <div className="space-y-2">
                                <div className="h-4 w-40 rounded bg-slate-200" />
                                <div className="h-3 w-28 rounded bg-slate-100" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-4 w-24 rounded bg-slate-200" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-4 w-12 rounded bg-slate-200" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-8 w-24 rounded-full bg-slate-200" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
                          </td>
                        </tr>
                      ))
                    ) : hotels.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-16 text-center text-slate-500"
                        >
                          No active hotels found.
                        </td>
                      </tr>
                    ) : (
                      hotels.map((hotel, index) => (
                        <motion.tr
                          key={hotel._id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedHotel(hotel)}
                          className={`group cursor-pointer border-b border-slate-100 transition-all duration-300 hover:bg-orange-50/60 ${
                            selectedHotel?._id === hotel._id
                              ? "bg-orange-50/80"
                              : "bg-transparent"
                          }`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img
                                src={hotel.images?.[0] || "/no-image.jpg"}
                                alt={hotel.name}
                                className="h-14 w-14 rounded-2xl object-cover shadow-md transition duration-300 group-hover:scale-105"
                              />

                              <div>
                                <h3 className="font-bold text-slate-800">
                                  {hotel.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  {hotel.address}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaMapMarkerAlt className="text-orange-400" />
                              {hotel.city?.name}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 font-semibold text-slate-700">
                              <FaDoorOpen className="text-orange-400" />
                              {hotel.rooms?.length || 0}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                              {hotel.status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600">
                              View Details
                              <FaArrowRight className="text-xs" />
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

          {/* Details Panel */}
          <AnimatePresence>
            {selectedHotel && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="xl:sticky xl:top-6 xl:h-fit xl:w-[32%]"
              >
                <div className="rounded-4xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                        Selected Hotel
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-slate-800">
                        {selectedHotel.name}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <FaMapMarkerAlt className="text-orange-400" />
                        {selectedHotel.city?.name}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedHotel(null)}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl text-slate-500 transition duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <IoClose />
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-3xl">
                    <img
                      src={selectedHotel.images?.[0] || "/no-image.jpg"}
                      alt={selectedHotel.name}
                      className="h-64 w-full rounded-3xl object-cover shadow-lg"
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Address
                      </p>
                      <p className="text-sm leading-7 text-slate-600">
                        {selectedHotel.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                          Rooms
                        </p>
                        <h3 className="mt-3 text-3xl font-black text-slate-800">
                          {selectedHotel.rooms.length * selectedHotel.totalRoomQuantity || 0}
                        </h3>
                      </div>

                      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                          <FaClock />
                          Status
                        </p>
                        <h3 className="mt-3 text-lg font-bold text-emerald-600">
                          {selectedHotel.status}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <Link
                      to={`/admin/rooms/${selectedHotel._id}`}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-slate-700"
                    >
                      Show Rooms
                    </Link>

                    <Link
                      to={`/admin/update-hotel-details/${selectedHotel._id}`}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-5 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      Update Hotel
                    </Link>

                    <button
                      onClick={() => handleInactive(selectedHotel._id)}
                      className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition duration-300 hover:bg-red-100"
                    >
                      Mark Inactive
                    </button>
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

export default AdminHotelDashBoard;