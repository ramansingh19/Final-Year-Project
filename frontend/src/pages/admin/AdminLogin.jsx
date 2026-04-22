import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../features/auth/adminAuthSlice";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, loginSuccess, admin } = useSelector(
    (state) => state.adminAuth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) return;
    dispatch(adminLogin({ email, password }));
  };

  useEffect(() => {
    if (loginSuccess) {
      alert("admin login successfully");

      if (admin?.admin?.host === "hotel") {
        navigate("/admin/adminDashboard");
      } else if (admin?.admin?.host === "restaurant") {
        navigate("/admin/restaurantDashboard");
      } else if (admin?.admin?.host === "delivery_boy") {
        navigate("/admin/deliveryBoy-dashboard");
      }
    }
  }, [loginSuccess, navigate, admin]);

  return (
    <div className="flex items-center justify-center px-3 sm:px-6 py-4 sm:py-6 text-gray-800 dark:text-white">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="mb-5 sm:mb-6 text-center lg:text-left">
          <h2 className="text-xs sm:text-[15px] font-medium uppercase tracking-[0.2em] text-emerald-700">
            Secure Access
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-gray-200">
            Access your admin dashboard securely
          </p>
        </div>

        <form onSubmit={handelSubmit} className="space-y-4 sm:space-y-5">
          
          {/* Email */}
          <div>
            <div className="relative">
              <FiMail className="absolute left-4 sm:left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handelChange}
                required
                placeholder="Enter your email"
                className="h-12 sm:h-14 w-full rounded-full border-0 bg-[#ececeb] pl-10 sm:pl-12 pr-4 text-sm sm:text-[15px] text-gray-900 placeholder:text-gray-500 outline-none transition focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 sm:left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handelChange}
                required
                placeholder="Enter your password"
                className="h-12 sm:h-14 w-full rounded-full border-0 bg-[#ececeb] pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-[15px] text-gray-900 placeholder:text-gray-500 outline-none transition focus:ring-2 focus:ring-emerald-700"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2.5 text-center text-xs sm:text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 sm:h-14 w-full rounded-full bg-emerald-800 text-sm sm:text-base font-semibold text-white shadow-lg transition hover:bg-emerald-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Start"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;