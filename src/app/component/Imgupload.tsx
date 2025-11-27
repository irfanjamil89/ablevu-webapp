"use client";
import React, { useState, useEffect  } from "react";


interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  email: string;
}

export default function Imgupload() {
  const [OpenEditModel, setOpenEditModel] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState("/assets/images/Meegan.avif");
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);


  const getUserFromSession = (): User | null => {

    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // Get userId on component mount
  useEffect(() => {
    const user = getUserFromSession();
    if (user?.id) {
      setUserId(user.id);
      // Optionally load user's current image
      // setCurrentImage(user.profile_image_url || "/assets/images/Meegan.avif");
    }
  }, []);


  const handleSaveImage = async () => {
    if (!selectedFile) {
      setEditMessage("Please select an image");
      return;
    }

    setEditLoading(true);
    setEditMessage("");

    try {
      // Convert file to Base64
      const fileToBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // Prepare payload
      const body = {
        data: fileToBase64,
        folder: "user",
        fileName: userId
      };

      console.log(body);

      // API Call
      const res = await fetch("https://staging-api.qtpack.co.uk/images/upload-base64", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Upload failed");
      }

      // Update UI → show new uploaded image path
      setCurrentImage(result?.data?.url || previewImage || currentImage);
      setEditMessage("Profile updated!");
      
      // Reset form state
      setSelectedFile(null);
      setPreviewImage(null);
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setOpenEditModel(false);
        setEditMessage("");
      }, 1500);

    } catch (err) {
      console.error("Upload error:", err);
      setEditMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setEditMessage("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setEditMessage("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setEditMessage("");

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCloseModal = () => {
    setOpenEditModel(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setEditMessage("");
  };

  return (
    <div>
      <div className="flex flex-col justify-baseline items-center mb-6 w-auto md:w-[170px] mr-4">
        <img
          src={currentImage}
          alt="Profile Picture"
          className="rounded-full w-30 h-30 object-cover"
        />
        <button
          type="button"
          onClick={() => setOpenEditModel(true)}
          className="text-[#0519CE] underline font-bold cursor-pointer text-md mt-2"
        >
          Edit Photo
        </button>
      </div>

      {OpenEditModel && (
        <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">
              Edit Profile Picture
            </h2>

            <div className="flex justify-center mb-6">
              <label htmlFor="profileUpload" className="cursor-pointer">
                <img
                  src={previewImage || currentImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover shadow-md hover:opacity-80 transition"
                />
              </label>
            </div>

            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {editMessage && (
              <p
                className={`text-sm mb-2 text-center ${
                  editMessage === "Profile updated!" 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}
              >
                {editMessage}
              </p>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                onClick={handleCloseModal}
                disabled={editLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleSaveImage}
                disabled={editLoading || !selectedFile}
                className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}