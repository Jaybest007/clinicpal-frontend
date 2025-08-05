import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiLoader, FiInfo } from "react-icons/fi";

interface SignUpData {
    name: string;
    address: string;
    email: string;
    phone: string;
}

export const HospitalRegistration = () => {
    const { loading, hospital_Signup } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<SignUpData>({
        name: "",
        address: "",
        email: "",
        phone: ""
    });
    
    const [error, setError] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        server: ""
    });

    const [acceptTerms, setAcceptTerms] = useState(false);

    // Handle input changes with validation
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === "phone") {
            // Only allow digits and limit to 11
            const cleanedPhone = value.replace(/[^\d]/g, "").slice(0, 11);
            setFormData(prev => ({ ...prev, [name]: cleanedPhone }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for this field
        setError(prev => ({ ...prev, [name]: "" }));
        
        // Validate email format if field is email
        if (name === "email" && value.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setError(prev => ({ ...prev, [name]: "Enter a valid email" }));
            }
        }
    };

    // Form submission handler
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const { name, address, email, phone } = formData;

        // Validate all fields
        const newError: Partial<typeof error> = {};

        if (name.trim() === "") newError.name = "Hospital name is required";
        if (address.trim() === "") newError.address = "Hospital address is required";
        
        if (email.trim() === "") {
            newError.email = "Email address is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newError.email = "Enter a valid email";
            }
        }
        
        if (phone.trim() === "") {
            newError.phone = "Phone number is required";
        } else if (phone.length < 11) {
            newError.phone = "Phone number must be 11 digits";
        }

        if (!acceptTerms) {
            toast.error("Please accept the terms and conditions to continue");
            return;
        }

        if (Object.keys(newError).length > 0) {
            setError(prev => ({ ...prev, ...newError }));
            return;
        }

        // Clear errors before submission
        setError({
            name: "",
            address: "",
            email: "",
            phone: "",
            server: ""
        });

        try {
            await hospital_Signup(formData);
            toast.success("Hospital registered successfully!");
            
            // Reset form
            setFormData({
                name: "",
                address: "",
                email: "",
                phone: ""
            });
            
            navigate("/hq/login", { replace: true });
        } catch (err: any) {
            const serverErr =
                err.response?.data?.error?.server ||
                err.response?.data?.message ||
                "Registration failed. Please try again.";

            setError(prev => ({ ...prev, server: serverErr }));
            toast.error(serverErr);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-neutral-100 px-4 py-8">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white rounded-2xl shadow-lg p-8 sm:p-10">
                <h1 className="text-center font-bold text-3xl mb-2 text-blue-700">
                    Hospital Registration
                </h1>
                
                <div className="text-center mb-6 text-gray-600 text-sm">
                    Join ClinicPal to streamline your hospital management, patient records, and billing operations.
                </div>

                {error.server && (
                    <div className="text-red-800 text-center bg-red-100 p-3 mb-4 rounded-lg border border-red-300">
                        {error.server}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Hospital Name */}
                    <div>
                        <label htmlFor="name" className="block mb-1.5 font-medium text-gray-700">
                            Hospital Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg p-3 border ${
                                error.name ? "border-red-400" : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                            placeholder="Enter hospital name"
                        />
                        {error.name && <p className="mt-1 text-sm text-red-600">{error.name}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block mb-1.5 font-medium text-gray-700">
                            Hospital Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg p-3 border ${
                                error.address ? "border-red-400" : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                            placeholder="Enter complete address"
                        />
                        {error.address && <p className="mt-1 text-sm text-red-600">{error.address}</p>}
                    </div>

                    {/* Email & Phone in a grid on larger screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="email" className="block mb-1.5 font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg p-3 border ${
                                    error.email ? "border-red-400" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                placeholder="hospital@example.com"
                            />
                            {error.email && <p className="mt-1 text-sm text-red-600">{error.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block mb-1.5 font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg p-3 border ${
                                    error.phone ? "border-red-400" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                placeholder="08012345678"
                            />
                            {error.phone ? (
                                <p className="mt-1 text-sm text-red-600">{error.phone}</p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">Enter 11-digit number</p>
                            )}
                        </div>
                    </div>

                    {/* Information Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Important Information</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>An admin account will be created using your email address</li>
                                    <li>You'll receive setup instructions via email</li>
                                    <li>Standard subscription fees apply after the 14-day trial</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start mb-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptTerms}
                                onChange={() => setAcceptTerms(!acceptTerms)}
                                className="mt-1 mr-2"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, including:
                            </label>
                        </div>
                        <div className="text-xs text-gray-600 pl-6">
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Processing and storing patient data in accordance with health regulations</li>
                                <li>Maintaining the confidentiality of all medical information</li>
                                <li>Abiding by data protection and security protocols</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 mt-6 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin mr-2" />
                                Creating Account...
                            </>
                        ) : (
                            "Register Hospital"
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-gray-700">
                            Already have an account?{" "}
                            <Link to="/hq/login" className="text-blue-600 font-medium hover:underline">
                                Login here
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Need help? <a href="mailto:support@clinicpal.com" className="text-blue-600 hover:underline">Contact support</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};