"use client";
import React, { useState } from "react";
import axios from "axios";

interface SignupProps {
  onClose?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    userType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Handle user type selection
  const handleUserType = (type: string) => {
    setForm({ ...form, userType: type });
  };

  // Submit signup form
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://51.75.68.69:3006/users/signup", form);

      if (response.data?.success) {
        setSuccess("Account created successfully!");
        alert("🎉 Signup successful!");
        onClose?.();
      } else {
        setError(response.data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/ flex items-center justify-center z-50 top-100 right-120">
      <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[50%] md:w-[40%] lg:w-[900px] p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        {step === 1 ? (
          <>
            {/* STEP 1: Choose User Type */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-black">
                Sign up for AbleVu
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Connect with inclusive businesses
              </p>
            </div>

            <form className="space-y-6">
              {["User", "Business", "Contributor"].map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    form.userType === type
                      ? "border-[#0519CE]"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleUserType(type)}
                >
                  <input
                    type="radio"
                    checked={form.userType === type}
                    readOnly
                    className="mt-1 h-5 w-5 text-[#0519CE] focus:ring-[#0519CE]"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      As a {type}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {type === "User"
                        ? "View, review, and save profiles."
                        : type === "Business"
                        ? "Represent and manage a business profile."
                        : "Contribute verified accessibility data."}
                    </p>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.userType}
                className="w-full rounded-lg bg-[#0519CE] py-2 text-white font-medium transition hover:bg-[#0414a8] disabled:opacity-50"
              >
                Next
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-700">
              Already have an account?{" "}
              <a href="#" className="font-bold text-[#0519CE] underline">
                Login
              </a>
            </p>
          </>
        ) : (
          <>
            {/* STEP 2: Signup Form */}
            <div className="mb-6 text-center">
              <img
                src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1734964303683x924828582539070500/Profile.png"
                alt="User Icon"
                className="mx-auto mb-2"
              />
              <h2 className="text-2xl font-semibold text-black">
                Create Your Account
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Connect with inclusive businesses
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSignup}>
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] focus:ring-0"
                  />
                  <label
                    htmlFor="firstName"
                    className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                  >
                    First Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] focus:ring-0"
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                  >
                    Last Name
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="emailAddress"
                  value={form.emailAddress}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] focus:ring-0"
                />
                <label
                  htmlFor="emailAddress"
                  className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] focus:ring-0"
                />
                <label
                  htmlFor="password"
                  className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                >
                  Password
                </label>
              </div>

              {/* Error and Success Messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#0519CE] py-2 font-medium text-white transition hover:bg-[#0414a8] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="mt-1 text-center text-sm text-gray-700">
                Already have an account?{" "}
                <a href="#" className="font-bold text-[#0519CE] underline">
                  Login
                </a>
              </p>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#0519CE] hover:underline"
              >
                ← Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
