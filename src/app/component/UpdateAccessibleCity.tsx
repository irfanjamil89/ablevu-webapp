"use client";
import React, { useEffect, useState, useRef } from "react";

type BusinessType = {
  id: string;
  name: string;
  accessible_city_id?: string;
  latitude: number;
  longitude: number;
};

type AccessibleCityType = {
  id: string;
  city_name: string;
  latitude?: number;
  longitude?: number;
  picture_url?: string;
};

type Props = {
  selectedCity: AccessibleCityType | null;
  closeModal: () => void;
  onSuccess?: () => void;
};

export default function UpdateAccessibleCity({ selectedCity, closeModal, onSuccess }: Props) {
  const [cityName, setCityName] = useState(selectedCity?.city_name || "");
  const [latitude, setLatitude] = useState<number | null>(selectedCity?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(selectedCity?.longitude ?? null);
  const [businessList, setBusinessList] = useState<BusinessType[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessType[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Image states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>(selectedCity?.picture_url || "");

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const RADIUS_KM = 150;

  function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}business/list?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setBusinessList(data.data);

          if (selectedCity?.id) {
            const preSelected = data.data.filter((b: BusinessType) => b.accessible_city_id === selectedCity.id);
            setSelectedBusinesses(preSelected);
          }
        } else {
          setError("Failed to fetch businesses");
        }
      } catch (err) {
        setError("Error fetching businesses");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [selectedCity]);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
    });
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const newLat = place.geometry.location.lat();
      const newLng = place.geometry.location.lng();

      setSelectedBusinesses([]);
      setFilteredBusinesses([]);
      setIsDropdownOpen(false);

      setCityName(place.name || "");
      setLatitude(newLat);
      setLongitude(newLng);
    });
  }, [inputRef.current]);

  useEffect(() => {
    if (latitude === null || longitude === null || businessList.length === 0) {
      setFilteredBusinesses([]);
      return;
    }

    const filtered = businessList.filter((b) => {
      if (!b.latitude || !b.longitude) return false;
      const distance = getDistanceInKm(latitude, longitude, b.latitude, b.longitude);
      return distance <= RADIUS_KM;
    });

    setFilteredBusinesses(filtered);
  }, [latitude, longitude, businessList]);

  // Handle image selection and preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (SVG, PNG, JPG, or GIF)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Update city
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const payload: any = {
      business_Ids: selectedBusinesses.map((b) => b.id), 
    };

    if (cityName !== selectedCity?.city_name && latitude !== null && longitude !== null) {
      payload.cityName = cityName;
      payload.latitude = latitude;
      payload.longitude = longitude;
    }

    try {
      const token = localStorage.getItem("access_token");
      
      // STEP 1: Update city details
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/update/${selectedCity?.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        // STEP 2: Upload new image if selected
        if (selectedImage && selectedCity?.id) {
          console.log("Uploading new image for city ID:", selectedCity.id);

          try {
            const base64Data = await convertToBase64(selectedImage);

            const imagePayload = {
              data: base64Data,
              folder: "af-city",
              fileName: selectedCity.id,
            };

            console.log("Image upload payload:", {
              folder: imagePayload.folder,
              fileName: imagePayload.fileName,
              dataLength: base64Data.length
            });

            const imageRes = await fetch("https://staging-api.qtpack.co.uk/images/upload-base64", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(imagePayload),
            });

            console.log("Image upload status:", imageRes.status);
            
            const imageResult = await imageRes.json();
            console.log("Image upload response:", imageResult);

            if (!imageRes.ok) {
              console.error("Image upload failed:", imageResult);
              setError(`Image upload failed: ${imageResult.message || "Unknown error"}`);
            } else {
              console.log("Image uploaded successfully!");
            }
          } catch (imgErr: any) {
            console.error("Image upload error:", imgErr);
            setError(`Image upload error: ${imgErr.message}`);
          }
        }

        if (onSuccess) onSuccess();
        closeModal();
      } else {
        console.error(result);
        setError("Failed to update city");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating city");
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
        {updating && (
          <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50 rounded-3xl">
            <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Loading" />
          </div>
        )}
        <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold p-10">×</button>
        <h2 className="text-lg font-bold text-gray-700 mb-4 pt-6">Update Accessibility City</h2>
        <form className="space-y-6" onSubmit={handleUpdate}>
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          {/* Upload Section */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">Upload Picture</label>
            <div className="relative">
              {/* Show current image or new preview */}
              {imagePreview || currentImage ? (
                <div className="relative border border-gray-200 rounded-lg p-4 mb-3">
                  <img
                    src={imagePreview || currentImage}
                    alt="City"
                    className="w-full h-40 object-contain rounded-lg"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  {imagePreview && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {selectedImage?.name}
                    </p>
                  )}
                </div>
              ) : null}

              {/* Upload area - show only if no preview */}
              {!imagePreview && (
                <>
                  <input 
                    type="file" 
                    accept=".svg,.png,.jpg,.jpeg,.gif" 
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                    <img src="/assets/images/upload-icon.avif" alt="upload-icon" className="w-10 h-10" />
                    <p className="text-[#0519CE] font-semibold text-sm">
                      Click to upload <span className="text-gray-500 text-xs">or drag and drop</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                  </div>
                </>
              )}

              {/* Change image button if image exists */}
              {(imagePreview || currentImage) && !imagePreview && (
                <div className="mt-2">
                  <input 
                    type="file" 
                    accept=".svg,.png,.jpg,.jpeg,.gif" 
                    onChange={handleImageSelect}
                    className="hidden"
                    id="changeImage"
                  />
                  <label 
                    htmlFor="changeImage"
                    className="text-sm text-[#0519CE] cursor-pointer hover:underline"
                  >
                    Change Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* City Input */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Enter City<span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              placeholder="Search for City"
              value={cityName}
              ref={inputRef}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
            />
          </div>

          {/* Business Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-md font-medium text-gray-700 mb-1">
              Select Business<span className="text-red-500 font-bold">*</span>
            </label>
            <div
              className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 hover:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">
                {selectedBusinesses.length > 0 ? `${selectedBusinesses.length} selected` : 'Select Business'}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isDropdownOpen && filteredBusinesses.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md flex flex-col max-h-56 overflow-y-auto">
                {filteredBusinesses.map((business) => {
                  const isSelected = selectedBusinesses.some((b) => b.id === business.id);
                  return (
                    <button
                      key={business.id}
                      type="button"
                      className={`text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center ${
                        isSelected ? 'bg-gray-100 font-semibold' : ''
                      }`}
                      onClick={() =>
                        setSelectedBusinesses((prev) =>
                          isSelected ? prev.filter((b) => b.id !== business.id) : [...prev, business]
                        )
                      }
                    >
                      <span>{business.name}</span>
                      {isSelected && <span className="text-gray-500 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={closeModal}
              type="button"
              className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700"
              disabled={updating}
            >
              Update City
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}