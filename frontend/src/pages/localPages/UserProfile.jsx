import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserdataUpdateForm from "../../components/UserdataUpdateForm";
import { FiEdit } from "react-icons/fi";

function UserProfile() {
  const { user } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);

  // fallback initials function
  const getInitials = (name = "User") => {
    if (typeof name !== "string") return "U";
    return name
      .trim()
      .split(" ")
      .filter((n) => n)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
<div className="flex flex-col justify-center items-center h-64 space-y-4">
  {/* Spinner */}
  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>

  {/* Loading text */}
  <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
    Loading user data...
  </p>
</div>
    );
  }

  return (
    <div className="w-[80%] mx-auto mt-10 p-6 bg-gray-100 dark:bg-gray-800 shadow-xl rounded-xl">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.userName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(user.userName)
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user.userName || "User"}
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FiEdit />
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
          <p className="text-gray-500 dark:text-gray-300">
            {user.contactNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Optional: Additional info */}
      <div className="mt-4 text-gray-600 dark:text-gray-300 space-y-1">
        <p>Role: {user.role}</p>
        <p>Status: {user.isVerified ? "Verified" : "Not Verified"}</p>
      </div>

      {/* User Update Form */}
      {showForm && (
        <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md transition-all">
          <UserdataUpdateForm />
        </div>
      )}
    </div>
  );
}

export default UserProfile;