import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCity } from "react-icons/fa";

function HotelDashboard({ loading }) {
  const { superAdmin } = useSelector((state) => state.superAdmin);

  const cards = [
    {
      title: "Hotel Approval List",
      link: "/superAdmin/SuperAdminApprovealHotelList",
      color: "bg-amber-400",
    },
    {
      title: "Show All Hotels",
      link: "/superadmin/get-all-hotels",
      color: "bg-blue-400",
    },
    {
      title: "Show All Active Hotels",
      link: "/superAdmin/get-all-active-hotels",
      color: "bg-green-400",
    },
    {
      title: "Show All Inactive Hotels",
      link: "/superAdmin/get-all-Inactive-hotels",
      color: "bg-red-400",
    },
    {
      title: "Show All Rejected Hotels",
      link: "/superAdmin/get-all-rejected-hotels",
      color: "bg-purple-400",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-white rounded-xl shadow-md">
            <FaCity size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome to Hotel Panel
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Hi <span className="font-medium">{superAdmin?.userName}</span>, manage your platform from here.
            </p>
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="loader border-t-white border-blue-500 animate-spin rounded-full w-16 h-16 mb-4"></span>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      )}

      {/* Dashboard Cards */}
      {!loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition p-6 flex flex-col items-center justify-center gap-3 text-center"
            >
              <span
                className={`text-4xl p-2 rounded-sm text-white ${card.color} group-hover:scale-110 transform transition`}
              >
                <FaCity />
              </span>
              <span className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 transition">
                {card.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelDashboard;