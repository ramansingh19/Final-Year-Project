import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllInactiveCities } from "../../../features/user/citySlice";
import { Link } from "react-router-dom";

function GetAllInactiveCities() {
  const dispatch = useDispatch();
  const { cities = [], loading } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getAllInactiveCities());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Inactive Cities
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading inactive cities...</p>
      ) : cities.length === 0 ? (
        <p className="text-gray-400">No inactive cities found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
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
                <p className="text-sm text-gray-500 line-clamp-2">
                  {city.description}
                </p>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">
                    ₹{city.avgDailyBudget}/day
                  </span>

                  <Link
                    to={`/superAdmin/updateCityDetails/${city._id}`}
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    Update
                  </Link>
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