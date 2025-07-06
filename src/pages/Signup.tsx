import React, { useEffect, useState } from "react"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface signUpData{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}


const SignUp = () => {
    useEffect(() => {
        document.title = "Signup - ClinicPal App";
      }, []);   
    
     

    const [hidden, setHidden] = useState(true);
    const {signup, loading, user} = useAuth();
    const navigate = useNavigate();
    
    useEffect( () => {
        if(user){
            navigate("/dashboard");
        }
      },[user, navigate])

    const [formData, setFormData] = useState<signUpData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })

    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        server: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        //====validate and cleane phone number=====
        let updatedValue = value;
        if (name === "phone") {
            updatedValue = value.replace(/[^\d]/g, "").slice(0, 11);
        }
        setFormData(prev => ({ ...prev, [name]: updatedValue }));
        setError(prev => ({ ...prev, [name]: "" }));

        // ===== Validate email ===========
        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
            setError(prev => ({ ...prev, [name]: "Please enter a valid email address" }));
            }
        }

        //=====validate the password=======
        if (name === "password"){
            const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
            if(!PasswordRegex.test(formData.password)){
                setError(prev => ({...prev, [name]: "Password must be at least 6 characters, include uppercase or lowercase, and number." }))
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

    //=====Handle submision========
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const {firstName, lastName, email, phone, password, confirmPassword} = formData;

        const newError: Partial<typeof error> = {};

        if (firstName.trim() === "") newError.firstName = "First name can't be empty";
        if (lastName.trim() === "") newError.lastName = "Last name can't be empty";
        if (email.trim() === "") newError.email = "Email can't be empty";
        if (phone.toString().trim() === "") newError.phone = "Phone can't be empty";
        if (password.trim() === "") newError.password = "Password can't be empty";
        if (confirmPassword.trim() === "") newError.confirmPassword = "Confirm password can't be empty";
        if (password !== confirmPassword) newError.confirmPassword = "Passwords do not match";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //let validate email
        if(!emailRegex.test(formData.email)){
            setError(prev => ({...prev, email: "Please enter a valid email address"}))
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
            server: ""
        });

        try{
            await signup(formData);
            setError(prev => ({ ...prev, server: "" }));
        
        } catch(err: any){
            const serverErr = err.res.data.error || "Signup failed. Please try again.";
            setError(serverErr);
        }

        
    }


    return(
        <div className="min-h-screen flex justify-center items-center bg-neutral-100 px-4">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white rounded-xl drop-shadow-sm p-8 sm:p-10">
                <h1 className="text-center font-md text-3xl mb-6">Create Account</h1>

                {error.server && (
                <p className="text-red-800 text-center bg-red-100 p-2 mb-2 rounded border border-red-300">
                    {error.server}
                </p>
                )}

                <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
                {/* First & Last Name */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full">
                    <label htmlFor="firstName" className="block mb-1">First name</label>
                    <input
                        type="text"
                        name="firstName"
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.firstName ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="Enter your first name"
                        onChange={handleInputChange}
                    />
                    {error.firstName && <p className="text-sm text-red-600 mt-1">{error.firstName}</p>}
                    </div>

                    <div className="w-full">
                    <label htmlFor="lastName" className="block mb-1">Last name</label>
                    <input
                        type="text"
                        name="lastName"
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.lastName ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="Enter your last name"
                        onChange={handleInputChange}
                    />
                    {error.lastName && <p className="text-sm text-red-600 mt-1">{error.lastName}</p>}
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
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

                {/* Password */}
                <div className="w-full relative">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                    type={hidden ? "password" : "text"}
                    name="password"
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.password ? "border border-red-400" : "border-none"
                    } focus:outline-none pr-20`}
                    onChange={handleInputChange}
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

                {/* Confirm Password */}
                <div className="w-full">
                    <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                    <input
                    type={hidden ? "password" : "text"}
                    name="confirmPassword"
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.confirmPassword ? "border border-red-400" : "border-none"
                    } focus:outline-none`}
                    onChange={handleInputChange}
                    />
                    {error.confirmPassword && <p className="text-sm text-red-600 mt-1">{error.confirmPassword}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full p-3 mt-2 font-semibold bg-blue-400 hover:bg-blue-300 text-white rounded-lg transition-colors"
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

export default SignUp