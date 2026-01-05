import React, { useState, useCallback, useEffect, useRef } from 'react';
import Cropper from "react-easy-crop";

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BusinessImageUploadProps {
  businessId: string;
  businessName: string;
  initialImageUrl?: string | null;
  onUploadSuccess?: () => void;
}

const BusinessImageUpload: React.FC<BusinessImageUploadProps> = ({
  businessId,
  businessName,
  initialImageUrl,
  onUploadSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(!!initialImageUrl);
  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);
  const [processingFile, setProcessingFile] = useState(false);
  
  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
      // Cleanup any blob URLs
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // Load initial image with error handling
  useEffect(() => {
    if (initialImageUrl) {
      const img = new Image();
      img.onload = () => setLoading(false);
      img.onerror = () => {
        setLoading(false);
        setError("Failed to load business logo");
      };
      img.src = initialImageUrl;
    }
  }, [initialImageUrl]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
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
    pixelCrop: CroppedAreaPixels
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas to exactly 500x500
    canvas.width = 500;
    canvas.height = 500;

    // Draw the cropped area scaled to 500x500
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      500,
      500
    );

    // Use 0.5 quality for smaller file size
    return canvas.toDataURL("image/jpeg", 0.5);
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setError("Invalid crop area. Please try again.");
      return;
    }

    // Validate crop dimensions
    if (croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0) {
      setError("Invalid crop dimensions. Please adjust your selection.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      console.log('Cropped image size:', croppedImage.length, 'characters');
      console.log('Cropped image size in KB:', Math.round(croppedImage.length / 1024), 'KB');
      
      // Create abort controller for timeout
      const controller = new AbortController();
      uploadTimeoutRef.current = setTimeout(() => controller.abort(), 30000); // 30s timeout

      // Upload the cropped image
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,

        },
        body: JSON.stringify({
          data: croppedImage,
          folder: 'business',
          fileName: businessId
        }),
        signal: controller.signal
      });

      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      // Check for success in multiple possible formats
      const isSuccess = result.ok || result.success || result.status === 'success';
      
      if (!isSuccess) {
        throw new Error(result.message || 'Failed to upload image');
      }

      // Get uploaded image URL
      const uploadedUrl = result.data?.url || result.url || result.imageUrl;
      console.log('Uploaded URL:', uploadedUrl);
      
      if (!uploadedUrl) {
        throw new Error('No image URL returned from server');
      }

      // Update the current image URL with cache-busting timestamp
      const newImageUrl = uploadedUrl + '?t=' + new Date().getTime();
      console.log('New image URL with cache-bust:', newImageUrl);
      setCurrentImageUrl(newImageUrl);
      
      // Close cropper and reset states
      setShowCropper(false);
      setUploading(false);
      
      // Cleanup blob URL if it exists
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
      
      setImageSrc(null);
      setSelectedFile(null);
      setCroppedAreaPixels(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Show success popup after a brief delay to ensure cropper is closed
      requestAnimationFrame(() => {
        setTimeout(() => {
          console.log('Showing success popup');
          setSuccess('Image uploaded successfully!');
        }, 150);
      });
      
    } catch (e: any) {
      console.error('Upload error:', e);
      
      if (e.name === 'AbortError') {
        setError("Upload timeout. Please try again with a smaller image.");
      } else {
        setError(e.message || "Failed to crop and upload image");
      }
      
      setUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Clear any previous errors
    setError("");
    setSuccess("");

    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload SVG, PNG, JPG or GIF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large (max 5MB)');
      return;
    }

    setSelectedFile(file);
    setProcessingFile(true);

    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setProcessingFile(false);
      setShowCropper(true);
    };
    
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
      setProcessingFile(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCancelCrop = () => {
    // Cleanup blob URL if it exists
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    
    setShowCropper(false);
    setImageSrc(null);
    setSelectedFile(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setError("");
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border rounded-3xl mt-6 border-[#e5e5e7] overflow-hidden relative">
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <img
            src="/assets/images/favicon.png"
            className="w-15 h-15 animate-spin"
            alt="Loading"
          />
        </div>
      ) : processingFile ? (
        <div className="flex flex-col justify-center items-center h-[400px]">
          <img
            src="/assets/images/favicon.png"
            className="w-15 h-15 animate-spin"
            alt="Processing"
          />
          <p className="mt-4 text-gray-600 font-medium">Processing image...</p>
        </div>
      ) : currentImageUrl ? (
        <div className="flex justify-center p-6">
          <img
            onClick={handleClick}
            src={currentImageUrl}
            alt={businessName}
            className="w-80 object-contain cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center py-20 cursor-pointer transition-all duration-200 ${
            dragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            SVG, PNG, JPG or GIF (max. 5MB)
          </p>
          <p className="text-blue-600 font-semibold">
            Click to upload{' '}
            <span className="text-gray-500 font-normal">or drag and drop</span>
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        id="business-logo-input"
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && !showCropper && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded z-10">
          {error}
        </div>
      )}

      {showCropper && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancelCrop}
              disabled={uploading}
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">
              Adjust Your Business Logo
            </h2>

            {uploading ? (
              <div className="flex flex-col justify-center items-center h-[400px]">
                <img
                  src="/assets/images/favicon.png"
                  className="w-15 h-15 animate-spin"
                  alt="Loading"
                />
                <p className="mt-4 text-gray-600 font-medium">Uploading your logo...</p>
              </div>
            ) : (
              <>
                <div className="relative h-96 bg-gray-100 rounded-lg mb-4">
                  <Cropper
                    image={imageSrc || ""}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="rect"
                    showGrid={true}
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

                {error && (
                  <p className="text-sm mb-4 p-3 rounded-lg text-center bg-red-50 border border-red-200 text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={handleCancelCrop}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleCropConfirm}
                    className="px-5 py-2 w-full text-center text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer"
                  >
                    Crop & Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
            <h2 className="text-lg font-bold mb-2">Success</h2>
            <p className="mb-4">{success}</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
              onClick={() => setSuccess("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessImageUpload;