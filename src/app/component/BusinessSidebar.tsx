"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLike } from "react-icons/ai";
import {
  BsBookmark,
  BsBookmarkFill,
  BsArrowLeft,
  BsLink,
  BsEnvelope,
  BsTelephone,
  BsPin,
  BsFacebook,
  BsInstagram,
  BsClock,
} from "react-icons/bs";
import BusinessImageUpload from "./BusinessImageUpload";

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
  business_status?: string;
  businessRecomendations?: any[];
};

type BusinessType = {
  id: string;
  name: string;
};

type UserRole = "Admin" | "Business" | "Contributor" | "User" | string;

// ⭐ NEW: SavedBusiness type
type SavedBusiness = {
  id: string;
  business_id: string;
  user_id: string;
  note?: string;
  created_at: string;
  updated_at: string;
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
  showSuccess: (title: string, message: string, onClose?: () => void) => void;
  showError: (title: string, message: string, onClose?: () => void) => void;
  refetchBusiness: () => void;
}

// ---------- Status helper ----------
const normalizeStatus = (status: string) =>
  status.toLowerCase().trim().replace(/[\s_-]+/g, " ");

type StatusKey =
  | "draft"
  | "pending approval"
  | "approved"
  | "pending acclaim"
  | "claimed";

// Label mapping for UI
const STATUS_LABELS: Record<StatusKey, string> = {
  draft: "Draft",
  "pending approval": "Pending Approval",
  approved: "Approved",
  "pending acclaim": "Pending Acclaim",
  claimed: "Claimed",
};

const ALL_STATUSES: StatusKey[] = [
  "draft",
  "pending approval",
  "approved",
  "pending acclaim",
  "claimed",
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
  showSuccess,
  showError,
  refetchBusiness,
}: BusinessSidebarProps) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [status, setStatus] = useState<string>("draft");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  // ⭐ SAVE STATE
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveId, setSaveId] = useState<string | null>(null);

  // ---------- TOKEN HELPER ----------
  function getUserIdFromToken(token: string | null): string | null {
    if (!token || token === "null" || token === "undefined") return null;

    try {
      const parts = token.split(".");
      if (parts.length < 2) {
        console.warn("Invalid token format, no payload part");
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      const payload = JSON.parse(json);

      return payload?.sub || payload?.id || null;
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
  }

  // ⭐ SAVE TOGGLE
  const handleSaveToggle = async () => {
    if (!business || saveLoading) return;

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;

    if (!token) {
      showError("Login Required", "Please login to save businesses.");
      return;
    }

    try {
      setSaveLoading(true);

      // 🔴 UNSAVE
      if (saved && saveId) {
        const res = await fetch(
          `${API_BASE_URL}/business-save/delete/${saveId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to remove save");

        setSaved(false);
        setSaveId(null);
        showSuccess("Removed", "Business removed from saved list.");
        return;
      }

      // 🟢 SAVE
      const res = await fetch(`${API_BASE_URL}/business-save/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_id: business.id,
          note: "Save Business",
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const resData = await res.json();
      const created = (resData?.data || resData) as { id?: string };

      setSaved(true);
      if (created?.id) {
        setSaveId(created.id);
      }

      showSuccess("Saved", "Business added to your saved list.");
    } catch (err: any) {
      showError("Error", err.message || "Save failed");
    } finally {
      setSaveLoading(false);
    }
  };

  // ⭐ ON LOAD -> CHECK SAVED
  useEffect(() => {
    const checkSaved = async () => {
      if (!business || !API_BASE_URL) return;

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;
      const userId = getUserIdFromToken(token);

      if (!token || !userId) {
        setSaved(false);
        setSaveId(null);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/business-save/list?page=1&limit=100`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.warn("Failed to fetch saved list", res.status);
          return;
        }

        const body = await res.json();
        const items: SavedBusiness[] = body.data || body.items || [];

        const match = items.find(
          (s) =>
            s.business_id === business.id &&
            (!s.user_id || s.user_id === userId)
        );

        if (match) {
          setSaved(true);
          setSaveId(match.id);
        } else {
          setSaved(false);
          setSaveId(null);
        }
      } catch (err) {
        console.error("Failed to check saved status", err);
      }
    };

    checkSaved();
  }, [business?.id, API_BASE_URL]);

  const handleRecommendClick = async () => {
    if (!business) return;
    if (!API_BASE_URL) {
      showError("Error", "API base URL is not configured.");
      return;
    }

    try {
      setLikeLoading(true);

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      const res = await fetch(
        `${API_BASE_URL}/business-recomendations/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            businessId: business.id,
            label: "like",
            active: true,
          }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg =
          (body as { message?: string })?.message ||
          `Failed to create recommendation (${res.status})`;
        throw new Error(msg);
      }

      setLikeCount((prev) => prev + 1);

      showSuccess("Thank you!", "Your recommendation has been submitted.");
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to submit recommendation.";
      showError("Error", msg);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showSuccess("Link Copied", "Page URL copied to clipboard.");
    } catch {
      showError("Share Failed", "Unable to copy link.");
    }
  };

  useEffect(() => {
    if (!business?.businessRecomendations) {
      setLikeCount(0);
      return;
    }

    const count = business.businessRecomendations.filter((rec: any) => {
      const label = (rec.label || "").toLowerCase().trim();
      const isActive = rec.active !== false;
      return label === "like" && isActive;
    }).length;

    setLikeCount(count);
  }, [business?.businessRecomendations]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (typeof window === "undefined") return;

        const token = window.localStorage.getItem("access_token");
        const userId = getUserIdFromToken(token);

        if (!token || !userId) {
          console.warn("No valid token / userId found, skipping user role fetch");
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          console.error("API base URL is not configured");
          return;
        }

        const res = await fetch(`${base}/users/me/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("User role fetch failed with status", res.status);
          return;
        }

        const data = await res.json();
        if (data?.user_role) {
          setUserRole(data.user_role);
        }
      } catch (err) {
        console.error("Failed to fetch user role", err);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (business?.business_status) {
      setStatus(normalizeStatus(business.business_status));
    }
  }, [business?.business_status]);

  const handleStatusChange = async (newStatus: string) => {
    if (!business) return;

    const normalized = normalizeStatus(newStatus);

    try {
      setStatusError("");
      setStatusSaving(true);

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      const res = await fetch(
        `${API_BASE_URL}/business/status/${business.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business_status: normalized,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      setStatus(normalized);
      refetchBusiness?.();

      showSuccess("Status Updated", "Business status updated successfully.");
    } catch (err) {
      setStatusError("Failed to update status");
      showError(
        "Status Update Failed",
        "There was a problem updating the business status. Please try again."
      );
    } finally {
      setStatusSaving(false);
    }
  };

  // ✅ status helpers
  const normalizedStatus = useMemo(
    () => normalizeStatus(status) as StatusKey,
    [status]
  );

  const currentStatusLabel = STATUS_LABELS[normalizedStatus] || status;

  const isAdmin = userRole === "Admin";
  const isBusinessContributorOrUser =
  userRole === "Business" ||
  userRole === "Contributor" ||
  userRole === "User";

  // ✅ Admin dropdown options: all statuses
  const adminStatusOptions = useMemo(() => {
    return ALL_STATUSES.map((s) => ({
      value: s,
      label: STATUS_LABELS[s],
    }));
  }, []);

  // ✅ Non-admin actions (Business/Contributor)
  type StatusAction = {
    key: string;
    label: string;
    toStatus: StatusKey;
    roles: Array<"Business" | "Contributor">;
  };

  const ACTIONS: StatusAction[] = [
    {
      key: "submit_approval",
      label: "Submit for Approval",
      toStatus: "pending approval",
      roles: ["Business", "Contributor"],
    },
    {
      key: "submit_acclaim",
      label: "Submit for Acclaim",
      toStatus: "pending acclaim",
      roles: ["Business", "Contributor"],
    },
  ];

  const availableActions = useMemo(() => {
  if (!userRole) return [];
  if (isAdmin) return []; // admin uses dropdown

  const role = userRole as any;

  if (!["Business", "Contributor", "User"].includes(role)) return [];

  const byStatus: Record<StatusKey, Array<StatusAction["key"]>> = {
    draft: ["submit_approval"],
    "pending approval": [],
    approved: ["submit_acclaim"],
    "pending acclaim": [],
    claimed: [],
  };

  const allowedKeys = byStatus[normalizedStatus] || [];

  return ACTIONS.filter((a) => allowedKeys.includes(a.key));
}, [userRole, isAdmin, normalizedStatus]);


  const confirmDeleteAction = async () => {
    if (!business) return;

    try {
      setDeleteError("");

      if (!API_BASE_URL) {
        const msg = "API base URL is not configured.";
        setDeleteError(msg);
        showError("Delete Failed", msg);
        return;
      }

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        const msg = "Login required. No access token found.";
        setDeleteError(msg);
        showError("Delete Failed", msg);
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

      showSuccess(
        "Deleted Successfully!",
        "The business has been removed.",
        () => {
          router.push("/dashboard/businesses");
        }
      );
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to delete business";
      setDeleteError(msg);
      showError("Delete Failed", msg);
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
          (lt.business_type_id
            ? businessTypesMap[lt.business_type_id]
            : undefined)
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
          onClick={handleShare}
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
      <BusinessImageUpload
        businessId={business.id}
        businessName={business.name}
        initialImageUrl={business.logo_url}
        onUploadSuccess={() => {
          refetchBusiness();
        }}
      />

      {/* Info */}
      <div className="py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{business.name}</h3>

          <div className="flex items-center gap-3">
            {/* LIKE BUTTON */}
            <button
              className="flex items-center gap-1 py-1 px-3 rounded-2xl bg-[#f0f1ff] text-[#0205d3]"
              onClick={handleRecommendClick}
              disabled={likeLoading}
            >
              <AiOutlineLike className="w-5 h-5" />
              <span>{likeCount}</span>
            </button>

            {/* SAVE / BOOKMARK BUTTON */}
            <button
              onClick={handleSaveToggle}
              disabled={saveLoading}
              className="flex items-center"
            >
              {saved ? (
                <BsBookmarkFill className="w-5 h-5 text-[#0205d3]" />
              ) : (
                <BsBookmark className="w-5 h-5 text-[#0205d3]" />
              )}
            </button>
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

      {/* ✅ STATUS SECTION */}
      <div className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">Business Status</p>
          <span className="text-sm font-semibold text-gray-800">
            {currentStatusLabel}
          </span>
        </div>

        {/* ✅ ADMIN: Dropdown (all statuses) */}
        {isAdmin && (
          <>
            <select
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0519CE] focus:border-[#0519CE]"
              value={normalizedStatus}
              disabled={statusSaving}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {adminStatusOptions.map((opt) => (
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
          </>
        )}

        {/* ✅ Business/Contributor: Action Buttons */}
        {!isAdmin && isBusinessContributorOrUser && (
          <>
            {availableActions.length > 0 ? (
              <div className="mt-2 flex flex-col gap-2">
                {availableActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    disabled={statusSaving}
                    onClick={() => handleStatusChange(action.toStatus)}
                    className="w-full rounded-full px-4 py-2 text-sm font-bold border border-[#0519CE] text-[#0519CE] hover:bg-[#f0f1ff] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {statusSaving ? "Saving..." : action.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                No actions available for current status.
              </p>
            )}

            {statusError && (
              <p className="text-red-500 text-sm mt-2">{statusError}</p>
            )}
          </>
        )}
      </div>

      {/* Delete Business button */}
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
      </div>

      {/* Delete Confirmation Popup */}
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
    </div>
  );
}
