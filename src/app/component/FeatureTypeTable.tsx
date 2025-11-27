"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FeatureTypeTable({ refresh }: { refresh: number }) {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFeatureId, setEditFeatureId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [editloading, seteditLoading] = useState(false);
  const [editerror, seteditError] = useState("");
  const [success, setSuccess] = useState("");



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);



  const fetchFeatures = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_BASE_URL+"/accessible-feature-types/list",
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
      console.error("Error fetching features:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [refresh]);

  // Handle Edit feature type
  const handleEdit = async (id: string, currentName: string) => {
    setEditFeatureId(id);
    setForm({ name: currentName }); // pre-fill modal input
    seteditError("");
    setSuccess("");
    setOpenEditModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editFeatureId) return;

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accessible-feature-types/update/${editFeatureId}/80dfa7c9-f919-4ffa-b37b-ad36899ec46d`,
      {
        name: form.name,
        
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    setSuccess("Updated successfully!");

    setTimeout(() => {
      setOpenEditModal(false);
      fetchFeatures();
    }, 700);

  } catch (error) {
    console.error("Update error:", error);
    setError("Failed to update item.");
  } finally {
    setLoading(false);
  }
};




  // Handle Delete feature type
  const handleDelete = (id: string) => {
    setFeatureToDelete(id);  // store the id of the feature to delete
    setOpenDeleteModal(true); // open confirmation modal
  };

   if (loading) {
    return <div className="flex justify-center items-center h-screen">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
    </div>; // Show loading message while the data is being fetched
  }

  return (
    <section className="flex-1">
      <div className="h-auto rounded-lg shadow-sm border border-gray-200">
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
            ) : (features.map((feature: any, index: number) => (
              <tr key={feature.id || index} className="hover:bg-gray-50 relative">
                <td className="px-6 pr-4 pl-3">{index + 1}</td>
                <td className="px-6 py-4">{feature.name}</td>
                <td className="relative px-6 py-4 text-right">
                  {/* Dropdown Toggle */}
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-500 text-2xl focus:outline-none cursor-pointer"
                      id={`menuButton${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(index === openDropdown ? null : index);
                      }}
                    >
                      ⋮
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === index && (
                      <div
                        className="absolute right-0 mt-2 w-30 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(feature.id, feature.name)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(feature.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))


            )}
          </tbody>
        </table>
      </div>

      {openDeleteModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
            {/* Warning Icon */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            {/* Modal content */}
            <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this feature?</p>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
                onClick={() => setOpenDeleteModal(false)}
                disabled={loadingDelete}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 w-full text-center text-sm font-bold bg-red-600 text-white rounded-full cursor-pointer hover:bg-red-700"
                onClick={async () => {
                  if (!featureToDelete) return;
                  setLoadingDelete(true);
                  try {
                    await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accessible-feature-types/delete/${featureToDelete}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                      }
                    );
                    setOpenDeleteModal(false);
                    setFeatureToDelete(null);
                    fetchFeatures(); // refresh list
                    setOpenSuccessModal(true); // show success modal
                  } catch (error) {
                    console.error("Delete error:", error);
                    alert("Failed to delete item.");
                  } finally {
                    setLoadingDelete(false);
                  }
                }}
                disabled={loadingDelete}
              >
                {loadingDelete ? "Deleting..." : "Delete"}
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
            <p className="mb-4">The feature has been removed.</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => setOpenSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {openEditModal && (
        <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

            {/* Close Button */}
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Feature Type</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-md font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500 font-bold">*</span>
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={250}
                  pattern="^[A-Za-z\s]{1,50}$"
                  placeholder="Enter Name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
                />
              </div>

              {editerror && <p className="text-red-500 text-sm">{editerror}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  className="px-5 py-2 w-full text-center text-sm cursor-pointer font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100"
                  onClick={() => setOpenEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editloading}
                  className="px-5 py-2 w-full text-center cursor-pointer text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  {editloading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </section>
  );
}
