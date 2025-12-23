"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "../component/Header2";
import Footer from "../component/Footer";
import Link from "next/link";


// --------- TYPES ---------
type BusinessTypeMaster = {
  id: string;
  name: string;
};

type AccessibleFeatureMaster = {
  id: string;
  title: string;
};

type LinkedType = {
  id: string;
  business_type_id: string;
};

type BusinessAccessibilityFeature = {
  id: string;
  accessible_feature_id: string;
  accessible_feature?: {
    id: string;
    title: string;
  };
};

type BusinessScheduleItem = {
  id: string;
  day: string;
  opening_time_text: string;
  closing_time_text: string;
  active: boolean;
};

type Business = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  business_status: string | null;
  views: number;
  logo_url?: string | null;
  linkedTypes: LinkedType[];
  accessibilityFeatures: BusinessAccessibilityFeature[];
  businessSchedule: BusinessScheduleItem[];
  businessRecomendations: any[];
};

type BusinessListApiResponse = {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type AccessibleFeatureListResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: AccessibleFeatureMaster[];
};

// ---------- PAGE ----------
export default function Page() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeMaster[]>([]);
  const [featureMaster, setFeatureMaster] = useState<AccessibleFeatureMaster[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Selected filters (multi-select)
  const [selectedBusinessTypeIds, setSelectedBusinessTypeIds] = useState<string[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);

  // ---------- FETCHERS ----------

  const fetchBusinessTypes = async () => {
    if (!API_BASE_URL) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/business-type/list?page=1&limit=1000`
      );
      const json = await res.json();
      setBusinessTypes(json.data || []);
    } catch (err) {
      console.error("business-type/list error", err);
    }
  };

  const fetchFeatureMaster = async () => {
    if (!API_BASE_URL) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/accessible-feature/list?page=1&limit=1000`
      );
      const json: AccessibleFeatureListResponse = await res.json();
      setFeatureMaster(json.items || []);
    } catch (err) {
      console.error("accessible-feature/list error", err);
    }
  };

  // 🔹 Business list — ab filters ke sath
  const fetchBusinesses = async () => {
    if (!API_BASE_URL) return;

    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/business/list1?page=1&limit=1000`;

      if (selectedBusinessTypeIds.length) {
        url += `&businessTypeIds=${encodeURIComponent(
          selectedBusinessTypeIds.join(",")
        )}`;
      }

      if (selectedFeatureIds.length) {
        url += `&featureIds=${encodeURIComponent(
          selectedFeatureIds.join(",")
        )}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load businesses");

      const json: BusinessListApiResponse = await res.json();
      setBusinesses(json.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial load: sirf masters (types + features)
  useEffect(() => {
    if (!API_BASE_URL) return;
    Promise.all([fetchBusinessTypes(), fetchFeatureMaster()]).catch((e) =>
      console.error(e)
    );
  }, [API_BASE_URL]);

  // 🔹 Business list load + har filter change pe re-fetch
  useEffect(() => {
    if (!API_BASE_URL) return;
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, selectedBusinessTypeIds, selectedFeatureIds]);

  // ---------- MAPS for ID → NAME/TITLE ----------

  const typeNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    businessTypes.forEach((t) => {
      map[t.id] = t.name;
    });
    return map;
  }, [businessTypes]);

  const featureTitleMap = useMemo(() => {
    const map: Record<string, string> = {};
    featureMaster.forEach((f) => {
      map[f.id] = f.title;
    });
    return map;
  }, [featureMaster]);

  // ---------- HELPERS ----------

  const getStatusClass = (status?: string | null) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "bg-[#ECFDF3] text-[#039855]";
    if (s === "pending" || s === "pending approved")
      return "bg-[#FFF4E0] text-[#A65C00]";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusText = (status?: string | null) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getScheduleText = (b: Business): string => {
    if (!b.businessSchedule || !b.businessSchedule.length)
      return "Operating hours not specified";

    const active =
      b.businessSchedule.find((s) => s.active) ?? b.businessSchedule[0];

    if (active.opening_time_text && active.closing_time_text) {
      return `${active.opening_time_text} - ${active.closing_time_text}`;
    }

    return "Operating hours not specified";
  };

  const getAddress = (b: Business): string => {
    if (b.address) return b.address;
    const parts = [b.city, b.state, b.country].filter(Boolean);
    if (parts.length) return parts.join(", ");
    return "Address not specified";
  };

  const getCategoryNames = (b: Business): string[] => {
    if (!b.linkedTypes?.length) return [];
    return b.linkedTypes
      .map((lt) => typeNameMap[lt.business_type_id])
      .filter(Boolean);
  };

  const getFeatureTitles = (b: Business): string[] => {
    if (!b.accessibilityFeatures?.length) return [];
    return b.accessibilityFeatures
      .map(
        (af) =>
          af.accessible_feature?.title ||
          featureTitleMap[af.accessible_feature_id]
      )
      .filter(Boolean);
  };

  // ---------- FILTER TOGGLE HANDLERS ----------

  const toggleBusinessType = (id: string) => {
    setSelectedBusinessTypeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedBusinessTypeIds([]);
    setSelectedFeatureIds([]);
  };

  return (
    <div>
      <Header />
      <div className="bg-[#F7f7f7] py-4">
        <main className="bg-white px-3 lg:rounded-full lg:px-6 lg:py-4 md:px-2 md:bg-transparent mx-auto p-4 flex flex-col lg:flex-row gap-6 mt-4">
          {/* LEFT – FILTERS */}
          <aside className="w-full xxl:w-1/6 xl:w-1/5 lg:w-1/4 h-fit space-y-6">
            <div className="bg-[#F0F1FF] rounded-2xl p-5 space-y-6 font-['Helvetica']">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg mb-2">
                  Filter Results ({businesses.length})
                </h2>
                {(selectedBusinessTypeIds.length > 0 ||
                  selectedFeatureIds.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-700 underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category – dynamic from business-type/list */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 text-md tracking-wide">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2 font-['Helvetica']">
                  {businessTypes.length ? (
                    businessTypes.map((type) => {
                      const isSelected = selectedBusinessTypeIds.includes(
                        type.id
                      );
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => toggleBusinessType(type.id)}
                          className={`text-sm text-left px-3 py-1 rounded-full border transition ${
                            isSelected
                              ? "bg-[#0519CE] text-white border-[#0519CE]"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                          }`}
                        >
                          {type.name}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-500">
                      No categories found.
                    </span>
                  )}
                </div>
              </div>

              {/* Accessible Features – dynamic from accessible-feature/list */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 text-md tracking-wide">
                  Accessible Features
                </h3>
                <ul className="space-y-2 text-sm font-['Helvetica'] overflow-y-auto max-h-40 pr-2">
                  {featureMaster.length ? (
                    featureMaster.map((f) => {
                      const isChecked = selectedFeatureIds.includes(f.id);
                      return (
                        <li key={f.id}>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="accent-blue-700"
                              checked={isChecked}
                              onChange={() => toggleFeature(f.id)}
                            />
                            {f.title}
                          </label>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-xs text-gray-500">
                      No accessible features found.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 font-['Helvetica']">
              <h3 className="font-bold text-gray-800 text-md mb-2">
                Looking for a specific business?
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                If you&apos;re looking for a specific business and cannot find it
                on AbleVu yet, let us know and we will get it added.
              </p>
              <button className="w-1/3 bg-blue-700 text-white text-sm py-2 rounded-full hover:bg-blue-800 transition">
                Contact Us
              </button>
            </div>
          </aside>

          {/* RIGHT – BUSINESS LIST */}
          <section className="flex-1">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="font-bold text-[24px] font-['Helvetica']">
                Business List
              </h2>
              <button className="flex items-center justify-between gap-[8px] text-sm bg-white px-3 py-2 rounded-full text-black">
                <img src="/assets/images/location.png" className="w-3 h-3" />{" "}
                Search with Map
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Loading businesses...
              </div>
            ) : businesses.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                No businesses found.
              </div>
            ) : (
              <section className="space-y-10 lg:space-y-4 md:space-y-4">
                {businesses.map((b) => {
                  const categories = getCategoryNames(b);
                  const featureTitles = getFeatureTitles(b);

                  return (
                    <Link
                      key={b.id}
                      href={`/business-profile/${b.id}`}
                      className="rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]"
                    >
                      {/* IMAGE / STATUS */}
                      <div
                        className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                        style={{
                          backgroundImage: b.logo_url
                            ? `url('${b.logo_url}')`
                            : "url('/assets/images/search-1.jpg')",
                        }}
                      >
                        <span
                          className={`absolute md:-top-6 top-5 md:right-2 right-14 text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm ${getStatusClass(
                            b.business_status
                          )}`}
                        >
                          {getStatusText(b.business_status)}
                        </span>
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 bg-white p-4 ps-6 space-y-4">
                        <div className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                          <h3 className="font-semibold text-xl">{b.name}</h3>

                          <div className="flex flex-wrap md:flex-nowrap gap-2">
                            {/* Saved dummy */}
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
                              {b.views}.0 Views
                            </button>

                            {/* Recommendations count */}
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
                              {b.businessRecomendations.length}.0 Recommendations
                            </button>
                          </div>
                        </div>

                        {/* Categories – names only, no UUID */}
                        <div className="flex text-sm">
                          <span className="font-medium pe-2">Categories</span>
                          <ul className="flex flex-wrap md:flex-nowrap space-x-2">
                            {categories.length ? (
                              categories.map((cat) => (
                                <li
                                  key={cat}
                                  className="bg-[#F7F7F7] rounded-full px-2"
                                >
                                  {cat}
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-gray-500">
                                No categories
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Accessible Features – titles only, no UUID */}
                        <div className="text-xs text-gray-500 mt-2">
                          <div className="flex flex-wrap md:gap-0 gap-2">
                            <span className="font-medium pe-2">
                              Accessible Features
                            </span>
                            <ul className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                              {featureTitles.length ? (
                                featureTitles.map((ft) => (
                                  <li
                                    key={ft}
                                    className="bg-[#F7F7F7] rounded-full px-2"
                                  >
                                    {ft}
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-400">
                                  No features added
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Operating hours */}
                        <p className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                          <img
                            src="/assets/images/clock.webp"
                            className="w-3 h-3"
                            alt="clock"
                          />
                          <span className="text-sm">
                            {getScheduleText(b)}
                          </span>
                        </p>

                        {/* Location */}
                        <p className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                          <img
                            src="/assets/images/location.png"
                            className="w-3 h-3"
                            alt="location"
                          />
                          <span className="text-sm">{getAddress(b)}</span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </section>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
