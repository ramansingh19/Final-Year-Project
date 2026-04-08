import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../features/auth/authSlice";
import { FiLock, FiMail } from "react-icons/fi";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error, message } = useSelector((state) => state.auth)
  
  const handelForgotPassword = async (e) => {
    e.preventDefault();
    try {

      const result = await dispatch(forgotPassword(email)).unwrap();
  
      if (result.success) {
        navigate(`/verify-otp/${email}`);
      }
  
    } catch (error) {
      console.log("Forgot password error:", error);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-6">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src="/images/forest-login-bg.jpg"
        alt="background"
        className="h-full w-full scale-110 object-cover blur-sm"
      />
  
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />
  
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-900/30 via-black/50 to-cyan-900/30" />
    </div>
  
    {/* Glow Effects */}
    <div className="absolute -left-30 -top-30 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
    <div className="absolute -bottom-25 -right-25 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
  
    {/* Card */}
    <div className="relative z-10 w-full max-w-md rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl sm:p-7">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl">
          <FiLock className="h-6 w-6 text-white" />
        </div>
  
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Forgot Password
        </h1>
  
        <p className="mt-2 text-sm leading-6 text-gray-300">
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>
      </div>
  
      {/* Success State */}
      {isSubmitted ? (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
            <FiMail className="h-6 w-6 text-emerald-300" />
          </div>
  
          <h2 className="text-lg font-semibold text-white">
            Check your inbox
          </h2>
  
          <p className="mt-2 text-sm leading-6 text-gray-300">
            We’ve sent a reset link to
          </p>
  
          <p className="mt-1 break-all text-sm font-semibold text-white">
            {email}
          </p>
  
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-5 inline-flex items-center rounded-2xl border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Try another email
          </button>
        </div>
      ) : (
        <form onSubmit={handelForgotPassword} className="space-y-5">
          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300 backdrop-blur-xl">
              {error}
            </div>
          )}
  
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Email Address
            </label>
  
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
  
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="h-13 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition-all duration-300 focus:border-emerald-400 focus:bg-white/15"
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-13 w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending Reset Link...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
  
          {/* Back to Login */}
          <div className="pt-2 text-center">
            <p className="text-sm text-gray-300">
              Remember your password?{" "}
              <Link
                to="/loginPage"
                className="font-semibold text-white transition hover:text-emerald-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  </div>
  );
}

export default ForgotPassword;
