import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import AddCityDetails from "./AddCityDetails";

function CityDashboard() {
  const [showAdminForm, setShowAdminForm] = useState(false); 
  const { superAdmin } = useSelector((state) => state.superAdmin);

  const getInitials = (name) => {
    if (!name) return "SA";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div>
      {/* Welcome Card */}
      <div>
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Left Side */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {superAdmin?.avatar ? (
                <img
                  src={superAdmin.avatar}
                  alt={superAdmin.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(superAdmin?.userName)
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Welcome Back 👋
              </h1>

              <p className="text-gray-600 dark:text-gray-300">
                Hi <span className="font-medium">{superAdmin?.userName}</span>,
                manage your platform from here.
              </p>
            </div>
          </div>

          {/* Right Side Button */}
          <div>
            <Link to="/superAdmin/createCity" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition">+ Create City</Link>
          </div>
        </div>

        {/* Admin Register Modal */}
        {showAdminForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] relative ">
              {/* Close Button */}
              <button
                onClick={() => setShowAdminForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
              >
                ✕
              </button>

              {/* Form Component */}
              {/* <AdminRegisterForm closeForm={() => setShowAdminForm(false)} /> */}
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CityDashboard;
