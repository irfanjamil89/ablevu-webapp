"use client";
import React, { useState, useEffect } from "react";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    user_role: string;
    email: string;
    profile_image_url?: string;
}

export default function ImageUpload() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState("/assets/images/profile.png");
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState("");
    const [user, setUser] = useState<User | null>(null);

    // Get user on mount
    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.profile_image_url) {
                setCurrentImage(parsedUser.profile_image_url + '?t=' + Date.now());
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setEditMessage("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setEditMessage("Image size should be less than 5MB");
            return;
        }

        setSelectedFile(file);
        setEditMessage("");

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveImage = async () => {
        if (!selectedFile) {
            setEditMessage("Please select an image");
            return;
        }

        if (!user?.id) {
            setEditMessage("User not found");
            return;
        }

        setEditLoading(true);
        setEditMessage("");

        try {
            // Convert to base64 WITH prefix
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);

            const base64Data = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });

            // const role = user.user_role?.toLowerCase();

            // if (role === "admin") folder = "admin";
            // else if (role === "business") folder = "business";
            // else if (role === "contributor") folder = "contributor";

            console.log("DATA SENDING TO API:", {
                data: base64Data,
                folder: "user",
                fileName: String(user.id)
            });

            const response = await fetch("https://staging-api.qtpack.co.uk/images/upload-base64", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    data: base64Data,
                    folder: "user",
                    fileName: String(user.id),
                }),
            });

            // debug raw response
            const text = await response.text();
            console.log("RAW API RESPONSE:", text);

            // try to parse JSON
            let result;
            try {
                result = JSON.parse(text);
            } catch {
                console.error("Error: Response was not JSON.");
                return;
            }

            console.log("PARSED JSON:", result);

            const newImageUrl = result?.data?.url || result?.url;
            if (newImageUrl) {
                setCurrentImage(newImageUrl + '?t=' + Date.now());

                // Update session
                const updatedUser = { ...user, profile_image_url: newImageUrl };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }

            setEditMessage("Profile updated!");
            setSelectedFile(null);
            setPreviewImage(null);

            setTimeout(() => {
                setOpenEditModal(false);
                setEditMessage("");
            }, 1500);

        } catch (error) {
            console.error("Upload error:", error);
            setEditMessage("Upload failed. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenEditModal(false);
        setSelectedFile(null);
        setPreviewImage(null);
        setEditMessage("");
    };

    return (
        <div>
            <div className="flex flex-col justify-baseline items-center mb-6 w-auto md:w-[170px] mr-4">

                <img
                    key={currentImage}
                    src={currentImage}
                    alt="Profile Picture"
                    className="rounded-full w-30 h-30 object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/images/profile.png";
                    }}
                />

                
                <button
                    type="button"
                    onClick={() => setOpenEditModal(true)}
                    className="text-[#0519CE] underline font-bold cursor-pointer text-md mt-2"
                >
                    Edit Photo
                </button>
            </div>

            {openEditModal && (
                <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
                            onClick={handleCloseModal}
                            disabled={editLoading}
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
                            disabled={editLoading}
                        />

                        {editMessage && (
                            <p
                                className={`text-sm mb-4 p-3 rounded-lg text-center ${editMessage === "Profile updated!"
                                    ? "bg-green-50 border border-green-200 text-green-700"
                                    : "bg-red-50 border border-red-200 text-red-700"
                                    }`}
                            >
                                {editMessage}
                            </p>
                        )}

                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                type="button"
                                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleCloseModal}
                                disabled={editLoading}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveImage}
                                disabled={editLoading || !selectedFile}
                                className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {editLoading ? "Uploading..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}