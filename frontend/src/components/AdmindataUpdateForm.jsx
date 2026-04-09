import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateAdminProfile } from '../features/user/adminSlice'

function AdmindataUpdateForm() {
  const dispatch = useDispatch()
  const {loading, error, admin} = useSelector((state) => state.admin)

  const [formData, setFormData] = useState ({
    userName: "",
    email: "",
    contactNumber: "",
    avatar: null,
  })

  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (admin) {
      setFormData({
        userName: admin.userName || "",
        email: admin.email || "",
        contactNumber: admin.contactNumber || "",
        avatar: null, // we only append avatar if user selects new file
      });
      setAvatarPreview(admin.avatar || "");
    }
  }, [admin]);

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
    if (formData.userName !== admin.userName) data.append("userName", formData.userName);
    if (formData.email !== admin.email) data.append("email", formData.email);
    if (formData.contactNumber !== admin.contactNumber) data.append("contactNumber", formData.contactNumber);
    if (formData.avatar) data.append("avatar", formData.avatar);

    dispatch(updateAdminProfile(data));
  };


  return (
<form
  onSubmit={handleSubmit}
  className="mx-auto w-full max-w-6xl overflow-hidden rounded-4xl border border-white/60 bg-white/80 shadow-[0_30px_80px_rgba(148,163,184,0.18)] backdrop-blur-2xl transition-all duration-500"
>
  <div className="grid lg:grid-cols-[360px_1fr]">
    {/* LEFT PANEL */}
    <div className="relative overflow-hidden border-b border-[#e7d8c9] bg-linear-to-br from-[#fff8f3] via-[#f9efe6] to-[#f5ebe0] p-6 sm:p-8 lg:border-b-0 lg:border-r">
      {/* Background Effects */}
      <div className="absolute -left-16 -top-10 h-52 w-52 rounded-full bg-[#e9cbb1]/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#d9b99b]/20 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8c0aa] bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9c6f4e] shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#c67c4e]" />
            Admin Settings
          </div>

          <h2 className="mt-6 font-serif text-3xl font-bold leading-tight text-[#2d1f16] sm:text-4xl">
            Update Your Profile
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-7 text-[#6f5a4b] sm:text-base">
            Keep your account information fresh and updated. Add a new profile
            photo and manage your details easily.
          </p>
        </div>

        {/* Profile Preview */}
        <div className="mt-10 rounded-[28px] border border-white/70 bg-white/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="group relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="h-28 w-28 rounded-[28px] object-cover ring-4 ring-white transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-linear-to-br from-[#d6b79e] via-[#c9926b] to-[#b6784e] text-4xl font-bold text-white ring-4 ring-white transition duration-500 group-hover:scale-105">
                  {admin?.userName?.[0]?.toUpperCase() || "A"}
                </div>
              )}

              <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-[#c67c4e] text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-[#b86c3d]">
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

            <h3 className="mt-5 font-serif text-2xl font-semibold text-[#2d1f16]">
              {formData.userName || "Admin Name"}
            </h3>

            <p className="mt-1 text-sm text-[#7c6858]">
              {formData.email || "admin@email.com"}
            </p>

            <div className="mt-6 w-full rounded-2xl border border-[#eadccf] bg-[#fffaf7] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c6858]">Role</span>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#f3e3d6] px-3 py-1 text-xs font-semibold capitalize text-[#a05e35]">
                  <span className="h-2 w-2 rounded-full bg-[#c67c4e]" />
                  {admin?.host || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto hidden pt-8 lg:block">
          <p className="text-xs leading-6 text-[#8d7665]">
            Tip: Updated information helps you receive system notifications and
            important account alerts faster.
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="relative bg-linear-to-br from-[#fffdfb] via-[#faf5ef] to-[#f5ebe0] p-6 sm:p-8 lg:p-10">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#f0d9c5]/30 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-5 border-b border-[#e8d9ca] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-3xl font-bold text-[#2d1f16]">
              Personal Information
            </h3>
            <p className="mt-2 text-sm text-[#6f5a4b]">
              Edit your account details below
            </p>
          </div>

          <div className="hidden rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-sm sm:flex sm:items-center sm:gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e3d6] text-[#b46d42]">
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a816d]">
                Secure Access
              </p>
              <p className="text-sm font-semibold text-[#2d1f16]">
                Protected Profile
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#5f4a3d]">
              Full Name
            </label>

            <div className="group flex items-center rounded-3xl border border-[#eadccf] bg-white/80 px-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-within:border-[#c67c4e] focus-within:shadow-[0_0_0_4px_rgba(198,124,78,0.12)]">
              <svg
                className="mr-3 h-5 w-5 text-[#b79d8b] transition group-focus-within:text-[#c67c4e]"
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
                className="w-full bg-transparent py-4 text-[#2d1f16] placeholder:text-[#b6a294] focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5f4a3d]">
              Email Address
            </label>

            <div className="group flex items-center rounded-3xl border border-[#eadccf] bg-white/80 px-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-within:border-[#c67c4e] focus-within:shadow-[0_0_0_4px_rgba(198,124,78,0.12)]">
              <svg
                className="mr-3 h-5 w-5 text-[#b79d8b] transition group-focus-within:text-[#c67c4e]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent py-4 text-[#2d1f16] placeholder:text-[#b6a294] focus:outline-none"
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5f4a3d]">
              Contact Number
            </label>

            <div className="group flex items-center rounded-3xl border border-[#eadccf] bg-white/80 px-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-within:border-[#c67c4e] focus-within:shadow-[0_0_0_4px_rgba(198,124,78,0.12)]">
              <svg
                className="mr-3 h-5 w-5 text-[#b79d8b] transition group-focus-within:text-[#c67c4e]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5h2l3 7-1.5 2.5A1 1 0 007.5 16H19v2H7.5a3 3 0 01-2.59-4.5L6 11 3 5z"
                />
              </svg>

              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                className="w-full bg-transparent py-4 text-[#2d1f16] placeholder:text-[#b6a294] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500 animate-pulse">
            {error}
          </div>
        )}

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-[#e8d9ca] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7b6758]">
            Your changes will be saved securely and updated instantly.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-[#c67c4e] to-[#b86c3d] px-8 py-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(198,124,78,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(198,124,78,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating...
              </>
            ) : (
              <>
                Update Profile
                <svg
                  className="h-5 w-5 transition duration-300 group-hover:translate-x-1"
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
  </div>
</form>
  )
}

export default AdmindataUpdateForm