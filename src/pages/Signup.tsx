import React, { useEffect, useState } from "react"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface signUpData{
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
        hospital_id: "",
    })

    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        server: "",
        hospital_id: "",
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
    hospital_id:"",
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
      hospital_id: ""
    });
  } catch (err: any) {
    const errData = err?.response?.data;

    const newError: Partial<typeof error> = {};

    // If backend sends field-level errors
    if (Array.isArray(errData?.errors)) {
      errData.errors.forEach((e: { param: string; msg: string }) => {
        newError[e.param as keyof typeof error] = e.msg;
      });
    }

    // If backend sends a direct error object
    if (typeof errData?.error === "object") {
      Object.entries(errData.error).forEach(([key, value]) => {
        newError[key as keyof typeof error] = value as string;
      });
    }

    // If backend sends string error
    if (typeof errData?.error === "string" || errData?.message) {
      newError.server = errData.error || errData.message;
    }

    setError(prev => ({ ...prev, ...newError }));
    toast.error(newError.server || "Signup failed. Please try again.");
  }
};



    return(
        <div className="min-h-screen flex justify-center items-center bg-neutral-100 px-4">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white rounded-xl drop-shadow-sm p-8 sm:p-10">
                <h1 className="text-center font-bold text-3xl mb-6">Staff Onboarding </h1>

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
                    placeholder="enter password"
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
                    placeholder="Confirm password"
                    name="confirmPassword"
                    className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.confirmPassword ? "border border-red-400" : "border-none"
                    } focus:outline-none`}
                    onChange={handleInputChange}
                    />
                    {error.confirmPassword && <p className="text-sm text-red-600 mt-1">{error.confirmPassword}</p>}
                </div>

                    <div className="w-full">
                    <label htmlFor="HospitalCode" className="block mb-1">Hospital Code</label>
                    <input
                        type="text"
                        name="hospital_id"
                        className={`w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 ${
                        error.hospital_id ? "border border-red-400" : "border-none"
                        } focus:outline-none`}
                        placeholder="Enter Hospital code"
                        onChange={handleInputChange}
                    />
                    {error.hospital_id && <p className="text-sm text-red-600 mt-1">{error.hospital_id}</p>}
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