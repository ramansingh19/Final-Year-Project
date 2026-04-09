import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFood,
  getFoodByRestaurantId,
  toggleFoodAvailability,
} from "../../../features/user/foodSlice";
import { Link, useParams } from "react-router-dom";

function GetAllFood() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { foods = [], loading } = useSelector((state) => state.food);

  const [selectedFood, setSelectedFood] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch foods
  useEffect(() => {
    if (id) dispatch(getFoodByRestaurantId(id));
  }, [dispatch, id]);

  // Extract unique categories from foods
  const categories = ["All", ...new Set(foods.map((f) => f.category))];

  // Filter foods based on search and category
  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      activeCategory === "All" ? true : food.category === activeCategory;
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-900 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-72 w-72 bg-orange-200/40 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 h-80 w-80 bg-blue-200/40 blur-3xl rounded-full animate-pulse" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl p-6 md:p-8 shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 transition-transform duration-500 hover:scale-[1.02]">
          <div>
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-[0.35em] mb-2">
              Restaurant Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Food Items Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base max-w-2xl">
              View, manage and update all food items of this restaurant.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl border border-orange-300 bg-orange-100/40 px-5 py-4 min-w-35 animate-pulse">
              <p className="text-xs uppercase tracking-widest text-orange-500 mb-1">
                Total Items
              </p>
              <h2 className="text-3xl font-bold text-gray-900">{foods.length}</h2>
            </div>

            <div className="rounded-2xl border border-emerald-300 bg-emerald-100/40 px-5 py-4 min-w-35 animate-pulse">
              <p className="text-xs uppercase tracking-widest text-emerald-500 mb-1">
                Available
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {foods.filter((f) => f.isAvailable).length}
              </h2>
            </div>
          </div>
        </div>

        {/* Search & Category Filters */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 border border-gray-300 bg-white px-4 py-2 rounded-2xl shadow-sm focus:ring-1 focus:ring-orange-300 transition-all duration-300"
          />

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-2xl border font-medium text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-orange-400 text-white border-orange-400 shadow-md"
                    : "bg-white/70 text-gray-900 border-gray-300 hover:bg-orange-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-gray-200 bg-white/50 p-6 animate-pulse overflow-hidden">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-white/30 border border-white/20"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredFoods.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/50 py-20 text-center backdrop-blur-lg">
            <div className="text-6xl mb-4 animate-bounce">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Food Items Found
            </h2>
            <p className="text-gray-600">
              Try adding food items or changing the filters/search.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredFoods.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white/50 shadow-sm">
            <table className="w-full min-w-212.5">
              <thead className="bg-white/50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Food</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredFoods.map((food) => (
                  <tr
                    key={food._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedFood(food)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4 min-w-55">
                        <img
                          src={food.images?.[0] || "/no-image.jpg"}
                          alt={food.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-gray-200"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize text-sm md:text-base">
                            {food.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-45">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700 text-sm">{food.category}</td>

                    <td className="px-4 py-3">
                      <span className="rounded-xl bg-orange-100 border border-orange-200 px-3 py-1 text-orange-500 font-semibold text-sm">
                        ₹{food.price}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold border ${
                          food.isVeg
                            ? "bg-emerald-100 text-emerald-500 border-emerald-200"
                            : "bg-red-100 text-red-500 border-red-200"
                        }`}
                      >
                        {food.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold border ${
                          food.isAvailable
                            ? "bg-blue-100 text-blue-500 border-blue-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-all duration-300">
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Sidebar & Overlay */}
      {selectedFood && (
        <>
          <div
            className="fixed inset-0 z-40 bg-gray-900/10 backdrop-blur-sm"
            onClick={() => setSelectedFood(null)}
          />
          <div
            className={`fixed top-0 right-0 z-50 h-full w-full sm:w-105 md:w-120 transform border-l border-gray-200 bg-white/90 backdrop-blur-3xl shadow-[-20px_0_60px_rgba(0,0,0,0.15)] transition-transform duration-500 translate-x-0`}
          >
            <div className="flex h-full flex-col overflow-y-auto">

              {/* Sidebar Header */}
              <div className="sticky top-0 z-10 border-b border-gray-300 bg-white/90 backdrop-blur-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-1">
                    Food Details
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {selectedFood.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="h-11 w-11 rounded-2xl border border-gray-300 bg-white/50 text-gray-600 hover:text-red-500 hover:border-red-300 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Main Image */}
              <div className="p-5">
                <img
                  src={selectedFood.images?.[0] || "/no-image.jpg"}
                  alt={selectedFood.name}
                  className="h-64 w-full rounded-3xl object-cover border border-gray-200"
                />
              </div>

              {/* Gallery */}
              <div className="px-5 grid grid-cols-3 gap-3">
                {selectedFood.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="food"
                    className="h-24 w-full rounded-2xl object-cover border border-gray-200 hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Category
                    </p>
                    <p className="font-semibold text-gray-900">{selectedFood.category}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Price
                    </p>
                    <p className="font-semibold text-orange-500">₹{selectedFood.price}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Food Type
                    </p>
                    <p className={`${selectedFood.isVeg ? "text-emerald-500" : "text-red-500"} font-semibold`}>
                      {selectedFood.isVeg ? "Veg" : "Non-Veg"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Availability
                    </p>
                    <p className={`${selectedFood.isAvailable ? "text-blue-500" : "text-gray-500"} font-semibold`}>
                      {selectedFood.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white/70 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-sm leading-7 text-gray-600">
                    {selectedFood.description || "No description available."}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-auto sticky bottom-0 border-t border-gray-300 bg-white/90 p-5 backdrop-blur-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    to={`/admin/update-food/${selectedFood._id}`}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700"
                  >
                    Update Food Items
                  </Link>

                  <button
                    onClick={() => dispatch(toggleFoodAvailability(selectedFood._id))}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      selectedFood.isAvailable
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {selectedFood.isAvailable ? "Make Unavailable" : "Make Available"}
                  </button>

                  <button
                    onClick={() => dispatch(deleteFood(selectedFood._id))}
                    className="rounded-2xl bg-red-500/15 border border-red-300 px-4 py-3 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default GetAllFood;
