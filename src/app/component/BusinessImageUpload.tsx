import React, { useState } from 'react';

interface BusinessImageUploadProps {
  businessId: string;
  businessName: string;
  initialImageUrl?: string | null;
  onUploadSuccess?: () => void; // Callback to refresh parent data
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

  const handleFileUpload = async (file: File) => {
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

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;

        // Upload to API
        const response = await fetch('https://staging-api.qtpack.co.uk/images/upload-base64', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: base64Data,
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

        // Call parent callback to refresh business data
        if (onUploadSuccess) {
          onUploadSuccess();
        }

        setSuccess('Image uploaded successfully!');
      };

      reader.onerror = () => {
        setError('Error reading file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  const handleClick = () => {
    document.getElementById('business-logo-input')?.click();
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

  return (
    <div className="border rounded-3xl mt-6 border-[#e5e5e7] overflow-hidden relative">
      {initialImageUrl ? (
        // Show existing image from business.logo_url
        <div className="flex justify-center p-6">
          <img
            onClick={handleClick}
            src={initialImageUrl}
            alt={businessName}
            className="w-80 object-contain cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
      ) : (
        // Show upload area if no image
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center py-20 cursor-pointer transition-all duration-200 ${dragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'
            }`}
        >
          {/* Upload Icon */}
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

          {/* Text */}
          <p className="text-gray-600 text-sm mb-2">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
          <p className="text-blue-600 font-semibold">
            Click to upload{' '}
            <span className="text-gray-500 font-normal">or drag and drop</span>
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="business-logo-input"
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Loading overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
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
    </div>
  );
};

export default BusinessImageUpload;
