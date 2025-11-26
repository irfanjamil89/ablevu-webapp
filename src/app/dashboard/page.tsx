"use client";

import React, { useEffect, useMemo, useState } from "react";

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

// 🔹 Business Schedule types
type BusinessSchedule = {
  id: string;
  business: {
    id: string;
    name: string;
  };
  day: string; // "monday", "tuesday" ...
  opening_time: string; // ISO string from backend
  closing_time: string; // ISO string from backend
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

const getStatusInfo = (b: Business) => {
  const raw = (b.business_status || "").toLowerCase().trim();
  let label = "";
  let bg = "";
  let text = "";

  if (raw === "draft") {
    label = "Draft";
    bg = "#FFF3CD";
    text = "#C28A00";
  } else if (raw === "pending" || raw === "pending_approval") {
    label = "Pending Approval";
    bg = "#FFEFD5";
    text = "#B46A00";
  } else if (raw === "claimed") {
    label = "Claimed";
    bg = "#E0F7FF";
    text = "#0369A1";
  } else if (b.active && !b.blocked) {
    label = "Approved";
    bg = "#ECFDF3";
    text = "#039855";
  }

  return { label, bg, text };
};

export default function Page() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [schedules, setSchedules] = useState<BusinessSchedule[]>([]); // 🔹
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("created-desc");

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

  const getBusinessTypeName = (type: LinkedType) => {
    if (type.businessType?.name) return type.businessType.name.trim();
    if (type.business_type_name) return type.business_type_name.trim();
    if (type.businessTypeName) return type.businessTypeName.trim();
    if (type.name) return type.name.trim();

    const key = type.business_type_id || type.id;
    if (key && businessTypesMap[key]) {
      return businessTypesMap[key];
    }
    return key || "Unknown";
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

  // ---------- Fetch data (admin = all businesses) ----------

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const load = async () => {
      try {
        setLoading(true);

        // Business types
        const btRes = await fetch(
          `${base}/business-type/list?page=1&limit=1000`,
          { headers }
        );
        const btJson = await btRes.json();
        setBusinessTypes(btJson.data || []);

        // Accessible features
        const fRes = await fetch(
          `${base}/accessible-feature/list?page=1&limit=1000`
        );
        const fJson = await fRes.json();
        setFeatures(fJson.items || []);

        // Businesses (admin sees all – backend role-based)
        const bRes = await fetch(
          `${base}/business/list?page=1&limit=1000`,
          { headers }
        );
        const bJson = await bRes.json();
        setBusinesses(bJson.data || []);

        // 🔹 Business schedules
        const sRes = await fetch(
          `${base}/business-schedules/list?page=1&limit=1000`,
          { headers }
        );
        const sJson: ScheduleListResponse = await sRes.json();
        setSchedules(sJson.data || []);
      } catch (e) {
        console.error("Error loading admin dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ---------- Schedules map: businessId -> schedules[] ----------

  const schedulesByBusinessId = useMemo(() => {
    const map: Record<string, BusinessSchedule[]> = {};

    (schedules || []).forEach((sch) => {
      const bId = sch.business?.id;
      if (!bId) return;
      if (!map[bId]) map[bId] = [];
      map[bId].push(sch);
    });

    // optional: sort by day to keep list consistent
    Object.values(map).forEach((list) => {
      list.sort((a, b) => a.day.localeCompare(b.day));
    });

    return map;
  }, [schedules]);

  // ---------- Helper: today's schedule text ----------

  const getTodayKey = (): string => {
    const todayIndex = new Date().getDay(); // 0 = Sunday ... 6 = Saturday
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

  const getTodayScheduleLabel = (businessId: string): string | null => {
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
  };

  // ---------- Sorting + simple search ----------

  const sortedBusinesses = useMemo(() => {
    const arr = [...businesses];

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
      default:
        arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
    }

    return arr;
  }, [businesses, sortOption]);

  const filteredBusinesses = useMemo(() => {
    if (!searchTerm.trim()) return sortedBusinesses;
    const term = searchTerm.toLowerCase();

    return sortedBusinesses.filter((b) => {
      const nameMatch = b.name.toLowerCase().includes(term);
      const cityMatch = (b.city || "").toLowerCase().includes(term);

      const categoryMatch = (b.linkedTypes || []).some((lt) =>
        getBusinessTypeName(lt).toLowerCase().includes(term)
      );

      return nameMatch || cityMatch || categoryMatch;
    });
  }, [sortedBusinesses, searchTerm, businessTypesMap]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">
          <div className="w-full min-h-screen bg-white px-6 py-5">
            {/* KPI Cards (top) */}
            <div className="cards flex flex-wrap lg:flex-nowrap sm:flex-wrap gap-4 items-center pb-10 pt-4">
              {/* card-1 */}
              <a className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  13
                </h5>
                <p className="font-normal text-gray-700">Accessible Cities</p>
              </a>

              {/* card-2 */}
              <a className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  20
                </h5>
                <p className="font-normal text-gray-700">Paid Contributors</p>
              </a>

              {/* card-3 */}
              <a className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  25
                </h5>
                <p className="font-normal text-gray-700">
                  Volunteer Contributors
                </p>
              </a>

              {/* card-4 – dynamic count */}
              <a className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {businesses.length}
                </h5>
                <p className="font-normal text-gray-700">Business Profiles</p>
              </a>

              {/* card-5 */}
              <a className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  7
                </h5>
                <p className="font-normal text-gray-700">Total Partners</p>
              </a>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Recently Created Businesses ({filteredBusinesses.length})
              </h1>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="border border-gray-300 rounded-md px-3 py-1.5">
                  <select
                    className="bg-transparent text-sm text-gray-700 outline-none"
                    value={sortOption}
                    onChange={(e) =>
                      setSortOption(e.target.value as SortOption)
                    }
                  >
                    <option value="created-desc">Newest First</option>
                    <option value="created-asc">Oldest First</option>
                    <option value="name-asc">Name (A–Z)</option>
                    <option value="name-desc">Name (Z–A)</option>
                  </select>
                </div>

                {/* Search */}
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 w-72">
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
                    placeholder="Search by Business Name, City, Category"
                    className="w-full border-none text-sm text-gray-700 placeholder-gray-400 ml-2 focus:border-0 active:border-0 focus-visible:outline-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Business cards from DB */}
            <section className="flex-1">
              <section className="space-y-10 lg:space-y-4 md:space-y-4">
                {filteredBusinesses.map((business) => {
                  const statusInfo = getStatusInfo(business);

                  return (
                    <div
                      key={business.id}
                      className="border border-gray-200 rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]"
                    >
                      {/* left-side image */}
                      <div
                        className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                        style={{
                          backgroundImage: `url(${
                            business.logo_url ||
                            "/assets/images/search-1.jpg"
                          })`,
                        }}
                      >
                        {statusInfo.label && (
                          <span
                            className="absolute md:-top-6 top-5 md:right-2 right-14 text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm"
                            style={{
                              backgroundColor: statusInfo.bg,
                              color: statusInfo.text,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        )}
                      </div>

                      {/* right-side */}
                      <div className="flex-1 bg-white p-4 ps-6 space-y-4">
                        <div className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 text-xl">
                            {business.name}
                          </h3>

                          <div className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                            {/* Saved (static) */}
                            <label className="inline-flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                className="peer hidden"
                              />
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
                                <span>0 Saved</span>
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
                              {business.views ?? 0} Views
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
                                  d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z"
                                />
                              </svg>
                              {business.businessRecomendations?.length ?? 0}{" "}
                              Recommendations
                            </button>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="text-sm">
                          <div className="flex">
                            <span className="font-medium text-gray-500 pe-2">
                              Categories
                            </span>
                            <ul className="flex flex-wrap md:flex-nowrap space-x-2">
                              {business.linkedTypes.map((type) => (
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
                        <div className="text-xs text-gray-500 mt-2">
                          <div className="flex flex-wrap md:gap-0 gap-2">
                            <span className="font-medium text-gray-500 pe-2">
                              Accessible Features
                            </span>
                            <ul className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                              {business.accessibilityFeatures.map((feature) => (
                                <li
                                  key={feature.id}
                                  className="bg-[#F7F7F7] rounded-full px-2"
                                >
                                  {getFeatureName(feature)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Hours (now dynamic from BusinessSchedule) */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                          <img
                            src="/assets/images/clock.webp"
                            className="w-3 h-3"
                            alt="clock"
                          />
                          <span className="text-sm">
                            {getTodayScheduleLabel(business.id) ||
                              "Operating hours not specified"}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                          <img
                            src="/assets/images/location.png"
                            className="w-3 h-3"
                            alt="location"
                          />
                          <span className="text-sm">
                            {formatFullAddress(business)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredBusinesses.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No businesses found for this search.
                  </p>
                )}
              </section>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
