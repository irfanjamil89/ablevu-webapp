"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import UpdateAccessibilityFeatureForm from "./UpdateAccessibilityFeatureForm";

type LinkedType = {
  accessible_feature_type_id: string;
  business_type_id: string;
};

type AccessibleFeature = {
  id: string;
  title: string;
  linkedTypes: LinkedType[];
  linkedBusinessTypes: LinkedType[];
};

type FeatureType = {
  id: string;
  name: string;
};

type BusinessType = {
  id: string;
  name: string;
};
type Props = {
  onCountChange?: (count: number) => void;
};

const AccessibleFeatureTable = forwardRef<{ fetchFeatures: () => void }, Props>(
  function AccessibleFeatureTable({ onCountChange }, ref) {
    const [features, setFeatures] = useState<AccessibleFeature[]>([]);
    const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([]);
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeature, setSelectedFeature] = useState<AccessibleFeature | null>(null);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState<AccessibleFeature | null>(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(features.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeatures = features.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  

    const fetchFeatures = async () => {
      setLoading(true);
      try {
        const [ftRes, btRes, fRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature-types/list?limit=1000`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}business-type/list?limit=1000`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature/list?limit=1000`, {
            headers: { "Content-Type": "application/json" },
          }).then(res => res.json())
        ]);

        setFeatureTypes(ftRes.data || []);
        setBusinessTypes(btRes.data || []);
        const items = fRes.items || [];
        setFeatures(items);
        if (onCountChange) onCountChange(items.length);
      } catch (err) {
        console.error("Error fetching features:", err);
      } finally {
        setLoading(false);
      }
    };
    useImperativeHandle(ref, () => ({
      fetchFeatures,
    }));

    useEffect(() => {
      fetchFeatures();
    }, []);


    const getFeatureTypeNames = (linked: LinkedType[]) =>
      linked
        .map(
          (lt) =>
            featureTypes.find((ft) => ft.id === lt.accessible_feature_type_id)?.name
        )
        .filter(Boolean)
        .join(", ");

    const getBusinessTypeNames = (linked: LinkedType[]) =>
      linked
        .map(
          (lt) => businessTypes.find((bt) => bt.id === lt.business_type_id)?.name
        )
        .filter(Boolean)
        .join(", ");

    const confirmDeleteAction = async () => {
      if (!featureToDelete) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature/delete/${featureToDelete.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (res.ok) {
          setOpenDeleteModal(false);
          setFeatureToDelete(null);
          setOpenSuccessModal(true);
        } else {
          console.error("Failed to delete feature");
        }
      } catch (error) {
        console.error("Error deleting feature:", error);
      }
    };

    if (loading) {
      return <div className="flex justify-center items-center h-[400px]">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
      </div>;
    }

    const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
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
      <div className="w-full rounded-lg shadow-sm border border-gray-200">
        <div className="w-full overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
              <tr>
                <th scope="col" className="w-auto lg:w-[800px] py-3 pr-3 pl-3">ID</th>
                <th scope="col" className="w-auto lg:w-[800px] py-3 pr-3 pl-3">Title</th>
                <th scope="col" className="px-6 py-3">Feature Type</th>
                <th scope="col" className="px-6 py-3">Business Categories</th>
                <th scope="col" className="px-3 py-3 text-right"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentFeatures.map((feature, index) => (
                <tr key={feature.id} className="hover:bg-gray-50">
                  <td className="px-6 pr-4 pl-3">{index + 1}</td>
                  <td className="px-6 pr-4 pl-3">{feature.title}</td>
                  <td className="px-6 py-4">{getFeatureTypeNames(feature.linkedTypes)}</td>
                  <td className="px-6 py-4">{getBusinessTypeNames(feature.linkedBusinessTypes)}</td>
                  <td className="relative px-6 py-4 text-right">
                    <input
                      type="checkbox"
                      id={`menuToggle${index}`}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`menuToggle${index}`}
                      className="cursor-pointer text-gray-500 text-2xl select-none"
                    >
                      ⋮
                    </label>


                    <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                      <button
                        onClick={() => {
                          setSelectedFeature(feature);
                          setIsUpdateFormOpen(true);
                          const toggle = document.getElementById(`menuToggle${index}`) as HTMLInputElement;
                          if (toggle) toggle.checked = false;
                        }}
                        className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setFeatureToDelete(feature);
                          setOpenDeleteModal(true);
                          const toggle = document.getElementById(
                            `menuToggle${index}`
                          ) as HTMLInputElement;
                          if (toggle) toggle.checked = false;
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && features.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
            {/* Left side: Entry counter */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, features.length)} of {features.length} entries
            </div>

            {/* Right side: Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  <React.Fragment key={idx}>
                    {page === '...' ? (
                      <span className="px-3 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(page as number)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page
                          ? "bg-[#0519CE] text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
        </div>
        {isUpdateFormOpen && (
          <UpdateAccessibilityFeatureForm
            isOpen={isUpdateFormOpen}
            onClose={() => setIsUpdateFormOpen(false)}
            feature={selectedFeature}
            onSuccess={fetchFeatures}
          />
        )}
        {openDeleteModal && featureToDelete && (
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Delete Accessible Feature
              </h2>
              <p className="mb-4 text-gray-600">Are you sure you want to delete this Accessible Feature.</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteAction}
                  className="px-5 py-2 w-full bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

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
              <p className="mb-4">The Accessible Feature has been removed.</p>

              <button
                className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  setOpenSuccessModal(false);
                  fetchFeatures();
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
export default AccessibleFeatureTable;
