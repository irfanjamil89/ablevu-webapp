"use client";
import ImageUpload from "@/app/component/ImageUpload";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

type UpdateProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Message = {
  type: "success" | "error";
  text: string;
};

type ProfileErrors = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
};

export default function Page() {
  const [userId, setUserId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [profileForm, setProfileForm] = useState<UpdateProfile>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [originalProfileForm, setOriginalProfileForm] = useState<UpdateProfile>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
  const [rules, setRules] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [passwordFocus, setPasswordFocus] = useState(false);

  const isProfileChanged = JSON.stringify(profileForm) !== JSON.stringify(originalProfileForm);
  const isPasswordFilled = passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmPassword;

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };
  const validateProfile = (): boolean => {
    const errors: ProfileErrors = {};

    // first name – required, max 50
    const fn = profileForm.first_name.trim();
    if (!fn) {
      errors.first_name = "First name is required.";
    } else if (fn.length > 50) {
      errors.first_name = "First name cannot be longer than 50 characters.";
    }

    // last name – required, max 50
    const ln = profileForm.last_name.trim();
    if (!ln) {
      errors.last_name = "Last name is required.";
    } else if (ln.length > 50) {
      errors.last_name = "Last name cannot be longer than 50 characters.";
    }

    // email – required + regex
    const email = profileForm.email.trim();
    if (!email) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    // phone – optional, but if present then basic validation
    const phone = profileForm.phone_number.trim();
    if (!phone) {
      errors.phone_number = "Phone number is required.";
    } else {
      const phoneRegex = /^\+[1-9][0-9]{7,14}$/;
      if (!phoneRegex.test(phone)) {
        errors.phone_number = "Phone number must be in international format.";
      }
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const updateProfileRequest = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const dtoBody = {
      firstName: profileForm.first_name,
      lastName: profileForm.last_name,
      email: profileForm.email,
      phoneNumber: profileForm.phone_number,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}users/update-profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtoBody),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || "Failed to update profile");
    }

    return response.json();
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateProfile()) {
      setProfileMessage({
        type: "error",
        text: "Please fix the highlighted fields.",
      });
      return;
    }

    if (!userId) {
      setProfileMessage({
        type: "error",
        text: "User ID is missing!",
      });
      return;
    }

    setProfileLoading(true);
    setProfileMessage(null);

    try {
      await updateProfileRequest();
      setProfileMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
      setOriginalProfileForm(profileForm);
    } catch (error: any) {
      console.error("Profile update error:", error);
      setProfileMessage({
        type: "error",
        text: error?.message || "Something went wrong.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let payload: any;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Invalid token:", err);
      return;
    }

    const uid = payload.sub;
    if (!uid) {
      console.error("No 'sub' found in token payload");
      return;
    }

    setUserId(uid);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}users/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);

        const profile = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
        };
        setProfileForm(profile);
        setOriginalProfileForm(profile);
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setPasswordForm((prev) => ({
    ...prev,
    [name]: value,
  }));
  if (name === "newPassword") {
    setRules({
      length: value.length >= 12,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%]/.test(value),
    });
  }
};


  const changePasswordRequest = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}users/update-password`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || "Failed to update password");
    }

    return response.json();
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      await changePasswordRequest();
      setPasswordMessage({
        type: "success",
        text: "Password updated successfully.",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      setPasswordMessage({
        type: "error",
        text: error?.message || "Something went wrong.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return <div className="flex justify-center w-full items-center h-[400px]">
      <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
    </div>;
  }

  return (
    <div className="w-full p-6 space-y-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>

      <div className="flex bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
        <ImageUpload/>

        {/* PROFILE FORM */}
        <form onSubmit={handleProfileSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-600">
                First name
              </label>
              <input
                type="text"
                name="first_name"
                value={profileForm.first_name}
                onChange={handleProfileChange}
                className="border border-gray-200 rounded-lg p-3 mt-1 text-gray-700 focus:outline-[#0519CE]"
              />
              {profileErrors.first_name && (
                <span className="text-red-600 text-xs mt-1">
                  {profileErrors.first_name}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-600">
                Last name
              </label>
              <input
                type="text"
                name="last_name"
                value={profileForm.last_name}
                onChange={handleProfileChange}
                className="border border-gray-200 rounded-lg p-3 mt-1 text-gray-700 focus:outline-[#0519CE]"
              />
              {profileErrors.last_name && (
                <span className="text-red-600 text-xs mt-1">
                  {profileErrors.last_name}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-md font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              readOnly
              className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 bg-gray-100 focus:outline-none "
            />
            {profileErrors.email && (
              <span className="text-red-600 text-xs mt-1">
                {profileErrors.email}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="text-md font-medium text-gray-600">
              Phone number
            </label>
            <input
              type="text"
              name="phone_number"
              value={profileForm.phone_number}
              onChange={handleProfileChange}
              className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 focus:outline-[#0519CE]"
            />
            {profileErrors.phone_number && (
              <span className="text-red-600 text-xs mt-1">
                {profileErrors.phone_number}
              </span>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            {/* <button
              type="button"
              className="text-[#0519CE] text-sm font-bold border border-[#0519CE] rounded-full py-3 px-6 hover:bg-gray-100"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              disabled={profileLoading || !isProfileChanged}
              className="bg-[#0519CE] text-white text-sm font-bold rounded-full py-3 px-5 hover:bg-blue-700 disabled:opacity-60"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {profileMessage && (
            <p
              className={`mt-3 text-sm ${profileMessage.type === "error"
                  ? "text-red-600"
                  : "text-green-600"
                }`}
            >
              {profileMessage.text}
            </p>
          )}
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Change Password
      </h2>

      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="relative">
              <label className="text-md font-medium text-gray-600">
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 focus:outline-none"
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
            </div>

            <div className="relative">
              <label className="text-md font-medium text-gray-600">
                New Password
              </label>
              <input
                type={showPassword1 ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword1 ? (
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
            </div >

            <div className="relative">
              <label className="text-md font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type={showPassword2 ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword2 ? (
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
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading || !isPasswordFilled}
              className="bg-[#0519CE] text-white text-sm font-bold rounded-full py-3 px-8 hover:bg-blue-700 disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Update"}
            </button>
          </div>

          {passwordMessage && (
            <p
              className={`mt-3 text-sm ${passwordMessage.type === "error"
                  ? "text-red-600"
                  : "text-green-600"
                }`}
            >
              {passwordMessage.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}