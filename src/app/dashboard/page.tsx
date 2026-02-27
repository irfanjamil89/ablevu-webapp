"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  // last_login can be added if API provides it
  last_login?: string | null;
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

type Subscription = {
  id: string;
  packageName: string;
  start_date: string;
  end_date: string;
  status: string; // "active" | "expired" | etc.
  business: { id: string; name: string };
} | null;

// Column sort config
type TableSortKey =
  | "name"
  | "business_status"
  | "subscription_status"
  | "end_date"
  | "payment_status"
  | "active_profiles"
  | "created_at"
  | "modified_at"
  | "last_login";

type TableSortDir = "asc" | "desc";

// ---------- Helpers ----------

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
  "pending review": { label: "Pending Review", bg: "#F3E8FF", text: "#6B21A8" },
  "pending approval": { label: "Pending Approval", bg: "#FFEFD5", text: "#B46A00" },
  approved: { label: "Approved", bg: "#e3f1ff", text: "#1e429e" },
  "pending claim": { label: "Pending Claim", bg: "#EEF2FF", text: "#3730A3" },
  claimed: { label: "Claimed", bg: "#dff7ed", text: "#03543f" },
};

const toCanonicalStatus = (raw: string, b?: Business): StatusKey | null => {
  const s = normalizeStatus(raw);
  if (s === "pending review" || s === "review pending") return "pending review";
  if (s === "pending" || s === "pending approved") return "pending approval";
  if (s === "pending claim") return "pending claim";
  if (s === "draft") return "draft";
  if (s === "pending approval") return "pending approval";
  if (s === "approved") return "approved";
  if (s === "claimed") return "claimed";
  if ((!s || s === "active") && b?.active === true && !b?.blocked) return "approved";
  return null;
};

const getStatusInfo = (b: Business) => {
  const canonical = toCanonicalStatus(b.business_status || "", b);
  if (!canonical) return { label: "—", bg: "#F3F4F6", text: "#9CA3AF" };
  return STATUS_BADGE[canonical];
};

const formatDate = (d?: string | Date | null) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const SUBSCRIPTION_STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "#dff7ed", text: "#03543f" },
  expired: { label: "Expired", bg: "#FEE2E2", text: "#991B1B" },
  cancelled: { label: "Cancelled", bg: "#F3F4F6", text: "#6B7280" },
  pending: { label: "Pending", bg: "#FFF3CD", text: "#C28A00" },
  none: { label: "None", bg: "#F3F4F6", text: "#9CA3AF" },
};

const getSubStatusBadge = (status?: string | null) => {
  if (!status) return SUBSCRIPTION_STATUS_BADGE["none"];
  const key = status.toLowerCase().trim();
  return SUBSCRIPTION_STATUS_BADGE[key] || { label: status, bg: "#F3F4F6", text: "#6B7280" };
};

// Sort icon component
const SortIcon = ({
  column,
  sortKey,
  sortDir,
}: {
  column: TableSortKey;
  sortKey: TableSortKey | null;
  sortDir: TableSortDir;
}) => {
  const isActive = sortKey === column;
  return (
    <span className="inline-flex flex-col ml-1.5 opacity-60" style={{ gap: 1 }}>
      <svg
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="none"
        style={{ opacity: isActive && sortDir === "asc" ? 1 : 0.35 }}
      >
        <path d="M3.5 0L7 5H0L3.5 0Z" fill={isActive && sortDir === "asc" ? "#0519CE" : "#6B7280"} />
      </svg>
      <svg
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="none"
        style={{ opacity: isActive && sortDir === "desc" ? 1 : 0.35 }}
      >
        <path d="M3.5 5L0 0H7L3.5 5Z" fill={isActive && sortDir === "desc" ? "#0519CE" : "#6B7280"} />
      </svg>
    </span>
  );
};

export default function Page() {
  // State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [accessibleCityTotal, setAccessibleCityTotal] = useState(0);
  const [partnerTotal, setPartnerTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("created-desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const itemsPerPage = 12;

  // Subscription cache: businessId -> Subscription
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>({});
  const subscriptionFetchedRef = useRef<Set<string>>(new Set());

  // Table-level sort (client-side for current page data)
  const [tableSortKey, setTableSortKey] = useState<TableSortKey | null>(null);
  const [tableSortDir, setTableSortDir] = useState<TableSortDir>("asc");

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // ---------- Debounced Search ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ---------- Load Reference Data (Once) ----------
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const btRes = await fetch(`${base}business-type/list?page=1&limit=1000`, { headers });
        const btJson = await btRes.json();
        setBusinessTypes(btJson.data || []);

        const fRes = await fetch(`${base}accessible-feature/list?page=1&limit=1000`);
        const fJson = await fRes.json();
        setFeatures(fJson.items || []);

        const acRes = await fetch(`${base}accessible-city/list?page=1&limit=1000`, { headers });
        const acJson = await acRes.json();
        setAccessibleCityTotal(acJson.total ?? (acJson.items?.length || 0));

        const pRes = await fetch(`${base}partner/list?page=1&limit=1000`, { headers });
        const pJson = await pRes.json();
        const partnersArr: Partner[] = pJson.items || [];
        setPartnerTotal(pJson.total ?? partnersArr.length);

        const uRes = await fetch(`${base}users`, { headers });
        if (uRes.ok) {
          const uJson = await uRes.json();
          let usersArr: User[] = [];
          if (Array.isArray(uJson)) usersArr = uJson;
          else if (Array.isArray(uJson.data)) usersArr = uJson.data;
          else if (Array.isArray(uJson.items)) usersArr = uJson.items;
          setUsers(usersArr);
        }
      } catch (e) {
        console.error("Error loading reference data:", e);
      }
    };
    loadReferenceData();
  }, []);

  // ---------- Load Businesses ----------
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        let url = `${base}business/list?page=${currentPage}&limit=${itemsPerPage}`;
        if (searchTerm.trim()) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (sortOption) url += `&sort=${sortOption}`;

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
  }, [currentPage, searchTerm, sortOption]);

  // ---------- Fetch Subscriptions for current page businesses ----------
  useEffect(() => {
    if (businesses.length === 0) return;

    const fetchSubscriptions = async () => {
      const toFetch = businesses.filter(
        (b) => !subscriptionFetchedRef.current.has(b.id)
      );
      if (toFetch.length === 0) return;

      // Mark as fetching
      toFetch.forEach((b) => subscriptionFetchedRef.current.add(b.id));

      const results = await Promise.allSettled(
        toFetch.map(async (b) => {
          const res = await fetch(
            `${base}subscriptions/subscription-profile/${b.id}`,
            { headers }
          );
          if (!res.ok) return { id: b.id, sub: null };
          const json = await res.json();
          return { id: b.id, sub: json?.id ? json : null };
        })
      );

      const newSubs: Record<string, Subscription> = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") {
          newSubs[r.value.id] = r.value.sub;
        }
      });

      setSubscriptions((prev) => ({ ...prev, ...newSubs }));
    };

    fetchSubscriptions();
  }, [businesses]);

  // ---------- Memoized Values ----------
  const { paidContributorsCount, volunteerContributorsCount } = useMemo(() => {
    const paid = users.filter((u) => u.paid_contributor === true).length;
    const volunteers = users.filter(
      (u) => (u.user_role || "").toLowerCase() === "contributor"
    ).length;
    return { paidContributorsCount: paid, volunteerContributorsCount: volunteers };
  }, [users]);

  // ---------- Table Sort Handler ----------
  const handleTableSort = (key: TableSortKey) => {
    if (tableSortKey === key) {
      setTableSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setTableSortKey(key);
      setTableSortDir("asc");
    }
  };

  // ---------- Sorted businesses (client-side, current page) ----------
  const sortedBusinesses = useMemo(() => {
    if (!tableSortKey) return businesses;

    return [...businesses].sort((a, b) => {
      const subA = subscriptions[a.id];
      const subB = subscriptions[b.id];
      let valA: any = "";
      let valB: any = "";

      switch (tableSortKey) {
        case "name":
          valA = a.name?.toLowerCase() || "";
          valB = b.name?.toLowerCase() || "";
          break;
        case "business_status":
          valA = a.business_status || "";
          valB = b.business_status || "";
          break;
        case "subscription_status":
          valA = subA?.status || "";
          valB = subB?.status || "";
          break;
        case "end_date":
          valA = subA?.end_date ? new Date(subA.end_date).getTime() : 0;
          valB = subB?.end_date ? new Date(subB.end_date).getTime() : 0;
          break;
        case "payment_status":
          valA = subA?.status || "";
          valB = subB?.status || "";
          break;
        case "active_profiles":
          valA = a.active ? 1 : 0;
          valB = b.active ? 1 : 0;
          break;
        case "created_at":
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
          break;
        case "modified_at":
          valA = new Date(a.modified_at).getTime();
          valB = new Date(b.modified_at).getTime();
          break;
        case "last_login":
          valA = a.last_login ? new Date(a.last_login).getTime() : 0;
          valB = b.last_login ? new Date(b.last_login).getTime() : 0;
          break;
      }

      if (valA < valB) return tableSortDir === "asc" ? -1 : 1;
      if (valA > valB) return tableSortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [businesses, tableSortKey, tableSortDir, subscriptions]);

  // ---------- Pagination ----------
  const totalPages = Math.max(1, Math.ceil(totalBusinesses / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
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

  // ---------- Table columns config ----------
  const columns: { key: TableSortKey; label: string; width?: string }[] = [
    { key: "name", label: "Business Name", width: "min-w-[180px]" },
    { key: "business_status", label: "Business Status", width: "min-w-[140px]" },
    { key: "subscription_status", label: "Subscription", width: "min-w-[130px]" },
    { key: "end_date", label: "Renewal / Expiry", width: "min-w-[130px]" },
    { key: "payment_status", label: "Payment Status", width: "min-w-[130px]" },
    { key: "active_profiles", label: "Active Profile", width: "min-w-[110px]" },
    { key: "created_at", label: "Created", width: "min-w-[110px]" },
    { key: "modified_at", label: "Last Updated", width: "min-w-[110px]" },
    { key: "last_login", label: "Last Login", width: "min-w-[110px]" },
  ];

  // ---------- Loading State ----------
  if (loading && businesses.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-[400px]">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Loading" />
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full min-h-screen bg-white px-4 sm:px-6 py-4 sm:py-5">

        {/* KPI Cards — unchanged */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 pb-6 sm:pb-10 pt-4">
          <a className="block w-full p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{accessibleCityTotal}</h5>
            <p className="font-normal text-gray-700 text-sm sm:text-base">Accessible Cities</p>
          </a>
          <a className="block w-full p-3 px-4 bg-[#fcf4e0] rounded-lg shadow-md">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{paidContributorsCount}</h5>
            <p className="font-normal text-gray-700 text-sm sm:text-base">Paid Contributors</p>
          </a>
          <a className="block w-full p-3 px-4 bg-[#ffe2df] rounded-lg shadow-md">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{volunteerContributorsCount}</h5>
            <p className="font-normal text-gray-700 text-sm sm:text-base">Volunteer Contributors</p>
          </a>
          <a className="block w-full p-3 px-4 bg-[#daf1e6] rounded-lg shadow-md">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{totalBusinesses}</h5>
            <p className="font-normal text-gray-700 text-sm sm:text-base">Business Profiles</p>
          </a>
          <a className="block w-full p-3 px-4 bg-[#fde8e2] rounded-lg shadow-md">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{partnerTotal}</h5>
            <p className="font-normal text-gray-700 text-sm sm:text-base">Total Partners</p>
          </a>
        </div>

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Business Profiles ({totalBusinesses})
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Sort dropdown */}
            <div className="border border-gray-300 rounded-md px-3 py-1.5 bg-white">
              <select
                className="w-full sm:w-auto bg-transparent text-sm text-gray-700 outline-none"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value as SortOption);
                  setCurrentPage(1);
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, city, category…"
                className="w-full border-none text-sm text-gray-700 placeholder-gray-400 ml-2 focus:outline-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:bg-gray-100 transition-colors ${col.width || ""}`}
                      onClick={() => handleTableSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {col.label}
                        <SortIcon column={col.key} sortKey={tableSortKey} sortDir={tableSortDir} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-16 text-center">
                      <div className="flex justify-center">
                        <img src="/assets/images/favicon.png" className="w-8 h-8 animate-spin" alt="Loading" />
                      </div>
                    </td>
                  </tr>
                ) : sortedBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-16 text-center text-gray-400 text-sm">
                      No businesses found.
                    </td>
                  </tr>
                ) : (
                  sortedBusinesses.map((business) => {
                    const statusInfo = getStatusInfo(business);
                    const sub = subscriptions[business.id];
                    // undefined = still loading, null = no subscription
                    const subLoaded = business.id in subscriptions;
                    const subStatus = sub?.status ?? null;
                    const subBadge = getSubStatusBadge(subStatus);
                    const packageName = sub?.packageName ?? null;
                    const endDate = sub?.end_date ?? null;



                    return (
                      <tr
                        key={business.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Business Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {business.logo_url ? (
                              <img
                                src={`${business.logo_url}?_t=${new Date(business.modified_at).getTime()}`}
                                alt={business.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-100"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-500">
                                {business.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 whitespace-nowrap max-w-[200px] truncate" title={business.name}>
                                {business.name}
                              </p>
                              <p className="text-xs text-gray-400 whitespace-nowrap">{business.city}, {business.state}</p>
                            </div>
                          </div>
                        </td>

                        {/* Business Status */}
                        <td className="px-4 py-3">
                          {statusInfo.label ? (
                            <span
                              className="inline-block text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap"
                              style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                            >
                              {statusInfo.label}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Subscription Status → packageName (e.g. "Yearly", "Monthly") */}
                        <td className="px-4 py-3">
                          {!subLoaded ? (
                            <span className="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse" />
                          ) : packageName ? (
                            <span
                              className="inline-block text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap"
                              style={{ backgroundColor: "#EEF2FF", color: "#3730A3" }}
                            >
                              {packageName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Renewal / Expiry Date → end_date */}
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap text-sm">
                          {!subLoaded ? (
                            <span className="inline-block w-20 h-4 bg-gray-100 rounded animate-pulse" />
                          ) : (
                            formatDate(endDate)
                          )}
                        </td>

                        {/* Payment Status → status (active / expired / cancelled …) */}
                        <td className="px-4 py-3">
                          {!subLoaded ? (
                            <span className="inline-block w-14 h-5 bg-gray-100 rounded animate-pulse" />
                          ) : subStatus ? (
                            <span
                              className="inline-block text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap capitalize"
                              style={{ backgroundColor: subBadge.bg, color: subBadge.text }}
                            >
                              {subStatus}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Active Profile */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md"
                            style={
                              business.active && !business.blocked
                                ? { backgroundColor: "#dff7ed", color: "#03543f" }
                                : { backgroundColor: "#FEE2E2", color: "#991B1B" }
                            }
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: business.active && !business.blocked ? "#03543f" : "#991B1B",
                              }}
                            />
                            {business.active && !business.blocked ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                          {formatDate(business.created_at)}
                        </td>

                        {/* Last Updated */}
                        <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                          {formatDate(business.modified_at)}
                        </td>

                        {/* Last Login */}
                        <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                          {business.last_login ? formatDate(business.last_login) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <Link
                            href={`/business-profile/${business.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0519CE] hover:text-[#0315a0] hover:underline whitespace-nowrap"
                          >
                            View
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && sortedBusinesses.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(safePage * itemsPerPage, totalBusinesses)} of {totalBusinesses} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                    currentPage === 1
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
                        <span className="px-2 py-1 text-gray-500 text-xs">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page as number)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                            safePage === page
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
                  onClick={() => goToPage(safePage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
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
        </div>
      </div>
    </div>
  );
}