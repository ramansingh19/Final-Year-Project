import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../features/user/userSlice";

function UserdataUpdateForm() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // Initialize form fields with user data
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    contactNumber: "",
    avatar: null,
  });

  // Preview avatar locally
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        avatar: null, // we only append avatar if user selects new file
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

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
    if (formData.userName !== user.userName) data.append("userName", formData.userName);
    if (formData.email !== user.email) data.append("email", formData.email);
    if (formData.contactNumber !== user.contactNumber) data.append("contactNumber", formData.contactNumber);
    if (formData.avatar) data.append("avatar", formData.avatar);

    dispatch(updateUserProfile(data));
  };

  return (
<form
  onSubmit={handleSubmit}
  className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[38px] border border-white/70 bg-[#f7f9fc]/90 shadow-[0_35px_90px_rgba(15,23,42,0.08)] backdrop-blur-3xl"
>
  {/* Ecommerce Style Background */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-20 -top-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl animate-pulse" />
    <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl animate-pulse [animation-delay:1s]" />
    <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-200/30 blur-3xl animate-pulse [animation-delay:2s]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.10),transparent_45%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.55),transparent,rgba(255,255,255,0.35))]" />
  </div>

  <div className="relative z-10 grid lg:grid-cols-[360px_1fr]">
    {/* LEFT PANEL */}
    <div className="relative border-b border-slate-200/80 bg-white/70 p-6 backdrop-blur-2xl sm:p-8 lg:border-b-0 lg:border-r">
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-orange-100 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
            Account Settings
          </div>

          <h2 className="mt-5 bg-linear-to-r from-slate-900 via-orange-500 to-amber-500 bg-clip-text text-3xl font-black leading-tight text-transparent sm:text-4xl">
            Update Profile
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Manage your profile details, upload a fresh photo and keep your
            account information beautifully updated.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-10 rounded-[30px] border border-white/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-[30px] bg-linear-to-r from-orange-400 via-pink-400 to-sky-400 opacity-30 blur-md transition duration-500 group-hover:opacity-60" />

              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="relative h-28 w-28 rounded-[28px] object-cover ring-4 ring-white shadow-[0_15px_40px_rgba(249,115,22,0.15)] transition duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] bg-linear-to-br from-orange-400 via-amber-400 to-pink-400 text-4xl font-black text-white ring-4 ring-white shadow-[0_15px_40px_rgba(249,115,22,0.15)] transition duration-500 group-hover:scale-[1.04]">
                  {user?.userName?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-white bg-orange-500 text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:scale-105 hover:bg-orange-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5 0 113.536 3.536L12.536 16.536A4 4 0 019.707 17.707L7 18l.293-2.707A4 4 0 018.464 12.536z"
                  />
                </svg>

                <input
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900">
              {formData.userName || "Your Name"}
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {formData.email || "your@email.com"}
            </p>

            <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Status
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto hidden pt-8 lg:block">
          <div className="rounded-2xl border border-orange-100 bg-orange-50/80 p-4 text-sm leading-7 text-orange-600">
            Tip: A clean profile image and updated contact details make your
            account look more professional and trustworthy.
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="bg-[#fbfcff]/80 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            Personal Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Edit your account details below
          </p>
        </div>

        <div className="hidden rounded-3xl border border-white bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex sm:items-center sm:gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-500">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0 3.866-3.582 7-8 7m16-7c0 3.866-3.582 7-8 7m0-7V4m0 7c4.418 0 8 3.134 8 7"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Secure Account
            </p>

            <p className="text-sm font-semibold text-slate-800">
              Information Protected
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Full Name
          </label>

          <div className="group flex items-center rounded-3xl border border-slate-200 bg-white px-5 shadow-sm transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-orange-300 focus-within:shadow-[0_12px_30px_rgba(249,115,22,0.12)]">
            <svg
              className="mr-3 h-5 w-5 text-slate-400 transition group-focus-within:text-orange-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z"
              />
            </svg>

            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-transparent py-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Email Address
          </label>

          <div className="group flex items-center rounded-3xl border border-slate-200 bg-white px-5 shadow-sm transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-sky-300 focus-within:shadow-[0_12px_30px_rgba(14,165,233,0.12)]">
            <svg
              className="mr-3 h-5 w-5 text-slate-400 transition group-focus-within:text-sky-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12H8m8 0l-4-4m4 4l-4 4"
              />
            </svg>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-transparent py-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Contact Number
          </label>

          <div className="group flex items-center rounded-3xl border border-slate-200 bg-white px-5 shadow-sm transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-emerald-300 focus-within:shadow-[0_12px_30px_rgba(16,185,129,0.12)]">
            <svg
              className="mr-3 h-5 w-5 text-slate-400 transition group-focus-within:text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5h2l3 7-1.5 2.5A1 1 0 007.5 16H19v2H7.5a3 3 0 01-2.59-4.5L6 11 3 5zm6 14a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
              />
            </svg>

            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full bg-transparent py-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-500 shadow-sm animate-[fadeIn_.4s_ease]">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Changes are saved securely to your account.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 px-8 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating...
            </>
          ) : (
            <>
              Save Changes
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-5-5l5 5-5 5"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
</form>
  );
}

export default UserdataUpdateForm;