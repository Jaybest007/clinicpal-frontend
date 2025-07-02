import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
const Login = () => {

    const [hidden, setHidden] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-10">
        {/* Title */}
        <h1 className="font-bold text-3xl text-center text-gray-800 mb-6">Login</h1>

        {/* Login Form */}
        <form className="space-y-5 w-full">
          {/* Username */}
          <div className="text-base">
            <label htmlFor="username" className="block mb-1 text-gray-700 font-medium">Username</label>
            <input
              type="text"
              id="username"
              className="w-full rounded-lg p-3 bg-neutral-200 focus:bg-neutral-100 border border-neutral-300 focus:border-blue-400 outline-none transition"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Password */}
            <div className="text-base relative">
            <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">Password</label>
            <input
                type={hidden ? "password" : "text"}
                id="password"
                className="w-full rounded-lg p-3 pr-10 bg-neutral-200 focus:bg-neutral-100 border border-neutral-300 focus:border-blue-400 outline-none transition"
                placeholder="Enter password"
                required
            />
            <button
                type="button"
                onClick={() => setHidden(!hidden)}
                className="absolute top-10 right-3 text-gray-600 hover:text-blue-500 focus:outline-none"
            >
                {hidden ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
            </button>
            </div>


          {/* Forgot Password */}
          <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-lime-500 hover:bg-lime-400 text-white font-semibold rounded-lg py-3 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
