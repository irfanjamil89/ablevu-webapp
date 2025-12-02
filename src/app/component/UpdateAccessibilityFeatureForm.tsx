"use client";
import React, { useEffect, useState } from "react";

type LinkedType = {
  accessible_feature_type_id: string;
  business_type_id: string;
};

export type AccessibleFeature = {
  id: string;
  title: string;
  linkedTypes: LinkedType[];
  linkedBusinessTypes: LinkedType[];
};

type BusinessType = { id: string; name: string };
type FeatureType = { id: string; name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  feature: AccessibleFeature | null;
  onSuccess?: () => void;
};

export default function UpdateAccessibilityFeatureForm({
  isOpen,
  onClose,
  feature,
  onSuccess,
}: Props) {
  const [allFeatureTypes, setAllFeatureTypes] = useState<FeatureType[]>([]);
  const [allBusinessTypes, setAllBusinessTypes] = useState<BusinessType[]>([]);
  const [title, setTitle] = useState("");
  const [selectedFeatureType, setSelectedFeatureType] = useState("");
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);
  const [selectAllCategories, setSelectAllCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!feature) return;
    const initialSelected = feature.linkedBusinessTypes?.map((x) => x.business_type_id) || [];
    setTitle(feature.title || "");
    setSelectedFeatureType(feature.linkedTypes?.[0]?.accessible_feature_type_id || "");
    setSelectedBusinessTypes(initialSelected);
    setSelectAllCategories(
      initialSelected.length > 0 &&
      initialSelected.length === allBusinessTypes.length
    );
  }, [feature, allBusinessTypes]);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature-types/list?limit=1000`)
      .then((res) => res.json())
      .then((data) => setAllFeatureTypes(data.data || []));

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}business-type/list?limit=1000`)
      .then((res) => res.json())
      .then((data) => setAllBusinessTypes(data.data || []));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feature) return;

    const token = localStorage.getItem("access_token");
    const payload = {
      title,
      accessible_feature_types: [selectedFeatureType],
      business_type: selectedBusinessTypes,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature/update/${feature.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Feature updated successfully");
        setError(null);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorMsg = "Failed to update feature";
        setError(errorMsg);
        setSuccess(null);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };


  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Update Accessibility Feature
        </h2>

        <form className="space-y-5">
          {success && <p className="text-green-500 text-md mb-2">{success}</p>}
          {error && <p className="text-red-500 text-md mb-2">{error}</p>}

          {/* Title */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Feature Type Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-md font-medium text-gray-700 mb-1">Select Type <span className="text-red-500">*</span></label>
          </div>
          <div className="relative w-full">
            <input type="checkbox" id="updateDropdownToggle" className="hidden peer" />
            <label
              htmlFor="updateDropdownToggle"
              className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
            >
              <span className="truncate">
                {selectedFeatureType
                  ? allFeatureTypes.find((f) => f.id === selectedFeatureType)?.name
                  : "Select Category"}
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

            <label htmlFor="updateDropdownToggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>

            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md hidden peer-checked:flex flex-col">
              {allFeatureTypes.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedFeatureType(feature.id);
                    const toggle = document.getElementById("updateDropdownToggle") as HTMLInputElement;
                    if (toggle) toggle.checked = false;
                  }}
                >
                  {feature.name}
                </button>
              ))}
            </div>
          </div>

          {/* Business Types */}
          <div className="mt-4 overflow-hidden overflow-y-auto rounded-lg py-2 w-full max-w-xl bg-white">
            <div className="flex flex-wrap justify-between gap-y-2 max-h-56 overflow-y-auto">
              <h3 className="w-full text-md font-medium text-gray-700">Select Categories</h3>

              <label className="flex w-full items-center gap-2 text-gray-700 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#0519CE] border-gray-300 rounded"
                  checked={selectAllCategories}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectAllCategories(checked);
                    if (checked) {
                      setSelectedBusinessTypes(allBusinessTypes.map((b) => b.id));
                    } else {
                      setSelectedBusinessTypes([]);
                    }
                  }}
                />
                Select All
              </label>

              {allBusinessTypes.map((bt) => (
                <label key={bt.id} className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                  <input
                    type="checkbox"
                    className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded"
                    checked={selectedBusinessTypes.includes(bt.id)}
                    onChange={(e) => {
                      const id = bt.id;
                      let updatedList;
                      if (e.target.checked) {
                        updatedList = [...selectedBusinessTypes, id];
                      } else {
                        updatedList = selectedBusinessTypes.filter((x) => x !== id);
                      }
                      setSelectedBusinessTypes(updatedList);
                      setSelectAllCategories(updatedList.length === allBusinessTypes.length);
                    }}
                  />
                  {bt.name}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
