import React, { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useNavigate } from "react-router-dom";


interface LoginFormErrors {
  hospital_id?: string;
  password?: string;
}

const HospitalLogin: React.FC = () => {
  const [hospital_id, setHospitalId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const {hospitalLogin, loading} = useHospital();
  const navigate = useNavigate()

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
      await hospitalLogin({hospital_id, password});
      setHospitalId("");
      setPassword("");
      setErrors({});
      navigate("/hq", {replace: true});
    } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
        setServerError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-semibold text-center text-blue-800 mb-4">
          Hospital Login
        </h2>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hospital ID */}
          <div>
            <label htmlFor="hospital_id" className="block text-gray-700 mb-1">
              Hospital ID
            </label>
            <input
              type="text"
              id="hospital_id"
              value={hospital_id}
              onChange={(e) => setHospitalId(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.hospital_id ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.hospital_id && (
              <p className="text-red-500 text-sm mt-1">{errors.hospital_id}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            {loading ? "Logging..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalLogin;
