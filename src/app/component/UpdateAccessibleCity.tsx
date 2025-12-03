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

  // Filter businesses within radius
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
        if (onSuccess) onSuccess();
        closeModal();
      } else {
        console.error(result);
      }
    } catch (err) {
      console.error(err);
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
          {/* Upload Section */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo</label>
            <div className="relative">
              <input type="file" accept=".svg,.png,.jpg,.gif" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                <img src="/assets/images/upload-icon.avif" alt="upload-icon" className="w-10 h-10" />
                <p className="text-[#0519CE] font-semibold text-sm">
                  Click to upload <span className="text-gray-500 text-xs">or drag and drop</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </div>
              <img src="/assets/images/tower 2.jpg" alt="Uploaded" className="mt-3 h-40" />
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
