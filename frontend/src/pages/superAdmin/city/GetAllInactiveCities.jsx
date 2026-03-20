import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveCityById,
  deleteCity,
  getAllInactiveCities,
} from "../../../features/user/citySlice";
import { Link } from "react-router-dom";
import { FaCity } from "react-icons/fa";

function GetAllInactiveCities() {
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState(null);
  const { cities = [], loading } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getAllInactiveCities());
  }, [dispatch]);

  const handelActiveButtton = (cityId) => {
    dispatch(approveCityById(cityId));
  };

  const handelDeleteCityButton = (cityId) => {
    dispatch(deleteCity(cityId));
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-white rounded-xl shadow-md">
            <FaCity size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Inactive Cities
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              Manage all inactive cities on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="loader border-t-white border-blue-500 animate-spin rounded-full w-12 h-12 mb-4"></span>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Loading inactive cities...
          </p>
        </div>
      )}

      {/* No Cities */}
      {!loading && cities?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
          <svg
            className="w-16 h-16 text-gray-300 dark:text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2a4 4 0 00-4-4H5m6 6h6a4 4 0 004-4v-2m-6 6V9m0 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4h4z"
            ></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No inactive cities found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
            Looks like all your cities are active. You can add new cities or
            change status from the dashboard.
          </p>
        </div>
      )}

      {/* City Grid */}
      {!loading && cities?.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={city.images?.[0]}
                  alt={city.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                />

                {/* Inactive Badge */}
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Inactive
                </span>

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                {/* City Name */}
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-lg font-semibold capitalize">
                    {city.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    {city.state}, {city.country}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                  {city.description}
                </p>

                <div className="mt-3 flex justify-between items-start gap-3">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    ₹{city.avgDailyBudget}/day
                  </span>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handelActiveButtton(city._id)}
                      disabled={loading}
                      className="flex items-center justify-center text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="loader border-t-white border-blue-500 animate-spin rounded-full w-4 h-4 mr-2"></span>
                          Restoring...
                        </>
                      ) : (
                        "Activate"
                      )}
                    </button>

                    <button
                      onClick={() => handelDeleteCityButton(city._id)}
                      disabled={loading}
                      className="flex items-center justify-center text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="loader border-t-white border-blue-500 animate-spin rounded-full w-4 h-4 mr-2"></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetAllInactiveCities;
