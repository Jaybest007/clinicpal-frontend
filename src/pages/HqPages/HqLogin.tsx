import React, { useState, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { hospitalLogin, loading } = useHospital();
  const { setTempInfo, tempInfo } = useAuth();
  const navigate = useNavigate();

  // Clear server error when user types
  useEffect(() => {
    if (serverError && (hospital_id || password)) {
      setServerError("");
    }
  }, [hospital_id, password, serverError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const newErrors: LoginFormErrors = {};

    // Client-side validation
    if (!hospital_id.trim()) newErrors.hospital_id = "Hospital ID is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (password.trim() && password.length < 6) newErrors.password = "Password must be at least 6 characters.";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200 px-4 py-10">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
        
        
        {tempInfo.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Demo Credentials</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white p-2 rounded border border-blue-100">
                <span className="block text-gray-500 text-xs">Hospital ID</span>
                <span className="font-mono font-medium text-blue-800">{tempInfo[0]?.hospital_id}</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <span className="block text-gray-500 text-xs">Password</span>
                <span className="font-mono font-medium text-blue-800">{tempInfo[0]?.password}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-200 rounded-full p-2 shadow-md mb-3">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.1" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#ffffff"
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              {serverError}
            </p>
          </div>
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
              onChange={(e) => {
                setHospitalId(e.target.value);
                if (errors.hospital_id) setErrors({...errors, hospital_id: undefined});
              }}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({...errors, password: undefined});
                }}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-blue-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 transition`}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
            className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white py-3 rounded-lg shadow-md text-base font-semibold transition-all flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Yet to sign up as an hospital onboard?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => navigate("/onboarding")}
              >
                Start onboarding
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalLogin;
