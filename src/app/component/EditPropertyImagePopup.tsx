"use client";
import React, { useState, useEffect } from 'react';

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

export type BusinessImage = {
  id: string;
  name: string;
  description: string;
  tags: string;
  image_url: string;
  business_id: string;
};

interface PropertyImagePopupProps {
  businessImageId: string; // Changed from businessId to businessImageId
  setOpenEditPropertyImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

const EditPropertyImagePopup: React.FC<PropertyImagePopupProps> = ({
  businessImageId,
  setOpenEditPropertyImagePopup,
  onUpdated,
}) => {
  const [businessImage, setBusinessImage] = useState<BusinessImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [base64Data, setBase64Data] = useState<string>("");
  const [altText, setAltText] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchBusinessImage = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}business-images/business-images-profile/${businessImageId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch business image data');
        }

        const data = await response.json();
        
        setBusinessImage(data);
        setAltText(data.name || "");
        setDescription(data.description || "");
        setPreviewUrl(data.image_url || "");
      } catch (err) {
        console.error('Error fetching business image:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image data');
      } finally {
        setIsFetching(false);
      }
    };

    if (businessImageId) {
      fetchBusinessImage();
    }
  }, [businessImageId]);

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
        setBase64Data(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload new image as base64 using the businessImageId as fileName
  const uploadImageBase64 = async (): Promise<string> => {
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          data: base64Data,
          folder: "business-images",
          fileName: businessImageId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload image error response:', errorData);
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      if (data.ok && data.url) {
        return data.url;
      } else {
        throw new Error('Invalid response from image upload');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };

  // Update business image record
  const updateBusinessImage = async (imageUrl?: string) => {
    try {
      const updateData: any = {
        name: altText,
        description: description || altText,
      };

      // Only include image_url if a new image was uploaded
      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}business-images/update/${businessImageId}`,
        {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business image');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error updating business image:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to update business image');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!altText.trim()) {
      setError('Please provide alt text for the image');
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      let imageUrl;

      // If user selected a new file, upload it first
      if (selectedFile && base64Data) {
        imageUrl = await uploadImageBase64();
      }

      // Update the business image record
      await updateBusinessImage(imageUrl);

      setSuccessMessage('Property image updated successfully!');
      
      // Close the popup after a short delay
      setTimeout(() => {
        setOpenEditPropertyImagePopup(false);
      }, 1500);
      
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // if (isFetching) {
  //   return (
  //     <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
  //       <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6">
  //         <div className="flex items-center justify-center py-10">
  //           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0519CE]"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <label
          onClick={() => setOpenEditPropertyImagePopup(false)}
          className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </label>

        {/* Header */}
        <h2 className="text-md font-semibold text-gray-900 mb-3">Edit Property Image</h2>
        <p className="text-gray-700 text-md mb-4">
          Update your property image details. Changes will be saved to your business profile.
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
                {selectedFile ? selectedFile.name : 'Click to upload new image (or keep existing)'}
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
              onClick={() => setOpenEditPropertyImagePopup(false)}
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
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyImagePopup;