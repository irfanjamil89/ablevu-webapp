"use client";
import React, { useState } from "react";
import axios from "axios";

interface PartnerEditModalProps {
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  partnerId: string;
  partnerName: string;
  partnerWebsite: string;
}

const PartnerEditModal: React.FC<PartnerEditModalProps> = ({ 
  setOpenEditModal, 
  partnerId,
  partnerWebsite,
  partnerName
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [form, setForm] = useState({
    name: partnerName,
    web_url:partnerWebsite ,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      setError("Partner name is required");
      return;
    }
    
    if (!form.web_url.trim()) {
      setError("Website URL is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const organizationId = "80dfa7c9-f919-4ffa-b37b-ad36899ec46d"; 

      const payload = {
        name: form.name,
        web_url: form.web_url,
      };

      const response = await axios.put(
        `https://staging-api.qtpack.co.uk/partner/update/${partnerId}/${organizationId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Partner updated successfully!");
        
        setTimeout(() => {
          setOpenEditModal(false);
          window.location.reload(); // Refresh page to show updated data
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error updating partner:", err);
      setError(err.response?.data?.message || "Failed to update partner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
        
        <button 
          onClick={() => setOpenEditModal(false)}
          disabled={loading}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer disabled:opacity-50"
        >
          ×
        </button>

        <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Partner</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo (Optional)</label>
            <div className="relative">
              <input
                type="file"
                accept=".svg,.png,.jpg,.gif"
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                <img src="/assets/images/upload-icon.avif" alt="upload-icon" className='w-10 h-10' />
                <p className="text-[#0519CE] font-semibold text-sm">Click to upload <span className='text-gray-500 text-xs'>or drag and drop</span></p>
                <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-800 mb-1">Partner Name *</label>
            <input 
              type="text" 
              placeholder="Partner Name"
              id="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] outline-none disabled:bg-gray-100" 
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-800 mb-1">Website Link *</label>
            <input 
              type="url" 
              placeholder="https://website.com"
              id="web_url"
              value={form.web_url}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] outline-none disabled:bg-gray-100" 
            />
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setOpenEditModal(false)}
              disabled={loading}
              className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerEditModal;