import React from "react";
import { Link } from "react-router-dom";

function OrdersDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Overview of your platform performance
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition">
          + Add Food
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">120</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold text-green-500">₹45,000</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <h2 className="text-2xl font-bold text-yellow-500">12</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Users</p>
          <h2 className="text-2xl font-bold text-blue-500">85</h2>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Orders
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                #1234 - Shivam
              </p>
              <p className="text-sm text-gray-500">₹350</p>
            </div>
            <span className="text-yellow-500 text-sm">Pending</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                #1235 - Aman
              </p>
              <p className="text-sm text-gray-500">₹500</p>
            </div>
            <span className="text-green-500 text-sm">Delivered</span>
          </div>

        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Link to={"/admin/manage-orders"} className="bg-blue-600 text-white p-4 rounded-xl shadow hover:scale-105 transition">
          Manage Orders
        </Link>

        <button className="bg-green-600 text-white p-4 rounded-xl shadow hover:scale-105 transition">
          Add Food Item
        </button>

        <button className="bg-purple-600 text-white p-4 rounded-xl shadow hover:scale-105 transition">
          View Users
        </button>

      </div>

    </div>
  );
}

export default OrdersDashboard;