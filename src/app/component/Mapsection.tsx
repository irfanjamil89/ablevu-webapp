"use client";

import React, { useState, useEffect } from "react";
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

// Helper function to validate and parse coordinates
const validateCoordinates = (
  lat: any,
  lng: any
): { lat: number; lng: number } | null => {
  const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
  const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

  if (isNaN(latitude) || isNaN(longitude)) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;

  if (Math.abs(latitude) > 90 && Math.abs(longitude) <= 90) {
    return { lat: longitude, lng: latitude };
  }

  return { lat: latitude, lng: longitude };
};

export default function Mapsections() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(true);

  // Old modal (login/signup)
  const [businessForModal, setBusinessForModal] = useState<Business | null>(
    null
  );
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

  // ✅ Plan modal states (same like AddBusinessModal)
  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);

  // ===== Helpers =====
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

  // ✅ MOVED: Calculate filtered and valid businesses BEFORE useEffect
  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter businesses with valid coordinates for map display
  const validBusinesses = filteredBusinesses
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

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Auto-fit bounds when businesses load
  useEffect(() => {
    if (map && validBusinesses.length > 0 && shouldFitBounds) {
      fitBoundsToMarkers();
    }
  }, [map, validBusinesses, shouldFitBounds]);

  // ✅ Backend create API hit
  const addBusinessToClaimCart = async (business: Business, plan: PlanKey) => {
    const token = getToken();
    if (!token || token === "undefined" || token === "null") {
      throw new Error("Not logged in");
    }

    const batch_id = getOrCreateBatchId();

    // ✅ plan based amount (apne hisaab se set kar lena)
    const amount = plan === "monthly" ? 29 : 299;

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/business-claim-cart/create`;
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
        package: plan, // ✅ optional (backend handle kare to)
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Failed to add to cart");
    }

    return await res.json();
  };

  // ✅ Approved Business Click
  const handleApprovedBusinessClick = (business: Business) => {
    if (!isTokenValid()) {
      setBusinessForModal(business);
      return;
    }

    if (isNormalUser()) {
      setBusinessForModal(business);
      return;
    }

    setBusinessForModal(null);

    // ✅ Step-1: confirm popup
    setClaimBusiness(business);
    setClaimConfirmOpen(true);
  };

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

  const fetchBusinesses = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}business/list1`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch businesses");

      const result: ApiResponse = await response.json();
      setBusinesses(result.data || []);
      setShouldFitBounds(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  const handleBusinessClick = (business: Business) => {
    const coords = validateCoordinates(business.latitude, business.longitude);
    if (coords) {
      setShouldFitBounds(false);
      setSelectedBusiness(business);
      setMapCenter({ lat: coords.lat, lng: coords.lng });
      setMapZoom(15);

      if (map) {
        map.panTo({ lat: coords.lat, lng: coords.lng });
        map.setZoom(15);
      }
    }
  };

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

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
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-600">Loading map...</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50">
              <p className="text-red-600">Error: {error}</p>
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
              {validBusinesses.map((business) => {
                const isApproved =
                  business.business_status?.toLowerCase() === "approved";
                return (
                  <Marker
                    key={business.id}
                    position={{
                      lat: business.validLat,
                      lng: business.validLng,
                    }}
                    onClick={() => setSelectedBusiness(business)}
                    icon={getMarkerIcon(isApproved)}
                  />
                );
              })}

              {selectedBusiness &&
                (() => {
                  const coords = validateCoordinates(
                    selectedBusiness.latitude,
                    selectedBusiness.longitude
                  );
                  if (!coords) return null;

                  const isApproved =
                    selectedBusiness.business_status?.toLowerCase() ===
                    "approved";
                  const isClaimed =
                    selectedBusiness.business_status?.toLowerCase() ===
                    "claimed";

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
                              setSelectedBusiness(null); // popup close (optional)
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

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-4 shadow flex flex-col font-['Helvetica']">
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
              placeholder="Search Business..."
              className="w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location List */}
          <div className="space-y-4 overflow-y-auto pr-2">
            {loading ? (
              <p className="text-center text-gray-500 py-4">
                Loading businesses...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">
                Failed to load businesses
              </p>
            ) : filteredBusinesses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No businesses found
              </p>
            ) : (
              filteredBusinesses.map((business) => {
                const isApproved =
                  business.business_status?.toLowerCase() === "approved";

                if (isApproved) {
                  return (
                    <div
                      key={business.id}
                      onClick={() => handleApprovedBusinessClick(business)}
                      className="w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50 text-left cursor-pointer"
                    >
                      <img
                        src={business?.logo_url || "assets/images/b-img.png"}
                        alt={business.name}
                        className="rounded-lg object-cover w-20 h-16"
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
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={business.id}
                    onClick={() => handleBusinessClick(business)}
                    href={`/business-profile/${business.id}`}
                    className="w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50 text-left"
                  >
                    <img
                      src={business?.logo_url || "assets/images/b-img.png"}
                      alt={business.name}
                      className="rounded-lg object-cover w-20 h-16"
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
                    </div>
                  </Link>
                );
              })
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
              {/* Cancel */}
              <button
                onClick={() => {
                  setClaimConfirmOpen(false);
                  setClaimBusiness(null); // ✅ back to normal
                }}
                className="px-5 py-2 rounded-full border font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>

              {/* Yes -> open plan */}
              <button
                onClick={() => {
                  setClaimConfirmOpen(false);
                  setSelectedPlan(null);
                  setOpenPlanModal(true); // ✅ now show subscription plans
                }}
                className="px-5 py-2 rounded-full bg-[#0519ce] text-white font-semibold hover:opacity-90"
              >
                Yes, continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Subscription Plan Popup (Mapsections) */}
      {openPlanModal && claimBusiness && (
        <div className="fixed inset-0 z-[10010] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-1xl p-6 relative">
            <button
              type="button"
              disabled={claimLoading}
              onClick={() => !claimLoading && setOpenPlanModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
              {/* Monthly */}
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

              {/* Yearly */}
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

      {/* ✅ Fullscreen loader */}
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

      {/* ✅ Old Login/Signup Modal for NOT logged-in */}
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
