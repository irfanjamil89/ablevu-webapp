"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";

// ---------- Types ----------

type LinkedType = {
  id: string;
  business_type_id: string;
  name?: string;
  business_type_name?: string;
  businessTypeName?: string;
  businessType?: { id: string; name: string };
};

type AccessibilityFeature = {
  id: string;
  business_id: string;
  accessible_feature_id: string;
  title?: string;
  name?: string;
  feature_name?: string;
  label?: string;
  featureType?: { id: string; name: string };
};

type Business = {
  id: string;
  name: string;
  address: string;
  logo_url?: string;
  linkedTypes: LinkedType[];
  accessibilityFeatures: AccessibilityFeature[];
  active: boolean;
  blocked: boolean;
  business_status?: string | null;
  views: number;
  created_at: Date | string;
  modified_at: Date | string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  businessRecomendations?: any[];
};

type BusinessType = {
  id: string;
  name: string;
};

type FeatureType = {
  id: string;
  title?: string;
  name?: string;
  feature_name?: string;
  label?: string;
  slug?: string;
};

type SortOption =
  | ""
  | "name-asc"
  | "name-desc"
  | "created-asc"
  | "created-desc";

type BusinessSchedule = {
  id: string;
  business: {
    id: string;
    name: string;
  };
  day: string;
  opening_time: string;
  closing_time: string;
  opening_time_text: string;
  closing_time_text: string;
  active: boolean;
  created_at: string;
  modified_at: string;
};

type ScheduleListResponse = {
  data: BusinessSchedule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type AccessibleCity = {
  id: string;
  city_name: string;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  display_order: number | null;
  picture_url: string | null;
  slug: string;
  businessCount: number;
};

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_role?: string;
  paid_contributor?: boolean;
};

type Partner = {
  id: string;
  name: string;
  description: string;
  tags: string;
  image_url: string;
  web_url: string;
  active: boolean;
};

// ---------- Helpers ----------

const formatFullAddress = (b: Business) => {
  const parts: string[] = [];

  if (b.address) parts.push(b.address);
  if (b.city) parts.push(b.city);

  let stateZip = "";
  if (b.state) stateZip += b.state;
  if (b.zipcode) stateZip += (stateZip ? " " : "") + b.zipcode;
  if (stateZip) parts.push(stateZip);

  if (b.country) parts.push(b.country);

  return parts.join(", ");
};
const normalizeStatus = (status?: string | null) =>
  (status || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, " ");


type StatusKey =
  | "draft"
  | "pending review"
  | "pending approval"
  | "approved"
  | "pending claim"
  | "claimed";

const STATUS_BADGE: Record<StatusKey, { label: string; bg: string; text: string }> = {
  draft: { label: "Draft", bg: "#FFF3CD", text: "#C28A00" },
  "pending review": {      
    label: "Pending Review",
    bg: "#F3E8FF",
    text: "#6B21A8",
  },
  "pending approval": {
    label: "Pending Approval",
    bg: "#FFEFD5",
    text: "#B46A00",
  },
  approved: { label: "Approved", bg: "#e3f1ff", text: "#1e429e" },
  "pending claim": {
    label: "Pending Claim",
    bg: "#EEF2FF",
    text: "#3730A3",
  },
  claimed: { label: "Claimed", bg: "#dff7ed", text: "#03543f" },
};


const toCanonicalStatus = (raw: string, b?: Business): StatusKey | null => {
  const s = normalizeStatus(raw);

  if (s === "pending review" || s === "review pending") return "pending review";
  if (s === "pending" || s === "pending approved") return "pending approval";
  if (s === "pending claim" || s === "pending claim")
    return "pending claim";

  if (s === "draft") return "draft";
  if (s === "pending approval") return "pending approval";
  if (s === "approved") return "approved";
  if (s === "claimed") return "claimed";

  if ((!s || s === "active") && b?.active === true && !b?.blocked) {
    return "approved";
  }

  return null;
};

const getStatusInfo = (b: Business) => {
  const canonical = toCanonicalStatus(b.business_status || "", b);

  if (!canonical) return { label: "", bg: "", text: "" };

  return STATUS_BADGE[canonical];
};

const getCacheBustedUrl = (url: string | undefined, timestamp?: Date | string) => {
  if (!url) return '';
  const t = timestamp ? new Date(timestamp).getTime() : Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${t}`;
};

export default function Page() {
  // State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [schedules, setSchedules] = useState<BusinessSchedule[]>([]);
  const [accessibleCityTotal, setAccessibleCityTotal] = useState(0);
  const [partnerTotal, setPartnerTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For debouncing
  const [sortOption, setSortOption] = useState<SortOption>("created-desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0); // Total from server
  const itemsPerPage = 6;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // ---------- Debounced Search ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ---------- Load Reference Data (Once) ----------
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        // Business types
        const btRes = await fetch(
          `${base}business-type/list?page=1&limit=1000`,
          { headers }
        );
        const btJson = await btRes.json();
        setBusinessTypes(btJson.data || []);

        // Accessible features
        const fRes = await fetch(
          `${base}accessible-feature/list?page=1&limit=1000`
        );
        const fJson = await fRes.json();
        setFeatures(fJson.items || []);

        // Accessible cities
        const acRes = await fetch(
          `${base}accessible-city/list?page=1&limit=1000`,
          { headers }
        );
        const acJson = await acRes.json();
        setAccessibleCityTotal(acJson.total ?? (acJson.items?.length || 0));

        // Partners
        const pRes = await fetch(`${base}partner/list?page=1&limit=1000`, {
          headers,
        });
        const pJson = await pRes.json();
        const partnersArr: Partner[] = pJson.items || [];
        const totalPartners = pJson.total ?? partnersArr.length;
        setPartnerTotal(totalPartners);

        // Users
        const uRes = await fetch(`${base}users`, { headers });
        if (!uRes.ok) {
          console.error("Users fetch failed:", uRes.status, uRes.statusText);
        } else {
          const uJson = await uRes.json();
          let usersArr: User[] = [];

          if (Array.isArray(uJson)) {
            usersArr = uJson;
          } else if (Array.isArray(uJson.data)) {
            usersArr = uJson.data;
          } else if (Array.isArray(uJson.items)) {
            usersArr = uJson.items;
          }

          setUsers(usersArr);
        }

        // Business schedules
        const sRes = await fetch(
          `${base}business-schedules/list?page=1&limit=1000`,
          { headers }
        );
        const sJson: ScheduleListResponse = await sRes.json();
        setSchedules(sJson.data || []);
      } catch (e) {
        console.error("Error loading reference data:", e);
      }
    };

    loadReferenceData();
  }, []); // Only run once

  // ---------- Load Businesses (Server-Side Pagination) ----------
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);

        // Build query params for server-side filtering and sorting
        let url = `${base}business/list?page=${currentPage}&limit=${itemsPerPage}`;

        // Add search if present
        if (searchTerm.trim()) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        // Add sort if present
        if (sortOption) {
          url += `&sort=${sortOption}`;
        }

        const bRes = await fetch(url, { headers });
        const bJson = await bRes.json();

        setBusinesses(bJson.data || []);
        setTotalBusinesses(bJson.total || 0);
      } catch (e) {
        console.error("Error loading businesses:", e);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, [currentPage, searchTerm, sortOption]); // Reload when these change

  // ---------- Memoized Values ----------

  const { paidContributorsCount, volunteerContributorsCount } = useMemo(() => {
    const paid = users.filter((u) => u.paid_contributor === true).length;
    const volunteers = users.filter(
      (u) => (u.user_role || "").toLowerCase() === "contributor"
    ).length;

    return {
      paidContributorsCount: paid,
      volunteerContributorsCount: volunteers,
    };
  }, [users]);

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

  const featuresMap = useMemo(() => {
    const map: Record<string, string> = {};
    (features || []).forEach((f) => {
      if (!f) return;

      const label =
        f.title?.trim() ||
        f.name?.trim() ||
        f.feature_name?.trim() ||
        f.label?.trim() ||
        f.slug?.trim();

      if (f.id && label) {
        map[f.id] = label;
      }
    });
    return map;
  }, [features]);

  const schedulesByBusinessId = useMemo(() => {
    const map: Record<string, BusinessSchedule[]> = {};

    (schedules || []).forEach((sch) => {
      const bId = sch.business?.id;
      if (!bId) return;
      if (!map[bId]) map[bId] = [];
      map[bId].push(sch);
    });

    Object.values(map).forEach((list) => {
      list.sort((a, b) => a.day.localeCompare(b.day));
    });

    return map;
  }, [schedules]);

  // ---------- Helper Functions ----------

  const getBusinessTypeName = useCallback(
    (type: LinkedType) => {
      if (type.businessType?.name) return type.businessType.name.trim();
      if (type.business_type_name) return type.business_type_name.trim();
      if (type.businessTypeName) return type.businessTypeName.trim();
      if (type.name) return type.name.trim();

      const key = type.business_type_id || type.id;
      if (key && businessTypesMap[key]) {
        return businessTypesMap[key];
      }
      return key || "Unknown";
    },
    [businessTypesMap]
  );

  const getFeatureName = useCallback(
    (feature: AccessibilityFeature) => {
      if (feature.title) return feature.title.trim();
      if (feature.name) return feature.name.trim();
      if (feature.feature_name) return feature.feature_name.trim();
      if (feature.label) return feature.label.trim();
      if (feature.featureType?.name) return feature.featureType.name.trim();

      const key = feature.accessible_feature_id || feature.id;
      if (key && featuresMap[key]) {
        return featuresMap[key];
      }
      return key || "Unknown feature";
    },
    [featuresMap]
  );

  const getTodayKey = (): string => {
    const todayIndex = new Date().getDay();
    const mapByIndex: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return mapByIndex[todayIndex] || "monday";
  };

  const getTodayScheduleLabel = useCallback(
    (businessId: string): string | null => {
      const list = schedulesByBusinessId[businessId];
      if (!list || list.length === 0) return null;

      const todayKey = getTodayKey();

      const todaySchedule = list.find(
        (sch) => sch.day.toLowerCase() === todayKey && sch.active
      );

      if (!todaySchedule) {
        return "Closed today";
      }

      const openText =
        todaySchedule.opening_time_text ||
        new Date(todaySchedule.opening_time).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

      const closeText =
        todaySchedule.closing_time_text ||
        new Date(todaySchedule.closing_time).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

      return `Today: ${openText} – ${closeText}`;
    },
    [schedulesByBusinessId]
  );

  // ---------- Pagination Logic ----------

  const totalPages = Math.max(1, Math.ceil(totalBusinesses / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (safePage < totalPages) setCurrentPage(safePage + 1);
  };

  const goToPreviousPage = () => {
    if (safePage > 1) setCurrentPage(safePage - 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };
  // ---------- Loading State ----------
  if (loading && businesses.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-[400px]">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Loading"
        />
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="w-full overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">
          <div className="w-full min-h-screen bg-white px-4 sm:px-6 py-4 sm:py-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 pb-6 sm:pb-10 pt-4">
              <a className="block w-full p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {accessibleCityTotal}
                </h5>
                <p className="font-normal text-gray-700 text-sm sm:text-base">
                  Accessible Cities
                </p>
              </a>

              <a className="block w-full p-3 px-4 bg-[#fcf4e0] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {paidContributorsCount}
                </h5>
                <p className="font-normal text-gray-700 text-sm sm:text-base">
                  Paid Contributors
                </p>
              </a>

              <a className="block w-full p-3 px-4 bg-[#ffe2df] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {volunteerContributorsCount}
                </h5>
                <p className="font-normal text-gray-700 text-sm sm:text-base">
                  Volunteer Contributors
                </p>
              </a>

              <a className="block w-full p-3 px-4 bg-[#daf1e6] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {totalBusinesses}
                </h5>
                <p className="font-normal text-gray-700 text-sm sm:text-base">
                  Business Profiles
                </p>
              </a>

              <a className="block w-full p-3 px-4 bg-[#fde8e2] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {partnerTotal}
                </h5>
                <p className="font-normal text-gray-700 text-sm sm:text-base">
                  Total Partners
                </p>
              </a>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Recently Created Businesses ({totalBusinesses})
              </h1>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Sort dropdown */}
                <div className="border border-gray-300 rounded-md px-3 py-1.5 bg-white">
                  <select
                    className="w-full sm:w-auto bg-transparent text-sm text-gray-700 outline-none"
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as SortOption);
                      setCurrentPage(1); // Reset to first page
                    }}
                  >
                    <option value="created-desc">Newest First</option>
                    <option value="created-asc">Oldest First</option>
                    <option value="name-asc">Name (A–Z)</option>
                    <option value="name-desc">Name (Z–A)</option>
                  </select>
                </div>

                {/* Search */}
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white sm:w-72">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Business Name, City, Category"
                    className="w-full border-none text-sm text-gray-700 placeholder-gray-400 ml-2 focus:border-0 active:border-0 focus-visible:outline-0"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Business cards */}
            <section className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <img
                    src="/assets/images/favicon.png"
                    className="w-10 h-10 animate-spin"
                    alt="Loading"
                  />
                </div>
              ) : (
                <section className="space-y-4">
                  {businesses.map((business) => {
                    const statusInfo = getStatusInfo(business);

                    return (
                      <Link
                        key={business.id}
                        href={`/business-profile/${business.id}`}
                        className="border border-gray-200 rounded-xl flex flex-col md:flex-row font-['Helvetica'] bg-white hover:shadow-md transition-shadow"
                      >
                        {/* Left image */}
                        <div
                          className="relative flex items-center justify-center w-full h-48 md:h-auto md:w-48 lg:w-56 flex-shrink-0 shadow-sm bg-[#E5E5E5] bg-cover bg-center bg-no-repeat opacity-95"
                          style={{
                            backgroundImage: `url(${getCacheBustedUrl(
                              business?.logo_url,
                              business.modified_at || business.created_at
                            )})`,
                          }}
                        >
                          {statusInfo.label && (
                            <span
                              className="absolute top-3 right-3 text-xs sm:text-sm font-semibold px-2 py-1 rounded-md shadow-sm"
                              style={{
                                backgroundColor: statusInfo.bg,
                                color: statusInfo.text,
                              }}
                            >
                              {statusInfo?.label === "approved"
                                ? "Submitted"
                                : statusInfo?.label}

                            </span>
                          )}
                        </div>

                        {/* Right content */}
                        <div className="flex-1 justify-between bg-white p-4 sm:py-3 sm:ps-5 space-y-3 sm:space-y-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-2 sm:mb-4">
                            <h3 className="font-semibold text-gray-800 text-lg sm:text-xl lg:text-2xl">
                              {business.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {/* Saved */}
                              <label className="inline-flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" className="peer hidden" />
                                <div className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-2 sm:px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="black"
                                    fill="white"
                                    className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
                                    />
                                  </svg>
                                  <span className="hidden sm:inline">0 Saved</span>
                                  <span className="sm:hidden">0</span>
                                </div>
                              </label>

                              {/* Views */}
                              <button className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-2 sm:px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="white"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="black"
                                  className="w-4 h-4 flex-shrink-0"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span className="whitespace-nowrap">
                                  {business.views} Views
                                </span>
                              </button>

                              {/* Recommendations */}
                              <button className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-2 sm:px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="white"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="black"
                                  className="w-4 h-4 flex-shrink-0"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z"
                                  />
                                </svg>
                                <span className="whitespace-nowrap">
                                  {business.businessRecomendations?.length ?? 0}{" "}
                                  <span className="hidden sm:inline">
                                    Recommendations
                                  </span>
                                  <span className="sm:hidden">Recs</span>
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Categories */}
                          <div className="text-sm sm:text-md">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-gray-500">
                                Categories
                              </span>
                              <ul className="flex flex-wrap gap-2">
                                {business.linkedTypes.map((type) => (
                                  <li
                                    key={type.id}
                                    className="bg-[#F7F7F7] text-gray-700 rounded-full px-2 py-0.5 text-xs sm:text-sm"
                                  >
                                    {getBusinessTypeName(type)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Accessible Features */}
                          <div className="text-sm sm:text-md text-gray-500">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-gray-500">
                                Accessible Features
                              </span>
                              <ul className="flex flex-wrap gap-2">
                                {(() => {
                                  const list =
                                    business.accessibilityFeatures || [];
                                  const count = list.length;

                                  if (count === 0)
                                    return (
                                      <li className="text-xs sm:text-sm">
                                        No features
                                      </li>
                                    );

                                  const firstTwo = list.slice(0, 2);

                                  return (
                                    <>
                                      {firstTwo.map((feature) => (
                                        <li
                                          key={feature.id}
                                          className="bg-[#F7F7F7] text-gray-700 rounded-full px-2 py-0.5 text-xs sm:text-sm"
                                        >
                                          {getFeatureName(feature)}
                                        </li>
                                      ))}

                                      {count > 2 && (
                                        <li className="bg-[#F7F7F7] text-gray-700 rounded-full px-2 py-0.5 text-xs sm:text-sm">
                                          +{count - 2}
                                        </li>
                                      )}
                                    </>
                                  );
                                })()}
                              </ul>
                            </div>
                          </div>

                          {/* Schedule */}
                          <div className="flex items-start sm:items-center gap-2 text-sm sm:text-md text-gray-500">
                            <img
                              src="/assets/images/clock.webp"
                              className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0"
                              alt="Clock"
                            />
                            <span className="text-sm sm:text-md text-gray-700">
                              {getTodayScheduleLabel(business.id) ||
                                "Operating hours not specified"}
                            </span>
                          </div>

                          {/* Address */}
                          <div className="flex items-start sm:items-center gap-2 text-sm sm:text-md text-gray-500">
                            <img
                              src="/assets/images/location.png"
                              className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0"
                              alt="Location"
                            />
                            <span className="text-sm sm:text-md text-gray-700 break-words">
                              {business.address}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {businesses.length === 0 && !loading && (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No businesses found for this search.
                    </p>
                  )}

                  {/* Pagination */}
                  {!loading && businesses.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white mt-6">
                      <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                        Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(safePage * itemsPerPage, totalBusinesses)} of{" "}
                        {totalBusinesses} entries
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${currentPage === 1
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            }`}
                        >
                          <span className="hidden sm:inline">Previous</span>
                          <span className="sm:hidden">Prev</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-1">
                          {getPageNumbers().map((page, idx) => (
                            <React.Fragment key={idx}>
                              {page === "..." ? (
                                <span className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm">
                                  ...
                                </span>
                              ) : (
                                <button
                                  onClick={() => goToPage(page as number)}
                                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${safePage === page
                                      ? "bg-[#0519CE] text-white"
                                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                  {page}
                                </button>
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <div className="sm:hidden text-xs text-gray-600 px-2">
                          Page {safePage} of {totalPages}
                        </div>

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${currentPage === totalPages
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}