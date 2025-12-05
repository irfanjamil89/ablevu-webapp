"use client";

import React, { useEffect, useState } from "react";

export type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
};

type Partner = {
  id: string;
  name: string;
  image_url?: string | null;
  web_url?: string | null;
};

interface PartnerCertificationPopupProps {
  businessId: string;
  setOpenPartnerCertificationsPopup: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onUpdated?: (b: BusinessProfile) => void;
}

// small helper to read token
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

// ---------- Component ----------
const PartnerCertificationPopup: React.FC<PartnerCertificationPopupProps> = ({
  businessId,
  setOpenPartnerCertificationsPopup,
  onUpdated,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // -------- Fetch partner list on mount --------
  useEffect(() => {
    const fetchPartners = async () => {
      if (!API_BASE_URL) return;

      const token = getToken();
      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/partner/list?page=1&limit=1000`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch partners");
          return;
        }

        const data = await res.json();
        const list: Partner[] = Array.isArray(data)
          ? data
          : data.items || data.data || [];

        setPartners(list);
      } catch (err) {
        console.error("Error fetching partners", err);
      }
    };

    fetchPartners();
  }, [API_BASE_URL]);

  // -------- Submit handler --------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API_BASE_URL) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    if (!selectedPartnerId) {
      setError("Please select a partner.");
      setSuccess(null);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        partner_id: selectedPartnerId,
        active: true,
      };

      const res = await fetch(`${API_BASE_URL}/business-partner/create/${businessId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok){
        setSuccess("Partner Certficaton created successfully!");
        setError("");
      }
      else {
        let msg = "Failed to save partner certification";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {
          // ignore parse error
        }
        setError(msg);
      }

      const updated = await res.json();
      if (onUpdated && updated) {
        onUpdated(updated);
      }

      setOpenPartnerCertificationsPopup(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to save partner certification");
      setSuccess("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      {/* <!-- MODAL CARD --> */}
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">
        {/* <!-- CLOSE BUTTON --> */}
        <label
          onClick={() => setOpenPartnerCertificationsPopup(false)}
          className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </label>

        {/* <!-- HEADER --> */}
        <h2 className="text-md font-semibold text-gray-900 mb-4">
          Add Partner Certificates/Programs
        </h2>

        {/* <!-- FORM --> */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm ">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          {/* <!-- Select Partner --> */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Select Partner
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-1 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
            >
              <option value="" disabled>
                Choose from this dropdown
              </option>

              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* <!-- BUTTONS --> */}
          <div className="flex justify-center gap-3 pt-2">
            <label
              onClick={() => setOpenPartnerCertificationsPopup(false)}
              className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </label>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerCertificationPopup;
