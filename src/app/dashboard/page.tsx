"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { useUser } from "@/app/component/UserContext";

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
  owner_last_login_at?: string | null;
  last_login?: string | null;
};

type BusinessType = { id: string; name: string };
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
  | "created-desc"
  | "modified-asc"
  | "modified-desc"
  | "status-asc"
  | "status-desc"
  | "last-login-asc"
  | "last-login-desc";

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
  status: string;
  business: { id: string; name: string };
} | null;

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
  (status || "").toLowerCase().trim().replace(/[\s_-]+/g, " ");

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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

// ---------- SERVER_SORT_MAP ----------
const SERVER_SORT_MAP: Partial<Record<TableSortKey, { asc: SortOption; desc: SortOption }>> = {
  name: { asc: "name-asc", desc: "name-desc" },
  created_at: { asc: "created-asc", desc: "created-desc" },
  modified_at: { asc: "modified-asc", desc: "modified-desc" },
  business_status: { asc: "status-asc", desc: "status-desc" },
  last_login: { asc: "last-login-asc", desc: "last-login-desc" },
};

// Columns whose data comes from the subscription API (not the main business list)
const CLIENT_ONLY_SORT_KEYS: TableSortKey[] = [
  "subscription_status",
  "end_date",
  "payment_status",
  "active_profiles",
];

// ---------- Sort Icon ----------
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
    <span className="inline-flex flex-col ml-1.5" style={{ gap: 1 }}>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none"
        style={{ opacity: isActive && sortDir === "asc" ? 1 : 0.35 }}>
        <path d="M3.5 0L7 5H0L3.5 0Z"
          fill={isActive && sortDir === "asc" ? "#0519CE" : "#6B7280"} />
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none"
        style={{ opacity: isActive && sortDir === "desc" ? 1 : 0.35 }}>
        <path d="M3.5 5L0 0H7L3.5 5Z"
          fill={isActive && sortDir === "desc" ? "#0519CE" : "#6B7280"} />
      </svg>
    </span>
  );
};

// ---------- Background Load Progress Pill ----------
const BackgroundLoadBar = ({ loaded, total }: { loaded: number; total: number }) => {
  if (loaded >= total || total === 0) return null;
  const pct = Math.round((loaded / total) * 100);
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ minWidth: 240 }}>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">Loading all businesses…</span>
          <span className="text-xs text-gray-400 font-mono">{loaded}/{total}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#0519CE] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-gray-400">
          Subscription columns will sort globally once complete
        </p>
      </div>
    </div>
  );
};

// ---------- Sort-wait Overlay ----------
const SortWaitOverlay = ({ loaded, total }: { loaded: number; total: number }) => {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-b-xl gap-4">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-7 h-7 text-[#0519CE]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm font-medium text-gray-700">Loading all data to sort globally…</p>
        <div className="w-56 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#0519CE] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 font-mono">{loaded} / {total} businesses loaded</p>
      </div>
    </div>
  );
};

export default function Page() {
  const { user, updateUser } = useUser();

  // ---------- Visible page state ----------
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageChanging, setPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ---------- All-data (background) state ----------
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(0);
  const [bgLoadTotal, setBgLoadTotal] = useState(0);
  const [bgLoading, setBgLoading] = useState(false);
  const bgFetchAbortRef = useRef<AbortController | null>(null);

  // ---------- Sort state ----------
  const [sortOption, setSortOption] = useState<SortOption>("created-desc");
  const [tableSortKey, setTableSortKey] = useState<TableSortKey | null>(null);
  const [tableSortDir, setTableSortDir] = useState<TableSortDir>("asc");

  // Queued sort (clicked while BG still loading)
  const [pendingSortKey, setPendingSortKey] = useState<TableSortKey | null>(null);
  const [pendingSortDir, setPendingSortDir] = useState<TableSortDir>("asc");
  const [waitingForAllData, setWaitingForAllData] = useState(false);

  // View mode: "paginated" = normal API pages | "sorted-all" = slicing from allBusinesses
  const [viewMode, setViewMode] = useState<"paginated" | "sorted-all">("paginated");
  const [sortedPage, setSortedPage] = useState(1);

  // ---------- Reference data ----------
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [accessibleCityTotal, setAccessibleCityTotal] = useState(0);
  const [partnerTotal, setPartnerTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);

  // ---------- Subscriptions ----------
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>({});
  const subscriptionFetchedRef = useRef<Set<string>>(new Set());

  // ---------- Search ----------
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const headers = useMemo<Record<string, string>>(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const h: Record<string, string> = {};
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, []);

  // ---------- Debounced Search ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      // Reset all-data state on new search
      bgFetchAbortRef.current?.abort();
      setAllBusinesses([]);
      setAllDataLoaded(false);
      setBgLoaded(0);
      setViewMode("paginated");
      setTableSortKey(null);
      setPendingSortKey(null);
      setWaitingForAllData(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ---------- Load Reference Data (Once) ----------
  useEffect(() => {
    const load = async () => {
      try {
        const [btRes, fRes, acRes, pRes, uRes] = await Promise.all([
          fetch(`${base}business-type/list?page=1&limit=1000`, { headers }),
          fetch(`${base}accessible-feature/list?page=1&limit=1000`),
          fetch(`${base}accessible-city/list?page=1&limit=1000`, { headers }),
          fetch(`${base}partner/list?page=1&limit=1000`, { headers }),
          fetch(`${base}users`, { headers }),
        ]);
        const btJson = await btRes.json(); setBusinessTypes(btJson.data || []);
        const fJson = await fRes.json(); setFeatures(fJson.items || []);
        const acJson = await acRes.json(); setAccessibleCityTotal(acJson.total ?? acJson.items?.length ?? 0);
        const pJson = await pRes.json(); setPartnerTotal(pJson.total ?? (pJson.items?.length || 0));
        if (uRes.ok) {
          const uJson = await uRes.json();
          const arr: User[] = Array.isArray(uJson) ? uJson : uJson.data || uJson.items || [];
          setUsers(arr);
        }
      } catch (e) { console.error("Reference data error:", e); }
    };
    load();
  }, []);

  // ---------- Load current page (fast, visible) ----------
  const isFirstLoad = useRef(true);

  useEffect(() => {
    bgFetchAbortRef.current?.abort();
    setAllDataLoaded(false);
    setAllBusinesses([]);
    setBgLoaded(0);
    setViewMode("paginated");

    const loadPage = async () => {
      try {
        if (isFirstLoad.current) setLoading(true);
        else setPageChanging(true);

        let url = `${base}business/list?page=${currentPage}&limit=${itemsPerPage}`;
        if (searchTerm.trim()) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (sortOption) url += `&sort=${sortOption}`;

        const res = await fetch(url, { headers });
        const json = await res.json();
        const total = json.total || 0;
        const items: Business[] = (json.data || []).map((b: any) => ({
          ...b,
          last_login: b.owner_last_login_at ?? b.last_login ?? null,
        }));

        setBusinesses(items);
        setTotalBusinesses(total);
        setBgLoadTotal(total);
      } catch (e) {
        console.error("Page load error:", e);
      } finally {
        isFirstLoad.current = false;
        setLoading(false);
        setPageChanging(false);
      }
    };
    loadPage();
  }, [currentPage, searchTerm, sortOption]);

  // ---------- Background: fetch ALL businesses after page renders ----------
  useEffect(() => {
    if (loading || totalBusinesses === 0 || allDataLoaded) return;

    bgFetchAbortRef.current?.abort();
    const controller = new AbortController();
    bgFetchAbortRef.current = controller;

    const fetchAll = async () => {
      setBgLoading(true);
      const bgLimit = 50;
      const pages = Math.ceil(totalBusinesses / bgLimit);
      const collected: Business[] = [];

      try {
        for (let p = 1; p <= pages; p++) {
          if (controller.signal.aborted) return;

          let url = `${base}business/list?page=${p}&limit=${bgLimit}`;
          if (searchTerm.trim()) url += `&search=${encodeURIComponent(searchTerm)}`;
          // No sort param — collect raw data, sort client-side

          const res = await fetch(url, { headers, signal: controller.signal });
          if (!res.ok) continue;
          const json = await res.json();
          const items: Business[] = (json.data || []).map((b: any) => ({
            ...b,
            last_login: b.owner_last_login_at ?? b.last_login ?? null,
          }));
          collected.push(...items);
          setBgLoaded(collected.length);
        }

        if (!controller.signal.aborted) {
          setAllBusinesses(collected);
          setAllDataLoaded(true);
          setBgLoading(false);
          // Kick off background subscription fetches
          fetchSubscriptionsForAll(collected, controller);
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") console.error("BG fetch error:", e);
        setBgLoading(false);
      }
    };

    fetchAll();
    return () => controller.abort();
  }, [loading, totalBusinesses, searchTerm]);

  // ---------- Subscription fetch helpers ----------
  const fetchSubscriptionsForBusinesses = useCallback(async (list: Business[]) => {
    const toFetch = list.filter((b) => !subscriptionFetchedRef.current.has(b.id));
    if (!toFetch.length) return;
    toFetch.forEach((b) => subscriptionFetchedRef.current.add(b.id));

    const results = await Promise.allSettled(
      toFetch.map(async (b) => {
        const res = await fetch(`${base}subscriptions/subscription-profile/${b.id}`, { headers });
        if (!res.ok) return { id: b.id, sub: null };
        const json = await res.json();
        return { id: b.id, sub: json?.id ? json : null };
      }),
    );
    const newSubs: Record<string, Subscription> = {};
    results.forEach((r) => { if (r.status === "fulfilled") newSubs[r.value.id] = r.value.sub; });
    setSubscriptions((prev) => ({ ...prev, ...newSubs }));
  }, [base, headers]);

  const fetchSubscriptionsForAll = useCallback(async (list: Business[], controller: AbortController) => {
    const BATCH = 10;
    for (let i = 0; i < list.length; i += BATCH) {
      if (controller.signal.aborted) return;
      await fetchSubscriptionsForBusinesses(list.slice(i, i + BATCH));
      await new Promise((r) => setTimeout(r, 80)); // gentle throttle
    }
  }, [fetchSubscriptionsForBusinesses]);

  // Fetch subs for current visible page
  useEffect(() => {
    if (businesses.length) fetchSubscriptionsForBusinesses(businesses);
  }, [businesses]);

  // ---------- Apply sort across ALL data ----------
  const applyGlobalSort = useCallback((
    key: TableSortKey,
    dir: TableSortDir,
    dataOverride?: Business[],
  ) => {
    const data = dataOverride ?? allBusinesses;
    const subs = subscriptions;

    const sorted = [...data].sort((a, b) => {
      const subA = subs[a.id];
      const subB = subs[b.id];
      let valA: any = "";
      let valB: any = "";

      switch (key) {
        case "name":
          valA = a.name?.toLowerCase() || ""; valB = b.name?.toLowerCase() || ""; break;
        case "business_status":
          valA = a.business_status || ""; valB = b.business_status || ""; break;
        case "created_at":
          valA = new Date(a.created_at).getTime(); valB = new Date(b.created_at).getTime(); break;
        case "modified_at":
          valA = new Date(a.modified_at).getTime(); valB = new Date(b.modified_at).getTime(); break;
        case "last_login":
          valA = a.last_login ? new Date(a.last_login).getTime() : 0;
          valB = b.last_login ? new Date(b.last_login).getTime() : 0; break;
        case "subscription_status":
          valA = subA?.status || ""; valB = subB?.status || ""; break;
        case "end_date":
          valA = subA?.end_date ? new Date(subA.end_date).getTime() : 0;
          valB = subB?.end_date ? new Date(subB.end_date).getTime() : 0; break;
        case "payment_status":
          valA = subA?.status || ""; valB = subB?.status || ""; break;
        case "active_profiles":
          valA = a.active && !a.blocked ? 1 : 0;
          valB = b.active && !b.blocked ? 1 : 0; break;
      }

      if (valA < valB) return dir === "asc" ? -1 : 1;
      if (valA > valB) return dir === "asc" ? 1 : -1;
      return 0;
    });

    setAllBusinesses(sorted);
    setViewMode("sorted-all");
    setSortedPage(1);
    setTableSortKey(key);
    setTableSortDir(dir);
  }, [allBusinesses, subscriptions]);

  // ---------- Resolve pending sort when BG finishes ----------
  useEffect(() => {
    if (waitingForAllData && allDataLoaded && pendingSortKey) {
      setWaitingForAllData(false);
      applyGlobalSort(pendingSortKey, pendingSortDir);
      setPendingSortKey(null);
    }
  }, [allDataLoaded, waitingForAllData, pendingSortKey, pendingSortDir, applyGlobalSort]);

  // ---------- Table Sort Handler ----------
  const handleTableSort = (key: TableSortKey) => {
    const newDir: TableSortDir =
      tableSortKey === key ? (tableSortDir === "asc" ? "desc" : "asc") : "asc";

    if (allDataLoaded) {
      // All data in memory → sort everything globally, instant ✅
      applyGlobalSort(key, newDir);
    } else {
      // Still loading in background
      const serverMapping = SERVER_SORT_MAP[key];
      const isClientOnly = CLIENT_ONLY_SORT_KEYS.includes(key);

      if (serverMapping && !isClientOnly) {
        // Server-sortable column: fire API sort as fallback while BG loads
        const currentlyAsc = sortOption === serverMapping.asc;
        const newSortOption = currentlyAsc ? serverMapping.desc : serverMapping.asc;
        setSortOption(newSortOption);
        setCurrentPage(1);
        setTableSortKey(key);
        setTableSortDir(newDir);
        setViewMode("paginated");
      } else {
        // Client-only column: queue the sort, show wait overlay
        setPendingSortKey(key);
        setPendingSortDir(newDir);
        setWaitingForAllData(true);
        setTableSortKey(key);
        setTableSortDir(newDir);
      }
    }
  };

  // ---------- Memoized KPI values ----------
  const { paidContributorsCount, volunteerContributorsCount } = useMemo(() => ({
    paidContributorsCount: users.filter((u) => u.paid_contributor === true).length,
    volunteerContributorsCount: users.filter((u) => (u.user_role || "").toLowerCase() === "contributor").length,
  }), [users]);

  // ---------- Visible rows ----------
  const visibleBusinesses = useMemo(() => {
    if (viewMode === "sorted-all") {
      const start = (sortedPage - 1) * itemsPerPage;
      return allBusinesses.slice(start, start + itemsPerPage);
    }
    // Paginated mode — may apply client sort on current page only
    if (!tableSortKey || SERVER_SORT_MAP[tableSortKey]) return businesses;
    return [...businesses].sort((a, b) => {
      const subA = subscriptions[a.id];
      const subB = subscriptions[b.id];
      let valA: any = "";
      let valB: any = "";
      switch (tableSortKey) {
        case "subscription_status": valA = subA?.status || ""; valB = subB?.status || ""; break;
        case "end_date":
          valA = subA?.end_date ? new Date(subA.end_date).getTime() : 0;
          valB = subB?.end_date ? new Date(subB.end_date).getTime() : 0; break;
        case "payment_status": valA = subA?.status || ""; valB = subB?.status || ""; break;
        case "active_profiles": valA = a.active && !a.blocked ? 1 : 0; valB = b.active && !b.blocked ? 1 : 0; break;
      }
      if (valA < valB) return tableSortDir === "asc" ? -1 : 1;
      if (valA > valB) return tableSortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [viewMode, sortedPage, allBusinesses, businesses, tableSortKey, tableSortDir, subscriptions]);

  // ---------- Pagination ----------
  const effectiveTotalPages = useMemo(() => {
    if (viewMode === "sorted-all") return Math.max(1, Math.ceil(allBusinesses.length / itemsPerPage));
    return Math.max(1, Math.ceil(totalBusinesses / itemsPerPage));
  }, [viewMode, allBusinesses.length, totalBusinesses]);

  const effectivePage = viewMode === "sorted-all" ? sortedPage : currentPage;
  const safePage = Math.min(effectivePage, effectiveTotalPages);
  const effectiveTotal = viewMode === "sorted-all" ? allBusinesses.length : totalBusinesses;

  const goToPage = (page: number) => {
    if (viewMode === "sorted-all") setSortedPage(page);
    else setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const total = effectiveTotalPages;
    const cur = safePage;
    const pages: (number | string)[] = [];
    if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
    else if (cur <= 3) { for (let i = 1; i <= 4; i++) pages.push(i); pages.push("..."); pages.push(total); }
    else if (cur >= total - 2) { pages.push(1); pages.push("..."); for (let i = total - 3; i <= total; i++) pages.push(i); }
    else { pages.push(1); pages.push("..."); pages.push(cur - 1); pages.push(cur); pages.push(cur + 1); pages.push("..."); pages.push(total); }
    return pages;
  };

  // ---------- Columns ----------
  const columns: { key: TableSortKey; label: string; width?: string; clientOnly?: boolean }[] = [
    { key: "name", label: "Business Name", width: "min-w-[180px]" },
    { key: "business_status", label: "Business Status", width: "min-w-[140px]" },
    { key: "subscription_status", label: "Subscription", width: "min-w-[130px]", clientOnly: true },
    { key: "end_date", label: "Renewal / Expiry", width: "min-w-[130px]", clientOnly: true },
    { key: "payment_status", label: "Payment Status", width: "min-w-[130px]", clientOnly: true },
    { key: "active_profiles", label: "Active Profile", width: "min-w-[110px]", clientOnly: true },
    { key: "created_at", label: "Created", width: "min-w-[110px]" },
    { key: "modified_at", label: "Last Updated", width: "min-w-[110px]" },
    { key: "last_login", label: "Last Login", width: "min-w-[110px]" },
  ];

  if (loading && businesses.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-[400px]">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Loading" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto">
      {user?.user_role === "Admin" ? (
        <div className="w-full min-h-screen bg-white px-4 sm:px-6 py-4 sm:py-5">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 pb-6 sm:pb-10 pt-4">
            {[
              { bg: "#E9F6FB", val: accessibleCityTotal, label: "Accessible Cities" },
              { bg: "#fcf4e0", val: paidContributorsCount, label: "Paid Contributors" },
              { bg: "#ffe2df", val: volunteerContributorsCount, label: "Volunteer Contributors" },
              { bg: "#daf1e6", val: totalBusinesses, label: "Business Profiles" },
              { bg: "#fde8e2", val: partnerTotal, label: "Total Partners" },
            ].map(({ bg, val, label }) => (
              <a key={label} className="block w-full p-3 px-4 rounded-lg shadow-md" style={{ backgroundColor: bg }}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">{val}</h5>
                <p className="font-normal text-gray-700 text-sm sm:text-base">{label}</p>
              </a>
            ))}
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Business Profiles ({totalBusinesses})
              </h1>
              {allDataLoaded ? (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  All data ready — global sorting active
                </span>
              ) : bgLoading ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                  <svg className="animate-spin w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading {bgLoaded}/{bgLoadTotal} for global sort…
                </span>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Dropdown — disabled in sorted-all mode */}
              <div className={`border border-gray-300 rounded-md px-3 py-1.5 bg-white ${viewMode === "sorted-all" ? "opacity-40 pointer-events-none" : ""}`}>
                <select className="w-full sm:w-auto bg-transparent text-sm text-gray-700 outline-none"
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value as SortOption); setCurrentPage(1); setTableSortKey(null); setViewMode("paginated"); }}>
                  <option value="created-desc">Newest First</option>
                  <option value="created-asc">Oldest First</option>
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                </select>
              </div>

              {/* Clear sort (sorted-all mode only) */}
              {viewMode === "sorted-all" && (
                <button onClick={() => { setViewMode("paginated"); setTableSortKey(null); setSortedPage(1); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Sort
                </button>
              )}

              {/* Search */}
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white sm:w-72">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input type="text" placeholder="Search by name, city, category…"
                  className="w-full border-none text-sm text-gray-700 placeholder-gray-400 ml-2 focus:outline-none"
                  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm relative">
            {pageChanging && (
              <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#0519CE]"
                  style={{ width: "40%", animation: "slide 1s ease-in-out infinite" }} />
              </div>
            )}

            {/* Overlay when waiting for BG data before applying sort */}
            {waitingForAllData && <SortWaitOverlay loaded={bgLoaded} total={bgLoadTotal} />}

            <style>{`
              @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
            `}</style>

            {/* Sorted-all info banner */}
            {viewMode === "sorted-all" && (
              <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-medium text-indigo-700">
                  All {allBusinesses.length} businesses sorted by{" "}
                  <strong>{columns.find((c) => c.key === tableSortKey)?.label ?? tableSortKey}</strong>{" "}
                  ({tableSortDir === "asc" ? "↑ ascending" : "↓ descending"})
                </span>
                <button onClick={() => { setViewMode("paginated"); setTableSortKey(null); setSortedPage(1); }}
                  className="text-xs text-indigo-600 hover:underline font-medium">
                  Back to default view
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns.map((col) => {
                      const isClientOnly = col.clientOnly;
                      return (
                        <th key={col.key}
                          className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:bg-gray-100 transition-colors ${col.width || ""}`}
                          onClick={() => handleTableSort(col.key)}
                          title={isClientOnly && !allDataLoaded ? `Background loading ${bgLoaded}/${bgLoadTotal}. Clicking will queue this sort and apply it once all data is loaded.` : undefined}>
                          <span className="inline-flex items-center gap-0.5">
                            {col.label}
                            <SortIcon column={col.key} sortKey={tableSortKey} sortDir={tableSortDir} />
                            {/* Spinner on client-only columns while BG loading */}
                            {isClientOnly && !allDataLoaded && (
                              <svg className="animate-spin w-2.5 h-2.5 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                            )}
                            {/* "global" badge once all data ready */}
                            {isClientOnly && allDataLoaded && (
                              <span className="ml-1 text-[9px] font-medium text-green-700 border border-green-300 bg-green-50 rounded px-1 leading-tight hidden sm:inline">
                                global
                              </span>
                            )}
                          </span>
                        </th>
                      );
                    })}
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className={`divide-y divide-gray-100 transition-opacity duration-150 ${pageChanging ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                  {loading ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-16 text-center">
                        <div className="flex justify-center">
                          <img src="/assets/images/favicon.png" className="w-8 h-8 animate-spin" alt="Loading" />
                        </div>
                      </td>
                    </tr>
                  ) : visibleBusinesses.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-16 text-center text-gray-400 text-sm">
                        No businesses found.
                      </td>
                    </tr>
                  ) : (
                    visibleBusinesses.map((business) => {
                      const statusInfo = getStatusInfo(business);
                      const sub = subscriptions[business.id];
                      const subLoaded = business.id in subscriptions;
                      const subStatus = sub?.status ?? null;
                      const subBadge = getSubStatusBadge(subStatus);
                      const packageName = sub?.packageName ?? null;
                      const endDate = sub?.end_date ?? null;

                      return (
                        <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                          {/* Business Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {business.logo_url ? (
                                <img src={`${business.logo_url}?_t=${new Date(business.modified_at).getTime()}`}
                                  alt={business.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-100" />
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
                            <span className="inline-block text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap"
                              style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                              {statusInfo.label}
                            </span>
                          </td>

                          {/* Subscription */}
                          <td className="px-4 py-3">
                            {!subLoaded ? (
                              <span className="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse" />
                            ) : packageName ? (
                              <span className="inline-block text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap"
                                style={{ backgroundColor: "#EEF2FF", color: "#3730A3" }}>
                                {packageName}
                              </span>
                            ) : <span className="text-gray-400 text-xs">—</span>}
                          </td>

                          {/* Renewal / Expiry */}
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap text-sm">
                            {!subLoaded ? (
                              <span className="inline-block w-20 h-4 bg-gray-100 rounded animate-pulse" />
                            ) : formatDate(endDate)}
                          </td>

                          {/* Payment Status */}
                          <td className="px-4 py-3">
                            {!subLoaded ? (
                              <span className="inline-block w-14 h-5 bg-gray-100 rounded animate-pulse" />
                            ) : subStatus ? (
                              <span className="inline-block text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap capitalize"
                                style={{ backgroundColor: subBadge.bg, color: subBadge.text }}>
                                {subStatus}
                              </span>
                            ) : <span className="text-gray-400 text-xs">—</span>}
                          </td>

                          {/* Active Profile */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md"
                              style={business.active && !business.blocked
                                ? { backgroundColor: "#dff7ed", color: "#03543f" }
                                : { backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: business.active && !business.blocked ? "#03543f" : "#991B1B" }} />
                              {business.active && !business.blocked ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">{formatDate(business.created_at)}</td>

                          {/* Last Updated */}
                          <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">{formatDate(business.modified_at)}</td>

                          {/* Last Login */}
                          <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                            {business.last_login ? formatDate(business.last_login) : <span className="text-gray-400">—</span>}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <Link href={`/business-profile/${business.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#0519CE] hover:text-[#0315a0] hover:underline whitespace-nowrap">
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
            {!loading && visibleBusinesses.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(safePage * itemsPerPage, effectiveTotal)} of {effectiveTotal} entries
                  {viewMode === "sorted-all" && (
                    <span className="ml-1.5 text-indigo-600 font-medium text-xs">(globally sorted)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${safePage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"}`}>
                    <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      <React.Fragment key={idx}>
                        {page === "..." ? (
                          <span className="px-2 py-1 text-gray-500 text-xs">...</span>
                        ) : (
                          <button onClick={() => goToPage(page as number)}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${safePage === page ? "bg-[#0519CE] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="sm:hidden text-xs text-gray-600 px-2">
                    Page {safePage} of {effectiveTotalPages}
                  </div>

                  <button onClick={() => goToPage(safePage + 1)} disabled={safePage === effectiveTotalPages}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${safePage === effectiveTotalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"}`}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : <></>}

      {/* Bottom-right background load progress pill */}
      <BackgroundLoadBar loaded={bgLoaded} total={bgLoadTotal} />
    </div>
  );
}