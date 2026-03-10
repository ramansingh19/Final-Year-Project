import React from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const { admin } = useSelector((state) => state.admin);

  const getInitials = (name) => {
    if (!name) return "SA";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
          {admin?.avatar ? (
            <img
              src={admin.avatar}
              alt={admin.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(admin?.userName)
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Welcome Back 👋
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            Hi <span className="font-medium">{admin?.userName}</span>,
            manage your platform from here.
          </p>
        </div>
      </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
