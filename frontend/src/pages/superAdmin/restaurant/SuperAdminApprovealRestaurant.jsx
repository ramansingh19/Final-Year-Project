import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveRestaurantById,
  getPendingRestaurant,
  rejecteRestaurantById,
} from "../../../features/user/restaurantSlice";
import { getActiveCities } from "../../../features/user/citySlice";
import {
  FaUtensils,
  FaSearch,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCity,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function SuperAdminApprovealRestaurant() {
  const dispatch = useDispatch();

  const { restaurants = [], loading } = useSelector(
    (state) => state.restaurant
  );

  const { cities = [] } = useSelector((state) => state.city);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getPendingRestaurant({ page: 1 }));
    dispatch(getActiveCities());
  }, [dispatch]);

  const cityFilters = useMemo(() => {
    const cityNames = [
      ...new Set(
        restaurants
          ?.map((restaurant) => {
            if (typeof restaurant?.city === "string") return restaurant.city;
            return restaurant?.city?.name;
          })
          .filter((city) => city && typeof city === "string")
      ),
    ];

    return ["All", ...cityNames];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const restaurantCity =
        typeof restaurant?.city === "string"
          ? restaurant.city
          : restaurant?.city?.name || "";

      const matchesSearch =
        restaurant?.name?.toLowerCase().includes(search.toLowerCase()) ||
        restaurantCity.toLowerCase().includes(search.toLowerCase()) ||
        restaurant?.address?.toLowerCase().includes(search.toLowerCase()) ||
        restaurant?.foodType?.toLowerCase().includes(search.toLowerCase());

      const matchesCity =
        selectedCity === "All" || restaurantCity === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [restaurants, search, selectedCity]);

  const handleApprove = (e, id) => {
    e.stopPropagation();
    dispatch(approveRestaurantById(id));

    if (selectedRestaurant?._id === id) {
      setSelectedRestaurant(null);
    }
  };

  const handleReject = (e, id) => {
    e.stopPropagation();
    dispatch(rejecteRestaurantById(id));

    if (selectedRestaurant?._id === id) {
      setSelectedRestaurant(null);
    }
  };

  return (
<div className="min-h-screen bg-linear-to-b from-gray-50 via-gray-100 to-white text-gray-900 px-4 md:px-8 py-6 overflow-hidden">
  {/* Background Glow */}
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 w-80 h-80 bg-yellow-200/40 blur-3xl rounded-full animate-pulse-slow" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/40 blur-3xl rounded-full animate-pulse-slow" />
  </div>

  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative z-10 mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg p-6 md:p-8"
  >
    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-yellow-200/30 blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-pink-200/30 blur-3xl animate-pulse-slow" />

    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-yellow-400 to-pink-400 text-3xl shadow-md transition-transform hover:scale-105">
          <FaUtensils />
        </div>

        <div>
          <div className="mb-2 inline-flex rounded-full border border-yellow-300/50 bg-yellow-100 px-3 py-1 text-xs uppercase tracking-[0.25em] text-yellow-700">
            Restaurant Approval Panel
          </div>

          <h1 className="text-3xl md:text-5xl font-bold">
            Pending Restaurant Approvals
          </h1>

          <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-600 leading-7">
            Review, approve or reject restaurant submissions from a single
            interactive dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Total Pending
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {filteredRestaurants.length}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-300 bg-yellow-100 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-700">
                Current City
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-800">
                {selectedCity}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-105 space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search restaurant, city, address or food type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
          />
        </div>

        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
          {cityFilters.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                selectedCity === city
                  ? "bg-yellow-400 text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>

  {/* Table */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="relative z-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
  >
    <div className="overflow-x-auto">
      <table className="min-w-full w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-5 text-sm font-semibold text-gray-500">
              Restaurant
            </th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-500">
              City
            </th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-500">
              Food Type
            </th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-500">
              Avg Cost
            </th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-500">
              Status
            </th>
            <th className="px-6 py-5 text-right text-sm font-semibold text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? [...Array(6)].map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td colSpan="6" className="px-6 py-5">
                    <div className="h-16 w-full animate-pulse rounded-2xl bg-gray-100" />
                  </td>
                </tr>
              ))
            : filteredRestaurants.length > 0
            ? filteredRestaurants.map((restaurant, index) => {
                const cityName =
                  typeof restaurant?.city === "string"
                    ? restaurant.city
                    : restaurant?.city?.name || "-";
                return (
                  <motion.tr
                    key={restaurant._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="group cursor-pointer border-b border-gray-200 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={restaurant.images?.[0] || "/placeholder.jpg"}
                          alt={restaurant.name}
                          className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 transition group-hover:text-yellow-500">
                            {restaurant.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Click to view details
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700">{cityName}</td>
                    <td className="px-6 py-5 text-gray-600">
                      {restaurant.foodType || "-"}
                    </td>
                    <td className="px-6 py-5 text-gray-800">
                      ₹{restaurant.avgCostForOne || 0}
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 capitalize">
                        {restaurant.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleApprove(e, restaurant._id)}
                          className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={(e) => handleReject(e, restaurant._id)}
                          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            : (
              <tr>
                <td colSpan="6" className="py-20 text-center text-gray-400">
                  No pending restaurants found.
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  </motion.div>

  {/* Side Panel */}
{/* Side Panel */}
<AnimatePresence>
  {selectedRestaurant && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedRestaurant(null)}
        className="fixed inset-0 z-40 bg-gray-200/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        className="fixed right-0 top-0 z-50 h-full w-full sm:w-125 overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-yellow-700">
              Restaurant Details
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              {selectedRestaurant.name}
            </h2>
          </div>

          <button
            onClick={() => setSelectedRestaurant(null)}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Main Image */}
        <img
          src={selectedRestaurant.images?.[0] || "/placeholder.jpg"}
          alt={selectedRestaurant.name}
          className="mt-6 h-64 w-full rounded-3xl border border-gray-200 object-cover"
        />

        {/* Details Sections */}
        <div className="mt-6 space-y-5">
          {/* Basic Info */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <FaCity /> City
                </span>
                <span className="text-gray-900">
                  {typeof selectedRestaurant.city === "string"
                    ? selectedRestaurant.city
                    : selectedRestaurant.city?.name || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <FaUtensils /> Food Type
                </span>
                <span className="text-gray-900">
                  {selectedRestaurant.foodType || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <FaMoneyBillWave /> Avg Cost
                </span>
                <span className="text-gray-900">
                  ₹{selectedRestaurant.avgCostForOne || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <FaClock /> Best Time
                </span>
                <span className="text-gray-900">
                  {selectedRestaurant.bestTime || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Address
            </h3>
            <p className="text-sm leading-7 text-gray-600">
              {selectedRestaurant.address || "No address available"}
            </p>
          </div>

          {/* Famous Food */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Famous Food
            </h3>
            <p className="text-sm leading-7 text-gray-600">
              {selectedRestaurant.famousFood || "No famous food added"}
            </p>
          </div>

          {/* Opening Hours */}
          {selectedRestaurant.openingHours && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Opening Hours
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="text-gray-900">
                  {selectedRestaurant.openingHours.open} -{" "}
                  {selectedRestaurant.openingHours.close}
                </span>
              </div>
            </div>
          )}

          {/* Gallery */}
          {selectedRestaurant.images?.length > 1 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedRestaurant.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="restaurant"
                    className="h-28 w-full rounded-2xl border border-gray-200 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Google Maps */}
          {selectedRestaurant.location?.coordinates && (
            <a
              href={`https://www.google.com/maps?q=${selectedRestaurant.location.coordinates[1]},${selectedRestaurant.location.coordinates[0]}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-yellow-400 to-pink-400 px-5 py-4 font-semibold text-white transition hover:scale-[1.02]"
            >
              <FaMapMarkerAlt />
              Open in Google Maps
              <FaArrowRight className="text-sm" />
            </a>
          )}

          {/* Approve / Reject Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={(e) => handleApprove(e, selectedRestaurant._id)}
              className="rounded-2xl bg-green-500 py-4 font-semibold text-white transition hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={(e) => handleReject(e, selectedRestaurant._id)}
              className="rounded-2xl bg-red-500 py-4 font-semibold text-white transition hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
</div>
  );
}

export default SuperAdminApprovealRestaurant;