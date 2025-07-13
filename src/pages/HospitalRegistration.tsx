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
                navigate("/dashboard")
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
        <div className="min-h-screen flex justify-center items-center bg-neutral-100 px-4">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white rounded-xl drop-shadow-sm p-8 sm:p-10">
                <h1 className="text-center font-bold text-3xl mb-6">Hospital's Onboarding </h1>

                {error.server && (
                <p className="text-red-800 text-center bg-red-100 p-2 mb-2 rounded border border-red-300">
                    {error.server}
                </p>
                )}

                <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
                {/* First & Last Name */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full">
                    <label htmlFor="firstName" className="block mb-1">Hospital's name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.name ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="Enter your first name"
                        onChange={handleInputChange}
                    />
                    {error.name && <p className="text-sm text-red-600 mt-1">{error.name}</p>}
                    </div>

                    <div className="w-full">
                    <label htmlFor="address" className="block mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.address ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="Enter your last name"
                        onChange={handleInputChange}
                    />
                    {error.address && <p className="text-sm text-red-600 mt-1">{error.address}</p>}
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.email ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="Enter your email"
                        onChange={handleInputChange}
                    />
                    {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
                    </div>

                    <div className="w-full">
                    <label htmlFor="phone" className="block mb-1">Phone number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.phone ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="e.g. 080..."
                        onChange={handleInputChange}
                    />
                    {error.phone && <p className="text-sm text-red-600 mt-1">{error.phone}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full p-3 mt-2 font-semibold bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
                >
                    {loading ? "Signing up" : "Create account"}
                </button>

                <p className="text-center">
                    Already had an account? <Link to="/login" className="text-blue-500">Login</Link>
                </p>
                </form>
            </div>
        </div>
    )
}