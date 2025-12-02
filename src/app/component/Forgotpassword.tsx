"use client";
import React, { useState } from "react";

interface ForgotPasswordProps {
  setOpenForgotPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSuccessModal:React.Dispatch<React.SetStateAction<boolean>>;
  
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  setOpenForgotPasswordModal,
  setOpenLoginModal,
  setOpenSuccessModal,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Replace with actual API call
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+"/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Password reset link sent! Please check your email.");
      } else {
        setError(data.message || "Error resetting password. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl shadow-2xl w-[550px] max-w-md p-8">
        {/* Close Button */}
        <button
          onClick={() => setOpenForgotPasswordModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* Header + Icon */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="assets/images/pass.avif"
            alt="Security Icon"
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold text-black text-center">Forgot Password</h2>
          <p className="text-gray-600 text-sm text-center mt-1">Enter your email to reset your password</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          {/* Email Address */}
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
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
              Email Address
            </label>
          </div>

          {/* Resend Link */}
          {/* <div className="text-right">
            <button
              onClick={() => setSuccess("Resending link...")} // This can trigger a resend action if needed
              type="button"
              className="text-[#0519CE] text-sm underline font-bold cursor-pointer"
            >
              Resend Link
            </button>
          </div> */}

          {success && <p className="text-green-500 text-sm">{success}</p>}
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Send Link Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0519CE] hover:bg-[#0212a0] cursor-pointer text-white font-medium rounded-lg py-2 transition disabled:opacity-60"
          >
            {loading ? "Sending Link..." : "Send Link"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-700 mt-4">
          Remember Your Password?{" "}
          <button
            className="text-[#0519CE] underline font-bold cursor-pointer"
            onClick={() => {
              setOpenForgotPasswordModal(false);
              setOpenLoginModal(true);
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
