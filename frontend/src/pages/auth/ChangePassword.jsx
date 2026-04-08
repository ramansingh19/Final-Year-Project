import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { changePassword } from "../../features/auth/authSlice";
import { FiLock, FiEye, FiShield, FiEyeOff } from "react-icons/fi";

function ChangePassword() {
  const { email } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);
  console.log(user);

  const { superAdmin } = useSelector((state) => state.superAdminAuth);
  console.log(superAdmin);

  const handelChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Password do not match");
      return;
    }

    try {
      const result = await dispatch(
        changePassword({ email, newPassword, confirmPassword })).unwrap();
         console.log(result);
      if (result.user.role === "super_admin") {
        navigate("/superAdmin/login")
      }else{
        navigate("/login")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-6">
  {/* Background */}
  <div className="absolute inset-0">
    <img
      src="/images/forest-login-bg.jpg"
      alt="background"
      className="h-full w-full scale-110 object-cover blur-sm"
    />

    <div className="absolute inset-0 bg-black/65" />
    <div className="absolute inset-0 bg-linear-to-br from-emerald-900/30 via-black/50 to-cyan-900/30" />
  </div>

  {/* Glow Effects */}
  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
  <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

  {/* Card */}
  <div className="relative z-10 w-full max-w-md rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl sm:p-7">
    {/* Header */}
    <div className="mb-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl">
        <FiLock className="h-6 w-6 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        Change Password
      </h1>

      <p className="mt-2 text-sm leading-6 text-gray-300">
        Set a new secure password for
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-white">
        {email}
      </p>
    </div>

    {/* Messages */}
    {errorMessage && (
      <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300 backdrop-blur-xl">
        {errorMessage}
      </div>
    )}

    {successMessage && (
      <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-300 backdrop-blur-xl">
        {successMessage}
      </div>
    )}

    {/* Form */}
    <div className="space-y-5">
      {/* New Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-200">
          New Password
        </label>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-12 text-sm text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition-all duration-300 focus:border-emerald-400 focus:bg-white/15"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
          >
            {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-200">
          Confirm Password
        </label>

        <div className="relative">
          <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-12 text-sm text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition-all duration-300 focus:border-emerald-400 focus:bg-white/15"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
          >
            {showConfirmPassword ? (
              <FiEyeOff size={18} />
            ) : (
              <FiEye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Password Hint */}
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-gray-300">
        Password should contain at least 8 characters, including uppercase,
        lowercase, number, and special character.
      </div>

      {/* Button */}
      <button
        disabled={loading}
        onClick={handelChangePassword}
        className="flex h-13 w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Changing Password...
          </div>
        ) : (
          "Change Password"
        )}
      </button>
    </div>
  </div>
</div>
  );
}

export default ChangePassword;
