"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import UpdateAccessibleCity from "./UpdateAccessibleCity";

type AccessibleCityType = {
  id: string;
  city_name: string;
  picture_url?: string;
  featured: boolean;
  businessCount: number;
};
type Props = {
  onCountChange?: (count: number) => void;
};

const AccessibleCityTable = forwardRef<{ fetchCities: () => void }, Props>(
  function AccessibleCityTable({ onCountChange }, ref) {
    const [cities, setCities] = useState<AccessibleCityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<AccessibleCityType | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [cityToDelete, setCityToDelete] = useState<AccessibleCityType | null>(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const fetchCities = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/list?limit=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        setCities(data.items || []);
        if (onCountChange) onCountChange(data.items?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    useImperativeHandle(ref, () => ({
      fetchCities,
    }));

    useEffect(() => {
      fetchCities();
    }, []);

    const handleToggleFeatured = async (cityId: string, value: boolean) => {
      try {
        const token = localStorage.getItem("access_token");

        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/update/${cityId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ featured: value }),
        });

        setCities((prev) =>
          prev.map((c) => (c.id === cityId ? { ...c, featured: value } : c))
        );
      } catch (err) {
        console.error(err);
      }
    };
    const handleOpenUpdateForm = (city: AccessibleCityType) => {
      setSelectedCity(city);
      setIsUpdateFormOpen(true);
    };
    const confirmDeleteCity = async () => {
      if (!cityToDelete) return;

      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/delete/${cityToDelete.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          setOpenDeleteModal(false);
          setCityToDelete(null);
          setOpenSuccessModal(true);
        } else {
          console.error("Failed to delete city");
        }
      } catch (error) {
        console.error("Error deleting city:", error);
      }
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <img
            src="/assets/images/favicon.png"
            className="w-15 h-15 animate-spin"
            alt="Favicon"
          />
        </div>
      );
    }

    return (
      <div className="rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-center">Businesses</th>
              <th className="px-4 py-2 text-center">Featured</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="border-b border-gray-200">
                <td className="px-4 py-3 flex items-center gap-2 font-semibold">
                  <img
                    src={city.picture_url}
                    alt={city.city_name}
                    className="rounded-full w-12 h-12"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/lansing.avif";
                    }}

                  />
                  <p>{city.city_name}</p>

                </td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-[#FFE2C7] text-sm text-gray-700 font-semibold py-2.5 px-3 rounded-sm">
                    {city.businessCount} Businesses
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <label htmlFor={`toggle-${city.id}`} className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-md font-medium">Featured?</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`toggle-${city.id}`}
                        className="sr-only peer"
                        checked={city.featured}
                        onChange={() => handleToggleFeatured(city.id, !city.featured)}
                      />
                      <div className="block w-8 h-5 border-2 rounded-full peer-checked:bg-[#12B76A] peer-checked:border-none"></div>
                      <div className="dot absolute left-1 top-1 border-2 peer-checked:bg-white peer-checked:border-none w-3 h-3 rounded-full transition-transform peer-checked:translate-x-3"></div>
                    </div>
                  </label>
                </td>
                <td className="px-4 py-3 text-center flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setCityToDelete(city);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <img
                      src="/assets/images/delete-svgrepo-com.svg"
                      alt="Delete"
                      className="w-8 h-8 cursor-pointer"
                    />
                  </button>
                  <label htmlFor="update-city-modal" onClick={() => handleOpenUpdateForm(city)}>
                    <img
                      src="/assets/images/writing-svgrepo-com.svg"
                      alt="Edit"
                      className="w-8 h-8 cursor-pointer"
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isUpdateFormOpen && (
          <UpdateAccessibleCity
            selectedCity={selectedCity}
            closeModal={() => setIsUpdateFormOpen(false)}
            onSuccess={fetchCities}
          />
        )}
        {openDeleteModal && cityToDelete && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-red-600 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-bold mb-2 text-gray-800">Delete City</h2>
              <p className="mb-4 text-gray-600">Are you sure you want to delete this Accessible city?</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCity}
                  className="px-5 py-2 w-full bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
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
              <h2 className="text-lg font-bold mb-2">Deleted Successfully!</h2>
              <p className="mb-4">The Accessible city has been removed.</p>
              <button
                className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  setOpenSuccessModal(false);
                  fetchCities();
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  });
export default AccessibleCityTable;
