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

interface AccessibilityFeaturePopupProps {
  businessId: string;
  setOpenAccessibilityFeaturePopup: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onUpdated?: (b: BusinessProfile) => void;

  // ⭐ edit group ke liye (optional)
  initialTypeId?: string;
  initialFeatureIds?: string[];
}

// ---------- Types from API ----------
type AccessibleFeatureType = {
  id: string;
  name?: string;
  title?: string;
  label?: string;
  slug?: string;
};

type AccessibleFeatureLinkedType = {
  id: string;
  accessible_feature_id: string;
  accessible_feature_type_id: string;
  active: boolean;
};

type AccessibleFeature = {
  id: string;
  title: string;
  slug: string;
  linkedTypes?: AccessibleFeatureLinkedType[];
};

// ---------- Component ----------
const AccessibilityFeaturePopup: React.FC<AccessibilityFeaturePopupProps> = ({
  businessId,
  setOpenAccessibilityFeaturePopup,
  onUpdated,
  initialTypeId,
  initialFeatureIds,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [featureTypes, setFeatureTypes] = useState<AccessibleFeatureType[]>([]);
  const [features, setFeatures] = useState<AccessibleFeature[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState<boolean>(false);
  const [loadingFeatures, setLoadingFeatures] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // helper
  const getFeatureTypeLabel = (t: AccessibleFeatureType) =>
    t.name || t.title || t.label || "Unnamed type";

  // ⭐ edit mode pre-fill
  useEffect(() => {
    if (initialTypeId) {
      setSelectedTypeId(initialTypeId);
    }
    if (initialFeatureIds && initialFeatureIds.length > 0) {
      setSelectedFeatureIds(initialFeatureIds);
    }
  }, [initialTypeId, initialFeatureIds]);

  // 1) Load Feature Types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoadingTypes(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/accessible-feature-types/list?limit=100&page=1`
        );

        if (!res.ok) {
          throw new Error(`Failed to load feature types (${res.status})`);
        }

        const data = await res.json();
        console.log("FEATURE TYPES RESPONSE:", data);

        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.items)) items = data.items;
        else if (Array.isArray(data.data)) items = data.data;

        setFeatureTypes(items);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load feature types");
      } finally {
        setLoadingTypes(false);
      }
    };

    if (!API_BASE_URL) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
      return;
    }

    fetchTypes();
  }, [API_BASE_URL]);

  // 2) Load ALL Accessible Features once
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoadingFeatures(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/accessible-feature/list?limit=1000&page=1`
        );
        if (!res.ok) {
          throw new Error(`Failed to load accessible features (${res.status})`);
        }

        const data = await res.json();
        console.log("ACCESSIBLE FEATURES RESPONSE:", data);

        const items: AccessibleFeature[] = Array.isArray(data)
          ? data
          : data.items || [];
        setFeatures(items);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load accessible features");
      } finally {
        setLoadingFeatures(false);
      }
    };

    if (!API_BASE_URL) return;
    fetchFeatures();
  }, [API_BASE_URL]);

  // 3) Filter features by selectedTypeId
  const visibleFeatures: AccessibleFeature[] =
    selectedTypeId && features.length > 0
      ? features.filter((f) =>
          f.linkedTypes?.some(
            (lt) => lt.accessible_feature_type_id === selectedTypeId && lt.active
          )
        )
      : [];

  // 4) Select / unselect single feature
  const toggleFeature = (featureId: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  // 5) Select All in visible list
  const allVisibleSelected =
    visibleFeatures.length > 0 &&
    visibleFeatures.every((f) => selectedFeatureIds.includes(f.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedFeatureIds((prev) =>
        prev.filter((id) => !visibleFeatures.some((f) => f.id === id))
      );
    } else {
      const visibleIds = visibleFeatures.map((f) => f.id);
      setSelectedFeatureIds((prev) =>
        Array.from(new Set([...prev, ...visibleIds]))
      );
    }
  };

  const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

const handleSubmit: React.FormEventHandler = async (e) => {
  e.preventDefault();

  if (!selectedTypeId || selectedFeatureIds.length === 0) {
    return;
  }

  const token = getToken();
  if (!token) {
    setError("No access token found");
    return;
  }

  try {
    setSaving(true);
    setError(null);

    // 🔹 EXACTLY same payload jaisa Postman me hai
    const res = await fetch(
      `${API_BASE_URL}/business-accessible-feature/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_id: businessId,
          accessible_feature_ids: selectedFeatureIds,
        }),
      }
    );

    if (!res.ok) {
      let msg = "Failed to save accessibility features";
      try {
        const body = await res.json();
        if (body?.message) {
          msg = Array.isArray(body.message)
            ? body.message.join(", ")
            : body.message;
        }
      } catch {
        // ignore JSON parse error
      }
      throw new Error(msg);
    }

    // 🔁 business ko refresh karne ke liye profile dubara fetch
    if (onUpdated) {
      const profileRes = await fetch(
        `${API_BASE_URL}/business/business-profile/${businessId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedBusiness = await profileRes.json();
      onUpdated(updatedBusiness);
    }

    // modal close
    setOpenAccessibilityFeaturePopup(false);
  } catch (err: any) {
    console.error(err);
    setError(err.message || "Failed to save accessibility features");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:w-[550px] p-8 relative">
        <button
          type="button"
          onClick={() => setOpenAccessibilityFeaturePopup(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Add Accessibility Features
        </h2>

        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Type select */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Select Type <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => {
                setSelectedTypeId(e.target.value);
                // agar edit mode nahi hai to type change par selection reset
                if (!initialTypeId) setSelectedFeatureIds([]);
              }}
              disabled={loadingTypes || featureTypes.length === 0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] focus:border-[#0519CE] outline-none disabled:bg-gray-100"
            >
              <option value="">
                {loadingTypes
                  ? "Loading types..."
                  : featureTypes.length === 0
                  ? "No feature types found"
                  : "Select Type"}
              </option>
              {featureTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {getFeatureTypeLabel(t)}
                </option>
              ))}
            </select>
          </div>

          {/* Features list */}
          <div
            id="categoryList"
            className="flex flex-wrap justify-between gap-y-2 max-h-56 overflow-y-auto"
          >
            <h3 className="w-full text-md font-medium text-gray-700">
              Select Features
            </h3>

            <label className="flex w-full items-center gap-2 text-gray-700 text-sm">
              <input
                id="selectAll"
                type="checkbox"
                className="h-4 w-4 text-[#0519CE] border-gray-300 rounded focus:ring-[#0519CE]"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                disabled={!selectedTypeId || visibleFeatures.length === 0}
              />
              <p className="w-[90%]">Select All</p>
            </label>

            {loadingFeatures ? (
              <p className="w-full text-sm text-gray-500">
                Loading features...
              </p>
            ) : !selectedTypeId ? (
              <p className="w-full text-sm text-gray-500">
                Please select a type first.
              </p>
            ) : visibleFeatures.length === 0 ? (
              <p className="w-full text-sm text-gray-500">
                No features found for this type.
              </p>
            ) : (
              visibleFeatures.map((f) => (
                <label
                  key={f.id}
                  className="flex w-1/2 items-center gap-2 text-gray-700 text-sm"
                >
                  <input
                    type="checkbox"
                    className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded"
                    checked={selectedFeatureIds.includes(f.id)}
                    onChange={() => toggleFeature(f.id)}
                  />
                  <p className="w-[90%]">{f.title}</p>
                </label>
              ))
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenAccessibilityFeaturePopup(false)}
              className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                saving || !selectedTypeId || selectedFeatureIds.length === 0
              }
              className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessibilityFeaturePopup;
