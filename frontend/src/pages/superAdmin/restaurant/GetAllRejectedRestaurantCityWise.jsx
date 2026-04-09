import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRestaurant,
  getAllRejectedRestaurantCityWise,
} from "../../../features/user/restaurantSlice";
import { getActiveCities } from "../../../features/user/citySlice";
import {
  FaUtensils,
  FaSearch,
  FaTrash,
  FaChevronRight,
  FaTimes,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";

function GetAllRejectedRestaurantCityWise() {
  const dispatch = useDispatch();

  const { restaurants = [], loading } = useSelector(
    (state) => state.restaurant
  );
  const { cities = [] } = useSelector((state) => state.city);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    dispatch(getActiveCities());
    dispatch(getAllRejectedRestaurantCityWise({ city: "", page: 1 }));
  }, [dispatch]);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteRestaurant(id));
  };

  const cityFilters = useMemo(() => {
    const cityNames = [
      ...new Set(
        restaurants
          .map((restaurant) => {
            if (restaurant.city?.name) return restaurant.city.name;
            if (typeof restaurant.city === "string") return restaurant.city;
            return null;
          })
          .filter(Boolean)
      ),
    ];

    return ["All", ...cityNames];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const cityName =
        restaurant.city?.name ||
        (typeof restaurant.city === "string" ? restaurant.city : "");

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        restaurant.name?.toLowerCase().includes(search) ||
        restaurant.address?.toLowerCase().includes(search) ||
        cityName?.toLowerCase().includes(search) ||
        restaurant.foodType?.toLowerCase().includes(search);

      const matchesCity =
        selectedCity === "All" || cityName === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [restaurants, searchTerm, selectedCity]);

  return (
<div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 text-gray-900">
  <div className="mx-auto max-w-7xl space-y-6">
    {/* HEADER */}
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-200 bg-orange-100 animate-pulse">
              <FaUtensils className="text-2xl text-orange-500" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Rejected Restaurants Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage rejected restaurants with search, filters, and quick actions.
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 transition hover:border-orange-300">
              <p className="text-xs uppercase tracking-widest text-gray-400">Total Restaurants</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">{restaurants.length}</h3>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-orange-400">Showing</p>
              <h3 className="mt-2 text-3xl font-bold text-orange-500">{filteredRestaurants.length}</h3>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 transition hover:border-orange-300">
              <p className="text-xs uppercase tracking-widest text-gray-400">Cities</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">{cityFilters.length - 1}</h3>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="w-full xl:max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurant, food type, address..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>
      </div>
    </div>

    {/* CITY FILTERS */}
    <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white p-4">
      <div className="flex min-w-max gap-3">
        {cityFilters.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setSelectedCity(city)}
            className={`flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCity === city
                ? "border-orange-500 bg-orange-200 text-orange-700 shadow-md"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            <FaCity className="text-xs" />
            {city}
          </button>
        ))}
      </div>
    </div>

    {/* TABLE */}
    {loading ? (
      <div className="flex min-h-100 items-center justify-center rounded-3xl border border-gray-200 bg-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />
      </div>
    ) : filteredRestaurants.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
        <FaUtensils className="mx-auto mb-4 text-5xl text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">No rejected restaurants found</h2>
        <p className="mt-2 text-gray-500">Try changing the search text or selected city.</p>
      </div>
    ) : (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Restaurant</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">City</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Food Type</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Address</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map((restaurant, index) => {
                const cityName = restaurant.city?.name || (typeof restaurant.city === "string" ? restaurant.city : "N/A");
                return (
                  <tr
                    key={restaurant._id}
                    className={`border-b border-gray-200 transition-all duration-300 hover:bg-orange-50/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } animate-fadeInUp`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={restaurant.images?.[0] || "https://via.placeholder.com/80"}
                          alt={restaurant.name}
                          className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                        />
                        <div>
                          <h3 className="text-base font-semibold capitalize text-gray-900">{restaurant.name}</h3>
                          <p className="mt-1 text-xs text-gray-500">₹{restaurant.avgCostForOne || 0} / person</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700">{cityName}</td>
                    <td className="px-6 py-5 text-gray-700">{restaurant.foodType || "N/A"}</td>
                    <td className="max-w-60 px-6 py-5 text-gray-700 truncate">{restaurant.address || "N/A"}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-medium text-red-500">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        Rejected
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, restaurant._id)}
                          className="inline-flex items-center rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRestaurant(restaurant)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* SIDE PANEL */}
    {selectedRestaurant && (
      <div className="fixed inset-0 z-50 flex justify-end bg-white/80 backdrop-blur-sm">
        <div className="h-full w-full max-w-xl overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-lg animate-[slideIn_.35s_ease]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Restaurant Details</h2>
            <button
              type="button"
              onClick={() => setSelectedRestaurant(null)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
            >
              <FaTimes />
            </button>
          </div>

          <img
            src={selectedRestaurant.images?.[0] || "https://via.placeholder.com/600x300"}
            alt={selectedRestaurant.name}
            className="mb-5 h-60 w-full rounded-2xl object-cover border border-gray-200"
          />

          <h3 className="text-3xl font-bold capitalize text-gray-900">{selectedRestaurant.name}</h3>

          <div className="mt-3 flex items-center gap-2 text-gray-500">
            <FaMapMarkerAlt className="text-orange-500" />
            <span>
              {selectedRestaurant.city?.name || "N/A"}, {selectedRestaurant.address}
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Food Type</p>
              <h4 className="mt-2 text-xl font-semibold text-gray-900">{selectedRestaurant.foodType || "N/A"}</h4>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Famous Food</p>
              <h4 className="mt-2 text-xl font-semibold text-gray-900">{selectedRestaurant.famousFood || "N/A"}</h4>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Average Cost</p>
                <h4 className="mt-2 text-xl font-semibold text-orange-500">₹{selectedRestaurant.avgCostForOne || 0}</h4>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-100 p-4">
                <p className="text-sm text-red-400">Status</p>
                <h4 className="mt-2 text-xl font-bold text-red-500">Rejected</h4>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Best Time</p>
              <h4 className="mt-2 text-lg text-gray-900">{selectedRestaurant.bestTime || "N/A"}</h4>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Opening Hours</p>
              <h4 className="mt-2 text-lg text-gray-900">
                {selectedRestaurant.openingHours?.open || "--"} - {selectedRestaurant.openingHours?.close || "--"}
              </h4>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Address</p>
              <h4 className="mt-2 text-gray-900">{selectedRestaurant.address || "N/A"}</h4>
            </div>

            {selectedRestaurant.location?.coordinates && (
              <a
                href={`https://maps.google.com?q=${selectedRestaurant.location.coordinates[1]},${selectedRestaurant.location.coordinates[0]}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 font-medium text-orange-500 transition hover:bg-orange-500 hover:text-white"
              >
                <FaMapMarkerAlt className="mr-2" />
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    )}
  </div>

  <style>{`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0%); opacity: 1; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.35s ease forwards;
    }
  `}</style>
</div>
  );
}

export default GetAllRejectedRestaurantCityWise;