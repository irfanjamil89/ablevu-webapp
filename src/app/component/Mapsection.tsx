"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";

// TypeScript Interfaces
interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  active: boolean;
  latitude: number;
  longitude: number;
  phone_number: string | null;
  website: string | null;
  email: string | null;
  logo_url: string | null;
  marker_image_url: string | null;
  business_status: string | null;
}

type PlanKey = "monthly" | "yearly";

interface ApiResponse {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 51.5073509,
  lng: -0.1277589,
};

// ✅ Enhanced validation function with better error handling
const validateCoordinates = (
  lat: any,
  lng: any
): { lat: number; lng: number } | null => {
  // Check for null/undefined first
  if (lat == null || lng == null) {
    return null;
  }

  const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
  const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

  // Check if parsing resulted in valid numbers
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }
  
  // Check if they're actual numbers (not empty strings that became 0)
  if (latitude === 0 && longitude === 0) {
    return null; // Likely invalid data
  }

  // Validate ranges
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;

  // Handle swapped coordinates
  if (Math.abs(latitude) > 90 && Math.abs(longitude) <= 90) {
    return { lat: longitude, lng: latitude };
  }

  return { lat: latitude, lng: longitude };
};

// ✅ Loading Skeleton Component
const BusinessSkeleton = () => (
  <div className="w-full flex items-center gap-4 bg-white rounded-xl shadow p-3 animate-pulse">
    <div className="rounded-lg bg-gray-300 w-20 h-16" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
);

export default function Mappp() {
  // State Management
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(true);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const ITEMS_PER_PAGE = 30; // Adjust as needed

  // Old modal (login/signup)
  const [businessForModal, setBusinessForModal] = useState<Business | null>(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

  // Claim flow modals
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [claimConfirmOpen, setClaimConfirmOpen] = useState(false);
  const [addedToCartOpen, setAddedToCartOpen] = useState(false);
  const [claimBusiness, setClaimBusiness] = useState<Business | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  // Plan modal states
  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);

  // ✅ Ref to track background loading
  const backgroundLoadingRef = useRef(false);

  // ===== Helper Functions =====
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const isTokenValid = () => {
    const token = getToken();
    return (
      !!token && token !== "undefined" && token !== "null" && token.length > 10
    );
  };

  const getUserFromSession = () => {
    if (typeof window === "undefined") return null;
    const u = sessionStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  };

  const isNormalUser = () => {
    const u = getUserFromSession();
    return u?.user_role === "User";
  };

  const pad2 = (n: number) => String(n).padStart(2, "0");

  const makeOrderBatchId = () => {
    const d = new Date();
    const DD = pad2(d.getDate());
    const MM = pad2(d.getMonth() + 1);
    const YYYY = d.getFullYear();
    const HH = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    return `Order-${DD}${MM}${YYYY}${HH}${mm}`;
  };

  const getOrCreateBatchId = () => {
    const key = "claim_batch_id";
    const batch = makeOrderBatchId();
    localStorage.setItem(key, batch);
    return batch;
  };

  // ✅ Debounce search input (only for filtering, not for API calls)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Auth sync
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(isTokenValid());
    syncAuth();

    window.addEventListener("storage", syncAuth);
    const interval = setInterval(syncAuth, 1000);

    return () => {
      window.removeEventListener("storage", syncAuth);
      clearInterval(interval);
    };
  }, []);

  // ✅ Initial fetch
  useEffect(() => {
    fetchBusinesses(1);
  }, []);

  // ✅ Start background loading after totalPages is set
  useEffect(() => {
    if (totalPages > 1 && !backgroundLoadingRef.current && businesses.length === ITEMS_PER_PAGE) {
      loadRemainingPages();
    }
  }, [totalPages]);

  // ✅ Filter and validate businesses - search across multiple fields
  const filteredBusinesses = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return businesses;
    }

    const searchLower = debouncedSearch.toLowerCase().trim();
    
    return businesses.filter((business) => {
      // Search across multiple fields
      const searchableFields = [
        business.name,
        business.address,
        business.city,
        business.state,
        business.country,
        business.zipcode,
        business.description,
        business.business_status,
      ];

      return searchableFields.some(field => 
        field?.toLowerCase().includes(searchLower)
      );
    });
  }, [businesses, debouncedSearch]);

  // ✅ Filter businesses with valid coordinates for map display
  const validBusinesses = useMemo(() => {
    return filteredBusinesses
      .map((business) => {
        const coords = validateCoordinates(business.latitude, business.longitude);
        return coords
          ? { ...business, validLat: coords.lat, validLng: coords.lng }
          : null;
      })
      .filter(
        (
          business
        ): business is Business & { validLat: number; validLng: number } =>
          business !== null
      );
  }, [filteredBusinesses]);

  // ✅ Auto-fit bounds when businesses load
  useEffect(() => {
    if (map && validBusinesses.length > 0 && shouldFitBounds) {
      fitBoundsToMarkers();
    }
  }, [map, validBusinesses, shouldFitBounds]);

  // ✅ Auto-fit map when search results change
  useEffect(() => {
    if (map && validBusinesses.length > 0 && debouncedSearch) {
      // When searching, always fit bounds to show search results
      const bounds = new google.maps.LatLngBounds();
      validBusinesses.forEach((business) => {
        bounds.extend({ lat: business.validLat, lng: business.validLng });
      });
      map.fitBounds(bounds);
      
      // If only one result, zoom in more
      if (validBusinesses.length === 1) {
        setTimeout(() => map.setZoom(15), 100);
      }
    } else if (map && !debouncedSearch && validBusinesses.length > 0) {
      // When clearing search, fit to all businesses
      fitBoundsToMarkers();
    }
  }, [debouncedSearch, validBusinesses, map]);

  // ✅ Debug: Log businesses with invalid coordinates
  useEffect(() => {
    if (businesses.length > 0) {
      const invalid = businesses.filter(b => {
        const coords = validateCoordinates(b.latitude, b.longitude);
        return !coords;
      });
      
      if (invalid.length > 0) {
        console.warn(`Found ${invalid.length} businesses with invalid coordinates:`, 
          invalid.map(b => ({ 
            name: b.name, 
            lat: b.latitude, 
            lng: b.longitude 
          }))
        );
      }
    }
  }, [businesses]);

  // ✅ Fetch businesses with pagination support
  const fetchBusinesses = async (page = 1, isBackground = false) => {
    try {
      if (page === 1 && !isBackground) {
        setLoading(true);
      } else if (!isBackground) {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}business/list1?${params}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch businesses");

      const result: ApiResponse = await response.json();
      
      // Append to existing businesses or replace if first page
      setBusinesses(prev => page === 1 && !isBackground ? result.data || [] : [...prev, ...(result.data || [])]);
      setTotalPages(result.totalPages || 1);
      
      if (!isBackground) {
        setCurrentPage(page);
      }
      
      if (page === 1 && !isBackground) setShouldFitBounds(true);
      setError(null);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Fetch error:", err);
    } finally {
      if (!isBackground) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  // ✅ Load remaining pages in background
  const loadRemainingPages = async () => {
    if (backgroundLoadingRef.current) return;
    
    backgroundLoadingRef.current = true;
    setBackgroundLoading(true);
    
    console.log(`Starting background loading: Pages 2 to ${totalPages}`);
    
    try {
      // Wait a bit to let initial render complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load pages 2 to totalPages sequentially
      for (let page = 2; page <= totalPages; page++) {
        console.log(`Background loading page ${page}/${totalPages}`);
        await fetchBusinesses(page, true);
        // Small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log('Background loading complete!');
    } catch (err) {
      console.error("Background loading error:", err);
    } finally {
      setBackgroundLoading(false);
      backgroundLoadingRef.current = false;
    }
  };

  // ✅ Load more businesses (for manual loading in sidebar)
  const loadMoreBusinesses = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchBusinesses(currentPage + 1);
    }
  };

  // ✅ Backend create API hit
  const addBusinessToClaimCart = async (business: Business, plan: PlanKey) => {
    const token = getToken();
    if (!token || token === "undefined" || token === "null") {
      throw new Error("Not logged in");
    }

    const batch_id = getOrCreateBatchId();
    const amount = plan === "monthly" ? 29 : 299;

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}business-claim-cart/create`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        business_id: business.id,
        batch_id,
        amount,
        package: plan,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Failed to add to cart");
    }

    return await res.json();
  };

  // ✅ Approved Business Click Handler
  const handleApprovedBusinessClick = (business: Business) => {
    // Validate coordinates before proceeding
    const coords = validateCoordinates(business.latitude, business.longitude);
    if (!coords) {
      alert("This business location is not available on the map");
      return;
    }

    if (!isTokenValid()) {
      setBusinessForModal(business);
      return;
    }

    if (isNormalUser()) {
      setBusinessForModal(business);
      return;
    }

    setBusinessForModal(null);
    setClaimBusiness(business);
    setClaimConfirmOpen(true);
  };

  // ✅ Confirm plan selection
  const handleConfirmPlan = async (plan: PlanKey) => {
    if (!claimBusiness) return;

    try {
      setClaimLoading(true);
      await addBusinessToClaimCart(claimBusiness, plan);

      setOpenPlanModal(false);
      setClaimBusiness(null);

      window.location.href = "/checkout";
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setClaimLoading(false);
    }
  };

  // ✅ Fit map bounds to markers
  const fitBoundsToMarkers = () => {
    if (!map || validBusinesses.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    validBusinesses.forEach((business) => {
      bounds.extend({ lat: business.validLat, lng: business.validLng });
    });

    map.fitBounds(bounds);

    if (validBusinesses.length === 1) {
      setTimeout(() => map.setZoom(15), 100);
    }
  };

  // ✅ Handle business click from sidebar
  const handleBusinessClick = (business: Business) => {
    const coords = validateCoordinates(business.latitude, business.longitude);
    
    if (!coords) {
      console.warn(`Invalid coordinates for business: ${business.name}`);
      alert("This business location is not available on the map");
      return;
    }
    
    setShouldFitBounds(false);
    setSelectedBusiness(business);
    setMapCenter({ lat: coords.lat, lng: coords.lng });
    setMapZoom(15);

    if (map) {
      map.panTo({ lat: coords.lat, lng: coords.lng });
      map.setZoom(15);
    }
  };

  // ✅ Map load handler
  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  // ✅ Get marker icon based on status
  const getMarkerIcon = (isApproved: boolean) => {
    if (typeof google !== "undefined") {
      if (isApproved) {
        return {
          url: "/assets/images/lock.png",
          scaledSize: new google.maps.Size(32, 42),
          anchor: new google.maps.Point(16, 42),
        };
      }
      return {
        url: "/assets/images/marker.png",
        scaledSize: new google.maps.Size(32, 42),
        anchor: new google.maps.Point(16, 42),
      };
    }
    return undefined;
  };

  return (
    <section className="w-5/6 custom-container lg:mx-auto px-4 py-12 mt-10">
      <h1 className="font-['Helvetica'] md:text-4xl lg:text-[48px] text-4xl font-bold mb-8">
        Interactive Map
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 h-[580px] mapsection">
        {/* Map */}
        <div className="w-full lg:w-2/3 h-[580px] rounded-lg shadow overflow-hidden">
          {loading && currentPage === 1 ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50">
              <div className="text-center">
                <p className="text-red-600 font-semibold mb-2">Error loading businesses</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => fetchBusinesses(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onMapLoad}
              options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {/* ✅ Render markers only for valid businesses */}
              {validBusinesses.map((business) => {
                const isApproved =
                  business.business_status?.toLowerCase() === "approved";
                
                // Additional safety check
                if (!business.validLat || !business.validLng) {
                  return null;
                }
                
                return (
                  <Marker
                    key={business.id}
                    position={{
                      lat: business.validLat,
                      lng: business.validLng,
                    }}
                    onClick={() => {
                      // Only set if coordinates are valid
                      const coords = validateCoordinates(business.latitude, business.longitude);
                      if (coords) {
                        setSelectedBusiness(business);
                      }
                    }}
                    icon={getMarkerIcon(isApproved)}
                  />
                );
              })}

              {/* ✅ Info Window with validation */}
              {selectedBusiness &&
                (() => {
                  const coords = validateCoordinates(
                    selectedBusiness.latitude,
                    selectedBusiness.longitude
                  );
                  
                  // Return null if coordinates are invalid
                  if (!coords) return null;

                  const isApproved =
                    selectedBusiness.business_status?.toLowerCase() === "approved";
                  const isClaimed =
                    selectedBusiness.business_status?.toLowerCase() === "claimed";

                  return (
                    <InfoWindow
                      position={{ lat: coords.lat, lng: coords.lng }}
                      onCloseClick={() => setSelectedBusiness(null)}
                    >
                      <div style={{ padding: "8px", maxWidth: "250px" }}>
                        <h3
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            marginBottom: "4px",
                          }}
                        >
                          {selectedBusiness.name}
                        </h3>
                        {selectedBusiness.business_status && (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              fontSize: "12px",
                              fontWeight: "600",
                              borderRadius: "4px",
                              marginBottom: "8px",
                              backgroundColor: isApproved
                                ? "#fee2e2"
                                : "#dbeafe",
                              color: isApproved ? "#991b1b" : "#1e40af",
                            }}
                          >
                            {selectedBusiness.business_status.toUpperCase()}
                          </span>
                        )}
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            marginBottom: "8px",
                          }}
                        >
                          {selectedBusiness.address}
                        </p>
                        {selectedBusiness.phone_number && (
                          <p style={{ fontSize: "14px", color: "#4b5563" }}>
                            {selectedBusiness.phone_number}
                          </p>
                        )}
                        {isClaimed && (
                          <button
                            onClick={() => {
                              setSelectedBusiness(null);
                              window.location.href = `/business-profile/${selectedBusiness.id}`;
                            }}
                            style={{
                              backgroundColor: "#1e40b0",
                              color: "white",
                              padding: "12px 16px",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              width: "100%",
                              marginTop: "10px",
                              fontSize: "14px",
                            }}
                          >
                            View Details
                          </button>
                        )}

                        {isApproved && (
                          <button
                            onClick={() =>
                              handleApprovedBusinessClick(selectedBusiness)
                            }
                            style={{
                              backgroundColor: "#b91c1c",
                              color: "white",
                              padding: "12px 16px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              width: "100%",
                              marginTop: "8px",
                              fontSize: "14px",
                            }}
                          >
                            Claim Business
                          </button>
                        )}
                      </div>
                    </InfoWindow>
                  );
                })()}
            </GoogleMap>
          )}
        </div>

        {/* ✅ Sidebar with improved list and pagination */}
        <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-4 shadow flex flex-col font-['Helvetica'] overflow-hidden">
          {/* Search Box */}
          <div className="flex items-center bg-white border rounded-md p-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search by name, location, city, state..."
              className="w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                ✕
              </button>
            )}
          </div>

          {/* ✅ Results count with background loading indicator */}
          {!loading && businesses.length > 0 && (
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {debouncedSearch ? (
                  <>
                    Found {filteredBusinesses.length} of {businesses.length} businesses
                  </>
                ) : (
                  <>
                    Showing {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
                  </>
                )}
              </p>
              {backgroundLoading && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Loading more...</span>
                </div>
              )}
            </div>
          )}

          {/* ✅ Location List with Loading States */}
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            {loading && currentPage === 1 ? (
              <>
                <BusinessSkeleton />
                <BusinessSkeleton />
                <BusinessSkeleton />
                <BusinessSkeleton />
              </>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Failed to load businesses</p>
                <button
                  onClick={() => fetchBusinesses(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {debouncedSearch ? (
                  <>
                    <p className="text-gray-500 font-medium">No businesses found for &quot;{debouncedSearch}&quot;</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {backgroundLoading 
                        ? "Still loading more businesses..." 
                        : `Searched ${businesses.length} businesses`}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Try: city name, state, business name, or address
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500">No businesses found</p>
                  </>
                )}
              </div>
            ) : (
              <>
                {filteredBusinesses.map((business) => {
                  const isApproved =
                    business.business_status?.toLowerCase() === "approved";
                  const hasValidCoords = validateCoordinates(
                    business.latitude,
                    business.longitude
                  );

                  if (isApproved) {
                    return (
                      <div
                        key={business.id}
                        onClick={() => {
                          if (hasValidCoords) {
                            handleApprovedBusinessClick(business);
                          } else {
                            alert("This business location is not available on the map");
                          }
                        }}
                        className={`w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition text-left ${
                          hasValidCoords
                            ? "hover:bg-gray-50 cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <img
                          src={business?.logo_url || "assets/images/b-img.png"}
                          alt={business.name}
                          className="rounded-lg object-cover w-20 h-16"
                          onError={(e) => {
                            e.currentTarget.src = "assets/images/b-img.png";
                          }}
                        />

                        <div className="pe-2 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {business.name}
                            </h3>
                            <span className="px-2 py-0.5 text-xs font-semibold capitalize rounded bg-blue-100 text-blue-800">
                              {business.business_status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {business.address}
                          </p>
                          {!hasValidCoords && (
                            <span className="text-xs text-red-500 mt-1 inline-block">
                              ⚠ No map location
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={business.id}
                      onClick={() => hasValidCoords && handleBusinessClick(business)}
                      href={`/business-profile/${business.id}`}
                      className={`w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition text-left ${
                        !hasValidCoords ? "opacity-60" : "hover:bg-gray-50"
                      }`}
                    >
                      <img
                        src={business?.logo_url || "assets/images/b-img.png"}
                        alt={business.name}
                        className="rounded-lg object-cover w-20 h-16"
                        onError={(e) => {
                          e.currentTarget.src = "assets/images/b-img.png";
                        }}
                      />

                      <div className="pe-2 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {business.name}
                          </h3>
                          {business.business_status && (
                            <span className="px-2 py-0.5 text-xs font-semibold capitalize rounded bg-green-100 text-green-800">
                              {business.business_status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {business.address}
                        </p>
                        {!hasValidCoords && (
                          <span className="text-xs text-red-500 mt-1 inline-block">
                            ⚠ No map location
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}

                {/* ✅ Load More Button - Only show if not background loading and more pages available */}
                {!backgroundLoading && currentPage < totalPages && (
                  <button
                    onClick={loadMoreBusinesses}
                    disabled={loadingMore}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                  >
                    {loadingMore ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      `Load More (${currentPage}/${totalPages})`
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Claim Confirm Modal */}
      {claimConfirmOpen && claimBusiness && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setClaimConfirmOpen(false);
                setClaimBusiness(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Claim this business?
            </h3>

            <p className="text-gray-600 mb-5">
              Do you want to claim{" "}
              <span className="font-semibold">{claimBusiness.name}</span>?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setClaimConfirmOpen(false);
                  setClaimBusiness(null);
                }}
                className="px-5 py-2 rounded-full border font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setClaimConfirmOpen(false);
                  setSelectedPlan(null);
                  setOpenPlanModal(true);
                }}
                className="px-5 py-2 rounded-full bg-[#0519ce] text-white font-semibold hover:opacity-90"
              >
                Yes, continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Subscription Plan Popup */}
      {openPlanModal && claimBusiness && (
        <div className="fixed inset-0 z-[10010] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 relative">
            <button
              type="button"
              disabled={claimLoading}
              onClick={() => !claimLoading && setOpenPlanModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Choose a Subscription Plan
            </h3>

            <p className="text-center text-gray-600 mb-6">
              Claiming:{" "}
              <span className="font-semibold">{claimBusiness.name}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Plan */}
              <div
                className={`rounded-[36px] border shadow-lg relative cursor-pointer transition flex flex-col ${
                  selectedPlan === "monthly"
                    ? "ring-4 ring-blue-400"
                    : "hover:shadow-xl"
                }`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-10 py-3 rounded-full shadow">
                  Monthly
                </div>

                <div className="p-8 pt-20 flex-1">
                  <div className="text-center text-5xl font-extrabold text-gray-900 mb-8">
                    $29
                  </div>

                  <ul className="space-y-4 text-gray-700">
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 text-xl">✓</span>
                      Upload 30+ photos & videos.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 text-xl">✓</span>
                      Integrate your 360° virtual tour.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 text-xl">✓</span>
                      Answer customer questions
                    </li>
                  </ul>
                </div>

                <div className="p-6 mt-auto">
                  <button
                    type="button"
                    className="w-full rounded-full bg-white text-[#06A7E8] border-2 border-[#06A7E8] font-bold py-4 text-lg hover:bg-[#06A7E8] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmPlan("monthly");
                    }}
                    disabled={claimLoading}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>

              {/* Yearly Plan */}
              <div
                className={`rounded-[36px] shadow-lg relative cursor-pointer transition flex flex-col ${
                  selectedPlan === "yearly"
                    ? "ring-4 ring-blue-400"
                    : "hover:shadow-xl"
                }`}
                onClick={() => setSelectedPlan("yearly")}
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-10 py-3 rounded-full shadow">
                  Yearly
                </div>

                <div className="bg-[#06A7E8] text-white p-8 pt-20 flex-1 rounded-[36px]">
                  <div className="text-center text-5xl font-extrabold mb-8">
                    $299
                  </div>

                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Upload 30+ photos & videos.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Integrate your 360° virtual tour.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Answer customer questions
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Most cost-effective
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-white mt-auto rounded-b-[36px]">
                  <button
                    type="button"
                    className="w-full rounded-full bg-white text-[#06A7E8] border-2 border-[#06A7E8] font-bold py-4 text-lg hover:bg-[#06A7E8] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmPlan("yearly");
                    }}
                    disabled={claimLoading}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Fullscreen Loader */}
      {claimLoading && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3">
            <img
              src="/assets/images/favicon.png"
              className="w-12 h-12 animate-spin"
              alt="Loading"
            />
            <p className="text-gray-700 font-semibold">Processing...</p>
          </div>
        </div>
      )}

      {/* ✅ Added To Cart Modal */}
      {addedToCartOpen && claimBusiness && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl mx-4">
            <button
              onClick={() => {
                setAddedToCartOpen(false);
                setClaimBusiness(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Added to cart
                </h3>
                <p className="text-gray-600">
                  <span className="font-semibold">{claimBusiness.name}</span>{" "}
                  has been added to your claim cart.
                </p>
              </div>
            </div>

            <div className="bg-[#f0f1ff] border border-blue-200 rounded-xl p-4 mb-5">
              <p className="text-gray-700 text-sm leading-relaxed">
                Checkout now to proceed with the claim, or add another business
                to cart.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setAddedToCartOpen(false);
                  setClaimBusiness(null);
                }}
                className="px-5 py-2 rounded-full border font-semibold hover:bg-gray-50"
              >
                Add more businesses
              </button>

              <button
                onClick={() => {
                  window.location.href = "/checkout";
                }}
                className="px-5 py-2 rounded-full bg-[#0519ce] text-white font-semibold hover:opacity-90"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Login/Signup Modal for NOT logged-in */}
      {businessForModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl mx-4">
            <button
              onClick={() => setBusinessForModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Business Details
            </h2>

            <div className="flex gap-6 mb-6">
              <img
                src={businessForModal?.logo_url || "assets/images/b-img.png"}
                alt={businessForModal?.name}
                className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = "assets/images/b-img.png";
                }}
              />
              <div className="flex-1">
                <div className="mb-3">
                  <span className="text-gray-600 font-semibold">
                    Business Name:{" "}
                  </span>
                  <span className="text-gray-900">
                    {businessForModal?.name}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 font-semibold">
                    Business Address:{" "}
                  </span>
                  <span className="text-gray-900">
                    {businessForModal?.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f0f1ff] border-2 border-blue-200 rounded-lg p-5 mb-6">
              <p className="text-gray-700 text-base leading-relaxed">
                This profile is currently locked. If you are the business owner,
                please sign up or log in to claim this profile.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setOpenLoginModal(true);
                  setBusinessForModal(null);
                }}
                className="px-8 py-3 border-2 border-[#0519ce] text-[#0519ce] rounded-full font-semibold hover:bg-blue-50 transition-all text-base min-w-[140px]"
              >
                Log in
              </button>

              <button
                onClick={() => {
                  setOpenSignupModal(true);
                  setBusinessForModal(null);
                }}
                className="px-8 py-3 bg-[#0519ce] text-white rounded-full font-semibold hover:bg-[#0519ce] transition-all text-base min-w-[140px]"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      {openLoginModal && (
        <Login
          setOpenLoginModal={setOpenLoginModal}
          setOpenSignupModal={setOpenSignupModal}
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
        />
      )}
      {openSignupModal && (
        <Signup
          setOpenSignupModal={setOpenSignupModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}
      {OpenForgotPasswordModal && (
        <ForgotPassword
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}
      {openSuccessModal && (
        <Successmodal
          setOpenSuccessModal={setOpenSuccessModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSignupModal={setOpenSignupModal}
        />
      )}
    </section>
  );
}