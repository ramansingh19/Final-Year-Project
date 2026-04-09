import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHotels } from "../../../features/user/hotelSlice";
import {
  FaHotel,
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function GetAllHotels() {
  const dispatch = useDispatch();
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllHotels());
  }, [dispatch]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel.city?.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || hotel.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [hotels, search, statusFilter]);

  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-100 to-gray-200 text-gray-900 overflow-hidden">
    {/* Background Glow */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
    </div>

    <div className="relative z-10 p-4 sm:p-6 xl:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 rounded-3xl border border-gray-300/40 bg-white shadow-lg overflow-hidden"
      >
        <div className="relative p-6 md:p-8">
          <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-300 to-pink-300 text-3xl shadow-md shadow-blue-300/20"
              >
                <FaHotel />
              </motion.div>

              <div>
                <div className="mb-2 inline-flex rounded-full border border-blue-200/30 bg-blue-100/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-blue-500">
                  Hotel Management Dashboard
                </div>

                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  Explore All Hotels
                </h1>

                <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600 leading-7">
                  Browse, search, and manage all hotels across the platform in
                  one interactive dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:w-auto w-full">
              <div className="rounded-2xl border border-gray-300/30 bg-gray-50 p-4 min-w-35">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Total Hotels
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {hotels.length}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-300/40 bg-blue-100/30 p-4 min-w-35">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-500">
                  Showing
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {filteredHotels.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hotel, city or address..."
                className="w-full rounded-2xl border border-gray-300/50 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-300 border ${
                    statusFilter === filter.value
                      ? "border-blue-400 bg-blue-300 text-white shadow-md shadow-blue-200"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <div className="overflow-y-auto max-h-125 rounded-3xl border border-gray-300/40 bg-white shadow-lg p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-300/50 bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-5 text-xs uppercase tracking-[0.2em] text-gray-500">Hotel</th>
                <th className="px-4 sm:px-6 py-5 text-xs uppercase tracking-[0.2em] text-gray-500 hidden md:table-cell">City</th>
                <th className="px-4 sm:px-6 py-5 text-xs uppercase tracking-[0.2em] text-gray-500 hidden lg:table-cell">Address</th>
                <th className="px-4 sm:px-6 py-5 text-xs uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="px-4 sm:px-6 py-5 text-xs uppercase tracking-[0.2em] text-gray-500 hidden sm:table-cell">Rating</th>
                <th className="px-4 sm:px-6 py-5"></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-300/40 animate-pulse">
                    <td className="px-4 sm:px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gray-200" />
                        <div>
                          <div className="h-4 w-32 rounded bg-gray-200 mb-2" />
                          <div className="h-3 w-24 rounded bg-gray-200" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 hidden md:table-cell">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 sm:px-6 py-5 hidden lg:table-cell">
                      <div className="h-4 w-40 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 sm:px-6 py-5">
                      <div className="h-8 w-20 rounded-full bg-gray-200" />
                    </td>
                    <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                      <div className="h-4 w-12 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <motion.tr
                    key={hotel._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedHotel(hotel)}
                    className="group cursor-pointer border-b border-gray-300/40 transition-all hover:bg-blue-50"
                  >
                    <td className="px-4 sm:px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={hotel.images?.[0]}
                          alt={hotel.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-gray-300/50"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-500 transition">{hotel.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{new Date(hotel.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 text-gray-600 hidden md:table-cell">{hotel.city?.name || "City"}</td>
                    <td className="px-4 sm:px-6 py-5 text-gray-700 max-w-65 truncate hidden lg:table-cell">{hotel.address}</td>
                    <td className="px-4 sm:px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${hotel.status === "active" ? "bg-green-100 text-green-600" : hotel.status === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-yellow-400 font-medium">
                        <FaStar className="text-xs" />
                        {hotel.averageRating || 0}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 text-right">
                      <FaChevronRight className="ml-auto text-gray-400 group-hover:text-blue-500 transition" />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-500">
                    No hotels found matching your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Side Detail Panel */}
    <AnimatePresence>
      {selectedHotel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHotel(null)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 z-50 h-full w-full sm:w-105 lg:w-130 overflow-y-auto border-l border-gray-300/40 bg-white shadow-lg"
          >
            <div className="relative">
              <img
                src={selectedHotel.images?.[0]}
                alt={selectedHotel.name}
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-white/90 via-white/40 to-transparent" />
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-gray-900 backdrop-blur hover:bg-red-500 transition"
              >
                <FaTimes />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${selectedHotel.status === "active" ? "bg-green-100 text-green-600" : selectedHotel.status === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                  {selectedHotel.status}
                </span>
                <h2 className="text-3xl font-bold text-gray-900">{selectedHotel.name}</h2>
                <p className="mt-2 text-gray-600">{selectedHotel.city?.name}</p>
              </div>
            </div>

            <div className="space-y-6 p-6 text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-300/40 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Rating</p>
                  <p className="mt-2 flex items-center gap-2 text-xl font-bold text-yellow-400">
                    <FaStar />
                    {selectedHotel.averageRating || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-300/40 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Reviews</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">{selectedHotel.totalReviews || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Address</h3>
                <div className="flex items-start gap-3 rounded-2xl border border-gray-300/40 bg-gray-50 p-4">
                  <FaMapMarkerAlt className="mt-1 text-blue-400" />
                  <div>
                    <p>{selectedHotel.address}</p>
                    <a
                      href={`https://www.google.com/maps?q=${selectedHotel.location?.coordinates?.[1]},${selectedHotel.location?.coordinates?.[0]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-blue-500 hover:text-blue-400"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
                <div className="rounded-2xl border border-gray-300/40 bg-gray-50 p-4 leading-7 text-gray-700">
                  {selectedHotel.description}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHotel.facilities?.map((facility, index) => (
                    <span key={index} className="rounded-full border border-blue-200/40 bg-blue-100/30 px-3 py-2 text-sm text-blue-500">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {selectedHotel.images?.length > 1 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Gallery</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedHotel.images.slice(1).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="hotel"
                        className="h-32 w-full rounded-2xl object-cover border border-gray-300/40"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
  );
}

export default GetAllHotels;