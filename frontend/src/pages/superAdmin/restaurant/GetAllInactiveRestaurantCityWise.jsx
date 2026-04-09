import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveRestaurantById,
  deleteRestaurant,
  getInactiveRestaurantCityWise,
} from "../../../features/user/restaurantSlice";
import { getActiveCities } from "../../../features/user/citySlice";
import {
  FaUtensils,
  FaSearch,
  FaCheckCircle,
  FaTrash,
  FaChevronRight,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

function GetAllInactiveRestaurantCityWise() {
  const dispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { restaurants = [], loading } = useSelector(
    (state) => state.restaurant
  );

  const { cities = [] } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getActiveCities());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getInactiveRestaurantCityWise({
        city: selectedCity,
        page: 1,
      })
    );
  }, [dispatch, selectedCity]);

  const handleApprove = (id) => {
    dispatch(approveRestaurantById(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteRestaurant(id));
  };

  const cityFilters = useMemo(() => {
    const uniqueCities = [
      ...new Set(
        restaurants
          .map((restaurant) => restaurant.city?.name)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCities];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        restaurant.name?.toLowerCase().includes(search) ||
        restaurant.address?.toLowerCase().includes(search) ||
        restaurant.city?.name?.toLowerCase().includes(search) ||
        restaurant.foodType?.toLowerCase().includes(search);

      const matchesCity =
        selectedCity === "" ||
        selectedCity === "All" ||
        restaurant.city?._id === selectedCity ||
        restaurant.city?.name === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [restaurants, searchTerm, selectedCity]);

  return (
<div className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl space-y-6">
    {/* HEADER */}
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,224,71,0.15),transparent_40%)]" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-300/30 bg-yellow-100 text-yellow-700 shadow-lg shadow-yellow-200 animate-pulse">
            <FaUtensils className="text-3xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Inactive Restaurants Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Search, filter and manage inactive restaurants from all cities.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-full border border-yellow-300/20 bg-yellow-50 px-4 py-2 text-sm text-yellow-700">
                {restaurants.length} Total Restaurants
              </div>

              <div className="rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm text-gray-700">
                {filteredRestaurants.length} Showing
              </div>
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
              placeholder="Search restaurant, city, address..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200/50"
            />
          </div>
        </div>
      </div>
    </div>

    {/* FILTER BUTTONS */}
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setSelectedCity("")}
        className={`rounded-2xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
          selectedCity === ""
            ? "border-yellow-500 bg-yellow-500 text-gray-900 shadow-md"
            : "border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:text-gray-900"
        }`}
      >
        All
      </button>

      {cities.map((city) => (
        <button
          key={city._id}
          onClick={() => setSelectedCity(city._id)}
          className={`rounded-2xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
            selectedCity === city._id
              ? "border-yellow-500 bg-yellow-500 text-gray-900 shadow-md"
              : "border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:text-gray-900"
          }`}
        >
          {city.name}
        </button>
      ))}
    </div>

    {/* TABLE */}
    {loading ? (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-gray-200 bg-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-500" />
      </div>
    ) : filteredRestaurants.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
        <FaUtensils className="mx-auto mb-4 text-5xl text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">
          No inactive restaurants found
        </h2>
        <p className="mt-2 text-gray-500">
          Try changing the city filter or search text.
        </p>
      </div>
    ) : (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
        <div className="max-h-162.5 overflow-y-auto overflow-x-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Restaurant</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">City</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Food Type</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Cost</th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRestaurants.map((restaurant, index) => (
                <tr
                  key={restaurant._id}
                  className="border-b border-gray-100 transition-all duration-300 hover:bg-yellow-50"
                  style={{
                    animation: `fadeInUp 0.3s ease ${index * 0.05}s both`,
                  }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={restaurant.images?.[0] || "https://via.placeholder.com/80"}
                        alt={restaurant.name}
                        className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                      />

                      <div>
                        <h3 className="font-semibold capitalize text-gray-900">{restaurant.name}</h3>
                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">{restaurant.address}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">{restaurant.city?.name || "N/A"}</td>
                  <td className="px-6 py-5 text-sm text-gray-700">{restaurant.foodType || "N/A"}</td>
                  <td className="px-6 py-5 text-sm text-gray-700">₹{restaurant.avgCostForOne || 0}</td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      <span className="h-2 w-2 rounded-full animate-pulse bg-red-600" />
                      Inactive
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(restaurant._id);
                        }}
                        className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500"
                      >
                        <FaCheckCircle className="mr-2" />
                        Active
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(restaurant._id);
                        }}
                        className="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>

                      <button
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:border-yellow-300 hover:bg-yellow-50"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* SIDE DRAWER */}
    {selectedRestaurant && (
      <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={() => setSelectedRestaurant(null)} />

        <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-gray-200 bg-white shadow-lg animate-[slideIn_.35s_ease]">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-5 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold capitalize text-gray-900">
                  {selectedRestaurant.name}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-gray-500">
                  <FaMapMarkerAlt className="text-yellow-500" />
                  <span>{selectedRestaurant.city?.name}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRestaurant(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* IMAGES */}
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedRestaurant.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={selectedRestaurant.name}
                  className="h-48 w-full rounded-3xl border border-gray-200 object-cover transition duration-300 hover:scale-[1.02]"
                />
              ))}
            </div>

            {/* DETAILS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Food Type</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{selectedRestaurant.foodType || "N/A"}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Famous Food</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{selectedRestaurant.famousFood || "N/A"}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Average Cost</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">₹{selectedRestaurant.avgCostForOne || 0}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Best Time</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{selectedRestaurant.bestTime || "N/A"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Address</h3>
              <p className="leading-7 text-gray-700">{selectedRestaurant.address}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Opening Hours</h3>
              <p className="text-gray-700">
                {selectedRestaurant.openingHours?.open} - {selectedRestaurant.openingHours?.close}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedRestaurant._id)}
                className="flex-1 rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
              >
                Activate Restaurant
              </button>

              <button
                onClick={() => handleDelete(selectedRestaurant._id)}
                className="flex-1 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <style>{`
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
</div>
  );
}

export default GetAllInactiveRestaurantCityWise;