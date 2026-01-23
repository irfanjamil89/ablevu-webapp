"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";


interface SignupProps {
  setOpenSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSuccessModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Signup: React.FC<SignupProps> = ({ setOpenSignupModal, setOpenLoginModal, setOpenSuccessModal }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "", // Changed from emailAddress to email
    password: "",
    userType: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };


  // Handle user type selection
  const handleUserType = (type: string) => {
    setForm({ ...form, userType: type });
  };

  const [passwordFocus, setPasswordFocus] = useState(false);

  const [rules, setRules] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm({ ...form, password: value });

    // validation rules
    setRules({
      length: value.length >= 12,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%]/.test(value),
    });
  };


  // Submit signup form
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Ensure the correct payload format
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      emailAddress: form.emailAddress, // Matching field name
      password: form.password,
      userType: form.userType,
      consent: form.consent,

    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "users/signup",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );


      if (response.status === 201) {
        setSuccess("Your account has been created successfully! You’ll be redirected shortly.");
        setOpenSignupModal(false);
        setOpenSuccessModal(true);
      } else {
        setError(response.data?.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl shadow-2xl w-[550px]  p-8">
        {/* Close Button */}
        <button
          onClick={() => setOpenSignupModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
        >
          ×
        </button>

        {step === 1 ? (
          <>
            {/* STEP 1: Choose User Type */}
            <div className="mb-6 text-center">
              <h2 className="text-center text-2xl font-bold text-black">Sign up for AbleVu</h2>
              <p className="mt-1 text-center  text-sm sm:text-lg text-gray-600">Connect with Inclusive businesses</p>
            </div>

            <form className="space-y-6">
              {["User", "Business", "Contributor"].map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-4 transition hover:border-[#0519CE] ${form.userType === type
                    ? "border-[#0519CE]"
                    : "border-gray-300"
                    }`}
                  onClick={() => handleUserType(type)}
                >
                  <input
                    type="radio"
                    checked={form.userType === type}
                    readOnly
                    className="mt-1.5 h-3 w-3 text-[#0519CE] border-[#0519CE] "
                  />
                  <div className="w-[95%]">
                    <h3 className="text-base sm:text-lg font-semibold text-black">
                      As a {type}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {type === "User"
                        ? "Would like to view, review, provide feedback and save profiles?"
                        : type === "Business"
                          ? "Are you a business representative who would like to view a created profile or create your own?"
                          : "Would you like to be able to edit and create detailed business profiles to showcase key information and services. This can be done as a volunteer to help build the platform or update to a paid contributor to receive payments for creating business profiles after they are approved by the associated business"}
                    </p>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.userType}
                className="w-full rounded-lg bg-[#0519CE] py-2 text-white font-medium transition hover:bg-[#0414a8] disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-700">
              Already have an account?{" "}
              <button className="font-bold text-[#0519CE] underline cursor-pointer" onClick={() => {
                setOpenSignupModal(false)
                setOpenLoginModal(true)
              }}>
                Login
              </button>
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
                    maxLength={50}
                    pattern="^[A-Za-z\s]{1,50}$"
                    className="peer block w-full rounded-lg border border-solid border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                  />
                  <label
                    htmlFor="firstName"
                    className=" absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
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
                    maxLength={50}
                    pattern="^[A-Za-z\s]{1,50}$"
                    className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
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
                  className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                />
                <label
                  htmlFor="email"
                  className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={form.password}
                  onChange={handlePasswordChange}
                  required
                  placeholder=" "
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 pr-10 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                />
                <label
                  htmlFor="password"
                  className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                >
                  Password
                </label>

                {/* Toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    // Eye slash icon (password visible)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    // Eye icon (password hidden)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>

                {/* Password validation rules */}
                <div
                  style={{
                    maxHeight: passwordFocus ? "200px" : "0",
                    opacity: passwordFocus ? 1 : 0,
                  }}
                  className="mt-2 text-xs transition-all duration-500 overflow-hidden mb-2"
                >
                  <p className="text-[14px] mt-2">Password must:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">

                    <li className={`${rules.length ? "text-green-600" : "text-red-600"}`}>
                      Be a minimum of 12 characters
                    </li>

                    <li className={`${rules.lowercase ? "text-green-600" : "text-red-600"}`}>
                      Include at least one lowercase letter (a-z)
                    </li>

                    <li className={`${rules.uppercase ? "text-green-600" : "text-red-600"}`}>
                      Include at least one uppercase letter (A-Z)
                    </li>

                    <li className={`${rules.number ? "text-green-600" : "text-red-600"}`}>
                      Include at least one number (0-9)
                    </li>

                    <li className={`${rules.special ? "text-green-600" : "text-red-600"}`}>
                      Include at least one special character (!@#$%)
                    </li>

                  </ul>
                </div>
              </div>



              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" id="consent" name="consent" required
                  checked={form.consent}
                  onChange={(e) =>
                    setForm({ ...form, consent: e.target.checked })
                  }
                  className="mt-1 h-3 w-3 rounded border-gray-300 text-[#0519CE] focus:ring-[#0519CE] cursor-pointer" />
                <label htmlFor="agree" className="text-gray-700 text-[13px] ">
                  By creating an account, I agree to our
                  <Link href="/terms-and-conditions" className="font-normal text-[#0519CE] underline"> Terms &
                    Conditions </Link>
                  and
                  <Link href="/privacy-policy" className="font-normal text-[#0519CE] underline"> Privacy
                    Policy</Link>.
                </label>
              </div>
              {/* Error and Success Messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#0519CE] py-2 font-medium text-white transition hover:bg-[#0414a8] disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="mt-1 text-center text-sm text-gray-700">
                Already have an account?{" "}
                <button className="font-bold text-[#0519CE] underline cursor-pointer" onClick={() => {
                  setOpenSignupModal(false)
                  setOpenLoginModal(true)
                }}>
                  Login
                </button>
              </p>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#0519CE] hover:underline cursor-pointer"
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
