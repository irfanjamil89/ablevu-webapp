"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";

// ---------- Types ----------

type SavedBusiness = {
  id: string;
  business_id: string;
  user_id: string;
  note?: string;
  created_at: string;
  updated_at: string;
};

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
  city: string;
  state: string;
  zipcode: string;
  country: string;
  businessRecomendations?: any[];
  owner?: { id: string };
  creator?: { id: string };
};

type BusinessType = {
  id: string;
  name: string;
};

// 🔹 record from /accessible-feature/list
type FeatureType = {
  id: string;
  title: string;
  slug: string;
};

type SortOption = "" | "name-asc" | "name-desc" | "created-asc" | "created-desc";
type StatusFilter = "" | "draft" | "pending approved" | "approved" | "claimed";

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

const normalizeStatus = (status: string) =>
  status.toLowerCase().trim().replace(/[\s_-]+/g, " ");

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ---------- Component ----------

export default function Page() {
  const [saved, setSaved] = useState<SavedBusiness[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [schedules, setSchedules] = useState<BusinessSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<SortOption>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusFilterLabel =
    statusFilter === "draft"
      ? "Draft"
      : statusFilter === "pending approved"
      ? "Pending Approved"
      : statusFilter === "approved"
      ? "Approved"
      : statusFilter === "claimed"
      ? "Claimed"
      : "";

  // ---------- token helper ----------

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  // ---------- Fetch business types, features, schedules (same as listing) ----------

  useEffect(() => {
    if (!API_BASE_URL) return;

    fetch(API_BASE_URL + "/business-type/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setBusinessTypes(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching business types:", error);
      });

    fetch(API_BASE_URL + "/accessible-feature/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setFeatures(data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching features:", error);
      });

    fetch(API_BASE_URL + "/business-schedules/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data: ScheduleListResponse) => {
        setSchedules(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching business schedules:", error);
      });
  }, []);

  // ---------- Fetch saved businesses ----------

  const fetchSavedBusinesses = useCallback(async () => {
    if (!API_BASE_URL) {
      setError("API base URL not configured");
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError("You must be logged in to see saved items.");
      setLoading(false);
      return;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Saved list
      const res = await fetch(
        `${API_BASE_URL}/business-save/list?page=1&limit=50`,
        { headers }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to fetch saved businesses");
      }

      const body = await res.json();
      const savedData: SavedBusiness[] = body.data || [];
      setSaved(savedData);

      if (!savedData.length) {
        setBusinesses([]);
        return;
      }

      // 2️⃣ Unique business_ids
      const ids = Array.from(
        new Set(savedData.map((s) => s.business_id).filter(Boolean))
      );

      // 3️⃣ har business ka profile
      const businessPromises = ids.map(async (id) => {
        const bRes = await fetch(
          `${API_BASE_URL}/business/business-profile/${id}`,
          { headers }
        );

        if (!bRes.ok) {
          console.error("Failed to fetch business profile", id);
          return null;
        }

        const data = await bRes.json();
        return data as Business;
      });

      const businessResults = await Promise.all(businessPromises);
      const validBusinesses = businessResults.filter(
        (b): b is Business => b !== null
      );

      setBusinesses(validBusinesses);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedBusinesses();
  }, [fetchSavedBusinesses]);

  // ---------- Maps (ID -> Name) ----------

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
        (f as any).title?.trim() ||
        (f as any).name?.trim() ||
        (f as any).feature_name?.trim() ||
        (f as any).label?.trim() ||
        (f as any).slug?.trim();

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

  // ---------- Status badge (same as listing) ----------

  const getStatusInfo = (b: Business) => {
    const raw = (b.business_status || "").toLowerCase().trim();
    const status = normalizeStatus(raw);

    let label = "";
    let bg = "";
    let text = "";

    if (status === "draft") {
      label = "Draft";
      bg = "#FFF3CD";
      text = "#C28A00";
    } else if (status === "pending approved") {
      label = "Pending Approved";
      bg = "#FFEFD5";
      text = "#B46A00";
    } else if (status === "claimed") {
      label = "Claimed";
      bg = "#dff7ed";
      text = "#03543f";
    } else if (status === "approved") {
      label = "Approved";
      bg = "#e3f1ff";
      text = "#1e429e";
    } else {
      label = "";
      bg = "";
      text = "";
    }

    return { label, bg, text };
  };

  // ---------- Schedule helpers ----------

  function getTodayKey(): string {
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
  }

  function getTodayScheduleLabel(businessId: string): string | null {
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
  }

  // ---------- Name helpers ----------

  const getBusinessTypeName = (type: LinkedType) => {
    if (type.businessType?.name) return type.businessType.name.trim();
    if (type.business_type_name) return type.business_type_name.trim();
    if (type.businessTypeName) return type.businessTypeName.trim();
    if (type.name) return type.name.trim();

    const key = type.business_type_id || type.id;
    if (key && businessTypesMap[key]) {
      return businessTypesMap[key];
    }

    return key || "Unknown business type";
  };

  const getFeatureName = (feature: AccessibilityFeature) => {
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
  };

  // ---------- Sorting + Status filter + local search on saved list ----------

  const sortedBusinesses = useMemo(() => {
    let arr = [...businesses];

    // 🔍 local search on name / city / country
    if (appliedSearch.trim()) {
      const q = appliedSearch.toLowerCase();
      arr = arr.filter((b) =>
        [
          b.name,
          b.city,
          b.country,
          b.address,
        ]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(q))
      );
    }

    if (statusFilter) {
      const normalizedFilter = normalizeStatus(statusFilter);

      arr = arr.filter((b) => {
        const raw = (b.business_status || "").toLowerCase().trim();
        const status = normalizeStatus(raw);

        switch (normalizedFilter) {
          case "draft":
            return status === "draft";

          case "approved":
            return (
              status === "approved" ||
              (!status && b.active === true && !b.blocked)
            );

          case "pending approved":
            return (
              status === "pending" ||
              status === "pending approval" ||
              status === "pending approved"
            );

          case "claimed":
            return status === "claimed";

          default:
            return true;
        }
      });
    }

    switch (sortOption) {
      case "name-asc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "created-asc":
        arr.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;
      case "created-desc":
        arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      default:
        break;
    }

    return arr;
  }, [businesses, sortOption, statusFilter, appliedSearch]);

  // ---------- Pagination ----------

  const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentbusiness = sortedBusinesses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
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

  // ---------- Loading state ----------

  if (loading) {
    return (
      <div className="pt-5 w-full bg-white border-r border-gray-200 min-h-screen">

        <div className="w-full flex justify-center items-center h-[400px]">
          <img
            src="/assets/images/favicon.png"
            className="w-15 h-15 animate-spin"
            alt="Favicon"
          />
        </div>
      </div>
    );
  }

  // ---------- UI (SAME as Business Listing) ----------

  return (
    <div className="pt-5 w-full bg-white border-r border-gray-200 min-h-screen">
      {/* Main content – COPY of business listing UI */}
      <div className="w-full bg-white">
        <div className="w-full bg-white px-6 py-5">
          {/* Header */}
          <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {`Saved Business Profiles (${sortedBusinesses.length})`}
            </h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-y-4 items-center gap-3">
              {/* Clear All filters */}
              <div className="relative inline-block text-left">
                <div
                  className="text-md text-gray-500 cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    setAppliedSearch("");
                    setSortOption("");
                    setStatusFilter("");
                    setCurrentPage(1);
                  }}
                >
                  Clear All
                </div>
              </div>

              {/* Sort By */}
              <div className="relative inline-block text-left w-[180px]">
                <input
                  type="checkbox"
                  id="sort-by-toggle"
                  className="hidden peer"
                />

                <label
                  htmlFor="sort-by-toggle"
                  className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <span className="flex items-center">
                    Sort By
                    {sortOption && (
                      <span className="ml-1 text-xs text-gray-400">
                        (
                        {sortOption === "name-asc"
                          ? "Name A–Z"
                          : sortOption === "name-desc"
                          ? "Name Z–A"
                          : sortOption === "created-asc"
                          ? "Oldest First"
                          : "Newest First"}
                        )
                      </span>
                    )}
                  </span>
                  <svg
                    className="w-2.5 h-2.5 ms-3 transition-transform duration-200 peer-checked:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </label>

                <label
                  htmlFor="sort-by-toggle"
                  className="hidden peer-checked:block fixed inset-0 z-10"
                ></label>

                <div className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[300px]">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        type="button"
                        onClick={() => setSortOption("name-asc")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Name (A–Z)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSortOption("name-desc")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Name (Z–A)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSortOption("created-asc")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Created Date (Low–High)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSortOption("created-desc")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Created Date (High–Low)
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Business Status */}
              <div className="relative inline-block text-left w-[290px]">
                <input
                  type="checkbox"
                  id="business-status-toggle"
                  className="hidden peer"
                />

                <label
                  htmlFor="business-status-toggle"
                  className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-3 rounded-md hover:border-[#0519CE] cursor-pointer w-auto lg:w-auto transition-all duration-200"
                >
                  <span className="flex items- center">
                    Business Status
                    {statusFilterLabel && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({statusFilterLabel})
                      </span>
                    )}
                  </span>

                  <svg
                    className="w-2.5 h-2.5 ms-3 transition-transform duration-200 peer-checked:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </label>

                <label
                  htmlFor="business-status-toggle"
                  className="hidden peer-checked:block fixed inset-0 z-10"
                ></label>

                <div className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[200px]">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        type="button"
                        onClick={() => setStatusFilter("draft")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Draft
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setStatusFilter("pending approved")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Pending Approved
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setStatusFilter("approved")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Approved
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setStatusFilter("claimed")}
                        className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                      >
                        Claimed
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-3 w-auto lg:w-[200px] md:w-[150px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
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
                  placeholder="Search by Name, City, Country"
                  className="w-full border-none focus:outline-none focus:ring-0 font-medium text-sm text-gray-700 placeholder-gray-500 ml-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setAppliedSearch(searchTerm);
                      setCurrentPage(1);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Business cards (SAME UI) */}
          <section>
            <div>
              {currentbusiness.map((business) => {
                const statusInfo = getStatusInfo(business);
                const allFeatures = business.accessibilityFeatures || [];
                const visibleFeatures = allFeatures.slice(0, 2);
                const extraFeaturesCount =
                  allFeatures.length - visibleFeatures.length;

                return (
                  <Link
                    key={business.id}
                    href={`/business-profile/${business.id}`}
                    className="border border-gray-200 rounded-xl flex flex-col md:flex-row font-['Helvetica'] bg-white mb-4"
                  >
                    {/* Left image */}
                    <div
                      className="relative flex items-center justify-center w-full sm:h-[180px] md:h-auto md:w-[220px] shadow-sm bg-[#E5E5E5] bg-contain bg-center bg-no-repeat opacity-95"
                      style={{
                        backgroundImage: `url(${business?.logo_url})`,
                      }}
                    >
                      {statusInfo.label && (
                        <span
                          className="absolute top-3 md:right-2 right-14 text-sm font-semibold px-2 py-1 rounded-md shadow-sm"
                          style={{
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.text,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      )}
                    </div>

                    {/* Right content */}
                    <div className="flex-1 justify-between bg-white py-3 ps-5 space-y-5">
                      <div className="flex flex-wrap space-y-4 md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-2xl">
                          {business.name}
                        </h3>
                        <div className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                          {/* Saved pill – same UI */}
                          <label className="inline-flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" className="peer hidden" />
                            <div className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
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
                              <span>Saved</span>
                            </div>
                          </label>

                          {/* Views */}
                          <button className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {business.views} Views
                          </button>

                          {/* Recommendations */}
                          <button className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z"
                              />
                            </svg>
                            {business.businessRecomendations?.length ?? 0}{" "}
                            Recommendations
                          </button>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="text-md">
                        <div className="flex">
                          <span className="font-medium text-gray-500 pe-2">
                            Categories
                          </span>
                          <ul className="flex flex-wrap md:flex-nowrap space-x-2">
                            {business.linkedTypes?.map((type) => (
                              <li
                                key={type.id}
                                className="bg-[#F7F7F7] rounded-full px-2"
                              >
                                {getBusinessTypeName(type)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Accessible Features */}
                      <div className="text-md text-gray-500 mt-2">
                        <div className="flex flex-wrap md:gap-0 gap-2">
                          <span className="font-medium text-gray-500 pe-2">
                            Accessible Features
                          </span>
                          <ul className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                            {visibleFeatures.map((feature) => (
                              <li
                                key={feature.id}
                                className="bg-[#F7F7F7] text-gray-700 rounded-full px-2"
                              >
                                {getFeatureName(feature)}
                              </li>
                            ))}
                            {extraFeaturesCount > 0 && (
                              <li className="bg-[#F7F7F7] text-gray-700 rounded-full px-3">
                                +{extraFeaturesCount}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Other info */}
                      <div className="flex items-center space-x-2 text-md text-gray-500 mt-2">
                        <img
                          src="/assets/images/clock.webp"
                          className="w-4 h-4"
                        />
                        <span className="text-md text-gray-700">
                          {getTodayScheduleLabel(business.id) ||
                            "Operating hours not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-md text-gray-500 mt-2">
                        <img
                          src="/assets/images/location.png"
                          className="w-4 h-4"
                        />
                        <span className="text-md text-gray-700">
                          {business.address}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ===== PAGINATION CONTROLS ===== */}
            {sortedBusinesses.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                {/* Left side: Entry counter */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, sortedBusinesses.length)} of{" "}
                  {sortedBusinesses.length} entries
                </div>

                {/* Right side: Pagination buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      <React.Fragment key={idx}>
                        {page === "..." ? (
                          <span className="px-3 py-1 text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            onClick={() => goToPage(page as number)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              currentPage === page
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

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* No data message */}
            {!error && sortedBusinesses.length === 0 && (
              <p className="text-gray-500 text-sm mt-4">
                You haven&apos;t saved any businesses yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
