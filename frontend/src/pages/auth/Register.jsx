import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/auth/authSlice";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    contactNumber: "",
    password: "",
    role: "user",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (avatar) data.append("avatar", avatar);

    dispatch(register(data));
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate("/verifyEmail");
    }
  }, [registerSuccess, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-3 sm:px-4 py-4 sm:py-6">
      
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/forest-login-bg.jpg"
          alt="background"
          className="h-full w-full object-cover scale-110 blur-sm"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900/40 via-black/50 to-cyan-900/40" />
      </div>

      {/* Glow */}
      <div className="absolute top-6 left-6 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute bottom-6 right-6 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl rounded-[28px] sm:rounded-[36px] border border-white/10 bg-black/30 p-3 sm:p-4 md:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mx-auto mb-3 sm:mb-4 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
            <FiUser className="h-5 w-5 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-300">
            Join now and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-xl">
              {preview ? (
                <img src={preview} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <FiUser className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
              )}
            </div>

            <label className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white backdrop-blur-xl hover:bg-white/20">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm text-gray-200">
              Full Name
            </label>

            <div className="relative">
              <FiUser className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="h-12 sm:h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-10 sm:pl-12 pr-4 text-sm sm:text-base text-white placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-400 focus:bg-white/15 outline-none"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm text-gray-200">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="h-12 sm:h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-10 sm:pl-12 pr-4 text-sm sm:text-base text-white placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-400 focus:bg-white/15 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm text-gray-200">
                Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                  placeholder="Phone"
                  className="h-12 sm:h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-10 sm:pl-12 pr-4 text-sm sm:text-base text-white placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-400 focus:bg-white/15 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm text-gray-200">
              Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                required
                placeholder="Password"
                className="h-12 sm:h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base text-white placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-400 focus:bg-white/15 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 sm:px-4 py-2.5 text-center text-xs sm:text-sm text-red-300 backdrop-blur-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="h-12 sm:h-14 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 text-sm sm:text-base font-semibold text-white shadow-lg transition active:scale-[0.98] hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Login */}
          <p className="text-center text-xs sm:text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/loginPage"
              className="font-semibold text-white hover:text-emerald-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;