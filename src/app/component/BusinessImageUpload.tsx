import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

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
  
  // Store the uploaded image preview
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
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

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropConfirm = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      
      setUploading(true);
      setImageToCrop(null);

      // Upload to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: croppedImage,
          folder: 'business',
          fileName: businessId
        })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      if (!result.ok) {
        throw new Error('Failed to upload image');
      }

      setUploading(false);

      // Store the uploaded image for immediate preview
      setUploadedImagePreview(croppedImage);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setSuccess('Image uploaded successfully!');
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
      setUploading(false);
      setImageToCrop(null);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

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

    // Read file and show cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setShowUploadModal(false); // Close upload modal when showing cropper
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    if (displayImageUrl) {
      // If image exists, show upload modal
      setShowUploadModal(true);
    } else {
      // If no image, directly open file picker
      document.getElementById('business-logo-input')?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Function to get the image URL with cache busting
  const getImageUrl = () => {
    // If we have a fresh upload preview, use that
    if (uploadedImagePreview) {
      return uploadedImagePreview;
    }
    
    // Otherwise use the initial URL with cache busting
    if (initialImageUrl) {
      // Add timestamp to bust cache
      const separator = initialImageUrl.includes('?') ? '&' : '?';
      return `${initialImageUrl}${separator}t=${Date.now()}`;
    }
    
    return null;
  };

  const displayImageUrl = getImageUrl();

  return (
    <>
      <div className="border rounded-3xl mt-6 border-[#e5e5e7] overflow-hidden relative">
        {displayImageUrl ? (
          <div className="flex justify-center p-6">
            <img
              onClick={handleImageClick}
              src={displayImageUrl}
              alt={businessName}
              className="w-80 object-contain cursor-pointer hover:opacity-80 transition-opacity"
              key={displayImageUrl} // Force re-render on URL change
            />
          </div>
        ) : (
          <div
            onClick={handleImageClick}
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
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
            <p className="text-blue-600 font-semibold">
              Click to upload{' '}
              <span className="text-gray-500 font-normal">or drag and drop</span>
            </p>
          </div>
        )}

        <input
          id="business-logo-input"
          type="file"
          accept="image/svg+xml,image/png,image/jpeg,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload Modal - Shows when clicking on existing image */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Update Logo</h2>
              <p className="text-gray-600 text-sm mt-1">Choose a new image for your business logo</p>
            </div>
            
            <div
              onClick={() => document.getElementById('business-logo-input')?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center py-16 m-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                dragActive ? 'bg-blue-50 border-blue-400' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
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

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold">Crop Image</h2>
            </div>
            
            <div className="relative h-96 bg-gray-100">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setImageToCrop(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="px-6 py-2 bg-[#0519CE] text-white rounded-lg hover:bg-[#0416b8] transition-colors"
                >
                  Crop & Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
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
            <h2 className="text-lg font-bold mb-2">Success</h2>
            <p className="mb-4">{success}</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => setSuccess("")}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => setError("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessImageUpload;