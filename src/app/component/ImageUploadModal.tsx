import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  fileName: string;
  folderName: string;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  label?: string;
  maxSizeText?: string;
}

const ImageUploadModal: React.FC<ImageUploadProps> = ({
  fileName,
  folderName,
  onUploadSuccess,
  onUploadError,
  label = "Upload Logo",
  maxSizeText = "SVG, PNG, JPG or GIF (max. 800×400px)"
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and auto-upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      const errorMsg = 'Please select a valid image file (SVG, PNG, JPG, or GIF)';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    setSelectedFile(file);
    setError("");
    setSuccess("");
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setPreviewUrl(base64Data);
      
      // Auto-upload if fileName and folderName are provided
      if (fileName && folderName) {
        await uploadImage(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload image to API
  const uploadImage = async (base64Data: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('https://staging-api.qtpack.co.uk/images/upload-base64', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          data: base64Data,
          folder: folderName,
          fileName: fileName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      if (data.ok && data.url) {
        const successMsg = 'Image uploaded successfully!';
        setSuccess(successMsg);
        
        // Call success callback with the URL
        if (onUploadSuccess) {
          onUploadSuccess(data.url);
        }
      } else {
        throw new Error('Invalid response from image upload');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-md font-medium text-gray-700 mb-2">{label}</label>
      
      {/* Upload Area */}
      {!previewUrl ? (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.gif"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
            <img src="/assets/images/upload-icon.avif" alt="upload-icon" className="w-10 h-10" />
            <p className="text-[#0519CE] font-semibold text-sm">
              Click to upload <span className="text-gray-500 text-xs">or drag and drop</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">{maxSizeText}</p>
          </div>
        </div>
      ) : (
        <div className="relative border border-gray-200 rounded-lg p-4">
          {/* Image Preview */}
          <div className="flex items-center justify-center mb-3">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 object-contain rounded"
            />
          </div>
          
          {/* File Info and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">
                {selectedFile?.name}
              </p>
              {selectedFile && (
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={handleClearImage}
              disabled={isLoading}
              className="ml-3 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <p className="text-sm text-blue-700">Uploading image...</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadModal;