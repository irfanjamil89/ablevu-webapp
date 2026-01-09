"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useUser } from "@/app/component/UserContext";

export default function ImageUpload() {
    const { user, updateUser } = useUser();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState("");
    const [imageKey, setImageKey] = useState(Date.now());

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: any
    ): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("No 2d context");
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL("image/jpeg", 0.9);
    };

    const handleCropConfirm = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setEditLoading(true);
        
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setShowCropper(false);
            await handleSaveImage(croppedImage);
        } catch (e) {
            console.error(e);
            setEditMessage("Failed to crop image");
            setEditLoading(false);
        }
    };

    const handleSaveImage = async (base64Data: string) => {
        if (!user?.id) {
            setEditMessage("User not found");
            setEditLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    data: base64Data,
                    folder: "user",
                    fileName: String(user.id),
                }),
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const text = await response.text();
            let result;
            
            try {
                result = JSON.parse(text);
            } catch {
                throw new Error("Invalid JSON response from server");
            }

            const newImageUrl = result?.data?.url || result?.url;
            
            if (!newImageUrl) {
                throw new Error("No image URL in response");
            }

            updateUser({ profile_picture_url: newImageUrl });
            setImageKey(Date.now());
            
            // Close edit modal and show success modal
            setOpenEditModal(false);
            setOpenSuccessModal(true);
            
            // Reset states
            setSelectedFile(null);
            setImageSrc(null);
            setEditMessage("");

        } catch (error: any) {
            console.error("Upload error:", error);
            setEditMessage(error.message || "Upload failed. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenEditModal(false);
        setSelectedFile(null);
        setImageSrc(null);
        setShowCropper(false);
        setEditMessage("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const handleSuccessModalClose = () => {
        window.location.reload();
        setOpenSuccessModal(false);
    };

    const getCurrentImageUrl = () => {
        if (!user?.profile_picture_url) {
            return "/assets/images/profile.png";
        }
        return `${user.profile_picture_url}?t=${imageKey}`;
    };

    return (
        <div>
            <div className="flex flex-col justify-baseline items-center mb-6 w-auto md:w-[170px] mr-4">
                <img
                    key={imageKey}
                    src={getCurrentImageUrl()}
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
                            {showCropper ? "Adjust Your Image" : "Edit Profile Picture"}
                        </h2>

                        {editLoading ? (
                            <div className="flex flex-col justify-center items-center h-[400px]">
                                <img
                                    src="/assets/images/favicon.png"
                                    className="w-15 h-15 animate-spin"
                                    alt="Loading"
                                />
                                <p className="mt-4 text-gray-600 font-medium">Uploading your image...</p>
                            </div>
                        ) : !showCropper ? (
                            <>
                                <div className="flex justify-center mb-6">
                                    <label htmlFor="profileUpload" className="cursor-pointer">
                                        <img
                                            src={getCurrentImageUrl()}
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
                                    <p className="text-sm mb-4 p-3 rounded-lg text-center bg-red-50 border border-red-200 text-red-700">
                                        {editMessage}
                                    </p>
                                )}

                                <div className="flex justify-center">
                                    <label
                                        htmlFor="profileUpload"
                                        className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 cursor-pointer"
                                    >
                                        Choose Image
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative h-80 bg-gray-100 rounded-lg mb-4">
                                    <Cropper
                                        image={imageSrc || ""}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        cropShape="round"
                                        showGrid={false}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zoom
                                    </label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setShowCropper(false);
                                            setImageSrc(null);
                                            setSelectedFile(null);
                                        }}
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={handleCropConfirm}
                                        className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 cursor-pointer"
                                    >
                                        Crop & Save
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {openSuccessModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                        <div className="flex justify-center mb-4">
                            <div className="bg-[#0519CE] rounded-full p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold mb-2">Upload Successfully!</h2>
                        <p className="mb-4 text-gray-600">Your profile picture has been updated.</p>
                        <button
                            className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                            onClick={handleSuccessModalClose}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}