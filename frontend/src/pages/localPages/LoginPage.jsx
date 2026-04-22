import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  User,
} from "lucide-react";
import Login from "../auth/Login";
import AdminLogin from "../admin/AdminLogin";

export default function LoginPage() {
  const [loginType, setLoginType] = useState("user");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-black px-3 sm:px-4 py-4 sm:py-6">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/forest-login-bg.jpg"
          alt="background"
          className="h-full w-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[28px] sm:rounded-[40px] border border-white/10 bg-black/30 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT SIDE */}
        <div className="flex items-center justify-center px-4 sm:px-8 lg:px-14 py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-sm">

            {/* LOGO */}
            <p className="mb-3 sm:mb-4 text-center text-xl sm:text-2xl font-bold lowercase tracking-wide text-emerald-800">
              logo
            </p>

            {/* HEADING */}
            <h1 className="mb-6 sm:mb-8 text-center text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-black lg:text-left">
              Start your <br />
              perfect trip
            </h1>

            {/* TOGGLE */}
            <div className="flex justify-center">
              <div className="relative mb-5 w-full max-w-xs flex rounded-2xl bg-[#e8e8e6] p-1">

                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-emerald-700 ${
                    loginType === "admin"
                      ? "left-[calc(50%+2px)]"
                      : "left-1"
                  }`}
                />

                <button
                  onClick={() => setLoginType("user")}
                  className={`relative z-10 flex flex-1 items-center justify-center rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    loginType === "user"
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  <User className="mr-1 sm:mr-2 h-4 w-4" />
                  User
                </button>

                <button
                  onClick={() => setLoginType("admin")}
                  className={`relative z-10 flex flex-1 items-center justify-center rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    loginType === "admin"
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  <Building2 className="mr-1 sm:mr-2 h-4 w-4" />
                  Admin
                </button>
              </div>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              {loginType === "user" ? <Login /> : <AdminLogin />}
            </div>

          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative hidden lg:block min-h-125 xl:min-h-162.5">
          <img
            src="/images/forest-login-bg.jpg"
            alt="trip"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/10" />

          {/* TOP CARD */}
          <div className="absolute left-[10%] top-[25%] rounded-2xl bg-white/80 px-3 sm:px-5 py-3 sm:py-4 backdrop-blur-md shadow-lg">
            <p className="text-[10px] sm:text-xs text-gray-500">Garsia Village</p>
            <p className="text-sm sm:text-lg font-semibold text-gray-900">Explore</p>
          </div>

          {/* DISTANCE */}
          <div className="absolute right-[10%] top-[40%] rounded-2xl bg-[#d9ddd3]/90 px-3 sm:px-5 py-3 sm:py-4 backdrop-blur-md shadow-lg">
            <p className="text-sm sm:text-lg font-bold text-gray-900">1.2 km</p>
            <p className="text-[10px] sm:text-sm text-gray-600">
              left to your accommodation
            </p>
          </div>

          {/* BOTTOM LABEL */}
          <div className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
            <p className="text-sm sm:text-base font-semibold text-black">
              Gringo Trail
            </p>
          </div>

          {/* LINE */}
          <div className="absolute left-1/2 top-16 h-[75%] w-px -translate-x-1/2 bg-white/50" />

          <div className="absolute left-1/2 top-16 h-3 w-3 sm:h-4 sm:w-4 -translate-x-1/2 rounded-full border-4 border-white bg-white/70" />

          <div className="absolute bottom-24 sm:bottom-28 left-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-x-1/2 rounded-full border-4 border-white bg-white/70" />
        </div>
      </div>
    </div>
  );
}