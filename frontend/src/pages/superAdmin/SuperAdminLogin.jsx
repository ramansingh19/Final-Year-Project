import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../../features/auth/superAdminAuthSlice";

import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

function SuperAdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, loginSuccess, superAdminToken } = useSelector(
    (state) => state.superAdminAuth);
  const token = localStorage.getItem("superAdminToken");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) return;

    dispatch(superAdminLogin({ email, password }));
  };

  useEffect(() => {
    if (loginSuccess) {
      navigate("/superAdmin/superAdminDashboard");
    }
  }, [loginSuccess, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
  
      {/* 🔥 Gradient Base */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
  
      {/* 🔥 Glow Effects */}
      <div className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl -top-12.5 -left-12.5"></div>
      <div className="absolute w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl -bottom-20 -right-15"></div>
  
      {/* 🔥 Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[40px_40px]"></div>
  
      {/* CONTENT */}
      <div className="relative z-10 w-full flex justify-center p-6">
  
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
  
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Super Admin 🔑
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Secure access to admin dashboard
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
  
          {/* FORM */}
          <form onSubmit={handelSubmit} className="space-y-5">
  
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Email Address
              </label>
  
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-4 text-gray-400" />
  
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handelChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
  
            {/* PASSWORD */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Password
                </label>
  
                <Link
                  to={"/forgot-password"}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>
  
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-4 text-gray-400" />
  
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handelChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
  
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
  
            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center py-2 px-3 rounded-lg">
                {error}
              </div>
            )}
  
            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
  
          </form>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;