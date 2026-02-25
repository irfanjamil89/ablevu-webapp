"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// ---------- Types ----------
// Accurately reflects /business/list API response as of 2026-02-23
//
// KNOWN API GAPS (fields not yet returned by the backend):
//   - subscription_expiry / renewal_date  → not in response
//   - payment_status                      → not in response
//   - last_login                          → belongs to user, not business
//
// When your backend adds these, update the Business type and the
// corresponding table cells below (search for "⚠️ API GAP").

type Business = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  logo_url?: string | null;
  active: boolean;
  blocked: boolean;
  business_status?: string | null;
  // ← subscription is a plain string ("monthly" | "yearly") or null
  subscription: string | null;
  views: number;
  created_at: string;
  modified_at: string;
  owner_user_id?: string | null;
  linkedTypes: { id: string; business_type_id: string }[];
  accessibilityFeatures: { id: string }[];
  businessRecomendations?: any[];
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "created-asc"
  | "created-desc"
  | "modified-asc"
  | "modified-desc"
  | "status-asc"
  | "status-desc";

// ---------- Helpers ----------

const formatDate = (d?: string | null) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

// Business status badge
const BUSINESS_STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  draft:              { label: "Draft",            bg: "#FFF3CD", text: "#C28A00" },
  "pending review":   { label: "Pending Review",   bg: "#F3E8FF", text: "#6B21A8" },
  "pending approval": { label: "Pending Approval", bg: "#FFEFD5", text: "#B46A00" },
  approved:           { label: "Submitted",        bg: "#e3f1ff", text: "#1e429e" },
  "pending claim":    { label: "Pending Claim",    bg: "#EEF2FF", text: "#3730A3" },
  claimed:            { label: "Claimed",          bg: "#dff7ed", text: "#03543f" },
};

const getBusinessStatusBadge = (b: Business) => {
  const s = (b.business_status || "").toLowerCase().trim().replace(/[\s_-]+/g, " ");
  const fallback = { label: "—", bg: "#F3F4F6", text: "#9CA3AF" };
  if (BUSINESS_STATUS_BADGE[s]) return BUSINESS_STATUS_BADGE[s];
  if (s === "review pending") return BUSINESS_STATUS_BADGE["pending review"];
  if (s === "pending" || s === "pending approved") return BUSINESS_STATUS_BADGE["pending approval"];
  // Fallback: active + not blocked → approved
  if ((!s || s === "active") && b.active && !b.blocked) return BUSINESS_STATUS_BADGE["approved"];
  return fallback;
};

// Subscription plan badge — subscription is "monthly" | "yearly" | null
const PLAN_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  monthly: { label: "Monthly", bg: "#EEF2FF", text: "#3730A3" },
  yearly:  { label: "Yearly",  bg: "#dff7ed", text: "#03543f" },
};

const getPlanBadge = (subscription: string | null) => {
  if (!subscription) return { label: "No Plan", bg: "#F3F4F6", text: "#9CA3AF" };
  const key = subscription.toLowerCase().trim();
  return PLAN_BADGE[key] || { label: subscription, bg: "#F3F4F6", text: "#6B7280" };
};

// ---------- Sort Icon ----------
const SortIcon = ({ col, current }: { col: string; current: string }) => (
  <span className="inline-flex flex-col ml-1 gap-[1px]">
    <svg width="7" height="5" viewBox="0 0 8 5" fill="currentColor"
      className={current === `${col}-asc` ? "text-[#0519CE]" : "text-gray-300"}>
      <path d="M4 0L8 5H0L4 0Z" />
    </svg>
    <svg width="7" height="5" viewBox="0 0 8 5" fill="currentColor"
      className={current === `${col}-desc` ? "text-[#0519CE]" : "text-gray-300"}>
      <path d="M4 5L0 0H8L4 5Z" />
    </svg>
  </span>
);

// ---------- Badge ----------
const Badge = ({ bg, text, label }: { bg: string; text: string; label: string }) => (
  <span
    className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
    style={{ backgroundColor: bg, color: text }}
  >
    {label}
  </span>
);

// ---------- Gap Cell (fields not yet in API) ----------
const GapCell = ({ tooltip }: { tooltip: string }) => (
  <td className="px-4 py-3 whitespace-nowrap" title={tooltip}>
    <span className="text-gray-300 text-xs">—</span>
  </td>
);

// ---------- Main Component ----------
export default function BusinessTable() {
  const [businesses, setBusinesses]   = useState<Business[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm]   = useState("");
  const [sortOption, setSortOption]   = useState<SortOption>("created-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const itemsPerPage = 10;

  const base  = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchTerm(searchInput); setCurrentPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let url = `${base}business/list?page=${currentPage}&limit=${itemsPerPage}`;
        if (searchTerm.trim()) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (sortOption)        url += `&sort=${sortOption}`;
        const res  = await fetch(url, { headers });
        const json = await res.json();
        setBusinesses(json.data || []);
        setTotalBusinesses(json.total || 0);
      } catch (e) {
        console.error("Error loading businesses:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, searchTerm, sortOption]);

  const toggleSort = (col: string) => {
    setSortOption((prev) => `${col}-${prev === `${col}-asc` ? "desc" : "asc"}` as SortOption);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalBusinesses / itemsPerPage));
  const safePage   = Math.min(currentPage, totalPages);

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4)              return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const columns: { key: string; label: string; sortable: boolean }[] = [
    { key: "name",      label: "Business Name",        sortable: true  },
    { key: "status",    label: "Business Status",       sortable: true  },
    { key: "sub",       label: "Subscription Plan",     sortable: false },
    { key: "expiry",    label: "Renewal / Expiry Date", sortable: false },
    { key: "payment",   label: "Payment Status",        sortable: false },
    { key: "profiles",  label: "Active Profile",        sortable: false },
    { key: "created",   label: "Creation Date",         sortable: true  },
    { key: "modified",  label: "Last Updated",          sortable: true  },
    { key: "lastlogin", label: "Last Login",            sortable: false },
  ];

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Business Profiles</h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalBusinesses} total records</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Sort */}
          <div className="border border-gray-300 rounded-md px-3 py-1.5 bg-white">
            <select
              className="w-full sm:w-auto bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value as SortOption); setCurrentPage(1); }}
            >
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="modified-desc">Last Updated (Newest)</option>
              <option value="modified-asc">Last Updated (Oldest)</option>
              <option value="status-asc">Status (A–Z)</option>
              <option value="status-desc">Status (Z–A)</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white sm:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, city, category…"
              className="w-full border-none text-sm text-gray-700 placeholder-gray-400 ml-2 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button onClick={() => setSearchInput("")}
                className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      

      {/* Table */}
      <div className="border border-gray-200 rounded-xl  shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                    className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                      col.sortable ? "cursor-pointer select-none hover:text-gray-800" : ""
                    }`}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {col.label}
                      {col.sortable && <SortIcon col={col.key} current={sortOption} />}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
              ) : businesses.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-16 text-center text-gray-400 text-sm">
                    No businesses found.
                  </td>
                </tr>
              ) : (
                businesses.map((b, idx) => {
                  const businessBadge = getBusinessStatusBadge(b);
                  const planBadge     = getPlanBadge(b.subscription);
                  const isActive      = b.active && !b.blocked;

                  return (
                    <tr
                      key={b.id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-blue-50/30 transition-colors`}
                    >
                      {/* Business Name */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {b.logo_url ? (
                            <img src={b.logo_url} alt={b.name}
                              className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-[#E9F6FB] flex items-center justify-center flex-shrink-0 text-[#0519CE] font-bold text-sm">
                              {b.name?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 max-w-[180px] truncate text-sm">{b.name}</div>
                            <div className="text-xs text-gray-400 truncate max-w-[180px]">
                              {[b.city, b.state].filter(Boolean).join(", ")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Business Status — b.business_status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge {...businessBadge} />
                      </td>

                      {/* Subscription Plan — b.subscription ("monthly" | "yearly" | null) */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge {...planBadge} />
                      </td>

                      {/* ⚠️ API GAP — Renewal/Expiry Date not in API response */}
                      <GapCell tooltip="Not yet returned by API — ask backend to include subscription expiry/renewal date" />

                      {/* ⚠️ API GAP — Payment Status not in API response */}
                      <GapCell tooltip="Not yet returned by API — ask backend to include payment_status" />

                      {/* Active Profile — b.active && !b.blocked */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isActive ? "bg-[#dff7ed] text-[#03543f]" : "bg-gray-100 text-gray-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#03543f]" : "bg-gray-400"}`} />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Creation Date — b.created_at */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                        {formatDate(b.created_at)}
                      </td>

                      {/* Last Updated — b.modified_at */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                        {formatDate(b.modified_at)}
                      </td>

                      {/* ⚠️ API GAP — Last Login not in API response (user-level field) */}
                      <GapCell tooltip="Not in business API — needs owner user's last_login from backend" />

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/business-profile/${b.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#0519CE] hover:text-[#0519CE]/80 bg-[#F0F1FF] hover:bg-[#e0e2ff] px-3 py-1.5 rounded-full transition-colors"
                        >
                          View
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
        {!loading && businesses.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
            <div className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">{(safePage - 1) * itemsPerPage + 1}</span>
              {" "}to{" "}
              <span className="font-medium text-gray-700">{Math.min(safePage * itemsPerPage, totalBusinesses)}</span>
              {" "}of{" "}
              <span className="font-medium text-gray-700">{totalBusinesses}</span> entries
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                ← Prev
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  <React.Fragment key={idx}>
                    {page === "..." ? (
                      <span className="px-2 text-gray-400 text-xs">…</span>
                    ) : (
                      <button
                        onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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

              <div className="sm:hidden text-xs text-gray-500 px-2">
                Page {safePage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}