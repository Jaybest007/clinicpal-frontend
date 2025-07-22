import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/CP.png"; // Adjust the path as necessary
interface loginCredentials {
  email: string;
  password: string;
}

const Login = () => {
  const { login, loading, user } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<loginCredentials>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    document.title = "Login - ClinicPal App";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border border-blue-100 my-4">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="ClinicPal Logo"
            className="w-16 h-16 mb-2 rounded-full shadow-lg"
          />
          <h1 className="font-extrabold text-3xl sm:text-4xl text-blue-900 mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-blue-700 text-base font-medium text-center">
            Sign in to your ClinicPal account to manage patients, appointments, and more.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-800 text-center bg-red-100 p-2 mb-2 rounded border border-red-300 font-semibold">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              className="w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium"
              placeholder="Enter your email"
              required
              onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
              value={formData.email}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type={hidden ? "password" : "text"}
              name="password"
              id="password"
              autoComplete="current-password"
              className="w-full rounded-lg p-3 pr-10 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium"
              placeholder="Enter your password"
              required
              onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
              value={formData.password}
            />
            <button
              type="button"
              onClick={() => setHidden(!hidden)}
              className="absolute top-9 right-3 text-blue-500 hover:text-blue-700 focus:outline-none"
              tabIndex={-1}
            >
              {hidden ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg py-3 shadow-md transition-colors ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:from-blue-400 hover:to-indigo-400"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-blue-100" />
          <span className="mx-4 text-blue-400 font-semibold text-xs">OR</span>
          <div className="flex-grow h-px bg-blue-100" />
        </div>

        {/* Signup Link */}
        <div className="text-center text-sm text-blue-700 font-medium">
          Need an account?{" "}
          <Link to="/signup" className="text-indigo-600 underline font-bold">
            Register here
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>
            <span className="font-semibold text-blue-700">ClinicPal</span> is an enterprise-grade platform for modern clinics and hospitals.
          </p>
          <p className="mt-2">
            Secure, fast, and compliant with healthcare standards. Your data is encrypted and protected.
          </p>
          <p className="mt-2">
            Need help? <a href="mailto:support@clinicpal.com" className="text-blue-600 underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
