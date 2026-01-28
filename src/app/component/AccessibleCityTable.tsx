"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import UpdateAccessibleCity from "./UpdateAccessibleCity";

type AccessibleCityType = {
  id: string;
  city_name: string;
  picture_url?: string;
  featured: boolean;
  businessCount: number;
  display_order?: number;
  slug?: string;
};

type Props = {
  onCountChange?: (count: number) => void;
};

// ✅ Loading Skeleton Component
const CityRowSkeleton = () => (
  <tr className="border-b border-gray-200 animate-pulse">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full w-12 h-12 bg-gray-300"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    </td>
    <td className="px-4 py-3 text-center">
      <div className="h-8 w-28 bg-gray-300 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 text-center">
      <div className="h-5 w-20 bg-gray-300 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 text-center">
      <div className="flex gap-3 justify-center">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    </td>
  </tr>
);

const AccessibleCityTable = forwardRef<{ fetchCities: () => void }, Props>(
  function AccessibleCityTable({ onCountChange }, ref) {
    const [cities, setCities] = useState<AccessibleCityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<AccessibleCityType | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [cityToDelete, setCityToDelete] = useState<AccessibleCityType | null>(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [itemsPerPage] = useState(6); // Match your API default

    // ✅ Optimized: Fetch only current page
    const fetchCities = useCallback(async (page: number = 1) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");

        // ✅ Only fetch 10 items per page (matches your API response)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/list?page=${page}&limit=${itemsPerPage}`,
          { 
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await res.json();
        
        // ✅ Fix picture_url format (remove leading //)
        const formattedCities = (data.items || []).map((city: AccessibleCityType) => ({
          ...city,
          picture_url: city.picture_url?.startsWith('//')
            ? `https:${city.picture_url}`
            : city.picture_url,
        }));

        setCities(formattedCities);
        setTotalPages(data.pageCount || 1);
        setTotalCount(data.total || 0);
        setCurrentPage(page);

        if (onCountChange) onCountChange(data.total || 0);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, [itemsPerPage, onCountChange]);

    // ✅ Page navigation handlers
    const goToNextPage = () => {
      if (currentPage < totalPages) {
        fetchCities(currentPage + 1);
      }
    };

    const goToPreviousPage = () => {
      if (currentPage > 1) {
        fetchCities(currentPage - 1);
      }
    };

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        fetchCities(page);
      }
    };

    useImperativeHandle(ref, () => ({
      fetchCities: () => fetchCities(1),
    }));

    useEffect(() => {
      fetchCities(1);
    }, []);

    // ✅ Optimized toggle with optimistic update
    const handleToggleFeatured = async (cityId: string, value: boolean) => {
      // Optimistic UI update
      setCities((prev) =>
        prev.map((c) => (c.id === cityId ? { ...c, featured: value } : c))
      );

      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/update/${cityId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ featured: value }),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to update featured status');
        }
      } catch (err) {
        console.error("Error updating featured status:", err);
        // Revert on error
        setCities((prev) =>
          prev.map((c) => (c.id === cityId ? { ...c, featured: !value } : c))
        );
        alert("Failed to update featured status");
      }
    };

    const handleOpenUpdateForm = (city: AccessibleCityType) => {
      setSelectedCity(city);
      setIsUpdateFormOpen(true);
    };

    // ✅ Optimized delete - refresh current page
    const confirmDeleteCity = async () => {
      if (!cityToDelete) return;

      setDeleteLoading(true);
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
          
          // ✅ Refresh current page after delete
          await fetchCities(currentPage);
        } else {
          throw new Error('Failed to delete city');
        }
      } catch (error) {
        console.error("Error deleting city:", error);
        alert("Failed to delete city. Please try again.");
      } finally {
        setDeleteLoading(false);
      }
    };

    // ✅ Calculate page range for pagination buttons
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">City</th>
                <th className="px-4 py-3 text-center font-semibold">Businesses</th>
                <th className="px-4 py-3 text-center font-semibold">Featured</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <CityRowSkeleton key={i} />
                  ))}
                </>
              ) : cities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-gray-500 font-medium">No cities found</p>
                      <p className="text-gray-400 text-sm mt-1">Add your first accessible city!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                cities.map((city) => (
                  <tr key={city.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={city.picture_url}
                          alt={city.city_name}
                          className="rounded-full w-12 h-12 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/images/lansing.avif";
                          }}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{city.city_name}</p>
                          {city.slug && (
                            <p className="text-xs text-gray-500">/{city.slug}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-[#FFE2C7] text-sm text-gray-700 font-semibold py-2 px-3 rounded-md inline-block">
                        {city.businessCount} {city.businessCount === 1 ? 'Business' : 'Businesses'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <label
                        htmlFor={`toggle-${city.id}`}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <span className="mr-2 text-sm font-medium text-gray-700">Featured?</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={`toggle-${city.id}`}
                            className="sr-only peer"
                            checked={city.featured}
                            onChange={() => handleToggleFeatured(city.id, !city.featured)}
                          />
                          <div className="block w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#12B76A] transition-colors"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => {
                            setCityToDelete(city);
                            setOpenDeleteModal(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete city"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenUpdateForm(city)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="Edit city"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Showing info */}
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} cities
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) => (
                    <React.Fragment key={idx}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page as number)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Form Modal */}
        {isUpdateFormOpen && selectedCity && (
          <UpdateAccessibleCity
            selectedCity={selectedCity}
            closeModal={() => {
              setIsUpdateFormOpen(false);
              setSelectedCity(null);
            }}
            onSuccess={() => fetchCities(currentPage)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {openDeleteModal && cityToDelete && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-[400px] text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-red-600 rounded-full p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">Delete City</h2>
              <p className="mb-1 text-gray-600">Are you sure you want to delete</p>
              <p className="mb-6 text-gray-900 font-semibold text-lg">{cityToDelete.city_name}?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setOpenDeleteModal(false);
                    setCityToDelete(null);
                  }}
                  className="px-6 py-3 w-full border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer disabled:opacity-50 font-semibold transition"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCity}
                  className="px-6 py-3 w-full bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer disabled:opacity-50 font-semibold transition"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {openSuccessModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-[400px] text-center p-8 relative">
              <div className="flex justify-center mb-4">
                <div className="bg-[#12B76A] rounded-full p-4">
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
              <h2 className="text-xl font-bold mb-2 text-gray-800">Deleted Successfully!</h2>
              <p className="mb-6 text-gray-600">The accessible city has been removed.</p>
              <button
                className="w-full bg-[#0519CE] text-white px-6 py-3 rounded-full cursor-pointer hover:bg-blue-700 transition font-semibold"
                onClick={() => setOpenSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default AccessibleCityTable;