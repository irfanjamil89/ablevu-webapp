"use client";
import React, { useState } from 'react';

export type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
};

interface PropertyImagePopupProps {
  businessId: string;
  setOpenPropertyImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

const PropertyImagePopup: React.FC<PropertyImagePopupProps> = ({
  businessId,
  setOpenPropertyImagePopup,
  onUpdated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [base64Data, setBase64Data] = useState<string>("");
  const [altText, setAltText] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");


  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (SVG, PNG, JPG, or GIF)');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError("");
      
      // Create preview URL and base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setBase64Data(result); // This includes the data:image/png;base64, prefix
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1: Create business image record (without image_url initially)
  const createBusinessImageRecord = async (): Promise<string> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}business-images/create`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          name: altText,
          description: description || altText,
          tags: "",
          image_url: "", // Empty initially, will be updated after upload
          business_id: businessId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property image record');
      }

      const data = await response.json();
      console.log('Create business image response:', data); // Debug log
      
      // Return the ID of the created business image
      if (data.id) {
        return data.id;
      } else {
        throw new Error('No ID returned from business image creation');
      }
    } catch (err) {
      console.error('Error creating business image record:', err); // Debug log
      throw new Error(err instanceof Error ? err.message : 'Failed to create business image record');
    }
  };

  // Step 2: Upload image as base64 using the businessImageId as fileName
  const uploadImageBase64 = async (businessImageId: string): Promise<string> => {
    try {
      console.log('Uploading image with businessImageId:', businessImageId); // Debug log

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          data: base64Data,
          folder: "business-images",
          fileName: businessImageId, // Use the businessImageId from step 1 as fileName
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload image error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      console.log('Upload image response:', data); // Debug log
      
      // Return the URL from the response
      if (data.ok && data.url) {
        return data.url;
      } else {
        throw new Error('Invalid response from image upload');
      }
    } catch (err) {
      console.error('Error uploading image:', err); // Debug log
      throw new Error(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    if (!altText.trim()) {
      setError('Please provide alt text for the image');
      return;
    }

    if (!base64Data) {
      setError('Image data not ready. Please try selecting the image again.');
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Step 1: Create business image record and get the businessImageId
      const businessImageId = await createBusinessImageRecord();
      console.log('Business Image ID received:', businessImageId); // Debug log

      // Step 2: Upload image using the businessImageId as fileName
      const imageUrl = await uploadImageBase64(businessImageId);
      console.log('Image URL received:', imageUrl); // Debug log

      // Show success message
      setSuccessMessage('Property image created successfully!');
      
      // Close the popup after a short delay to show success message
      setTimeout(() => {
        setOpenPropertyImagePopup(false);
      }, 1500);
      
    } catch (err) {
      console.error('Submit error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <label
          onClick={() => setOpenPropertyImagePopup(false)}
          className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </label>

        {/* Header */}
        <h2 className="text-md font-semibold text-gray-900 mb-3">Add an Image</h2>
        <p className="text-gray-700 text-md mb-4">
          To ensure quality and relevance, your Images will first be sent to the business for approval. This helps maintain a constructive and trustworthy feedback system.
        </p>

        {/* Upload Area */}
        <div className="w-full mb-4">
          <div className="relative">
            <input
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.gif"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 cursor-pointer">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-40 object-contain mb-2"
                />
              ) : (
                <img 
                  src="/assets/images/upload-icon.avif" 
                  alt="upload-icon" 
                  className="w-10 h-10"
                />
              )}
              <p className="text-sm text-gray-600 mt-2">
                {selectedFile ? selectedFile.name : 'Click to upload image'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="alt text of the image"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full border border-gray-300 text-center rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
            />
          </div>
          
          <p className="text-gray-700 text-sm mb-4">
            This is our AI readers Alt text generated. Please feel free to update or improve as you see fit
          </p>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Would you like to tell us anything more about this photo?
            </label>
            <textarea
              placeholder="Enter..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenPropertyImagePopup(false)}
              className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyImagePopup;