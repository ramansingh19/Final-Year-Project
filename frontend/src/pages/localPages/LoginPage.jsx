import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  HelpCircle,
} from "lucide-react";
import Login from "../auth/Login";
import AdminLogin from "../admin/AdminLogin";

export default function LoginPage() {
  const [loginType, setLoginType] = useState("user");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-6">
      {/* Full Background */}
      <div className="absolute inset-0">
        <img
          src="/images/forest-login-bg.jpg"
          alt="background"
          className="h-full w-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/10 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Form Side */}
        <div className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
          <div className="w-full max-w-sm">
            <p className="mb-4 text-center text-2xl font-bold lowercase tracking-wide text-emerald-800">
              logo
            </p>

            <h1 className="mb-8 text-center text-4xl font-extrabold leading-tight text-black sm:text-5xl lg:text-left">
              Start your <br />
              perfect trip
            </h1>


            {/* Toggle */
            <div className="w-full flex items-center justify-center">

            <div className="relative mb-5 w-[90%] flex rounded-2xl bg-[#e8e8e6] p-1">
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-emerald-700 shadow-md ${
                  loginType === "admin"
                    ? "left-[calc(50%+2px)]"
                    : "left-1"
                }`}
              />

              <button
                onClick={() => setLoginType("user")}
                className={`relative z-10 flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  loginType === "user"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                User
              </button>

              <button
                onClick={() => setLoginType("admin")}
                className={`relative z-10 flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  loginType === "admin"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Admin
              </button>
            </div>
            </div>

            /* Form */}
            <div className="space-y-4">
              {loginType === "user" ? <Login /> : <AdminLogin />}
            </div>


          </div>
        </div>

        {/* Right Image Side */}
        <div className="relative hidden min-h-162.5 lg:block">
          <img
            src="/images/forest-login-bg.jpg"
            alt="trip"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/10" />

          {/* Top Marker */}
          <div className="absolute left-[14%] top-[30%] rounded-3xl bg-white/80 px-5 py-4 backdrop-blur-md shadow-xl">
            <p className="text-xs text-gray-500">Garsia Village</p>
            <p className="text-lg font-semibold text-gray-900">Explore</p>
          </div>

          {/* Distance Marker */}
          <div className="absolute right-[12%] top-[42%] rounded-3xl bg-[#d9ddd3]/90 px-5 py-4 backdrop-blur-md shadow-xl">
            <p className="text-lg font-bold text-gray-900">1.2 km</p>
            <p className="text-sm text-gray-600">left to your accommodation</p>
          </div>

          {/* Bottom Trail Label */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-3 shadow-xl">
            <p className="text-base font-semibold text-black">Gringo Trail</p>
          </div>

          {/* Vertical Route Line */}
          <div className="absolute left-1/2 top-16 h-[75%] w-px -translate-x-1/2 bg-white/50" />

          <div className="absolute left-1/2 top-16 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-white/70" />

          <div className="absolute bottom-28 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-white/70" />
        </div>
      </div>
    </div>
  );
}
