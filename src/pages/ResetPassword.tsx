import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<boolean>(false);
    const { resetPassword, loading } = useAuth();

    // Parse URL params on component mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get("token");
        const emailParam = queryParams.get("email");
        
        if (tokenParam) setToken(tokenParam);
        if (emailParam) setEmail(emailParam);
    }, [location]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!token) newErrors.token = "Reset token is missing";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            await resetPassword(token, email, password);
            setSuccess(true);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error: any) {
            const message = error?.response?.data?.error || 
                error?.response?.data?.message || 
                "Password reset failed";
                
            setErrors({ server: message });
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-12">
            <div className="w-full max-w-md">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-xl font-bold text-white text-center">Reset Your Password</h1>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        {success ? (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-center py-6"
                            >
                                <div className="mb-4 flex justify-center">
                                    <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
                                <p className="text-gray-600 mb-4">Your password has been successfully updated.</p>
                                <p className="text-sm text-gray-500">Redirecting to login page...</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <p className="text-gray-600 text-sm mb-4">
                                    Enter your new password below. Your password should be at least 6 characters long.
                                </p>
                                
                                {/* Email field (hidden if already provided in URL) */}
                                {!email && (
                                    <div>
                                        <label htmlFor="email" className="block mb-1.5 text-gray-700 font-medium text-sm">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full rounded-lg p-2.5 bg-blue-50/70 focus:bg-white border ${
                                                errors.email ? "border-red-400" : "border-blue-200"
                                            } focus:border-blue-400 outline-none transition-all duration-200 text-gray-800`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                )}
                                
                                {/* Password field */}
                                <div>
                                    <label htmlFor="password" className="block mb-1.5 text-gray-700 font-medium text-sm">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full rounded-lg p-2.5 pl-10 pr-10 bg-blue-50/70 focus:bg-white border ${
                                                errors.password ? "border-red-400" : "border-blue-200"
                                            } focus:border-blue-400 outline-none transition-all duration-200 text-gray-800`}
                                            placeholder="Enter new password"
                                        />
                                        <div 
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>
                                
                                {/* Confirm Password field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-1.5 text-gray-700 font-medium text-sm">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full rounded-lg p-2.5 pl-10 bg-blue-50/70 focus:bg-white border ${
                                                errors.confirmPassword ? "border-red-400" : "border-blue-200"
                                            } focus:border-blue-400 outline-none transition-all duration-200 text-gray-800`}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>
                                
                                {/* Server error message */}
                                {errors.server && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-3 bg-red-50 rounded-lg flex items-start"
                                    >
                                        <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span className="text-sm text-red-600">{errors.server}</span>
                                    </motion.div>
                                )}
                                
                                {/* Token missing error */}
                                {errors.token && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-3 bg-red-50 rounded-lg flex items-start"
                                    >
                                        <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span className="text-sm text-red-600">
                                            Invalid reset link. Please request a new password reset.
                                        </span>
                                    </motion.div>
                                )}
                                
                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Resetting Password...</span>
                                        </>
                                    ) : "Reset Password"}
                                </button>
                                
                                {/* Back to login */}
                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
