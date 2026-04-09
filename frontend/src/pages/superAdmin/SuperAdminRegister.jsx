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
<div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-blue-100">
  
  {/* 🔥 Glow Effects */}
  <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -top-16 -left-16 animate-pulse-slow"></div>
  <div className="absolute w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -bottom-24 -right-24 animate-pulse-slow"></div>

  {/* 🔥 Grid Overlay */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_0.5px,transparent_0.5px),linear-gradient(to_bottom,#000_0.5px,transparent_0.5px)] bg-size-[40px_40px]"></div>

  {/* CONTENT */}
  <div className="relative z-10 w-full flex justify-center p-6">
    <div className="w-full max-w-150 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200 animate-fadeIn">
      
      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Super Admin Register 🚀
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Create your super admin account
        </p>
        <div className="w-12 h-1 bg-blue-500 mx-auto mt-4 rounded-full animate-scaleX"></div>
      </div>

      <form onSubmit={handelSubmit} className="space-y-5">

        {/* AVATAR */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-4 border-blue-300 overflow-hidden shadow-md mb-3 transition-transform hover:scale-105">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Avatar
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700 transition-colors">
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
          <label className="text-sm font-medium text-gray-700">User Name</label>
          <div className="relative mt-1">
            <FiUser className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handelChange}
              placeholder="Enter username"
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg 
              bg-white text-gray-800
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative mt-1">
            <FiMail className="absolute top-4 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handelChange}
              placeholder="Enter email"
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg 
              bg-white text-gray-800
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
            />
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <label className="text-sm font-medium text-gray-700">Contact Number</label>
          <div className="relative mt-1">
            <FiPhone className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handelChange}
              placeholder="Enter phone number"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg 
              bg-white text-gray-800
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1">
            <FiLock className="absolute top-4 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handelChange}
              placeholder="Enter password"
              required
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg 
              bg-white text-gray-800
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center py-2 px-3 rounded-lg animate-shake">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition duration-300 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register Super Admin"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            to="/superAdmin/login"
            className="text-blue-600 font-medium hover:underline transition-colors"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  </div>

  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

    @keyframes scaleX {
      0%, 100% { transform: scaleX(1); }
      50% { transform: scaleX(1.2); }
    }
    .animate-scaleX { animation: scaleX 2s ease-in-out infinite; transform-origin: center; }

    @keyframes pulseSlow {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.5; }
    }
    .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.3s ease; }
  `}</style>
</div>
  );
}

export default SuperAdminRegister;