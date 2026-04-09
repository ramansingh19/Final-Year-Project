import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaUserSecret,
  FaCity,
  FaClipboardList,
  FaArrowRight,
  FaPlus,
  FaBed,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const { admin } = useSelector((state) => state.admin);

  const getInitials = (name) => {
    if (!name) return "SA";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const cards = [
    {
      title: "All Hotels",
      description:
        "View, manage and update all listed hotels from one modern dashboard.",
      icon: <FaCity />,
      link: "/admin/hotel-dashboard",
      accent: "from-[#f3d8c2] to-[#e7c1a0]",
      iconBg: "from-[#c08457] to-[#d6a67a]",
    },
    {
      title: "Hotel Status",
      description:
        "Track approval status, availability and hotel activity in real time.",
      icon: <FaClipboardList />,
      link: "/admin/show-hotel-status",
      accent: "from-[#dce9f5] to-[#c7dbef]",
      iconBg: "from-[#7ca7cf] to-[#5d8db9]",
    },
    {
      title: "Bookings Dashboard",
      description:
        "Monitor and manage all hotel bookings with quick actions.",
      icon: <FaBed />,
      link: "/admin/hotel-booking-dashboard",
      accent: "from-[#efe4d7] to-[#e3cfba]",
      iconBg: "from-[#ba8d64] to-[#c9a37e]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-['Inter']">
      {/* Background same as ecommerce landing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-105 w-105 rounded-full bg-[#e8d8c8] blur-[130px] opacity-45" />
        <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-[#d9e6f2] blur-[120px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5ede5] blur-[180px] opacity-80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-4xl border border-[#ebe2d8] bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
        >
          {/* top gradient strip */}
          <div className="h-2 w-full bg-linear-to-r from-[#c08457] via-[#d6a67a] to-[#8db4d9]" />

          {/* floating glow */}
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#d9e6f2] blur-3xl opacity-50" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#e8d8c8] blur-3xl opacity-50" />

          <div className="relative px-5 sm:px-8 lg:px-10 py-7 md:py-10">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              {/* Left Content */}
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="relative mx-auto md:mx-0"
                >
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-[28px] bg-linear-to-br from-[#c08457] via-[#d6a67a] to-[#8db4d9] p-0.75 shadow-[0_18px_40px_rgba(192,132,87,0.25)]">
                    <div className="h-full w-full rounded-[26px] bg-white flex items-center justify-center overflow-hidden">
                      {admin?.avatar ? (
                        <img
                          src={admin.avatar}
                          alt={admin?.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl font-black text-[#1f2937]">
                          {getInitials(admin?.userName)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute -bottom-2 -right-2 rounded-full border border-white bg-[#dcfce7] px-3 py-1 text-[11px] font-semibold text-[#166534] shadow-md">
                    Online
                  </div>
                </motion.div>

                {/* Text Content */}
                <div className="text-center md:text-left">
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-[#b08968] font-semibold">
                    Hotel Admin Dashboard
                  </p>

                  <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-[#1f2937]">
                    Welcome back,{" "}
                    <span className="bg-linear-to-r from-[#c08457] via-[#d6a67a] to-[#8db4d9] bg-clip-text text-transparent">
                      {admin?.userName?.split(" ")[0] || "Admin"}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-[#6b7280]">
                    Manage hotels, rooms and bookings from your premium admin
                    panel with a smooth and modern experience.
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-[#ebe2d8] bg-[#faf7f3] px-4 py-2 text-sm text-[#5b6470] shadow-sm">
                      <FaUserSecret className="text-[#c08457]" />
                      <span>Host:</span>
                      <span className="font-semibold text-[#1f2937]">
                        {admin?.host || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-[#ebe2d8] bg-[#f3f8fc] px-4 py-2 text-sm text-[#5b6470] shadow-sm">
                      <FaClipboardList className="text-[#7ca7cf]" />
                      <span>Administrator Access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex flex-col sm:flex-row xl:flex-col gap-4 w-full xl:w-auto">
                <Link
                  to="/admin/create-hotel"
                  className="group w-full sm:w-auto xl:w-57.5"
                >
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between rounded-2xl bg-linear-to-r from-[#c08457] to-[#d6a67a] px-6 py-4 text-white shadow-[0_18px_35px_rgba(192,132,87,0.35)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FaPlus />
                      <span className="font-semibold">Add Hotel</span>
                    </div>

                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.div>
                </Link>

                <Link
                  to="/admin/create-room"
                  className="group w-full sm:w-auto xl:w-57.5"
                >
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between rounded-2xl border border-[#ebe2d8] bg-white/90 px-6 py-4 text-[#1f2937] shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all hover:bg-[#faf7f3]"
                  >
                    <div className="flex items-center gap-3">
                      <FaBed className="text-[#7ca7cf]" />
                      <span className="font-semibold">Add Room</span>
                    </div>

                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 mb-7"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-[#1f2937]">
            Dashboard Modules
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6b7280]">
            Quickly access every section of your hotel management system.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link key={index} to={card.link} className="group">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-[30px] border border-[#ebe2d8] bg-white/80 backdrop-blur-2xl p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
              >
                {/* soft card background */}
                <div
                  className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br ${card.accent} blur-3xl opacity-70`}
                />

                <div className="relative z-10">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${card.iconBg} text-2xl text-white shadow-lg`}
                  >
                    {card.icon}
                  </div>

                  <h3 className="text-xl font-bold text-[#1f2937]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6b7280]">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#c08457] transition-all duration-300 group-hover:gap-3">
                    Open Module
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* hover border glow */}
                <div className="absolute inset-0 rounded-[30px] border border-transparent group-hover:border-[#d8c4b3] transition-all duration-300" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;