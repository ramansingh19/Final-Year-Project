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
    className="relative mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg"
  >
    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl" />
    <div className="absolute left-10 bottom-0 h-32 w-32 rounded-full bg-pink-200/20 blur-3xl" />

    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          <FaCheckCircle /> Hosted Items Dashboard
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight">
          Admin Hosted
          <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hotels & Restaurants
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-600 leading-7">
          Browse all hosted properties and restaurants in a clean table view.
          Click any item to instantly open detailed information in the side panel.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Total</p>
          <h3 className="mt-2 text-3xl font-bold">{allItems.length}</h3>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs uppercase tracking-widest text-blue-600">Hotels</p>
          <h3 className="mt-2 text-3xl font-bold">{hotels.length}</h3>
        </div>

        <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4">
          <p className="text-xs uppercase tracking-widest text-pink-600">Restaurants</p>
          <h3 className="mt-2 text-3xl font-bold">{restaurants.length}</h3>
        </div>
      </div>
    </div>
  </motion.div>

  {/* Controls */}
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="relative w-full lg:max-w-md">
      <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name, city or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-14 pr-4 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-blue-300 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
      />
    </div>

    <div className="flex flex-wrap gap-3">
      {[
        { key: "all", label: "All Items" },
        { key: "hotel", label: "Hotels" },
        { key: "restaurant", label: "Restaurants" },
      ].map((btn) => (
        <button
          key={btn.key}
          onClick={() => setFilter(btn.key)}
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 border ${
            filter === btn.key
              ? "border-blue-300 bg-blue-50 text-blue-600 shadow-md"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          {btn.label}
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead className="border-b border-gray-200 bg-gray-100">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Item</th>
              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Type</th>
              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">City</th>
              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Address</th>
              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
              <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {item.type === "restaurant" ? item.foodType : "Hosted Property"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        item.type === "hotel"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-pink-50 text-pink-600 border border-pink-200"
                      }`}
                    >
                      {item.type === "hotel" ? <FaHotel /> : <FaUtensils />}
                      {item.type}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-gray-700">{item.city?.name || "Unknown"}</td>

                  <td className="px-6 py-5 text-gray-500 max-w-xs truncate">{item.address}</td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 border border-green-200">
                      {item.status || "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:text-blue-600">
                      View Details
                      <FaChevronRight className="text-xs" />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )}

  {/* Side Detail Panel */}
  <AnimatePresence>
    {selectedItem && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto border-l border-gray-200 bg-white shadow-lg"
        >
          <div className="relative">
            <img
              src={selectedItem.images?.[0]}
              alt={selectedItem.name}
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent" />

            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 transition hover:bg-red-50 hover:text-red-600"
            >
              <FaTimes />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <span
                className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedItem.type === "hotel"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-pink-50 text-pink-600"
                }`}
              >
                {selectedItem.type}
              </span>

              <h2 className="text-3xl font-black text-gray-900">{selectedItem.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-blue-500" />
                {selectedItem.city?.name}
              </p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-4">
              {selectedItem.images?.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="preview"
                  className="h-32 w-full rounded-2xl object-cover border border-gray-200 transition hover:scale-[1.02]"
                />
              ))}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-5 text-lg font-bold text-gray-900">Details</h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500 mb-1">Address</p>
                  <p>{selectedItem.address}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p>{selectedItem.status}</p>
                </div>

                {selectedItem.type === "hotel" && (
                  <div>
                    <p className="text-gray-500 mb-1">Facilities</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedItem.facilities?.map((facility, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-600"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
                        {selectedItem.openingHours?.open} - {selectedItem.openingHours?.close}
                      </p>
                    </div>
                  </>
                )}

                <a
                  href={`https://maps.google.com?q=${selectedItem.location?.coordinates?.[1]},${selectedItem.location?.coordinates?.[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-100"
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