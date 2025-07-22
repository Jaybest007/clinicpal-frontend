import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/CP.png"; 


interface signUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  hospital_id: string;
}

const SignUp = () => {
  useEffect(() => {
    document.title = "Signup - ClinicPal App";
  }, []);

  const [hidden, setHidden] = useState(true);
  const { signup, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState<signUpData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    hospital_id: "",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    server: "",
    hospital_id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "phone") {
      updatedValue = value.replace(/[^\d]/g, "").slice(0, 11);
    }
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setError(prev => ({ ...prev, [name]: "" }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError(prev => ({ ...prev, [name]: "Please enter a valid email address" }));
      }
    }

    if (name === "password") {
      const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      if (!PasswordRegex.test(formData.password)) {
        setError(prev => ({
          ...prev,
          [name]: "Password must be at least 6 characters, include uppercase or lowercase, and number.",
        }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setError(prev => ({ ...prev, [name]: "Passwords do not match" }));
      } else {
        setError(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { firstName, lastName, email, phone, password, confirmPassword, hospital_id } = formData;

    const newError: Partial<typeof error> = {};

    if (!firstName.trim()) newError.firstName = "First name can't be empty";
    if (!lastName.trim()) newError.lastName = "Last name can't be empty";
    if (!email.trim()) newError.email = "Email can't be empty";
    if (!phone.trim()) newError.phone = "Phone can't be empty";
    if (!password.trim()) newError.password = "Password can't be empty";
    if (!confirmPassword.trim()) newError.confirmPassword = "Confirm password can't be empty";
    if (password !== confirmPassword) newError.confirmPassword = "Passwords do not match";
    if (!hospital_id.trim()) newError.hospital_id = "Hospital code is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newError.email = "Please enter a valid email address";
    }

    if (Object.keys(newError).length > 0) {
      setError(prev => ({ ...prev, ...newError }));
      return;
    }

    setError({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      server: "",
      hospital_id: "",
    });

    try {
      await signup(formData);
      toast.success("User created successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        hospital_id: "",
      });
    } catch (err: any) {
      const errData = err?.response?.data;

      const newError: Partial<typeof error> = {};

      if (Array.isArray(errData?.errors)) {
        errData.errors.forEach((e: { param: string; msg: string }) => {
          newError[e.param as keyof typeof error] = e.msg;
        });
      }

      if (typeof errData?.error === "object") {
        Object.entries(errData.error).forEach(([key, value]) => {
          newError[key as keyof typeof error] = value as string;
        });
      }

      if (typeof errData?.error === "string" || errData?.message) {
        newError.server = errData.error || errData.message;
      }

      setError(prev => ({ ...prev, ...newError }));
      toast.error(newError.server || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border border-blue-100 my-4">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="ClinicPal Logo"
            className="w-16 h-16 mb-2 rounded-full shadow-lg"
          />
          <h1 className="font-extrabold text-3xl sm:text-4xl text-blue-900 mb-2 tracking-tight">
            Staff Onboarding
          </h1>
          <p className="text-blue-700 text-base font-medium text-center">
            Create your ClinicPal account to join your hospital team.
          </p>
        </div>

        {/* Error Message */}
        {error.server && (
          <p className="text-red-800 text-center bg-red-100 p-2 mb-2 rounded border border-red-300 font-semibold">
            {error.server}
          </p>
        )}

        {/* Signup Form */}
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full">
              <label htmlFor="firstName" className="block mb-1 text-gray-700 font-semibold">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium ${
                  error.firstName ? "border-red-400" : ""
                }`}
                placeholder="Enter your first name"
                onChange={handleInputChange}
                value={formData.firstName}
              />
              {error.firstName && <p className="text-sm text-red-600 mt-1">{error.firstName}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="lastName" className="block mb-1 text-gray-700 font-semibold">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium ${
                  error.lastName ? "border-red-400" : ""
                }`}
                placeholder="Enter your last name"
                onChange={handleInputChange}
                value={formData.lastName}
              />
              {error.lastName && <p className="text-sm text-red-600 mt-1">{error.lastName}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full">
              <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium ${
                  error.email ? "border-red-400" : ""
                }`}
                placeholder="Enter your email"
                onChange={handleInputChange}
                value={formData.email}
              />
              {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="phone" className="block mb-1 text-gray-700 font-semibold">
                Phone number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium ${
                  error.phone ? "border-red-400" : ""
                }`}
                placeholder="e.g. 080..."
                onChange={handleInputChange}
              />
              {error.phone && <p className="text-sm text-red-600 mt-1">{error.phone}</p>}
            </div>
          </div>

          <div className="w-full relative">
            <label htmlFor="password" className="block mb-1 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type={hidden ? "password" : "text"}
              name="password"
              placeholder="Enter password"
              className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium pr-20 ${
                error.password ? "border-red-400" : ""
              }`}
              onChange={handleInputChange}
              value={formData.password}
            />
            <button
              type="button"
              onClick={() => setHidden(!hidden)}
              className="absolute right-4 top-[42px] text-sm text-blue-500 hover:underline"
            >
              {hidden ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {error.password && <p className="text-sm text-red-600 mt-1">{error.password}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="confirmPassword" className="block mb-1 text-gray-700 font-semibold">
              Confirm Password
            </label>
            <input
              type={hidden ? "password" : "text"}
              placeholder="Confirm password"
              name="confirmPassword"
              className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium ${
                error.confirmPassword ? "border-red-400" : ""
              }`}
              onChange={handleInputChange}
              value={formData.confirmPassword}
            />
            {error.confirmPassword && <p className="text-sm text-red-600 mt-1">{error.confirmPassword}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="HospitalCode" className="block mb-1 text-gray-700 font-semibold">
              Hospital Code
            </label>
            <input
              type="text"
              name="hospital_id"
              className={`w-full rounded-lg p-3 bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition text-blue-900 font-medium ${
                error.hospital_id ? "border-red-400" : ""
              }`}
              placeholder="Enter Hospital code"
              onChange={handleInputChange}
              value={formData.hospital_id}
            />
            {error.hospital_id && <p className="text-sm text-red-600 mt-1">{error.hospital_id}</p>}
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-2 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md transition-colors hover:from-blue-400 hover:to-indigo-400"
          >
            {loading ? "Signing up..." : "Create account"}
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-grow h-px bg-blue-100" />
            <span className="mx-4 text-blue-400 font-semibold text-xs">OR</span>
            <div className="flex-grow h-px bg-blue-100" />
          </div>

          <div className="text-center text-sm text-blue-700 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 underline font-bold">
              Login
            </Link>
          </div>
        </form>

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

export default SignUp;