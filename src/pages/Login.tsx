import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/CP.png";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

interface LoginCredentials {
  email: string;
  password: string;
}

const Login = () => {
  const { login, loading, user } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    document.title = "Login - ClinicPal";
  }, []);

  useEffect(() => {
    if (user?.token) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.email.trim() === "" || formData.password.trim() === "") {
      setError("Email and Password are required");
      return;
    }

    try {
      await login(formData);
      setError("");
      setFormData({ email: "", password: "" });
    } catch (err: any) {
      const errorMsg =
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : err?.response?.data?.error?.server ||
            err?.response?.data?.message ||
            "Login failed. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-blue-100"
      >
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            src={logo}
            alt="ClinicPal Logo"
            className="w-16 h-16 mb-3 rounded-full shadow-md object-cover"
          />
          <h1 className="font-bold text-2xl sm:text-3xl text-blue-900 mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-blue-600 text-sm font-medium text-center">
            Sign in to continue to your ClinicPal dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-gray-700 font-medium text-sm"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="username"
                className="w-full rounded-lg p-2.5 pl-10 bg-blue-50/70 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition-all duration-200 text-gray-800"
                placeholder="Enter your email"
                required
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
                value={formData.email}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-gray-700 font-medium text-sm"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type={hidden ? "password" : "text"}
                name="password"
                id="password"
                autoComplete="current-password"
                className="w-full rounded-lg p-2.5 pl-10 pr-10 bg-blue-50/70 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition-all duration-200 text-gray-800"
                placeholder="Enter your password"
                required
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setHidden(!hidden)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                tabIndex={-1}
                aria-label={hidden ? "Show password" : "Hide password"}
              >
                {hidden ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg py-2.5 shadow transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-md"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <FiLoader className="animate-spin h-4 w-4" aria-hidden="true" />
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-blue-100" />
          <span className="mx-3 text-blue-400 text-xs font-medium">OR</span>
          <div className="flex-grow h-px bg-blue-100" />
        </div>

        {/* Signup Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Create one now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
