"use client";
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

  const [profileForm, setProfileForm] = useState<UpdateProfile>({
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

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);

        setProfileForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
        });
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setPasswordForm((prev) => ({
    ...prev,
    [name]: value,
  }));
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

  return (
    <div className="w-full p-6 space-y-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>

      <div className="flex bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
        <div className="flex flex-col justify-baseline items-center mb-6 w-auto md:w-[170px]">
          <img
            src="/assets/images/Meegan.avif"
            alt="Profile Picture"
            className="rounded-full w-30 h-30 mr-4"
          />
          <button
            type="button"
            className="text-[#0519CE] underline font-bold cursor-pointer text-md"
          >
            Edit Photo
          </button>
        </div>

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
              onChange={handleProfileChange}
              className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 focus:outline-[#0519CE]"
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
            <button
              type="button"
              className="text-[#0519CE] text-sm font-bold border border-[#0519CE] rounded-full py-3 px-6 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileLoading}
              className="bg-[#0519CE] text-white text-sm font-bold rounded-full py-3 px-5 hover:bg-blue-700 disabled:opacity-60"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {profileMessage && (
            <p
              className={`mt-3 text-sm ${
                profileMessage.type === "error"
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
            <div>
              <label className="text-md font-medium text-gray-600">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full"
              />
            </div>

            <div>
              <label className="text-md font-medium text-gray-600">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full"
              />
            </div>

            <div>
              <label className="text-md font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[#0519CE] text-white text-sm font-bold rounded-full py-3 px-8 hover:bg-blue-700 disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Update"}
            </button>
          </div>

          {passwordMessage && (
            <p
              className={`mt-3 text-sm ${
                passwordMessage.type === "error"
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
