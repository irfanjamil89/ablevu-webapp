"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BusinessTypeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = "80dfa7c9-f919-4ffa-b37b-ad36899ec46d"; // temp static user id

  // Fetch all business types
  const fetchBusinessTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://staging-api.qtpack.co.uk/business-type/list");
      setData(response.data.data || []);
    } catch (err: any) {
      console.error("❌ Error fetching business types:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  // Delete business type
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this business type?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://staging-api.qtpack.co.uk/business-type/delete/${id}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      alert("🗑️ Deleted successfully!");
      fetchBusinessTypes(); // refresh list
    } catch (error) {
      console.error("❌ Delete error:", error);
      alert("Failed to delete item.");
    }
  };

  // Edit business type (name)
  const handleEdit = async (id: string) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    try {
      await axios.put(
        `https://staging-api.qtpack.co.uk/business-type/update/${id}/${userId}`,
        { name: newName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      alert("✅ Updated successfully!");
      fetchBusinessTypes();
    } catch (error) {
      console.error("❌ Update error:", error);
      alert("Failed to update item.");
    }
  };

  return (
    <section className="flex-1">
      <input type="radio" name="menuGroup" id="none" className="hidden" defaultChecked />

      <div className="h-auto  rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <p className="text-center p-4 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 p-4">{error}</p>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
              <tr>
                <th scope="col" className="py-3 px-6">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-3 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 pr-4 pl-3">{index + 1}</td>
                    <td className="px-6 py-4">{item.name}</td>
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
                          onClick={() => handleEdit(item.id)}
                          className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No business types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
