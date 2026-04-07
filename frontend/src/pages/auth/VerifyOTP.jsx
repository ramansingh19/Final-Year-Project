import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { IoReload } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../features/auth/authSlice";
import { FiShield } from "react-icons/fi";

function VerifyOTP() {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const inputRefs = useRef([]);
  const { email } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handelChange = (index, value) => {
    if (value.length > 1) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handelVerify = async (event) => {
    event.preventDefault();

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code.");
      return;
    }

    try {
      const result = await dispatch(verifyOtp({email, otp: finalOtp})).unwrap()
      if(result.success){
        navigate(`/change-password/${email}`)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage("");
    inputRefs.current[0]?.focus();
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

  {/* Verification Card */}
  <div className="relative z-10 w-full max-w-md rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl sm:p-7">
    {/* Header */}
    <div className="mb-7 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl">
        <FiShield className="h-6 w-6 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        Verify Your Email
      </h1>

      <p className="mt-2 text-sm leading-6 text-gray-300">
        Enter the 6-digit verification code sent to your email address.
      </p>
    </div>

    {/* Success Message */}
    {isVerified ? (
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
          <FiCheck className="h-7 w-7 text-emerald-300" />
        </div>

        <h2 className="text-lg font-semibold text-white">
          Verification Successful
        </h2>

        <p className="mt-2 text-sm text-gray-300">
          Your email has been verified successfully. Redirecting...
        </p>
      </div>
    ) : (
      <>
        {/* Instruction */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-gray-300">
            Enter the code below
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="mb-6 flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handelChange(index, e.target.value)}
              className="h-12 w-12 rounded-2xl border border-white/10 bg-white/10 text-center text-lg font-semibold text-white backdrop-blur-xl outline-none transition-all duration-300 focus:border-emerald-400 focus:bg-white/15 sm:h-14 sm:w-14 sm:text-xl"
            />
          ))}
        </div>

        {/* Error / Success Messages */}
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

        {/* Verify Button */}
        <button
          onClick={handelVerify}
          disabled={loading || otp.some((digit) => digit === "")}
          className="flex h-13 w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verifying...
            </div>
          ) : (
            "Verify Code"
          )}
        </button>

        {/* Secondary Actions */}
        <div className="mt-4 space-y-3">
          <button
            onClick={clearOtp}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/15 disabled:opacity-50"
          >
            <IoReload className="text-base" />
            Clear Code
          </button>

          <p className="text-center text-sm text-gray-300">
            Wrong email?{" "}
            <Link
              to="/forgotPassword"
              className="font-semibold text-white transition hover:text-emerald-300"
            >
              Go Back
            </Link>
          </p>
        </div>
      </>
    )}
  </div>
</div>
  );
}

export default VerifyOTP;
