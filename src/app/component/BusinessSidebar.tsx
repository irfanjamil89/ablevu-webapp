"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLike } from "react-icons/ai";
import {
  BsBookmark,
  BsArrowLeft,
  BsLink,
  BsEnvelope,
  BsTelephone,
  BsPin,
  BsFacebook,
  BsInstagram,
  BsClock,
} from "react-icons/bs";

// ---------- Types ----------
type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type BusinessScheduleItem = {
  id: string;
  day: string;
  opening_time_text: string;
  closing_time_text: string;
  active: boolean;
};

type LinkedTypeItem = {
  id: string;
  business_type_id: string;
  name?: string;
  business_type_name?: string;
  businessType?: { id: string; name: string };
};

type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  website: string | null;
  email: string | null;
  phone_number: string | null;
  facebook_link: string | null;
  instagram_link: string | null;
  logo_url: string | null;
  linkedTypes: LinkedTypeItem[];
  businessSchedule: BusinessScheduleItem[];
  business_status?: string | null; 
};

type BusinessType = {
  id: string;
  name: string;
};

interface BusinessSidebarProps {
  business: BusinessProfile | null;
  businessTypes: BusinessType[];
  loading: boolean;
  error: string | null;
  setOpenDetailPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenOperatingHours: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSocialLinks: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAboutModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Pending Approved", value: "pending approved" },
  { label: "Approved", value: "approved" },
  { label: "Claimed", value: "claimed" },
];

const DAY_ORDER: Record<DayKey, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const getDayOrder = (day: string) => {
  const key = day.toLowerCase() as DayKey;
  return DAY_ORDER[key] ?? 999;
};

export default function BusinessSidebar({
  business,
  businessTypes,
  loading,
  error,
  setOpenDetailPopup,
  setOpenOperatingHours,
  setOpenSocialLinks,
  setOpenAboutModal,
}: BusinessSidebarProps) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleShareClick = async () => {
    try {
      const url =
        typeof window !== "undefined" ? window.location.href : "";

      if (!url) return;

      await navigator.clipboard.writeText(url);
      alert("Page link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL", err);
      alert("Could not copy link. Please try again.");
    }
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [status, setStatus] = useState<string>(
    business?.business_status || "Draft"
  );
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");


  const confirmDeleteAction = async () => {
    if (!business) return;

    try {
      setDeleteError("");
      setDeleteSuccess("");

      if (!API_BASE_URL) {
        setDeleteError("API base URL is not configured.");
        return;
      }

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        setDeleteError("Login required. No access token found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/business/delete/${business.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Delete business error:", body);
        const message =
          (body as { message?: string })?.message ||
          `Failed to delete business (${res.status})`;
        throw new Error(message);
      }

      setOpenDeleteModal(false);
      setDeleteSuccess("Business deleted successfully.");
      setOpenSuccessModal(true);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to delete business";
      setDeleteError(msg);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!business) return;

    try {
      setStatusError("");
      setStatusSaving(true);

      if (!API_BASE_URL) {
        setStatusError("API base URL is not configured.");
        return;
      }

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        setStatusError("Login required. No access token found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/business/status/${business.id}`,
        {
          method: "PATCH", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business_status: newStatus,
          }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Update business status error:", body);
        const message =
          (body as { message?: string })?.message ||
          `Failed to update business status (${res.status})`;
        throw new Error(message);
      }

      setStatus(newStatus);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to update business status";
      setStatusError(msg);
    } finally {
      setStatusSaving(false);
    }
  };

  const businessTypesMap = useMemo(() => {
    const map: Record<string, string> = {};
    businessTypes.forEach((bt) => {
      if (bt?.id && bt?.name) map[bt.id] = bt.name;
    });
    return map;
  }, [businessTypes]);

  const categoryNames = useMemo(() => {
    if (!business?.linkedTypes) return [];

    return business.linkedTypes
      .map((lt) => {
        return (
          lt.businessType?.name ??
          lt.name ??
          lt.business_type_name ??
          (lt.business_type_id ? businessTypesMap[lt.business_type_id] : undefined)
        );
      })
      .filter((n): n is string => Boolean(n));
  }, [business, businessTypesMap]);

  const displayAddress =
    business?.address ||
    [business?.city, business?.state, business?.zipcode, business?.country]
      .filter(Boolean)
      .join(", ") ||
    "Address not provided";

  const formatDay = (day: string) =>
    day ? day.charAt(0).toUpperCase() + day.slice(1).toLowerCase() : "";

  const sortedBusinessSchedule = useMemo(() => {
    if (!business?.businessSchedule?.length) return [];
    return [...business.businessSchedule]
      .filter((s) => s.active)
      .sort((a, b) => getDayOrder(a.day) - getDayOrder(b.day));
  }, [business?.businessSchedule]);

  if (loading) {
    return (
      <div className="w-3/10 px-10 py-7 border-r border-[#e5e5e7]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="w-3/10 px-10 py-7 border-r border-[#e5e5e7]">
        <button onClick={() => router.back()}>
          <BsArrowLeft className="w-6 h-6 mr-3 inline-block" />
        </button>
        <p className="text-red-500 mt-4">
          {error || "Failed to load business profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-3/10 px-10 py-7 border-r border-[#e5e5e7]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-2xl font-semibold">
          <button onClick={() => router.back()}>
            <BsArrowLeft className="w-6 h-6 mr-3" />
          </button>
          Business Details
        </div>

        <button
          className="rounded-4xl border py-3 px-4 flex border-[#e5e5e7] items-center"
          onClick={handleShareClick} 
          >
          <img
          src="/assets/images/share.png"
          alt="Share"
          className="w-5 h-5 mr-3"
          />
          Share
          </button>
      </div>

      {/* Logo */}
      <div className="border rounded-3xl mt-6 flex justify-center border-[#e5e5e7]">
        <img
          src={business.logo_url || "/assets/images/businesslogo.png"}
          alt={business.name}
          className="w-80 object-contain"
        />
      </div>

      {/* Info */}
      <div className="py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{business.name}</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 py-1 px-3 rounded-2xl bg-[#f0f1ff] text-[#0205d3]">
              <AiOutlineLike className="w-5 h-5" />
              <span>0</span>
            </button>
            <BsBookmark className="w-5 h-5 text-[#0205d3]" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-start mt-4 border-b border-[#e5e5e7] pb-6">
          <p className="mr-4 mt-1 text-gray-500">Categories</p>

          {categoryNames.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {categoryNames.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="bg-[#f8f9fb] py-1 px-3 rounded-2xl"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No categories</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">Details</h3>

          <button
            type="button"
            onClick={() => setOpenDetailPopup(true)}
            className="text-sm text-gray-800 cursor-pointer font-bold"
          >
            <img
              src="/assets/images/writing-svgrepo-com.svg"
              alt="Edit"
              className="w-6 h-6"
            />
          </button>
        </div>

        {business.website && (
          <p className="flex items-center mb-3">
            <BsLink className="w-6 h-6 mr-3 text-[#0205d3]" />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all"
            >
              {business.website}
            </a>
          </p>
        )}

        {business.email && (
          <p className="flex items-center mb-3">
            <BsEnvelope className="w-5 h-5 mr-3 text-[#0205d3]" />
            <a href={`mailto:${business.email}`} className="break-all">
              {business.email}
            </a>
          </p>
        )}

        {business.phone_number && (
          <p className="flex items-center mb-3">
            <BsTelephone className="w-5 h-5 mr-3 text-[#0205d3]" />
            <a href={`tel:${business.phone_number}`}>
              {business.phone_number}
            </a>
          </p>
        )}

        <p className="flex">
          <BsPin className="w-5 h-5 mr-3 text-[#0205d3]" />
          <span className="break-all">{displayAddress}</span>
        </p>
      </div>

      {/* Operating Hours */}
      <div className="border-b pb-10 mt-10 border-[#e5e5e7]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-6">Operating Hours</h3>

          <button
            type="button"
            onClick={() => setOpenOperatingHours(true)}
            className="text-sm text-gray-800 cursor-pointer font-bold"
          >
            <img
              src="/assets/images/writing-svgrepo-com.svg"
              alt="Edit"
              className="w-6 h-6"
            />
          </button>
        </div>

        {sortedBusinessSchedule.length ? (
          sortedBusinessSchedule.map((s) => (
            <p key={s.id} className="flex items-center mb-3">
              <BsClock className="w-5 h-5 mr-3 text-[#0205d3]" />
              <span className="min-w-[90px]">{formatDay(s.day)}</span>
              <span className="ml-4">
                {s.opening_time_text} to {s.closing_time_text}
              </span>
            </p>
          ))
        ) : (
          <p className="text-gray-500">No schedule added yet.</p>
        )}
      </div>

      {/* Social Links */}
      <div className="border-b pb-10 mt-10 border-[#e5e5e7]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-6">Social Links</h3>

          <button
            type="button"
            onClick={() => setOpenSocialLinks(true)}
            className="text-sm text-gray-800 cursor-pointer font-bold"
          >
            <img
              src="/assets/images/writing-svgrepo-com.svg"
              alt="Edit"
              className="w-6 h-6"
            />
          </button>
        </div>

        <div className="flex">
          {business.facebook_link && (
            <a
              href={business.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsFacebook className="w-10 h-10 mr-3 text-[#139df8]" />
            </a>
          )}
          {business.instagram_link && (
            <a
              href={business.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram className="w-10 h-10 mr-3 text-[#E1306C]" />
            </a>
          )}
          {!business.facebook_link && !business.instagram_link && (
            <p className="text-gray-500">No social links provided.</p>
          )}
        </div>
      </div>

      {/* About */}
      <div className="pb-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold my-6">About</h3>

          <button
            type="button"
            onClick={() => setOpenAboutModal(true)}
            className="text-sm text-gray-800 cursor-pointer font-bold"
          >
            <img
              src="/assets/images/writing-svgrepo-com.svg"
              alt="Edit"
              className="w-6 h-6"
            />
          </button>
        </div>
        <p>{business.description || "No description added yet."}</p>
      </div>

      {/* ⭐ Business Status - SELECT DROPDOWN */}
      <div className="pb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Business Status
  </label>

  <select
    className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0519CE] focus:border-[#0519CE]"
    value={status}
    disabled={statusSaving}
    onChange={(e) => handleStatusChange(e.target.value)}
  >
    {STATUS_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label} 
      </option>
    ))}
  </select>

  {statusSaving && (
    <p className="text-xs text-gray-500 mt-1">Saving...</p>
  )}

  {statusError && (
    <p className="text-red-500 text-sm mt-1">{statusError}</p>
  )}
</div>


      {/* Delete Business button + inline error/success */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpenDeleteModal(true)}
          className="flex justify-center items-center gap-2 px-5 py-2.5 w-full text-center text-md font-bold bg-[#FFEBEB] text-[#DD3820] rounded-full cursor-pointer"
        >
          <img
            src="/assets/images/red-delete.svg"
            alt="red-delete"
            className="w-5 h-5"
          />
          Delete Business
        </button>

        {deleteError && (
          <p className="text-red-500 text-sm mt-2">{deleteError}</p>
        )}
        {deleteSuccess && (
          <p className="text-green-600 text-sm mt-1">{deleteSuccess}</p>
        )}
      </div>

      {/* 🔴 Delete Confirmation Popup */}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Delete Business?
            </h2>
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

      {/* ✅ Success Modal */}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2">Deleted Successfully!</h2>
            <p className="mb-4">The business has been removed.</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => {
                setOpenSuccessModal(false);
                router.push("/dashboard/businesses");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
