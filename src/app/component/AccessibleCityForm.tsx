"use client";
import React, { useEffect, useState, useRef } from "react";

type BusinessType = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export default function AccessibleCityForm({ onSuccess }: { onSuccess?: () => void }) {
  const [cityName, setCityName] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [businessList, setBusinessList] = useState<BusinessType[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessType[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cityId, setCityId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const radius = 150; 

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
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
        } else {
          setError("Failed to fetch businesses");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching businesses");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      setCityName(place.name || "");
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLatitude(lat);
      setLongitude(lng);
    });
  }, [inputRef.current]);

  useEffect(() => {
    if (!latitude || !longitude) {
      setFilteredBusinesses([]);
      return;
    }
    const filtered = businessList.filter((b) => {
      const distance = getDistanceInKm(latitude, longitude, b.latitude, b.longitude);
      return distance <= radius;
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
      setError("");

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName || !latitude || !longitude || selectedBusinesses.length === 0) {
      setError("Please fill in all required fields and use autocomplete for City name.");
      setSuccess(null);
      return;
    }

    const payload = {
      cityName,
      latitude,
      longitude,
      business_Ids: selectedBusinesses.map((b) => b.id),
    };

    try {
      const token = localStorage.getItem("access_token");
      
      // STEP 1: CREATE CITY FIRST
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        // GET CITY ID FROM RESPONSE
        const createdCityId = result.id;
        setCityId(createdCityId);

        console.log("City created with ID:", createdCityId);

        // STEP 2: UPLOAD IMAGE IF SELECTED
        if (selectedImage && createdCityId) {
          console.log("Uploading image for city ID:", createdCityId);

          const base64Data = await convertToBase64(selectedImage);

          const imagePayload = {
            data: base64Data,
            folder: "accessible-city",
            fileName: createdCityId,
          };

          const imageRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(imagePayload),
          });

          const imageResult = await imageRes.json();
          console.log("Image upload response:", imageResult);

          if (!imageRes.ok) {
            console.error("Image upload failed:", imageResult);
          }
        }

        setSuccess("Accessible city created successfully!");
        setError("");
        setSelectedBusinesses([]);
        setCityName("");
        setLatitude(null);
        setLongitude(null);
        setSelectedImage(null);
        setImagePreview("");
        if (onSuccess) onSuccess();
      } else {
        const errorMsg = "Failed to create Accessible City";
        setError(errorMsg);
        setSuccess(null);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error creating Accessible City");
      setSuccess(null);
    }
  };

  return (
    <>
      <input type="checkbox" id="Accessible-cities-toggle" className="hidden peer" />
      <label
        htmlFor="Accessible-cities-toggle"
        className="px-5 py-2.5 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition"
      >
        Add City
      </label>
      <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50 overflow-auto" >
        <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative ">
          <label
            htmlFor="Accessible-cities-toggle"
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
          >
            ×
          </label>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Add Accessibility City</h2>
          <form className="space-y-6" onSubmit={handleSave}>
            {error && <div className="text-red-500 text-sm ">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Upload Picture</label>
              <div className="relative">
                {!imagePreview ? (
                  <>
                    <input 
                      type="file" 
                      accept=".svg,.png,.jpg,.gif" 
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
                ) : (
                  <div className="relative border border-gray-200 rounded-lg p-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-contain rounded-lg"
                    />
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
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {selectedImage?.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
            <div className="mb-4 relative">
              <label className="block text-md font-medium text-gray-700 mb-1">
                Select Business<span className="text-red-500 font-bold">*</span>
              </label>
              <input type="checkbox" id="businessDropdownToggle" className="hidden peer" />
              <label
                htmlFor="businessDropdownToggle"
                className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
              >
                <span className="truncate">
                  {selectedBusinesses.length > 0 ? `${selectedBusinesses.length} selected` : "Select Business"}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500 transition-transform duration-200 peer-checked:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </label>
              <label htmlFor="businessDropdownToggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md hidden peer-checked:flex flex-col max-h-56 overflow-y-auto">
                {filteredBusinesses.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400">No businesses found in this city</div>
                )}
                {filteredBusinesses.map((business) => {
                  const isSelected = selectedBusinesses.some((b) => b.id === business.id);
                  return (
                    <button
                      key={business.id}
                      type="button"
                      className={`text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center ${
                        isSelected ? "bg-gray-100 font-semibold" : ""
                      }`}
                      onClick={() => {
                        setSelectedBusinesses((prev) => {
                          if (isSelected) {
                            return prev.filter((b) => b.id !== business.id);
                          } else {
                            return [...prev, business];
                          }
                        });
                      }}
                    >
                      <span>{business.name}</span>
                      {isSelected && <span className="text-gray-500">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <label
                htmlFor="Accessible-cities-toggle"
                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </label>
              <button
                type="submit"
                className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700"
              >
                Create City
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}