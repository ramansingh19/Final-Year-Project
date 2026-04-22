import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHotel,
  FaUtensils,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { getAdminHotels } from "../../features/user/hotelSlice";
import { getAdminRestaurant } from "../../features/user/restaurantSlice";

function AdminItemsDetailsByAdminId() {
  const { adminId } = useParams();
  const dispatch = useDispatch();

  const {
    hotels = [],
    loadingHotels,
    error,
  } = useSelector((state) => state.hotel);

  const {
    restaurants = [],
    loading: loadingRestaurants,
  } = useSelector((state) => state.restaurant);

  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getAdminHotels(adminId));
    dispatch(getAdminRestaurant(adminId));
  }, [dispatch, adminId]);

  const allItems = useMemo(() => {
    const hotelItems = hotels.map((hotel) => ({
      ...hotel,
      type: "hotel",
    }));

    const restaurantItems = restaurants.map((restaurant) => ({
      ...restaurant,
      type: "restaurant",
    }));

    return [...hotelItems, ...restaurantItems];
  }, [hotels, restaurants]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.city?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.address?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : item.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [allItems, search, filter]);

  return (
<div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 md:px-8 overflow-hidden">
  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mb-6 sm:mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 md:p-8 shadow-lg"
  >
    <div className="absolute right-0 top-0 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-blue-200/20 blur-3xl" />
    <div className="absolute left-5 sm:left-10 bottom-0 h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-pink-200/20 blur-3xl" />

    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          <FaCheckCircle /> Hosted Items Dashboard
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight">
          Admin Hosted
          <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hotels & Restaurants
          </span>
        </h1>

        <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm md:text-base text-gray-600 leading-6 sm:leading-7">
          Browse all hosted properties and restaurants in a clean table view.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
          <h3 className="text-xl sm:text-3xl font-bold">{allItems.length}</h3>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 sm:p-4 text-center">
          <p className="text-[10px] sm:text-xs text-blue-600">Hotels</p>
          <h3 className="text-xl sm:text-3xl font-bold">{hotels.length}</h3>
        </div>

        <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3 sm:p-4 text-center">
          <p className="text-[10px] sm:text-xs text-pink-600">Restaurants</p>
          <h3 className="text-xl sm:text-3xl font-bold">{restaurants.length}</h3>
        </div>
      </div>
    </div>
  </motion.div>

  {/* Controls */}
  <div className="mb-5 sm:mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    {/* Search */}
    <div className="relative w-full lg:max-w-md">
      <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full rounded-2xl border border-gray-300 bg-white py-3 sm:py-4 pl-12 sm:pl-14 pr-4 text-sm sm:text-base outline-none focus:border-blue-300"
      />
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {["all", "hotel", "restaurant"].map((key) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border ${
            filter === key
              ? "border-blue-300 bg-blue-50 text-blue-600"
              : "border-gray-200 bg-white text-gray-500"
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  </div>

  {/* Loading */}
  {(loadingHotels || loadingRestaurants) && (
    <div className="rounded-3xl border border-gray-200 bg-white/70 p-6">
      <div className="space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-gray-200/50" />
        ))}
      </div>
    </div>
  )}

  {/* Error */}
  {error && (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-600">
      {error}
    </div>
  )}

  {/* Table */}
  {!loadingHotels && !loadingRestaurants && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg"
    >
     <div className="w-full overflow-x-auto">
      <table className="w-full min-w-225">

        <thead className="bg-gray-100">
          <tr>
            {["Item","Type","City","Address","Status","Action"].map((h) => (
              <th key={h} className="px-4 sm:px-6 py-4 text-xs text-gray-500 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((item) => (
            <tr
              key={item._id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.images?.[0]}
                    className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.foodType}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 sm:px-6 py-4 text-xs">{item.type}</td>
              <td className="px-4 sm:px-6 py-4 text-sm">{item.city?.name}</td>
              <td className="px-4 sm:px-6 py-4 text-sm truncate max-w-37.5">{item.address}</td>
              <td className="px-4 sm:px-6 py-4 text-xs text-green-600">{item.status}</td>

              <td className="px-4 sm:px-6 py-4 text-right">
                <button className="text-xs sm:text-sm">View</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
    </motion.div>
  )}

  {/* Side Detail Panel */}
  <AnimatePresence>
  {selectedItem && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedItem(null)}
        className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed right-0 top-0 z-50 h-screen w-full sm:max-w-xl md:max-w-2xl overflow-y-auto border-l border-gray-200 bg-white shadow-lg"
      >
        {/* Top Image */}
        <div className="relative">
          <img
            src={selectedItem.images?.[0]}
            alt={selectedItem.name}
            className="h-52 sm:h-64 md:h-72 w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute right-3 sm:right-4 top-3 sm:top-4 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 transition hover:bg-red-50 hover:text-red-600"
          >
            <FaTimes />
          </button>

          {/* Title Section */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
            <span
              className={`mb-2 sm:mb-4 inline-flex rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold ${
                selectedItem.type === "hotel"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-pink-50 text-pink-600"
              }`}
            >
              {selectedItem.type}
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {selectedItem.name}
            </h2>

            <p className="mt-1 sm:mt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-700">
              <FaMapMarkerAlt className="text-blue-500" />
              {selectedItem.city?.name}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 sm:space-y-6 p-4 sm:p-6">

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {selectedItem.images?.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="h-28 sm:h-32 w-full rounded-xl sm:rounded-2xl object-cover border border-gray-200 transition hover:scale-[1.02]"
              />
            ))}
          </div>

          {/* Details */}
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <h3 className="mb-4 sm:mb-5 text-base sm:text-lg font-bold text-gray-900">
              Details
            </h3>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700">

              <div>
                <p className="text-gray-500 mb-1">Address</p>
                <p>{selectedItem.address}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <p>{selectedItem.status}</p>
              </div>

              {/* Hotel */}
              {selectedItem.type === "hotel" && (
                <div>
                  <p className="text-gray-500 mb-1">Facilities</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItem.facilities?.map((facility, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-blue-200 bg-blue-50 px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-blue-600"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurant */}
              {selectedItem.type === "restaurant" && (
                <>
                  <div>
                    <p className="text-gray-500 mb-1">Food Type</p>
                    <p>{selectedItem.foodType}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Famous Food</p>
                    <p>{selectedItem.famousFood}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Average Cost</p>
                    <p>₹{selectedItem.avgCostForOne}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1 flex items-center gap-2">
                      <FaClock /> Opening Hours
                    </p>
                    <p>
                      {selectedItem.openingHours?.open} -{" "}
                      {selectedItem.openingHours?.close}
                    </p>
                  </div>
                </>
              )}

              {/* Map Button */}
              <a
                href={`https://maps.google.com?q=${selectedItem.location?.coordinates?.[1]},${selectedItem.location?.coordinates?.[0]}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 sm:mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-blue-200 bg-blue-50 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                <FaMapMarkerAlt /> View on Map
              </a>

            </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
</div>
  );
}

export default AdminItemsDetailsByAdminId;