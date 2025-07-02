import { useState } from "react"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom"

const SignUp = () => {

    const [hidden, setHidden] = useState(true);

    return(
        <div className="min-h-screen flex justify-center items-center bg-neutral-100 px-4">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white rounded-xl drop-shadow-sm p-8 sm:p-10">
                <h1 className="text-center font-md text-3xl mb-6">Create Account</h1>
                <form className="space-y-6 max-w-2xl mx-auto">

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full">
                    <label htmlFor="firstName" className="block mb-1">First name</label>
                    <input
                        type="text"
                        id="firstName"
                        className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border-none focus:outline-none"
                        placeholder="Enter your first name"
                        required
                    />
                    </div>

                    <div className="w-full">
                    <label htmlFor="lastName" className="block mb-1">Last name</label>
                    <input
                        type="text"
                        id="lastName"
                        className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border-none focus:outline-none"
                        placeholder="Enter your last name"
                        required
                    />
                    </div>
                </div>

                
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border-none focus:outline-none"
                        placeholder="Enter your email"
                        required
                    />
                    </div>

                    <div className="w-full">
                    <label htmlFor="phone" className="block mb-1">Phone number</label>
                    <input
                        type="tel"
                        id="phone"
                        className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border-none focus:outline-none"
                        placeholder="e.g. 080..."
                    />
                    </div>
                </div>

                
                {/* Password */}
                <div className="w-full relative">
                <label htmlFor="password" className="block mb-1">Password</label>
                <input
                    type={hidden ? "password" : "text"}
                    id="password"
                    className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border-none focus:outline-none pr-20"
                    required
                />
                <button
                    type="button"
                    onClick={() => setHidden(!hidden)}
                    className="absolute right-4 top-[42px] text-sm text-blue-500 hover:underline"
                >
                    {hidden ?  <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                </button>
                </div>

                {/* Confirm Password */}
                <div className="w-full">
                <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                <input
                    type={hidden ? "password" : "text"}
                    id="confirmPassword"
                    className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border-none focus:outline-none"
                    required
                />
                
                </div>

                <button
                    type="submit"
                    className="w-full p-3 mt-2 font-semibold bg-blue-400 hover:bg-blue-300 text-white rounded-lg transition-colors"
                >
                    Create account
                </button>

                <p className="text-center">Already had an account? <Link to="/login" className="text-blue-500">Login</Link> </p>

                </form>
            </div>
        </div>

    )
}

export default SignUp