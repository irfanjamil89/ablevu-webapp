"use client";
import React, { useState } from "react";
import axios from "axios";

interface LoginProps {
  setOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenForgotPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  
}

const Login: React.FC<LoginProps> = ({ setOpenLoginModal, setOpenSignupModal, setOpenForgotPasswordModal }) => {
  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
  const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+"/auth/login", {
    username: email,
    password: password,
  });

  

  // The API returns { access_token: "..." } with status 201
  if (response.status === 201 && response.data?.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
    window.location.href="/dashboard";
  } 
  else {
    setError("Invalid credentials or unexpected response.");
  }
} catch (err: any) {
  console.error("Login failed:", err?.response?.data || err);
  setError("Invalid credentials or server error.");
} finally {
  setLoading(false);
}

  };

  

  return (
   <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs">
  <div className="relative bg-white rounded-2xl shadow-2xl w-[550px] max-w-md p-8">
        {/* Close Button */}
        <button
          onClick={()=>setOpenLoginModal(false)}
          className="absolute top-3 right-3 text-gray-500 p-0 hover:text-gray-800 text-xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* Image + Heading */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1734964303683x924828582539070500/Profile.png"
            alt="User Icon"
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold text-black text-center">
            Log In to AbleVu
          </h2>
          <p className="text-gray-600 text-sm text-center mt-1">
            Connect with inclusive businesses
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
              Password
            </label>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-between">
            {/* Keep me logged in checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepMeLoggedIn"
                className="h-4 w-4 text-[#0519CE] border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="keepMeLoggedIn"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            {/* Forgot Password link */}
            <div>
              <button
                onClick={() => {setOpenForgotPasswordModal(true),setOpenLoginModal(false)} }
                className="text-sm text-[#0519CE] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0519CE] hover:bg-[#0212a0] text-white font-medium rounded-lg py-2 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-700 mt-4">
          New to AbleVu?{" "}
          <button className="text-[#0519CE] underline font-bold cursor-pointer" onClick={()=>{
            setOpenLoginModal(false)
            setOpenSignupModal(true) 
          }}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
