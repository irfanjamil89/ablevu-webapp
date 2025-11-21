import React, {useState,useEffect,ChangeEvent,FormEvent} from "react";

type UpdateProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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

export default function Profile() {
  const [profileForm, setProfileForm] = useState<UpdateProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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
  };

  const updateProfileRequest = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      "https://staging-api.qtpack.co.uk/users/update-profile",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
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

  console.log("JWT payload:", payload);

  const userId = payload.sub; // ⬅️ yahan se lo, id nahi
  if (!userId) {
    console.error("No sub in token payload");
    return;
  }

  fetch(`https://staging-api.qtpack.co.uk/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch user data.");
      }

      setProfileForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
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

    const response = await fetch(
      "https://staging-api.qtpack.co.uk/users/update-password",
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
      {/* About Me Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
      <div className="flex bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
        <div className="flex flex-col justify-baseline items-center mb-6 w-auto md:w-[170px]">
          <img
            src="/assets/images/Meegan.avif"
            alt="Profile Picture"
            className="rounded-full w-30 h-30 mr-4"
          />
          <div>
            <button
              type="button"
              className="text-[#0519CE] underline underline-[#0519CE] font-bold cursor-pointer text-md"
            >
              Edit Photo
            </button>
          </div>
        </div>

        {/* PROFILE FORM */}
        <form onSubmit={handleProfileSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label
                htmlFor="first-name"
                className="text-md font-medium text-gray-600"
              >
                First name
              </label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileChange}
                className="border border-gray-200 rounded-lg p-3 mt-1 text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE]"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label
                htmlFor="last-name"
                className="text-md font-medium text-gray-600"
              >
                Last name
              </label>
              <input
                type="text"
                id="last-name"
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileChange}
                className="border border-gray-200 rounded-lg p-3 mt-1 text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-md font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE]"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="text-md font-medium text-gray-600"
            >
              Phone number
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="+1 201-555-0123"
                className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="text-[#0519CE] text-sm font-bold border border-[#0519CE] cursor-pointer rounded-full py-3 px-6 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileLoading}
              className="bg-[#0519CE] text-white text-sm font-bold cursor-pointer rounded-full py-3 px-5 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* ========= CHANGE PASSWORD SECTION ========= */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Change Password
      </h2>
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Current Password */}
            <div className="mb-4">
              <label
                htmlFor="current-password"
                className="text-md font-medium text-gray-600"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="current-password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="border border-gray-300 rounded-md p-3 mt-1 w-full text-gray-700 pr-12 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE]"
                />
                <span className="absolute right-3 top-5 cursor-pointer ">
                  <img
                    src="/assets/images/eye-svgrepo-com.svg"
                    alt="eye-svgrepo-com.svg"
                    className="w-5 h-5"
                  />
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="text-md font-medium text-gray-600"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE]"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="text-md font-medium text-gray-600"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[#0519CE] text-white text-sm font-bold cursor-pointer rounded-full py-3 px-8 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
