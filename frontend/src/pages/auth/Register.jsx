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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Register your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full border-4 border-blue-500 overflow-hidden shadow-md mb-3">
              {preview ? (
                <img
                  src={preview || "https://via.placeholder.com/100"}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Avatar
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700">
              <FiUpload />
              Upload Avatar
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
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative mt-1">
              <FiUser className="absolute left-3 top-4 text-gray-400" />

              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-4 text-gray-400" />

              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Contact Number
            </label>

            <div className="relative mt-1">
              <FiPhone className="absolute left-3 top-4 text-gray-400" />

              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-4 text-gray-400" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-4 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
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
