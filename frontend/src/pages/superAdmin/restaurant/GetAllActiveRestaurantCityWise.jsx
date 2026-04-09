import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveRestaurantCityWise,
  inactiveRestaurant,
} from "../../../features/user/restaurantSlice";
import { getActiveCities } from "../../../features/user/citySlice";
import {
  FaUtensils,
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function GetAllActiveRestaurantCityWise() {
  const dispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  const { restaurants = [], loading } = useSelector(
    (state) => state.restaurant
  );
  const { cities = [] } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getActiveCities());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getActiveRestaurantCityWise({
        city: selectedCity,
        page: 1,
      })
    );
  }, [dispatch, selectedCity]);

  const handleInactive = (id) => {
    dispatch(inactiveRestaurant(id));
  };

  const cityOptions = useMemo(() => {
    const uniqueCities = [
      ...new Set(
        restaurants
          .map((r) =>
            typeof r.city === "object"
              ? r.city?.name
              : typeof r.city === "string"
              ? r.city
              : null
          )
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCities];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const cityName =
        typeof restaurant.city === "object"
          ? restaurant.city?.name || ""
          : restaurant.city || "";

      const matchesSearch =
        restaurant.name?.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(search.toLowerCase()) ||
        cityName.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.foodType?.toLowerCase().includes(search.toLowerCase());

      const matchesCity =
        cityFilter === "All" || cityName === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [restaurants, search, cityFilter]);

  return (
<div className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 lg:px-8 overflow-hidden">
  {/* Background Glow */}
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-yellow-200/30 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />
  </div>

  <div className="relative z-10">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg backdrop-blur-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,224,71,0.15),transparent_35%)]" />

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-300/30 bg-yellow-100 text-yellow-700 shadow-lg shadow-yellow-200/20 transition-all duration-300"
          >
            <FaUtensils className="text-3xl" />
          </motion.div>

          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/50 bg-yellow-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-700">
              Active Restaurant Dashboard
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Explore Active Restaurants
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Search, filter and manage all active restaurants across different cities with a modern interactive dashboard.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-full border border-yellow-300/50 bg-yellow-50 px-4 py-2 text-sm text-yellow-700 shadow-sm transition hover:shadow-md">
                {filteredRestaurants.length} Restaurants Showing
              </div>

              <div className="rounded-full border border-gray-200 bg-white/30 px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:shadow-md">
                {cityFilter === "All" ? "All Cities" : `City: ${cityFilter}`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 sm:w-auto">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 min-w-32.5 shadow-sm transition hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-yellow-700">{restaurants.length}</p>
          </div>

          <div className="rounded-2xl border border-yellow-300/50 bg-yellow-50 px-4 py-4 min-w-32.5 shadow-sm transition hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-yellow-700">Cities</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{cityOptions.length - 1}</p>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Search + Filters */}
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative w-full xl:max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurant, city, food type or address..."
          className="w-full rounded-2xl border border-gray-200 bg-white/50 py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200/50"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {cityOptions.map((city) => (
          <button
            key={city}
            onClick={() => {
              setCityFilter(city);
              if (city === "All") setSelectedCity("");
              else {
                const matched = cities.find((c) => c.name === city);
                setSelectedCity(matched?._id || "");
              }
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              cityFilter === city
                ? "border-yellow-500 bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-200/20"
                : "border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:text-gray-900 hover:shadow-sm"
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>

    {/* Table */}
    <div className="overflow-y-auto max-h-162.5 rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-xl shadow-lg transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
            <tr>
              <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Restaurant</th>
              <th className="hidden px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 md:table-cell">City</th>
              <th className="hidden px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 lg:table-cell">Food Type</th>
              <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Status</th>
              <th className="hidden px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 xl:table-cell">Cost</th>
              <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td colSpan="6" className="px-6 py-5">
                    <div className="h-16 animate-pulse rounded-2xl bg-gray-200/20" />
                  </td>
                </tr>
              ))
            ) : filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant, index) => {
                const cityName = typeof restaurant.city === "object" ? restaurant.city?.name : restaurant.city;

                return (
                  <motion.tr
                    key={restaurant._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="group cursor-pointer border-b border-gray-200 transition-all duration-300 hover:bg-yellow-50 hover:shadow-sm"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={restaurant.images?.[0] || "/no-image.jpg"}
                          alt={restaurant.name}
                          className="h-14 w-14 rounded-2xl border border-gray-200 object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 transition group-hover:text-yellow-600">{restaurant.name}</h3>
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">{restaurant.address}</p>
                        </div>
                      </div>
                    </td>

                    <td className="hidden px-6 py-5 text-sm text-gray-700 md:table-cell">{cityName}</td>
                    <td className="hidden px-6 py-5 text-sm text-gray-700 lg:table-cell">{restaurant.foodType}</td>

                    <td className="px-6 py-5">
                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                        {restaurant.status}
                      </span>
                    </td>

                    <td className="hidden px-6 py-5 text-sm text-gray-700 xl:table-cell">₹{restaurant.avgCostForOne}</td>

                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInactive(restaurant._id);
                        }}
                        className="mr-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-200 hover:shadow-sm"
                      >
                        Inactive
                      </button>
                      <FaChevronRight className="inline text-gray-400 transition group-hover:text-yellow-600" />
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                  No active restaurants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Side Drawer */}
  <AnimatePresence>
    {selectedRestaurant && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedRestaurant(null)}
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 240 }}
          className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto border-l border-gray-200 bg-white shadow-2xl sm:w-120 lg:w-155"
        >
          {/* FULL SIDEBAR CONTENT */}
          <div className="relative">
            <img
              src={selectedRestaurant.images?.[0] || "/no-image.jpg"}
              alt={selectedRestaurant.name}
              className="h-64 w-full object-cover rounded-b-3xl"
            />

            <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent rounded-b-3xl" />

            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition hover:bg-red-500 hover:text-white"
            >
              <FaTimes />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="mb-3 inline-flex rounded-full border border-green-500/30 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {selectedRestaurant.status}
              </span>

              <h2 className="text-3xl font-bold text-gray-900">{selectedRestaurant.name}</h2>

              <div className="mt-2 flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-yellow-500" />
                <span>
                  {typeof selectedRestaurant.city === "object"
                    ? selectedRestaurant.city?.name
                    : selectedRestaurant.city}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Food Type</p>
                <p className="mt-2 text-lg font-bold text-gray-900">{selectedRestaurant.foodType}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-yellow-50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-700">Cost For One</p>
                <p className="mt-2 text-lg font-bold text-yellow-700">₹{selectedRestaurant.avgCostForOne}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Address</h3>
              <p className="leading-7 text-gray-600">{selectedRestaurant.address}</p>
              <a
                href={`https://maps.google.com?q=${selectedRestaurant.location?.coordinates?.[1]},${selectedRestaurant.location?.coordinates?.[0]}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm text-yellow-500 transition hover:text-yellow-600"
              >
                View on Google Maps →
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Famous Food</p>
                  <p className="mt-1 text-gray-900">{selectedRestaurant.famousFood}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Best Time</p>
                  <p className="mt-1 text-gray-900">{selectedRestaurant.bestTime}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Opening Time</p>
                  <p className="mt-1 text-gray-900">{selectedRestaurant.openingHours?.open}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Closing Time</p>
                  <p className="mt-1 text-gray-900">{selectedRestaurant.openingHours?.close}</p>
                </div>
              </div>
            </div>

            {selectedRestaurant.images?.length > 1 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRestaurant.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="restaurant"
                      className="h-32 w-full rounded-2xl border border-gray-200 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => handleInactive(selectedRestaurant._id)}
              className="w-full rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 shadow-md"
            >
              Inactive Restaurant
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
  );
}

export default GetAllActiveRestaurantCityWise;