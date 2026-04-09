import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCompass, FaArrowRight, FaCheckCircle, FaTimesCircle, FaClock, FaBan } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { motion } from "framer-motion";

function PlaceDashboard({ loading }) {
  const { superAdmin } = useSelector((state) => state.superAdmin);

  const cards = [
    {
      title: "Place Approval List",
      icon: <FaClock />,
      color: "from-amber-500 to-yellow-500",
      link: "/superAdmin/SuperAdminApprovealPlaceList",
      glow: "hover:shadow-amber-500/20",
    },
    {
      title: "Show All Places",
      icon: <MdPlace />,
      color: "from-orange-500 to-red-500",
      link: "/superAdmin/get-placeCityWise",
      glow: "hover:shadow-orange-500/20",
    },
    {
      title: "Show All Active Places",
      icon: <FaCheckCircle />,
      color: "from-emerald-500 to-green-600",
      link: "/superAdmin/get-all-active-placeCityWise",
      glow: "hover:shadow-emerald-500/20",
    },
    {
      title: "Show All Inactive Places",
      icon: <FaTimesCircle />,
      color: "from-gray-500 to-zinc-600",
      link: "/superAdmin/get-inactive-pLaceCityWise",
      glow: "hover:shadow-gray-500/20",
    },
  ];

  return (
<div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-6 md:px-8 overflow-hidden relative text-gray-900">
  {/* Background Glow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
    <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
  </div>

  {/* Interactive Header */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg"
  >
    {/* Glow Circles */}
    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl" />
    <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />

    <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Side */}
      <div className="flex items-start gap-5">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-400 text-3xl shadow-md shadow-cyan-300/20"
        >
          <FaCompass />
        </motion.div>

        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/50 bg-cyan-100/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-700">
            Place Management Panel
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Welcome Back,
            <span className="ml-2 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {superAdmin?.userName}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            Manage place approvals, monitor active and inactive places, and review rejected listings from one premium dashboard experience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-md animate-fadeIn">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total Sections</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{cards.length}</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-cyan-100/20 px-4 py-3 backdrop-blur-md animate-fadeIn delay-100">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Dashboard Status</p>
              <p className="mt-1 text-xl font-bold text-cyan-800">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side CTA */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-stretch gap-4 rounded-3xl border border-gray-200 bg-white/50 p-5 backdrop-blur-xl lg:min-w-70"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Quick Action</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">Manage Places</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Open place sections and manage all listings instantly from one premium panel.
          </p>
        </div>

        <Link
          to="/superAdmin/add-place-details"
          className="group mt-2 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-blue-400 px-5 py-3 font-semibold text-white shadow-md shadow-cyan-300/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/50"
        >
          Create Places
          <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  </motion.div>

  {/* Cards */}
  {loading ? (
    <div className="flex min-h-75 items-center justify-center">
      <div className="h-14 w-14 rounded-full border-4 border-gray-300 border-t-cyan-400 animate-spin" />
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.45 }}
        >
          <Link
            to={card.link}
            className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-gray-300 hover:shadow-lg ${card.glow}`}
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 transition duration-500 group-hover:opacity-10`}
            />

            <div
              className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${card.color} text-2xl text-white shadow-md`}
            >
              {card.icon}
            </div>

            <h3 className="relative text-lg font-semibold text-gray-900 transition group-hover:text-cyan-600">
              {card.title}
            </h3>

            <p className="relative mt-2 text-sm leading-6 text-gray-600">
              Open and manage this section from your place administration dashboard.
            </p>

            <div className="relative mt-6 flex items-center gap-2 text-sm font-medium text-cyan-600 opacity-80 transition-all group-hover:gap-3 group-hover:opacity-100">
              Open Section
              <FaArrowRight className="text-xs" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )}
</div>
  );
}

export default PlaceDashboard;