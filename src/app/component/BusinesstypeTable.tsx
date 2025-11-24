"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BusinessTypeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = "80dfa7c9-f919-4ffa-b37b-ad36899ec46d"; 
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");


const [openEditModal, setOpenEditModal] = useState(false);
const [editId, setEditId] = useState<string | null>(null);
const [editName, setEditName] = useState("");
const [editMessage, setEditMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
const [editLoading, setEditLoading] = useState(false);



  // Fetch all business types
  const fetchBusinessTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(process.env.API_BASE_URL+"/business-type/list");
      setData(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching business types:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  // Actual delete API call
  const confirmDeleteAction = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${process.env.API_BASE_URL}/business-type/delete/${deleteId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setOpenDeleteModal(false);
      setDeleteId(null);
      fetchBusinessTypes();
      
      setSuccessMessage("Business type deleted successfully");
      setErrorMessage("");
      setOpenSuccessModal(true);

    } catch (error) {
      console.error("Delete error:", error);
      setSuccessMessage("");
      setErrorMessage("Failed to delete item"); // show error in modal
      setOpenSuccessModal(true);
    }
  };

  // Edit business type
  const handleEditSubmit = async () => {
  if (!editId || !editName.trim()) return;

  try {
    setEditLoading(true);
    await axios.patch(
      `http://51.75.68.69:3006/business-type/update/${editId}/${userId}`,
      { name: editName.trim() },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    setEditMessage({ text: "Updated successfully!", type: "success" });
    fetchBusinessTypes();
  } catch (err) {
    console.error(err);
    setEditMessage({ text: "Failed to update item.", type: "error" });
  } finally {
    setEditLoading(false);
  }
};


  return (
    <section className="flex-1">
      <input type="radio" name="menuGroup" id="none" className="hidden" defaultChecked />

      <div className="h-auto rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <p className="text-center p-4 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 p-4">{error}</p>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
              <tr>
                <th className="py-3 px-6">ID</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-3 py-3 text-right"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 pr-4">{index + 1}</td>
                    <td className="px-6 py-4">{item.name}</td>

                    {/* Actions */}
                    <td className="relative px-6 py-4 text-right">
                      <input type="radio" name="menuGroup" id={`menuToggle${index}`} className="hidden peer" />

                      <label htmlFor={`menuToggle${index}`} className="cursor-pointer text-gray-500 text-2xl">
                        ⋮
                      </label>

                      <label htmlFor="none" className="hidden peer-checked:block fixed inset-0 z-40"></label>

                      <div className="cursor-pointer absolute right-0 mt-2 w-[100px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                        <button
                          onClick={() => {
                            setEditId(item.id);
                            setEditName(item.name); // prefill current value
                            setEditMessage(null); // reset message
                            setOpenEditModal(true);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-[#EFF0F1] cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(item.id);
                            setOpenDeleteModal(true);
                          }}
                          className="cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                          Delete
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

      {/* Delete Modal */}
      {openDeleteModal && (
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

            <h2 className="text-lg font-bold mb-2 text-gray-800">Delete Business Type?</h2>
            <p className="mb-4 text-gray-600">This action cannot be undone.</p>

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
              <div className={`rounded-full p-3 ${successMessage ? "bg-[#0519CE]" : "bg-red-600"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {successMessage ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-2 text-gray-800">
              {successMessage ? "Success" : "Error"}
            </h2>

            <p className="mb-4 text-gray-600">{successMessage || errorMessage}</p>

            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
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
            
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
              onClick={() => setOpenEditModal(false)}
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-800">Edit Business Type</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
            />

            {editMessage && (
              <p className={`text-sm mb-2 ${editMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {editMessage.text}
              </p>
            )}

           

            <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={() => setOpenEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  onClick={handleEditSubmit}
              disabled={editLoading}
                  className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
          </div>
        </div>
      )}


    </section>
  );
}
