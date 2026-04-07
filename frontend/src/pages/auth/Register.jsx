import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/auth/authSlice";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiUpload,
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
    data.append("userName", formData.userName);
    data.append("email", formData.email);
    data.append("contactNumber", formData.contactNumber);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (avatar) data.append("avatar", avatar);

    dispatch(register(data));
    console.log(avatar);
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate("/verifyEmail");
      console.log("Registered successfully");
    }
  }, [registerSuccess]);

  return (
<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-6">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/images/forest-login-bg.jpg"
      alt="background"
      className="h-full w-full object-cover scale-110 blur-sm"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/55" />

    {/* Extra Gradient */}
    <div className="absolute inset-0 bg-linear-to-br from-emerald-900/30 via-black/40 to-cyan-900/30" />
  </div>

  {/* Glow Effects */}
  <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
  <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

  {/* Center Form Card */}
  <div className="relative z-10 w-full max-w-2xl rounded-[36px] border border-white/10 bg-white/10 p-1 sm:p-4 md:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
    {/* Header */}
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
        <FiUser className="h-5 w-5 text-white" />
      </div>

      <h1 className="text-3xl font-bold text-white sm:text-4xl">
        Create Account
      </h1>

      <p className="mt-2 text-sm text-gray-300">
        Join now and start your journey with us
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-white/10 shadow-xl backdrop-blur-xl">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <FiUser className="h-10 w-10 text-gray-300" />
          )}
        </div>

        <label className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/20">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-200">
          Full Name
        </label>

        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition focus:border-emerald-400 focus:bg-white/15"
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Email
          </label>

          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition focus:border-emerald-400 focus:bg-white/15"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Phone
          </label>

          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              maxLength={10}
              required
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition focus:border-emerald-400 focus:bg-white/15"
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-200">
          Password
        </label>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            placeholder="Create password"
            required
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-12 text-white placeholder:text-gray-400 backdrop-blur-xl outline-none transition focus:border-emerald-400 focus:bg-white/15"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300 backdrop-blur-xl">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        disabled={loading}
        className="h-14 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-emerald-500/20 disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-300">
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
