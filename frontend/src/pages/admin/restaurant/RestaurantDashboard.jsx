import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCity,
  FaClipboardList,
  FaUserSecret,
  FaUtensils,
} from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function RestaurantDashboard() {
  const { admin } = useSelector((state) => state.admin);

  const getInitials = (name) => {
    if (!name) return "SA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const cards = [
    {
      title: "All Restaurants",
      description: "View, manage and update every restaurant from one place.",
      icon: <FaCity />,
      color:
        "from-fuchsia-500/20 via-pink-500/10 to-transparent border-fuchsia-500/20",
      iconBg: "from-fuchsia-500 to-pink-500",
      link: "/admin/admin-active-restaurant",
    },
    {
      title: "Restaurant Status",
      description:
        "Track approval status, availability and restaurant activity.",
      icon: <FaClipboardList />,
      color:
        "from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/20",
      iconBg: "from-cyan-500 to-blue-600",
      link: "/admin/show-restaurant-status",
    },
    {
      title: "Orders Dashboard",
      description:
        "Monitor all customer orders and manage them efficiently.",
      icon: <FaUtensils />,
      color:
        "from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/20",
      iconBg: "from-amber-500 to-orange-600",
      link: "/admin/ordersDashboard",
    },
  ];

  return (
<div className="min-h-screen bg-linear-to-br from-[#fffdfb] via-[#faf5ef] to-[#f5ebe0] py-6 text-[#2d1f16]">
  <div className="ui-container">
    {/* Top Hero */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/70 p-6 shadow-[0_25px_80px_rgba(186,140,102,0.12)] backdrop-blur-2xl md:p-10"
    >
      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#f1d8c2]/50 blur-3xl" />
      <div className="absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-[#ead0bb]/40 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_55%)]" />

      <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        {/* Left Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
            className="relative mx-auto md:mx-0"
          >
            <div className="h-24 w-24 rounded-[28px] bg-linear-to-br from-[#d8b79d] via-[#c78c64] to-[#b86c3d] p-0.75 shadow-[0_18px_45px_rgba(184,108,61,0.25)] md:h-28 md:w-28">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[26px] bg-[#fffaf7]">
                {admin?.avatar ? (
                  <img
                    src={admin.avatar}
                    alt={admin?.userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-serif text-3xl font-bold text-[#7a4c2d]">
                    {getInitials(admin?.userName)}
                  </span>
                )}
              </div>
            </div>

            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-2 -right-2 rounded-2xl border border-[#d8c2ae] bg-white/90 px-3 py-1 text-xs font-semibold text-[#4d8d5f] shadow-md backdrop-blur-xl"
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="text-center md:text-left">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a07d63]">
              Restaurant Admin Panel
            </p>

            <h1 className="font-serif text-3xl font-bold leading-tight text-[#2d1f16] sm:text-4xl lg:text-5xl">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-[#c67c4e] via-[#b86c3d] to-[#9f5b31] bg-clip-text text-transparent">
                {admin?.userName?.split(" ")[0] || "Admin"}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f5a4b] sm:text-base">
              Manage restaurants, monitor orders and handle your platform from
              a clean, elegant and modern dashboard.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#eadccf] bg-white/80 px-4 py-2 text-sm text-[#6f5a4b] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <FaUserSecret className="text-[#c67c4e]" />
                Host:
                <span className="font-semibold text-[#2d1f16]">
                  {admin?.host || "N/A"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#eadccf] bg-white/80 px-4 py-2 text-sm text-[#6f5a4b] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <MdRestaurantMenu className="text-[#b86c3d]" />
                Restaurant Management
              </div>
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex w-full flex-col gap-4 sm:flex-row xl:w-auto xl:flex-col">
          <Link
            to="/admin/add-restaurant"
            className="group min-w-60 rounded-3xl bg-linear-to-r from-[#c67c4e] to-[#b86c3d] px-6 py-4 text-white shadow-[0_18px_40px_rgba(198,124,78,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(198,124,78,0.4)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold sm:text-base">
                Add Restaurant
              </span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/admin/create-food"
            className="group min-w-60 rounded-3xl border border-[#eadccf] bg-white/80 px-6 py-4 text-[#2d1f16] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c2ad] hover:bg-white hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold sm:text-base">
                Add Food Items
              </span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>

    {/* Section Heading */}
    <div className="mb-7 mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-3xl font-bold text-[#2d1f16]">
          Dashboard Modules
        </h2>
        <p className="mt-2 text-sm text-[#7b6758] sm:text-base">
          Quickly access and manage all restaurant operations
        </p>
      </div>

      <div className="hidden rounded-2xl border border-[#eadccf] bg-white/70 px-4 py-2 text-sm font-medium text-[#8b6a53] shadow-sm md:flex">
        {cards.length} Modules Available
      </div>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => (
        <Link key={index} to={card.link}>
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.45 }}
            whileHover={{ y: -8 }}
            className="group relative h-full overflow-hidden rounded-[30px] border border-[#eadccf] bg-white/80 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-[#dcc3ad] hover:shadow-[0_25px_50px_rgba(186,140,102,0.15)]"
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#f2ddca]/40 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />

            {/* Top Accent Line */}
            <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-[#c67c4e] via-[#d8b79d] to-transparent opacity-80" />

            <div className="relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#f3e5d8] to-[#ead4c0] text-2xl text-[#b86c3d] shadow-sm transition duration-300 group-hover:scale-105">
                {card.icon}
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#2d1f16] transition duration-300 group-hover:text-[#b86c3d]">
                {card.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#6f5a4b]">
                {card.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#9a6d4d] transition duration-300 group-hover:gap-3 group-hover:text-[#b86c3d]">
                Open Module
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  </div>
</div>
  );
}

export default RestaurantDashboard;