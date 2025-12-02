"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLike } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { BsLink } from "react-icons/bs";
import { BsEnvelope } from "react-icons/bs";
import { BsTelephone } from "react-icons/bs";
import { BsPin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsClock } from "react-icons/bs";

// ---------- Types ----------
type BusinessScheduleItem = {
  id: string;
  day: string;
  opening_time: string;
  closing_time: string;
  opening_time_text: string;
  closing_time_text: string;
  active: boolean;
};

type LinkedTypeItem = {
  id: string;
  business_id: string;
  business_type_id: string;
  active: boolean;
  name?: string;
  business_type_name?: string;
  businessType?: { id: string; name: string };
};

type BusinessProfile = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  active: boolean;
  blocked: boolean;
  business_status: string | null;
  views: number;
  website: string | null;
  email: string | null;
  phone_number: string | null;
  facebook_link: string | null;
  instagram_link: string | null;
  logo_url: string | null;
  marker_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  linkedTypes: LinkedTypeItem[];
  businessSchedule: BusinessScheduleItem[];
};

type BusinessType = {
  id: string;
  name: string;
  display_order: number;
  picture_url: string | null;
  active: boolean;
  slug: string;
};

interface BusinessSidebarProps {
  businessId: string;
}

export default function BusinessSidebar({ businessId }: BusinessSidebarProps) {
  const router = useRouter();

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ---------- Fetch Business Profile ----------
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        if (!token) {
          setError("Login required. No access token found.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/business/business-profile/${businessId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load business profile (${res.status})`);
        }

        const data: BusinessProfile = await res.json();
        setBusiness(data);
      } catch (err: any) {
        console.error("Error fetching business profile:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (businessId && API_BASE_URL) {
      fetchBusinessProfile();
    }
  }, [API_BASE_URL, businessId]);

  // ---------- Fetch Business Types (for category names) ----------
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        if (!token) return;

        const res = await fetch(
          `${API_BASE_URL}/business-type/list?page=1&limit=1000`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to load business types", res.status);
          return;
        }

        const data = await res.json();

        // handle shapes: {items: []} OR {data: []} OR plain array
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data.items)) {
          items = data.items;
        } else if (Array.isArray(data.data)) {
          items = data.data;
        }

        setBusinessTypes(items as BusinessType[]);
      } catch (err) {
        console.error("Error loading business types:", err);
      }
    };

    if (API_BASE_URL) {
      fetchBusinessTypes();
    }
  }, [API_BASE_URL]);

  // ---------- Maps ----------
  const businessTypesMap = useMemo(() => {
    const map: Record<string, string> = {};
    (businessTypes || []).forEach((bt) => {
      if (!bt) return;
      const label = bt.name?.trim();
      if (bt.id && label) {
        map[bt.id] = label;
      }
    });
    return map;
  }, [businessTypes]);

  // ---------- Helpers ----------
  const displayAddress =
    business?.address ||
    [business?.city, business?.state, business?.zipcode, business?.country]
      .filter(Boolean)
      .join(", ") ||
    "Address not provided";

  const formatDay = (day: string) =>
    day ? day.charAt(0).toUpperCase() + day.slice(1).toLowerCase() : "";

  const getCategoryNames = (): string[] => {
    if (!business || !business.linkedTypes) return [];

    // 1️⃣ Try direct names from linkedTypes
    const directNames =
      business.linkedTypes
        .map((lt) => {
          return (
            lt.businessType?.name || // relation style
            lt.name || // simple name
            lt.business_type_name // alternate key
          );
        })
        .filter((n): n is string => Boolean(n)) || [];

    if (directNames.length > 0) {
      return directNames;
    }

    // 2️⃣ Fallback: use IDs + businessTypesMap
    if (!businessTypes || businessTypes.length === 0) return [];

    const fromIds =
      business.linkedTypes
        .map((lt) => {
          const key = lt.business_type_id || lt.id;
          if (!key) return undefined;
          return businessTypesMap[key];
        })
        .filter((n): n is string => Boolean(n)) || [];

    return fromIds;
  };

  // ---------- Loading / Error UI ----------
  if (loading) {
    return (
      <div className="w-3/10 h-[200vh] px-10 py-7 border-r border-solid border-[#e5e5e7]">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-48 w-full bg-gray-200 rounded-3xl mb-6" />
          <div className="h-6 w-56 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="w-3/10 h-[200vh] px-10 py-7 border-r border-solid border-[#e5e5e7]">
        <div className="head flex items-center justify-between mb-6">
          <div className="icon flex items-center text-2xl font-[600]">
            <button className="cursor-pointer" onClick={() => router.back()}>
              <BsArrowLeft className="w-6 h-6 mr-3" />
            </button>
            <h3>Business Details</h3>
          </div>
        </div>
        <p className="text-red-500">
          {error?.includes("401")
            ? "You are not authorized to view this business profile. Please log in again."
            : `Failed to load business profile. (${error})`}
        </p>
      </div>
    );
  }

  const categoryNames = getCategoryNames();

  return (
    <div className="w-3/10 h-[200vh] px-10 py-7 border-r border-solid border-[#e5e5e7]">
      {/* Header */}
      <div className="head flex items-center justify-between">
        <div className="icon flex items-center text-2xl font-[600]">
          <button className="cursor-pointer" onClick={() => router.back()}>
            <BsArrowLeft className="w-6 h-6 mr-3" />
          </button>
          <h3>Business Details</h3>
        </div>
        <button className="button cursor-pointer rounded-4xl border font-[600] border-[#e5e5e7] py-3 px-4 flex items-center">
          <img
            src="/assets/images/share.png"
            alt="Share Icon"
            className="w-5 h-5 mr-3"
          />
          Share
        </button>
      </div>

      {/* Logo */}
      <div className="logo flex items-center justify-center border border-solid rounded-3xl border-[#e5e5e7] mt-6">
        <img
          src={business.logo_url || "/assets/images/businesslogo.png"}
          alt={business.name}
          className="w-80 m-auto object-contain"
        />
      </div>

      {/* Info */}
      <div className="info py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-[600]">
            {business.name || "Untitled Business"}
          </h3>

          <div className="flex">
            <button className="flex items-center gap-1 mr-3 py-1 px-3 rounded-2xl text-[#0205d3] bg-[#f0f1ff] transition-colors cursor-pointer">
              <AiOutlineLike className="w-5 h-5" />
              <span>0</span>
            </button>
            <button className="flex items-center gap-2 text-[#0205d3] transition-colors cursor-pointer">
              <BsBookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories with names */}
        <div className="flex items-start mt-4 border-b pb-6 border-[#e5e5e7]">
          <p className="mr-4 mt-1 text-gray-500">Categories</p>
          {categoryNames.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {categoryNames.map((name, index) => (
                <span
                  key={index}
                  className="bg-[#f8f9fb] py-1 px-3 rounded-2xl text-gray-700"
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
      <div className="details">
        <h3 className="text-xl font-[600] mb-4">Details</h3>

        {business.website && (
          <p className="flex items-center mb-3">
            <BsLink className="w-7 h-7 mr-3 rotate-130 text-[#0205d3]" />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-all w-4/5"
            >
              {business.website}
            </a>
          </p>
        )}

        {business.email && (
          <p className="flex items-center mb-3">
            <BsEnvelope className="w-5 h-5 mr-3 text-[#0205d3]" />
            <a href={`mailto:${business.email}`} className="block break-all w-4/5">
              {business.email}
            </a>
          </p>
        )}

        {business.phone_number && (
          <p className="flex items-center mb-3">
            <BsTelephone className="w-5 h-5 mr-3 text-[#0205d3]" />
            <a
              href={`tel:${business.phone_number}`}
              className="block break-all w-4/5"
            >
              {business.phone_number}
            </a>
          </p>
        )}

        <p className="flex">
          <BsPin className="w-5 h-5 mr-3 text-[#0205d3]" />
          <span className="block w-4/5">{displayAddress}</span>
        </p>
      </div>

      {/* Operating Hours */}
      <div className="social border-b pb-10 border-[#e5e5e7]">
        <h3 className="text-xl font-[600] my-6">Operating Hours</h3>

        {business.businessSchedule && business.businessSchedule.length > 0 ? (
          <div>
            {business.businessSchedule.map((s) =>
              !s.active ? null : (
                <p key={s.id} className="flex items-center mb-3">
                  <BsClock className="w-5 h-5 mr-3 text-[#0205d3]" />
                  <span className="min-w-[90px]">
                    {formatDay(s.day) || "Day"}
                  </span>
                  <span className="ml-4">
                    {s.opening_time_text} to {s.closing_time_text}
                  </span>
                </p>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500">No schedule added yet.</p>
        )}
      </div>

      {/* Social Links */}
      <div className="social border-b pb-10 border-[#e5e5e7]">
        <h3 className="text-xl font-[600] my-6">Social Links</h3>
        <div className="flex">
          {business.facebook_link && (
            <a
              href={business.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <BsFacebook className="w-10 h-10 mr-3 text-[#139df8]" />
            </a>
          )}
          {business.instagram_link && (
            <a
              href={business.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
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
        <h3 className="text-xl font-[600] my-6">About</h3>
        <p className="mb-4">
          {business.description || "No description added yet."}
        </p>
      </div>
    </div>
  );
}
