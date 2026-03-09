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

<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">

<div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">

  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
    Super Admin Register
  </h2>

  <p className="text-center text-gray-500 text-sm mb-6">
    Create your super admin account
  </p>

  <form onSubmit={handelSubmit} className="space-y-5">

    {/* Avatar Upload */}
    <div className="flex flex-col items-center">

      <div className="w-28 h-28 rounded-full border-4 border-blue-500 overflow-hidden shadow-md mb-3">
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
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

    {/* Username */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        User Name
      </label>
      <div className="relative mt-1">
        <FiUser className="absolute top-4 left-3 text-gray-400" />
        <input
          type="text"
          name="userName"
          placeholder="Enter username"
          value={formData.userName}
          onChange={handelChange}
          className="w-full pl-10 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>
    </div>

    {/* Email */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Email Address
      </label>
      <div className="relative mt-1">
        <FiMail className="absolute top-4 left-3 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handelChange}
          className="w-full pl-10 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>
    </div>

    {/* Contact */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Contact Number
      </label>
      <div className="relative mt-1">
        <FiPhone className="absolute top-4 left-3 text-gray-400" />
        <input
          type="text"
          name="contactNumber"
          placeholder="Enter phone number"
          value={formData.contactNumber}
          onChange={handelChange}
          className="w-full pl-10 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>

    {/* Password */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Password
      </label>
      <div className="relative mt-1">
        <FiLock className="absolute top-4 left-3 text-gray-400" />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handelChange}
          className="w-full pl-10 pr-10 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          required
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

    {/* Error */}
    {error && (
      <p className="text-red-500 text-sm text-center">{error}</p>
    )}

    {/* Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
    >
      {loading ? "Registering..." : "Register Super Admin"}
    </button>

              {/* Login */}
              <p className="text-sm text-center text-gray-600">
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
  );
}

export default SuperAdminRegister;