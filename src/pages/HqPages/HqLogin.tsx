import React, { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginFormErrors {
  hospital_id?: string;
  password?: string;
}

const HospitalLogin: React.FC = () => {
  const [hospital_id, setHospitalId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const { hospitalLogin, loading } = useHospital();
  const { setTempInfo, tempInfo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const newErrors: LoginFormErrors = {};

    // Client-side validation
    if (!hospital_id.trim()) newErrors.hospital_id = "Hospital ID is required.";
    if (!password.trim()) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await hospitalLogin({ hospital_id, password });
      setHospitalId("");
      setPassword("");
      setErrors({});
      navigate("/hq", { replace: true });
      setTempInfo([]); 
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "An unexpected error occurred.";
      setServerError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200 px-2">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
        {tempInfo.length > 0 &&
        <div className="text-center mb-5 bg-blue-50 ring-1 rounded p-2 shadow-sm">
          <p className="text-sm text-gray-500">Access your hospital dashboard</p>
          <h1 className="font-bold text-blue-800">Hospital ID:{tempInfo[0]?.hospital_id}</h1>
          <h1 className="font-bold text-blue-800">Password:  {tempInfo[0]?.password}</h1>
        </div>}
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-200 rounded-full p-2 shadow mb-2">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.1" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-1 text-center tracking-tight">
            Hospital HQ Login
          </h2>
          <p className="text-center text-gray-500 text-sm mb-2">
            Welcome back! Please enter your hospital credentials to access your HQ dashboard.
          </p>
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hospital ID */}
          <div>
            <label htmlFor="hospital_id" className="block text-blue-700 font-medium mb-1">
              Hospital ID
            </label>
            <input
              type="text"
              id="hospital_id"
              value={hospital_id}
              onChange={(e) => setHospitalId(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.hospital_id ? "border-red-500" : "border-blue-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 transition`}
              placeholder="e.g. HOSP-123456"
              autoComplete="username"
              required
            />
            {errors.hospital_id && (
              <p className="text-red-500 text-xs mt-1">{errors.hospital_id}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-blue-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-blue-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 transition`}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Trouble logging in?
            </span>
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline font-medium"
              onClick={() => navigate("/hq/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white py-2 rounded-lg shadow-md text-base font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalLogin;
