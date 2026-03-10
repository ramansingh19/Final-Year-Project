import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import AdminRegisterForm from "../admin/AdminRegisterForm";


function SuperAdminDashboard() {
  const { superAdmin } = useSelector((state) => state.superAdmin);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const getInitials = (name) => {
    if (!name) return "SA";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
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
            <button
              onClick={() => setShowAdminForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition"
            >
              + Register Admin
            </button>
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
              <AdminRegisterForm closeForm={() => setShowAdminForm(false)} />
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
            0
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm">Total Admins</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
            0
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm">Active Sessions</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
            0
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm">System Status</h3>
          <p className="text-lg font-semibold text-green-500 mt-2">Running</p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
