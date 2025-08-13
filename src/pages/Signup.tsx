import React, { useEffect, useState, useCallback, memo } from "react";
import { FaEyeSlash, FaEye, FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLoader } from "react-icons/fi";

interface signUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  hospital_id: string;
}

// Memoized input field component to prevent unnecessary re-renders
const InputField = memo(({ 
  label, 
  name, 
  type = "text", 
  icon, 
  placeholder, 
  value, 
  onChange,
  errorMessage,
  ...props 
}: { 
  label: string;
  name: string;
  type?: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  [key: string]: any;
}) => (
  <div className="w-full">
    <label htmlFor={name} className="block mb-1 text-gray-700 font-medium text-sm">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg p-2.5 pl-10 bg-blue-50/70 focus:bg-white border ${
          errorMessage ? "border-red-300" : "border-blue-200"
        } outline-none text-gray-800`}
        autoComplete="off"
        data-lpignore="true"
        {...props}
      />
      {name.includes("password") && props.showPasswordToggle && (
        <button
          type="button"
          onClick={props.onTogglePassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 focus:outline-none"
          tabIndex={-1}
        >
          {props.isPasswordHidden ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      )}
    </div>
    {errorMessage && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{errorMessage}</span>
      </p>
    )}
  </div>
));

// Prevent unnecessary re-renders
InputField.displayName = 'InputField';

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

  // Memoize input handler to prevent recreation on each render
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "phone") {
      updatedValue = value.replace(/[^\d]/g, "").slice(0, 11);
    }
    
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    
    // Don't validate on every keystroke for better performance
    if (value.length > 3) {
      let errorMsg = "";
      
      if (name === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Please enter a valid email address";
        }
      }

      if (name === "password" && value) {
        const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!PasswordRegex.test(value)) {
          errorMsg = "Password must be at least 6 characters, include letters and numbers";
        }
      }

      if (name === "confirmPassword" && value) {
        if (value !== formData.password) {
          errorMsg = "Passwords do not match";
        }
      }

      if (errorMsg) {
        setError(prev => ({ ...prev, [name]: errorMsg }));
      } else {
        setError(prev => ({ ...prev, [name]: "" }));
      }
    } else {
      setError(prev => ({ ...prev, [name]: "" }));
    }
  }, [formData.password]);

  // Memoize toggle password handler
  const togglePasswordVisibility = useCallback(() => {
    setHidden(prev => !prev);
  }, []);

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
    if (email && !emailRegex.test(email)) {
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

  // Common props for password fields
  const passwordProps = {
    showPasswordToggle: true,
    isPasswordHidden: hidden,
    onTogglePassword: togglePasswordVisibility
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 my-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl text-blue-900 mb-2">
            Staff Onboarding
          </h1>
          <p className="text-blue-600 text-sm">
            Create your account to join your hospital team
          </p>
        </div>

        {/* Error Message */}
        {error.server && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error.server}</span>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
          <div className="font-medium mb-1">Important Information:</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>You'll need your hospital code to register</li>
            <li>Your account will need approval before you can access the system</li>
            <li>Use a secure password with letters and numbers</li>
          </ul>
        </div>

        {/* Signup Form */}
        <form 
          className="space-y-4 w-full" 
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              icon={<FaUser className="h-4 w-4 text-blue-400" />}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              errorMessage={error.firstName}
              required
            />
            
            <InputField
              label="Last Name"
              name="lastName"
              icon={<FaUser className="h-4 w-4 text-blue-400" />}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              errorMessage={error.lastName}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              icon={<FaEnvelope className="h-4 w-4 text-blue-400" />}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              errorMessage={error.email}
              required
            />
            
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              icon={<FaPhone className="h-4 w-4 text-blue-400" />}
              placeholder="e.g. 080..."
              value={formData.phone}
              onChange={handleInputChange}
              errorMessage={error.phone}
              required
              inputMode="numeric"
            />
          </div>

          <InputField
            label="Hospital Code"
            name="hospital_id"
            icon={<FaBuilding className="h-4 w-4 text-blue-400" />}
            placeholder="Enter your hospital code"
            value={formData.hospital_id.toUpperCase()}
            onChange={handleInputChange}
            errorMessage={error.hospital_id}
            required
          />

          <InputField
            label="Password"
            name="password"
            type={hidden ? "password" : "text"}
            icon={<FaLock className="h-4 w-4 text-blue-400" />}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
            errorMessage={error.password}
            required
            {...passwordProps}
          />
          
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type={hidden ? "password" : "text"}
            icon={<FaLock className="h-4 w-4 text-blue-400" />}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            errorMessage={error.confirmPassword}
            required
            {...passwordProps}
          />
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold rounded-lg py-2.5 mt-2 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <FiLoader className="animate-spin h-4 w-4" aria-hidden="true" />
                <span>Creating Account...</span>
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-grow h-px bg-blue-100" />
          <span className="mx-3 text-blue-400 text-xs font-medium">OR</span>
          <div className="flex-grow h-px bg-blue-100" />
        </div>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;