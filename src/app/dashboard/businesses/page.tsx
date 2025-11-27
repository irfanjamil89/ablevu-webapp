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
  views: number;
  created_at: Date | string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  businessRecomendations?: any[];

  // backend relations (agar kabhi join karo)
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
type StatusFilter = "" | "draft" | "pending" | "approved" | "claimed";

type BusinessSchedule = {
  id: string;
  business: {
    id: string;
    name: string;
    // zarurat ho to extra fields bhi add kar sakte ho
  };
  day: string; // "monday", "tuesday" ...
  opening_time: string; // ISO string aa rahi hai
  closing_time: string; // ISO string aa rahi hai
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


// 🔹 Parse "street, city, ST ZIP, country" from UI
const parseFullAddress = (full?: string) => {
  if (!full) {
    return {
      address: undefined,
      city: undefined,
      state: undefined,
      zipcode: undefined,
      country: undefined,
    };
  }

  const parts = full.split(",").map((p) => p.trim());
  const street = parts[0] || undefined;
  const city = parts[1] || undefined;
  const stateZip = parts[2] || "";
  const country = parts[3] || undefined;

  let state: string | undefined;
  let zipcode: string | undefined;

  if (stateZip) {
    const match = stateZip.match(/^([A-Za-z]{2})\s+(\d+)/); // e.g. CA 90001
    if (match) {
      state = match[1];
      zipcode = match[2];
    } else {
      state = stateZip;
    }
  }

  return {
    address: street,
    city,
    state,
    zipcode,
    country,
  };
};

// ⭐ Validate each part of the parsed address
function validateParsedAddress(parsed: any) {
  if (!parsed.address) return "Please enter a complete street address.";
  if (!parsed.city) return "Please include the city in your address.";
  if (!parsed.state) return "State/Province is missing in the address.";
  if (!parsed.zipcode) return "Zip/Postal code is missing.";
  if (!parsed.country) return "Country is missing in the address.";

  return null; // Everything OK
}

// ---------- Component ----------

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

  // 🔹 Add Business form state
  const [newBusiness, setNewBusiness] = useState({
    name: "",
    fullAddress: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<BusinessSchedule[]>([]);



  const statusFilterLabel =
    statusFilter === "draft"
      ? "Draft"
      : statusFilter === "pending"
      ? "Pending Approved"
      : statusFilter === "approved"
      ? "Approved"
      : statusFilter === "claimed"
      ? "Claimed"
      : "";

  // ---------- Fetch business types & accessible features ----------

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    fetch(base + "/business-type/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        console.log("Business type list API:", data);
        setBusinessTypes(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching business types:", error);
      });

    fetch(base + "/accessible-feature/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        console.log("Accessible features API:", data);
        setFeatures(data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching features:", error);
      });

      fetch(base + "/business-schedules/list?page=1&limit=1000")
    .then((response) => response.json())
    .then((data: ScheduleListResponse) => {
      console.log("Business schedules API:", data);
      setSchedules(data.data || []);
    })
    .catch((error) => {
      console.error("Error fetching business schedules:", error);
    });
  }, []);

  // ---------- Fetch businesses (role-based filter backend pe) ----------

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    let url = base + "/business/list";

    if (appliedSearch) {
      url += `?search=${encodeURIComponent(appliedSearch)}`;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    setLoading(true);

    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log("Business list API:", data);
        const list: Business[] = data.data || [];
        // Backend already filter karega (Business / Contributor user ⇒ sirf apni)
        setBusinesses(list);
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

  // ---------- Status badge (business.business_status) ----------

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
      bg = "#D1FAE5";
      text = "#065F46";
    }

    return { label, bg, text };
  };

  // ---------- Sorting + Status filter ----------

  const sortedBusinesses = useMemo(() => {
    let arr = [...businesses];

    // 1) Status filter
    if (statusFilter) {
      arr = arr.filter((b) => {
        const status = (b.business_status || "").toLowerCase();

        switch (statusFilter) {
          case "draft":
            return status === "draft";

          case "approved":
            return (
              b.active === true &&
              !b.blocked &&
              status !== "pending" &&
              status !== "pending_approval" &&
              status !== "claimed" &&
              status !== "draft"
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
  }, [businesses, sortOption, statusFilter]);

  // Schedule Helper
  const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function getTodayKey(): string {
  const todayIndex = new Date().getDay(); 
  // 0 = Sunday ... 6 = Saturday

  // hamari API mein day lowercase string hai (monday, tuesday...)
  // isliye ek mapping bana lete hain:
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

  // aaj ka active schedule
  const todaySchedule = list.find(
    (sch) => sch.day.toLowerCase() === todayKey && sch.active,
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

  // Example: "Today: 9 AM – 6 PM"
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

  // ---------- Create business ----------

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newBusiness.name.trim()) {
      setCreateError("Business name is required.");
      return;
    }
    if (!selectedCategoryId) {
      setCreateError("Please select a business category.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      setCreateError("You must be logged in before creating a business.");
      return;
    }

    const parsed = parseFullAddress(newBusiness.fullAddress);
    const addrError = validateParsedAddress(parsed);
    if (addrError) {
      setCreateError(addrError);
      return;
    }

    const payload: any = {
      name: newBusiness.name.trim(),
      business_type: [selectedCategoryId],
      description: newBusiness.description || undefined,

      address: parsed.address,
      city: parsed.city,
      state: parsed.state,
      country: parsed.country,
      zipcode: parsed.zipcode,

      active: false,
      business_status: "draft",
    };

    try {
      setIsCreating(true);

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/business/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Create business – status:", res.status);

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Create business error:", errorBody);
        throw new Error(errorBody.message || "Failed to create business");
      }

      // List refresh (same JWT header)
      const listRes = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/business/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const listData = await listRes.json();
      const list: Business[] = listData.data || [];
      setBusinesses(list);

      setNewBusiness({ name: "", fullAddress: "", description: "" });
      setSelectedCategoryId("");

      const checkbox = document.getElementById(
        "business-toggle"
      ) as HTMLInputElement | null;
      if (checkbox) checkbox.checked = false;
    } catch (err: any) {
      setCreateError(err.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
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
                {`Business Profiles (${sortedBusinesses.length})`}
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

                    {createError && (
                      <p className="text-red-500 text-sm mb-2">
                        {createError}
                      </p>
                    )}

                    <form className="space-y-4" onSubmit={handleCreateBusiness}>
                      {/* Business Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Sample Business Name"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                          value={newBusiness.name}
                          onChange={(e) =>
                            setNewBusiness((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
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
                          placeholder="123 Main Street, Los Angeles, CA 90001, USA"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                          value={newBusiness.fullAddress}
                          onChange={(e) =>
                            setNewBusiness((prev) => ({
                              ...prev,
                              fullAddress: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* Logo upload (placeholder only) */}
                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">
                          Upload Business Logo/Photo
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".svg,.png,.jpg,.gif"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              console.log(
                                "logo file selected",
                                e.target.files?.[0]
                              );
                            }}
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
                          value={newBusiness.description}
                          onChange={(e) =>
                            setNewBusiness((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
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
                          onChange={(e) =>
                            setSelectedCategoryId(e.target.value)
                          }
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
                          disabled={isCreating}
                          className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-60"
                        >
                          {isCreating ? "Creating..." : "Create Business"}
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
                {sortedBusinesses.map((business) => {
                  const statusInfo = getStatusInfo(business);

                  return (
                    <div
                      key={business.id}
                      className="border border-gray-200 rounded-xl flex flex-col md:flex-row font-['Helvetica'] bg-white mb-4"
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
                          <img src="/assets/images/clock.webp" className="w-4 h-4" />
                            <span className="text-md text-gray-700">
                               {getTodayScheduleLabel(business.id) || "Operating hours not specified"}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-md text-gray-500 mt-2">
                          <img
                            src="/assets/images/location.png"
                            className="w-4 h-4"
                          />
                          <span className="text-md text-gray-700">
                            {formatFullAddress(business)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
