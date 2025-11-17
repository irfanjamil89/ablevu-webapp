"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FeatureTypeTable({ refresh }: { refresh: number }) {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  const fetchFeatures = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://staging-api.qtpack.co.uk/accessible-feature-types/list",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setFeatures(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setFeatures(response.data.data);
      } else {
        setError("Unexpected response format.");
      }
    } catch (err: any) {
      console.error("❌ Error fetching features:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [refresh]);

  // Handle Edit feature type
  const handleEdit = async (id: string) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    try {
      await axios.put(
        `https://staging-api.qtpack.co.uk/accessible-feature-types/update/${id}/80dfa7c9-f919-4ffa-b37b-ad36899ec46d`,
        { name: newName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      alert("✅ Updated successfully!");
      fetchFeatures();
    } catch (error) {
      console.error("❌ Update error:", error);
      alert("Failed to update item.");
    }
  };

  // Handle Delete feature type
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this feature?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://staging-api.qtpack.co.uk/accessible-feature-types/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      alert("🗑️ Deleted successfully!");
      fetchFeatures();
    } catch (error) {
      console.error("❌ Delete error:", error);
      alert("Failed to delete item.");
    }
  };

  return (
    <section className="flex-1">
      <div className="h-auto overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
            <tr>
              <th className="py-3 px-6">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : features.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  No data found.
                </td>
              </tr>
            ) : (
              features.map((feature: any, index: number) => (
                <tr key={feature.id || index} className="hover:bg-gray-50">
                  <td className="px-6 pr-4 pl-3">{index + 1}</td>
                  <td className="px-6 py-4">{feature.name}</td>
                  <td className="relative px-6 py-4 text-right">
                    {/* Radio-based toggle menu */}
                    <input
                      type="radio"
                      name="menuGroup"
                      id={`menuToggle${index}`}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`menuToggle${index}`}
                      className="cursor-pointer text-gray-500 text-2xl select-none"
                    >
                      ⋮
                    </label>

                    {/* Overlay to close on click outside */}
                    <label
                      htmlFor="none"
                      className="hidden peer-checked:block fixed inset-0 z-40"
                    ></label>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                      <button
                        onClick={() => handleEdit(feature.id)}
                        className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(feature.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
