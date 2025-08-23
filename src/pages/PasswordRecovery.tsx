import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const PasswordRecovery = () => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { passwordRecovery, loading } = useAuth();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e.target.value)){
            setError("Invalid email address");
        } else {
            setError(null);
        }
        setEmail(e.target.value);
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!email.trim()){
            setError("Email is required");
            return;
        } else{
            setError(null);
        }

        try{
            await passwordRecovery(email);
            setEmail("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch(error: any) {
            const message =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Password recovery failed";
            setError(message);
            setSuccess(false);
        }
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-12">
            <div className="w-full max-w-md">
                
                {/* Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-xl font-bold text-white text-center">Password Recovery</h1>
                    </div>
                    
                    {/* Form */}
                    <div className="p-6">
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-green-700 text-sm font-medium">
                                        Recovery email sent! Please check your inbox.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                        
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <p className="text-gray-600 text-sm mb-4">
                                Enter your email address below and we'll send you instructions to reset your password.
                            </p>
                            
                            {/* Email input */}
                            <div>
                                <label htmlFor="email" className="block mb-1.5 text-gray-700 font-medium text-sm">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={handleInput}
                                        placeholder="Enter your email"
                                        className="w-full rounded-lg p-2.5 pl-10 bg-blue-50/70 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition-all duration-200 text-gray-800"
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* Error message */}
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 bg-red-50 rounded-lg flex items-start"
                                >
                                    <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-sm text-red-600">{error}</span>
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
                                        <span>Sending...</span>
                                    </>
                                ) : "Send Recovery Email"}
                            </button>
                            
                            {/* Back to login */}
                            <div className="text-center mt-4">
                                <Link to="/login" className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}