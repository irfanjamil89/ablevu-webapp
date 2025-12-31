"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import GoogleAddressInput from "@/app/component/GoogleAddressInput";
import Link from "next/link";
import AddBusinessModal from "@/app/component/AddBusinessModal";

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
  owner?: { id: string };
  creator?: { id: string };
};

type NewBusinessForm = {
  name: string;
  fullAddress: string;
  description: string;
  place_id?: string;
  latitude?: number;
  longitude?: number;
  city: string;
  state: string;
  country: string;
  zipcode: string;
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
type StatusFilter =
  | ""
  | "draft"
  | "pending approval"
  | "approved"
  | "pending acclaim"
  | "claimed";


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

// ---------- Address helper ----------

function extractAddressParts(result: { address_components?: any[] }) {
  const components = result.address_components || [];

  const find = (type: string) =>
    components.find((c: any) => c.types.includes(type))?.long_name || "";

  const city =
    find("locality") ||
    find("postal_town") ||
    find("sublocality") ||
    find("administrative_area_level_2");

  const state = find("administrative_area_level_1");
  const country = find("country");
  const zipcode = find("postal_code");

  return { city, state, country, zipcode };
}

// 🔹 status normalize helper (same across app)
const normalizeStatus = (status?: string | null) =>
  (status || "").toLowerCase().trim().replace(/[\s_-]+/g, " ");

// ---------- Component ----------

export default function Page() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [newBusiness, setNewBusiness] = useState<NewBusinessForm>({
    name: "",
    fullAddress: "",
    description: "",
    place_id: undefined,
    latitude: undefined,
    longitude: undefined,
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const [OpenAddBusinessModal, setOpenAddBusinessModal] = useState(false);


  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<BusinessSchedule[]>([]);

  const statusFilterLabel =
  statusFilter === "draft"
    ? "Draft"
    : statusFilter === "pending approval"
    ? "Approval Request"
    : statusFilter === "approved"
    ? "Approved"
    : statusFilter === "pending acclaim"
    ? "Pending Acclaim"
    : statusFilter === "claimed"
    ? "Claimed"
    : "";


  // ---------- Fetch business types & accessible features ----------

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    fetch(base + "/business-type/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        
        setBusinessTypes(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching business types:", error);
      });

    fetch(base + "/accessible-feature/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        
        setFeatures(data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching features:", error);
      });

    fetch(base + "/business-schedules/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data: ScheduleListResponse) => {
        
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
        
        const list: Business[] = data.data || [];
        setBusinesses(list);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appliedSearch]);

  const fetchBusinesses = useCallback(async (search: string) => {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        let url = base + "/business/list";
    
        if (search) {
          url += `?search=${encodeURIComponent(search)}`;
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
    
        try {
          const response = await fetch(url, { headers });
          const data = await response.json();
          
          const list: Business[] = data.data || [];
          setBusinesses(list);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }, []);
    
      // fetch on first load + whenever appliedSearch changes
      useEffect(() => {
        fetchBusinesses(appliedSearch);
      }, [appliedSearch, fetchBusinesses]);
    
      // ---------- Callback for modal to refresh list ----------
    
      const handleBusinessCreated = () => {
        // re-fetch businesses with current search filter
        fetchBusinesses(appliedSearch);
      };
  

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

  // ---------- Status badge (business.business_status) ----------

  type StatusKey =
  | "draft"
  | "pending approval"
  | "approved"
  | "pending acclaim"
  | "claimed";

const STATUS_BADGE: Record<
  StatusKey,
  { label: string; bg: string; text: string }
> = {
  draft: { label: "Draft", bg: "#FFF3CD", text: "#C28A00" },
  "pending approval": {
    label: "Pending Approval",
    bg: "#FFEFD5",
    text: "#B46A00",
  },
  approved: { label: "Approved", bg: "#e3f1ff", text: "#1e429e" },
  "pending acclaim": {
    label: "Pending Acclaim",
    bg: "#EEF2FF",
    text: "#3730A3",
  },
  claimed: { label: "Claimed", bg: "#dff7ed", text: "#03543f" },
};

const toCanonicalStatus = (raw: string, b: Business): StatusKey | null => {
  const s = normalizeStatus(raw);

  // backend aliases
  if (s === "pending" || s === "pending approved") return "pending approval";
  if (s === "pending acclaim" || s === "pending claim") return "pending acclaim";

  if (s === "draft") return "draft";
  if (s === "pending approval") return "pending approval";
  if (s === "approved") return "approved";
  if (s === "claimed") return "claimed";

  // fallback: empty status but active + not blocked
  if ((!s || s === "active") && b.active === true && !b.blocked) {
    return "approved";
  }

  return null;
};

const getStatusInfo = (b: Business) => {
  const canonical = toCanonicalStatus(b.business_status || "", b);
  if (!canonical) return { label: "", bg: "", text: "" };
  return STATUS_BADGE[canonical];
};


  // ---------- Sorting + Status filter ----------

  const sortedBusinesses = useMemo(() => {
    let arr = [...businesses];

    if (statusFilter) {
  arr = arr.filter((b) => {
    const canonical = toCanonicalStatus(b.business_status || "", b);

    switch (statusFilter) {
      case "draft":
        return canonical === "draft";

      case "pending approval":
        return canonical === "pending approval";

      case "approved":
        return canonical === "approved";

      case "pending acclaim":
        return canonical === "pending acclaim";

      case "claimed":
        return canonical === "claimed";

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

  useEffect(() => {
  const t = setTimeout(() => {
    setAppliedSearch(searchTerm.trim());
    setCurrentPage(1);
  }, 350);

  return () => clearTimeout(t);
}, [searchTerm]);


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
    if (!newBusiness.fullAddress.trim()) {
      setCreateError("Please select address using Google search.");
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

    const payload = {
      name: newBusiness.name.trim(),
      business_type: [selectedCategoryId],
      description: newBusiness.description || "",

      address: newBusiness.fullAddress,
      place_id: newBusiness.place_id,
      latitude: newBusiness.latitude,
      longitude: newBusiness.longitude,

      city: newBusiness.city || "",
      state: newBusiness.state || "",
      country: newBusiness.country || "",
      zipcode: newBusiness.zipcode || "",

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

     

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Create business error:", errorBody);
        throw new Error(errorBody.message || "Failed to create business");
      }

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

      setNewBusiness({
        name: "",
        fullAddress: "",
        description: "",
        place_id: undefined,
        latitude: undefined,
        longitude: undefined,
        city: "",
        state: "",
        country: "",
        zipcode: "",
      });
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
      <div className=" w-full flex justify-center items-center h-[400px]">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }

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

  // ---------- UI ----------

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">
          <div className="w-full min-h-screen bg-white px-6 py-5">
            {/* Header */}
            <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                {`My Business Profiles (${sortedBusinesses.length})`}
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

                {/* Business Status (agar chahiye to uncomment kar sakte ho, logic ab same hai)
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
                          onClick={() => setStatusFilter("pending")}
                          className="w-full text-left block px-3 py-1 hover:bg-gray-100"
                        >
                          Approval Request
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
                */}

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
                  />
                </div>

                {/* Modal toggle */}
                {/* <input
                  type="checkbox"
                  id="business-toggle"
                  className="hidden peer"
                /> */}
                 <button
                  onClick={()=> setOpenAddBusinessModal(true)}
                  className="px-4 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Add Business
                </button>

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

                        <GoogleAddressInput
                          value={newBusiness.fullAddress}
                          onChangeText={(text) =>
                            setNewBusiness((prev) => ({
                              ...prev,
                              fullAddress: text,
                            }))
                          }
                          onSelect={(result) => {
                            

                            const { city, state, country, zipcode } =
                              extractAddressParts(result);

                            setNewBusiness((prev) => ({
                              ...prev,
                              fullAddress: result.formatted_address,
                              place_id: result.place_id,
                              latitude: result.lat,
                              longitude: result.lng,
                              city,
                              state,
                              country,
                              zipcode,
                            }));
                          }}
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
                {currentbusiness.map((business) => {
                  const statusInfo = getStatusInfo(business);

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
                          {(() => {
                            const list = business.accessibilityFeatures || [];
                            const count = list.length;

                            if (count === 0) return <li>No features</li>;

                            // Only first 2 items
                            const firstTwo = list.slice(0, 2);

                            return (
                              <>
                                {firstTwo.map((feature) => (
                                  <li
                                    key={feature.id}
                                    className="bg-[#F7F7F7] text-gray-700 rounded-full px-2"
                                  >
                                    {getFeatureName(feature)}
                                  </li>
                                ))}

                                {count > 2 && (
                                  <li className="bg-[#F7F7F7] text-gray-700 rounded-full px-2">
                                    +{count - 2} 
                                  </li>
                                )}
                              </>
                            );
                          })()}
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
              {!loading && sortedBusinesses.length > 0 && (
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
            </section>
          </div>
        </div>
      </div>
      {OpenAddBusinessModal && (
                    <AddBusinessModal
                      setOpenAddBusinessModal={setOpenAddBusinessModal}
                      onBusinessCreated={() => {}}
                    />
                  )}
    </div>
  );
}
