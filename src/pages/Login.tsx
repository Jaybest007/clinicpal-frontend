import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="font-bold text-3xl text-center text-gray-800 mb-6">Login</h1>

        {error && (
          <p className="text-red-800 text-center bg-red-100 p-2 mb-2 rounded border border-red-300">
            {error}
          </p>
        )}

        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="text-base">
            <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border border-neutral-300 focus:border-blue-400 outline-none transition"
              placeholder="Enter your email"
              required
              onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
              value={formData.email}
            />
          </div>

          {/* Password */}
          <div className="text-base relative">
            <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <input
              type={hidden ? "password" : "text"}
              name="password"
              id="password"
              className="w-full rounded-lg p-3 pr-10 bg-neutral-200 focus:bg-neutral-100 border border-neutral-300 focus:border-blue-400 outline-none transition"
              placeholder="Enter password"
              required
              onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
              value={formData.password}
            />
            <button
              type="button"
              onClick={() => setHidden(!hidden)}
              className="absolute top-10 right-3 text-gray-600 hover:text-blue-500 focus:outline-none"
            >
              {hidden ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-400 text-white font-semibold rounded-lg py-3 transition-colors ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-300"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-700 text-center">
          By logging in, you agree to our platform rules.
          <br />
          Need an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
