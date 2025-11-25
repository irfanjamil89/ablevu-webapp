"use client";
import React, { useState, useEffect, useMemo } from "react";

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
  created_at: Date;
};

type BusinessType = {
  id: string;
  name: string;
};

// 🔹 ONE record from /accessible-feature/list
type FeatureType = {
  id: string;
  title: string;
  slug: string;
};

type SortOption = "" | "name-asc" | "name-desc" | "created-asc" | "created-desc";

type StatusFilter = "" | "archived" | "pending" | "approved" | "claimed";

export default function Business() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const statusFilterLabel =
    statusFilter === "archived"
      ? "Archived"
      : statusFilter === "pending"
      ? "Pending Approved"
      : statusFilter === "approved"
      ? "Approved"
      : statusFilter === "claimed"
      ? "Claimed"
      : "";

  // ---------- Fetch data ----------

  useEffect(() => {
    // Fetch business types
    fetch("https://staging-api.qtpack.co.uk/business-type/list")
      .then((response) => response.json())
      .then((data) => {
        setBusinessTypes(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching business types:", error);
      });

    // Fetch accessibility FEATURES 
    fetch("https://staging-api.qtpack.co.uk/accessible-feature/list")
      .then((response) => response.json())
      .then((data) => {
        console.log("Accessible features API:", data);
        setFeatures(data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching features:", error);
      });

    // Initial business list
    fetch("https://staging-api.qtpack.co.uk/business/list")
      .then((response) => response.json())
      .then((data) => {
        console.log("Business list API:", data);
        setBusinesses(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);

    const url = appliedSearch
      ? `https://staging-api.qtpack.co.uk/business/list?search=${encodeURIComponent(
          appliedSearch
        )}`
      : "https://staging-api.qtpack.co.uk/business/list";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Business list API:", data);
        setBusinesses(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appliedSearch]);

  // ---------- Maps (ID -> Name) ----------

  const businessTypesMap = useMemo(() => {
    const map: Record<string, string> = {};
    businessTypes.forEach((bt) => {
      if (!bt.name) return;
      map[bt.id] = bt.name.trim();
=======
useEffect(() => {
  // Fetch business types
  fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/business-type/list')
    .then(response => response.json())
    .then(data => {
      setBusinessTypes(data.data);
    })
    .catch((error) => {
      console.error('Error fetching business types:', error);
    });

  // Fetch accessibility features
  fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/accessible-feature-types/list')
    .then(response => response.json())
    .then(data => {
      setFeatures(data.data);
    })
    .catch((error) => {
      console.error('Error fetching features:', error);
    });

  // Fetch business list
  fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/business/list')
    .then(response => response.json())
    .then(data => {
      setBusinesses(data.data); // Set the businesses data
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setLoading(false); // Hide loading spinner
    });
    return map;
  }, [businessTypes]);

  const featuresMap = useMemo(() => {
    const map: Record<string, string> = {};
    features.forEach((f) => {
      const raw = f.title ?? "";
      if (typeof raw === "string" && raw.length > 0) {
        map[f.id] = raw.trim();
      }
    });
    return map;
  }, [features]);

  // ---------- Sorting + Status filter ----------

  const sortedBusinesses = useMemo(() => {
    let arr = [...businesses];

    // 1) Status filter
    if (statusFilter) {
      arr = arr.filter((b) => {
        const status = (b.business_status || "").toLowerCase();

        switch (statusFilter) {
          case "archived":
            return b.active === false || b.blocked === true || status === "archived";

          case "approved":
            return (
              b.active === true &&
              !b.blocked &&
              status !== "pending" &&
              status !== "pending_approval" &&
              status !== "claimed" &&
              status !== "archived"
            );

          case "pending":
            return status === "pending" || status === "pending_approval";

          case "claimed":
            return status === "claimed";

          default:
            return true;
        }
      });
    }

    // 2) Sort
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
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "created-desc":
        arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      default:
        break;
    }

    return arr;
  }, [businesses, sortOption, statusFilter]);

  // ---------- Helpers ----------

  const getBusinessTypeName = (type: LinkedType) => {
    if (type.name) return type.name.trim();
    
    const fromMap = businessTypesMap[type.business_type_id];
    if (fromMap) return fromMap;

    console.warn(
      "Business type id not found in businessTypes:",
      type.business_type_id,
      businessTypes
    );
    return type.business_type_id;
  };

  const getFeatureName = (feature: AccessibilityFeature) => {
    if (feature.title) return feature.title.trim();
    if (feature.name) return feature.name.trim();
    if (feature.feature_name) return feature.feature_name.trim();
    if (feature.label) return feature.label.trim();
    if (feature.featureType?.name) return feature.featureType.name.trim();

    const fromMap = featuresMap[feature.accessible_feature_id];
    if (fromMap) return fromMap;

    console.warn(
      "Accessible feature id not found in features:",
      feature.accessible_feature_id,
      features
    );
    return feature.accessible_feature_id;
  };

  // ---------- Loading state ----------

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  // ---------- UI ----------
  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">
          <div className="w-full min-h-screen bg-white px-6 py-5">
            {/* Header */}
            <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                All Business Profiles (383)
              </h1>

              {/* Controls */}
              <div className="flex flex-wrap gap-y-4 items-center gap-3">
                {/* Clear All */}
                <div className="relative inline-block text-left">
                  <div
                    className="text-md text-gray-500 cursor-pointer"
                    onClick={() => {
                      setSearchTerm("");
                      setAppliedSearch("");
                      setSortOption("");
                      setStatusFilter("");
                    }}
                  >
                    Clear All
                  </div>
                </div>

                {/* Sort By */}
                <div className="relative inline-block text-left">
                  {/* Toggle */}
                  <input
                    type="checkbox"
                    id="sort-by-toggle"
                    className="hidden peer"
                  />

                  {/* Trigger */}
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

                  {/* Click outside to close */}
                  <label
                    htmlFor="sort-by-toggle"
                    className="hidden peer-checked:block fixed inset-0 z-10"
                  ></label>

                  {/* Dropdown */}
                  <div className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[200px]">
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
                <div className="relative inline-block text-left">
                  {/* toggle */}
                  <input
                    type="checkbox"
                    id="business-status-toggle"
                    className="hidden peer"
                  />

                  {/* label with current filter */}
                  <label
                    htmlFor="business-status-toggle"
                    className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-3 rounded-md hover:border-[#0519CE] cursor-pointer w-auto lg:w-[150px] transition-all duration-200"
                  >
                    <span className="flex items-center">
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

                  {/* click outside to close */}
                  <label
                    htmlFor="business-status-toggle"
                    className="hidden peer-checked:block fixed inset-0 z-10"
                  ></label>

                  {/* dropdown */}
                  <div className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[200px]">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          type="button"
                          onClick={() => setStatusFilter("archived")}
                          className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                        >
                          Archived
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setStatusFilter("pending")}
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
                      }
                    }}
                  />
                </div>

                {/* Modal toggle */}
                <input
                  type="checkbox"
                  id="business-toggle"
                  className="hidden peer"
                />
                <label
                  htmlFor="business-toggle"
                  className="px-4 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Add Business
                </label>

                {/* Modal */}
                <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[480px] p-6 relative">
                    <label
                      htmlFor="business-toggle"
                      className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                    >
                      ×
                    </label>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                      Add New Business
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      This business will remain locked until it has been
                      claimed by the business. Please submit to admin for
                      approval.
                    </p>

                    <form className="space-y-4">
                      {/* Business Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Sample Business Name"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                        />
                      </div>

                      {/* Business Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Address{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="123 Main Street, Anytown, CA 91234"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                        />
                      </div>

                      {/* Logo upload */}
                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">
                          Upload Business Logo/Photo
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".svg,.png,.jpg,.gif"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text:center hover:bg-gray-50 cursor-pointer h-fit">
                            <img
                              src="/assets/images/upload-icon.avif"
                              alt="upload-icon"
                              className="w-10 h-10"
                            />
                            <p className="text-[#0519CE] font-semibold text-sm">
                              Click to upload{" "}
                              <span className="text-gray-500 text-xs">
                                or drag and drop
                              </span>
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              SVG, PNG, JPG or GIF (max. 800×400px)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Write a short description..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                        ></textarea>
                      </div>

                      {/* Category select */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Categories{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                          value={selectedCategoryId}
                          onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {businessTypes.map((bt) => (
                            <option key={bt.id} value={bt.id}>
                              {bt.name.trim()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-center gap-3 pt-2">
                        <label
                          htmlFor="business-toggle"
                          className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
                        >
                          Cancel
                        </label>
                        <button
                          type="submit"
                          className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700"
                        >
                          Create Business
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Business cards */}
            <section>
              <div>
                {sortedBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="border border-gray-200 rounded-xl flex flex-col md:flex-row font-['Helvetica'] bg-white"
                  >
                    {/* Left image */}
                    <div
                      className="relative flex items-center justify-center w-full sm:h-[180px] md:h-auto md:w-[220px] shadow-sm bg-[#E5E5E5] bg-contain bg-center bg-no-repeat opacity-95"
                      style={{
                        backgroundImage: `url(${
                          business.logo_url || "/assets/images/b-img.png"
                        })`,
                      }}
                    >
                      <span
                        className={`absolute top-3 md:right-2 right-14 text-sm font-semibold px-2 py-1 rounded-md shadow-sm 
                          ${
                            business.active
                              ? "bg-[#E8FDEB] text-[#2ECC71]"
                              : "bg-[#FDE8E8] text-[#F03E3E]"
                          }`}
                      >
                        {business.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Right content */}
                    <div className="flex-1 justify-between bg-white py-3 ps-5 space-y-5">
                      <div className="flex flex-wrap space-y-4 md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-2xl">
                          {business.name}
                        </h3>
                        <div className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                          {/* Saved */}
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
                            0 Views
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
                            0 Recommendations
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
                      <div className="text-md text-gray-500 mt-2">
                        <div className="flex flex-wrap md:gap-0 gap-2">
                          <span className="font-medium text-gray-500 pe-2">
                            Accessible Features
                          </span>
                          <ul className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                            {business.accessibilityFeatures.map((feature) => (
                              <li
                                key={feature.id}
                                className="bg-[#F7F7F7] text-gray-700 rounded-full px-2"
                              >
                                {getFeatureName(feature)}
                              </li>
                            ))}
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
                          Operating hours not specified
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
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
