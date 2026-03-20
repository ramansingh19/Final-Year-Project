import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSuperAdminProfile } from '../features/user/superAdminSlice';

function SuperAdminDataUpdateForm() {
  const dispatch = useDispatch()
  const { loading, error, superAdmin} = useSelector((state) => state.superAdmin)

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    contactNumber: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  
  useEffect(() => {
    if (superAdmin) {
      setFormData({
        userName: superAdmin.userName || "",
        email: superAdmin.email || "",
        contactNumber: superAdmin.contactNumber || "",
        avatar: null, // we only append avatar if user selects new file
      });
      setAvatarPreview(superAdmin.avatar || "");
    }
  }, [superAdmin]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      const file = files[0];
      setFormData({ ...formData, avatar: file });
      if (file) {
        setAvatarPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append only changed fields
    if (formData.userName !== superAdmin.userName) data.append("userName", formData.userName);
    if (formData.email !== superAdmin.email) data.append("email", formData.email);
    if (formData.contactNumber !== superAdmin.contactNumber) data.append("contactNumber", formData.contactNumber);
    if (formData.avatar) data.append("avatar", formData.avatar);

    dispatch(updateSuperAdminProfile(data));
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-md mx-auto transition-all"
    >
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white text-center mb-4">
        Update Profile
      </h2>
  
      {/* Avatar Upload */}
      <div className="flex flex-col items-center">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-600 object-cover mb-3 shadow-md"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md">
            {superAdmin.userName ? superAdmin.userName[0].toUpperCase() : "U"}
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 text-sm">
          {/* <FiUpload /> */}
          Upload Avatar
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </div>
  
      {/* Name Field */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 dark:text-gray-300 font-medium">
          Name
        </label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 transition"
        />
      </div>
  
      {/* Email Field */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 dark:text-gray-300 font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 transition"
        />
      </div>
  
      {/* Contact Number Field */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 dark:text-gray-300 font-medium">
          Contact Number
        </label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Enter your number"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 transition"
        />
      </div>
  
      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
      )}
  
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="border-2 border-t-white border-blue-500 animate-spin rounded-full w-5 h-5 mr-2"></span>
            Updating...
          </>
        ) : (
          "Update Profile"
        )}
      </button>
    </form>
  );
}

export default SuperAdminDataUpdateForm