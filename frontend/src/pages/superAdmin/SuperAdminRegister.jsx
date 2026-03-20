import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { superAdminRegister } from "../../features/auth/superAdminAuthSlice";
import { FiUser, FiMail, FiPhone, FiLock, FiUpload, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";


function SuperAdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.superAdminAuth
  );

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    contactNumber: "",
    password: "",
    role: "super_admin",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handelChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("userName", formData.userName);
    data.append("email", formData.email);
    data.append("contactNumber", formData.contactNumber);
    data.append("password", formData.password);
    data.append("role", formData.role);

    if (avatar) data.append("avatar", avatar);
    console.log(data);
    dispatch(superAdminRegister(data));
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate("/verifyEmail");
    }
  }, [registerSuccess, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
  
      {/* 🔥 Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
  
      {/* 🔥 Glow Effects */}
      <div className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl -top-12.5 -left-12.5"></div>
      <div className="absolute w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl -bottom-20 -right-15"></div>
  
      {/* 🔥 Grid Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[40px_40px]"></div>
  
      {/* CONTENT */}
      <div className="relative z-10 w-full flex justify-center p-6">
  
        <div className="w-full max-w-[60%] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
  
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Super Admin Register 🚀
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Create your super admin account
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
  
          <form onSubmit={handelSubmit} className="space-y-5">
  
            {/* AVATAR */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full border-4 border-blue-500 overflow-hidden shadow-md mb-3">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Avatar
                  </div>
                )}
              </div>
  
              <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                <FiUpload />
                Upload Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handelImageChange}
                  className="hidden"
                />
              </label>
            </div>
  
            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                User Name
              </label>
  
              <div className="relative mt-1">
                <FiUser className="absolute top-4 left-3 text-gray-400" />
  
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handelChange}
                  placeholder="Enter username"
                  required
                  className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
  
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Email Address
              </label>
  
              <div className="relative mt-1">
                <FiMail className="absolute top-4 left-3 text-gray-400" />
  
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handelChange}
                  placeholder="Enter email"
                  required
                  className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
  
            {/* CONTACT */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Contact Number
              </label>
  
              <div className="relative mt-1">
                <FiPhone className="absolute top-4 left-3 text-gray-400" />
  
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handelChange}
                  placeholder="Enter phone number"
                  className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
  
            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Password
              </label>
  
              <div className="relative mt-1">
                <FiLock className="absolute top-4 left-3 text-gray-400" />
  
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handelChange}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
  
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
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
              {loading ? "Registering..." : "Register Super Admin"}
            </button>
  
            {/* LOGIN LINK */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/superAdmin/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
  
          </form>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminRegister;