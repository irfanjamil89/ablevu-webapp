"use client";
import React, { useEffect, useState } from "react";
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

export default function AccessibleFeatureTable() {
  const [features, setFeatures] = useState<AccessibleFeature[]>([]);
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<AccessibleFeature | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  useEffect(() => {
    const fetchFeatureTypes = fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature-types/list?limit=1000`
    ).then((res) => res.json());

    const fetchBusinessTypes = fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}business-type/list?limit=1000`
    ).then((res) => res.json());
    const fetchFeatures = fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature/list?limit=1000`,
      {
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => res.json());

    Promise.all([fetchFeatureTypes, fetchBusinessTypes, fetchFeatures])
      .then(([ftRes, btRes, fRes]) => {
        setFeatureTypes(ftRes.data || []);
        setBusinessTypes(btRes.data || []);
        setFeatures(fRes.items || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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

  if (loading) {
    return <div className="flex justify-center items-center h-[400px]">
      <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
    </div>;
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feature?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-feature/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        alert("Feature deleted successfully!");
        window.location.reload();
      }
      else {
        console.error('Failed to delete feature');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="rounded-lg shadow-sm border border-gray-200">
      <div className="max-h-[500px] overflow-y-auto">
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
            {features.map((feature, index) => (
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
                        handleDelete(feature.id);
                        const toggle = document.getElementById(`menuToggle${index}`) as HTMLInputElement;
                        if (toggle) toggle.checked = false;
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isUpdateFormOpen && (
        <UpdateAccessibilityFeatureForm
          isOpen={isUpdateFormOpen}
          onClose={() => setIsUpdateFormOpen(false)}
          feature={selectedFeature}
        />
      )}
    </div>
  );
}

