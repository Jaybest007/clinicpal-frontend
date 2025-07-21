import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
interface signUpData{
    name: string;
    address: string;
    email: string;
    phone: string;
}
export const HospitalRegistration = () => {
    
    const {loading, hospital_Signup} = useAuth();
    const navigate = useNavigate()
    const [formData, setFormData] = useState<signUpData>({
            name: "",
            address: "",
            email: "",
            phone: "",
            
        })
    
        const [error, setError] = useState({
            name: "",
            address: "",
            email: "",
            phone: "",
            server: ""
        })


        //handleInput change
        const handleInputChange =(event: React.ChangeEvent <HTMLInputElement>) =>{
            const {name, value} = event.target;

            setFormData((prev) => ({...prev, [name]: value}));
            setError((prev) => ({...prev, [name]: ""}));

            if(name === "phone"){
                const value = event.target.value
                const cleanedPhone = value.replace(/[^\d]/g, "").slice(0, 11);
                setFormData((prev => ({...prev, [name]: cleanedPhone})))
            };

            if(name === "email"){
                const value = event.target.value
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(value)){
                    setError((prev) => ({...prev, [name]: "Enter a valid email"}));
                }
            }
            
        }

        //handle submit
        const handleSubmit = async(event: React.FormEvent)=> {
            event.preventDefault();
            const { name, address , email, phone} = formData;

            const newError:Partial<typeof error> = {};

            if ( name.trim() === "") newError.name = "Hospital's name is required";
            if (address.trim() === "") newError.address = "Hospital's address is required";
            if (email.trim() === "") newError.email = "Hospital's Email is required";
            if (phone.trim() === "") newError.phone = "Hospital's phone number is required";

            if(Object.keys(newError).length > 0){
             setError(prev => ({ ...prev, ...newError }));
            return;
        }
            setError({
                name: "",
                address: "",
                email: "",
                phone: "",
                server: ""
            })

            try{
                await hospital_Signup(formData);   
                setFormData({
                    name: "",
                    address: "",
                    email: "",
                    phone: "",
                })
                navigate("/hq/login", {replace: true});
            }catch(err: any) {
                const serverErr =
                    err.response?.data?.error?.server ||
                    err.response?.data?.message ||
                    "Signup failed. Please try again.";

                setError(prev => ({ ...prev, server: serverErr }));
                toast.error(serverErr);
                }

        }

       
    return(
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-neutral-100 px-4">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white rounded-2xl shadow-lg p-8 sm:p-12">
            <h1 className="text-center font-extrabold text-4xl mb-8 text-blue-700 tracking-tight">
                Welcome to Hospital Onboarding
            </h1>
            <p className="text-center text-neutral-600 mb-6">
                Register your hospital to unlock seamless management and patient care.
            </p>

            {error.server && (
                <div className="text-red-800 text-center bg-red-100 p-3 mb-4 rounded-lg border border-red-300 font-medium">
                {error.server}
                </div>
            )}

            <form className="space-y-8 max-w-2xl mx-auto" onSubmit={handleSubmit}>
                {/* Hospital Name & Address */}
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                <div className="w-full">
                    <label htmlFor="name" className="block mb-2 font-semibold text-neutral-700">
                    Hospital Name
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-white ${
                        error.name ? "border border-red-400" : "border border-neutral-300"
                    } focus:outline-none transition`}
                    placeholder="Enter hospital name"
                    onChange={handleInputChange}
                    autoComplete="organization"
                    />
                    {error.name && <p className="text-sm text-red-600 mt-1">{error.name}</p>}
                </div>

                <div className="w-full">
                    <label htmlFor="address" className="block mb-2 font-semibold text-neutral-700">
                    Address
                    </label>
                    <input
                    type="text"
                    name="address"
                    value={formData.address}
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-white ${
                        error.address ? "border border-red-400" : "border border-neutral-300"
                    } focus:outline-none transition`}
                    placeholder="Enter hospital address"
                    onChange={handleInputChange}
                    autoComplete="street-address"
                    />
                    {error.address && <p className="text-sm text-red-600 mt-1">{error.address}</p>}
                </div>
                </div>

                {/* Email & Phone */}
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                <div className="w-full">
                    <label htmlFor="email" className="block mb-2 font-semibold text-neutral-700">
                    Email Address
                    </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-white ${
                        error.email ? "border border-red-400" : "border border-neutral-300"
                    } focus:outline-none transition`}
                    placeholder="Enter hospital email"
                    onChange={handleInputChange}
                    autoComplete="email"
                    />
                    {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
                </div>

                <div className="w-full">
                    <label htmlFor="phone" className="block mb-2 font-semibold text-neutral-700">
                    Phone Number
                    </label>
                    <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-white ${
                        error.phone ? "border border-red-400" : "border border-neutral-300"
                    } focus:outline-none transition`}
                    placeholder="e.g. 08012345678"
                    onChange={handleInputChange}
                    autoComplete="tel"
                    />
                    {error.phone && <p className="text-sm text-red-600 mt-1">{error.phone}</p>}
                </div>
                </div>

                <button
                type="submit"
                className="w-full p-3 mt-2 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow"
                disabled={loading}
                >
                {loading ? "Creating Account..." : "Create Hospital Account"}
                </button>

                <p className="text-center mt-6 text-neutral-700">
                Already have an account?{" "}
                <Link to="/hq/login" className="text-blue-600 font-semibold hover:underline">
                    Login here
                </Link>
                </p>
            </form>
            </div>
        </div>
    )
}