import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../features/auth/authSlice";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, loginSuccess } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handelChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelFormSubmit = (event) => {
    event.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      error;
      return;
    }

    dispatch(userLogin({ email, password }));
  };

  useEffect(() => {
    if (loginSuccess) {
      navigate("/");
    }
  }, [loginSuccess, navigate]);

  return (
    <div className=" flex items-center justify-center  p-6 text-gray-800 dark:text-white">
      <div className="w-full">
        <form onSubmit={handelFormSubmit} className="space-y-4">
          {/* Email */}
          <div>

            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handelChange}
              className="h-14 w-full border-0 bg-[#ececeb] px-5 text-[15px] text-gray-900 placeholder:text-gray-500 outline-none transition focus:ring-2 focus:ring-emerald-700 rounded-full"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-end">

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handelChange}
                className="h-14 w-full rounded-full border-0 bg-[#ececeb] px-5 pr-12 text-[15px] text-gray-900 placeholder:text-gray-500 outline-none transition focus:ring-2 focus:ring-emerald-700"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
              >
                {showPassword ? (
                  <IoEyeSharp size={18} />
                ) : (
                  <FaEyeSlash size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-14 w-full rounded-full bg-emerald-800 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Start"}
          </button>

          {/* Footer */}
          <p className="pt-2 text-center text-sm text-gray-200 lg:text-left">
            Don’t have an account?{" "}
            <Link
              to="/signUp"
              className="font-semibold text-white transition hover:text-emerald-700"
            >
              Sign up
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
