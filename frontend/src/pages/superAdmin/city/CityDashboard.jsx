import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCity } from "react-icons/fa";
// import { getCityById } from "../../../features/user/citySlice";


function CityDashboard() {
  const dispatch = useDispatch()
  const [showAdminForm, setShowAdminForm] = useState(false); 
  const { superAdmin } = useSelector((state) => state.superAdmin);
  const { city } = useSelector((state) => state.city)



  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-all">
      {/* Header Card */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8 transition-all border border-gray-200 dark:border-gray-700">
        {/* Left Side */}
        <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl shadow-md">
          <FaCity />
        </div>
          {/* Info */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Welcome to City Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Hi <span className="font-medium">{superAdmin?.userName}</span>, manage your platform from here.
            </p>
          </div>
        </div>
  
        {/* Right Side Button */}
        <div className="flex flex-col gap-2">
          <Link
            to="/superAdmin/createCity"
            className="text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition text-[15px] hover:scale-105"
          >
            + Create City
          </Link>
        </div>
      </div>
  
      {/* City Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Link
          to="/superAdmin/SuperAdminApprovealCityList"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
        >
          <span className="text-3xl mb-2 bg-amber-400 p-2 rounded-sm text-white">
            <FaCity />
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-100">
            City Approval List
          </span>
        </Link>
  
        <Link
          to="/superAdmin/get-all-cities"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
        >
          <span className="text-3xl mb-2 bg-blue-400 p-2 rounded-sm text-white">
            <FaCity />
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-100">
            Show All Cities
          </span>
        </Link>
  
        <Link
          to="/superAdmin/get-all-active-cities"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
        >
          <span className="text-3xl mb-2 bg-green-400 p-2 rounded-sm text-white">
            <FaCity />
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-100">
            Show All Active Cities
          </span>
        </Link>
  
        <Link
          to="/superAdmin/get-all-inactive-cities"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
        >
          <span className="text-3xl mb-2 bg-orange-700 p-2 rounded-sm text-white">
            <FaCity />
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-100">
            Show All Inactive Cities
          </span>
        </Link>
      </div>
    </div>
  );
}

export default CityDashboard;
