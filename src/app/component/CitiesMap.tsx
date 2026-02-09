"use client";

import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";

// TypeScript Interfaces
interface City {
  id: string;
  city_name: string;
  featured: boolean;
  latitude: string | number | null;
  longitude: string | number | null;
  display_order: number | null;
  picture_url: string | null;
  slug: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
  businessCount: number;
}

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
  blocked: boolean;
  business_status: string;
  subscription: string | null;
  views: number;
  website: string | null;
  email: string | null;
  phone_number: string | null;
  facebook_link: string | null;
  instagram_link: string | null;
  logo_url: string | null;
  marker_image_url: string | null;
  place_id: string;
  latitude: string;
  longitude: string;
  claimed_fee: string | null;
  external_id: string | null;
  promo_code: string | null;
  accessible_city_id: string;
  created_at: string;
  modified_at: string;
}

interface CityDetailResponse {
  id: string;
  city_name: string;
  featured: boolean;
  latitude: string;
  longitude: string;
  display_order: number | null;
  picture_url: string | null;
  slug: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
  businessCount: number;
  businesses: Business[];
  businessesMeta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

interface ApiResponse {
  items: City[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '580px'
};

const defaultCenter = {
  lat: 37.0902,
  lng: -95.7129
};

export default function CitiesMap() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<'cities' | 'businesses'>('cities');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [loadingBusinesses, setLoadingBusinesses] = useState<boolean>(false);
  const [currentCityName, setCurrentCityName] = useState<string>('');

  // Auth modals
  const [businessForModal, setBusinessForModal] = useState<Business | null>(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

  // Claim flow
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [claimConfirmOpen, setClaimConfirmOpen] = useState(false);
  const [addedToCartOpen, setAddedToCartOpen] = useState(false);
  const [claimBusiness, setClaimBusiness] = useState<Business | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  const DEFAULT_IMAGE = "https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=256,h=181,f=auto,dpr=0.75,fit=cover,q=75/f1744979714205x630911143129575800/Untitled%20design%20%2829%29.png";
  const DEFAULT_BUSINESS_IMAGE = "https://via.placeholder.com/128x96?text=Business";

  // Helper functions
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

  const addBusinessToClaimCart = async (business: Business) => {
    const token = getToken();
    if (!token || token === "undefined" || token === "null") {
      throw new Error("Not logged in");
    }

    const batch_id = getOrCreateBatchId();

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
        amount: 100.0,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Failed to add to cart");
    }

    return await res.json();
  };

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
    setClaimBusiness(business);
    setClaimConfirmOpen(true);
  };

  // Filter cities with search term
  const filteredCities = cities.filter((city) =>
    city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter businesses with search term
  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter cities with valid coordinates
  const validCities = filteredCities
    .map(city => ({
      ...city,
      latitude: city.latitude ? parseFloat(city.latitude.toString()) : null,
      longitude: city.longitude ? parseFloat(city.longitude.toString()) : null
    }))
    .filter(
      (city) =>
        city.latitude !== null &&
        city.longitude !== null &&
        !isNaN(city.latitude) &&
        !isNaN(city.longitude)
    );

  // Filter businesses with valid coordinates
  const validBusinesses = filteredBusinesses
    .map(business => ({
      ...business,
      latitude: business.latitude ? parseFloat(business.latitude.toString()) : null,
      longitude: business.longitude ? parseFloat(business.longitude.toString()) : null
    }))
    .filter(
      (business) =>
        business.latitude !== null &&
        business.longitude !== null &&
        !isNaN(business.latitude) &&
        !isNaN(business.longitude)
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
    fetchCities();
  }, []);

  useEffect(() => {
    if (map && shouldFitBounds) {
      if (viewMode === 'cities' && validCities.length > 0) {
        fitBoundsToMarkers(validCities);
      } else if (viewMode === 'businesses' && validBusinesses.length > 0) {
        fitBoundsToMarkers(validBusinesses);
      }
    }
  }, [map, validCities, validBusinesses, shouldFitBounds, viewMode]);

  const fetchCities = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/list/?page=1&limit=1000`);

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const result: ApiResponse = await response.json();
      setCities(result.items || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCityBusinesses = async (cityId: string, cityName: string) => {
    try {
      setLoadingBusinesses(true);
      setCurrentCityName(cityName);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/accessible-city/${cityId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const result: CityDetailResponse = await response.json();
      setBusinesses(result.businesses || []);
      setViewMode('businesses');
      setShouldFitBounds(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching businesses:', err);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const fitBoundsToMarkers = (markers: any[]) => {
    if (!map) return;

    const validMapMarkers = markers.filter(m => m.latitude && m.longitude);

    if (validMapMarkers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    validMapMarkers.forEach(marker => {
      bounds.extend({ lat: marker.latitude!, lng: marker.longitude! });
    });

    map.fitBounds(bounds);
  };

  const handleCityClick = (city: City) => {
    const lat = city.latitude ? parseFloat(city.latitude.toString()) : null;
    const lng = city.longitude ? parseFloat(city.longitude.toString()) : null;

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setShouldFitBounds(false);
      setSelectedCity(city);
      setMapCenter({ lat, lng });
      setMapZoom(12);

      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(12);
      }

      fetchCityBusinesses(city.id, city.city_name);
    }
  };

  const handleBusinessClick = (business: Business) => {
    const lat = business.latitude ? parseFloat(business.latitude.toString()) : null;
    const lng = business.longitude ? parseFloat(business.longitude.toString()) : null;

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setShouldFitBounds(false);
      setSelectedBusiness(business);
      setMapCenter({ lat, lng });
      setMapZoom(15);

      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(15);
      }
    }
  };

  const handleBusinessMarkerClick = (business: any) => {
    const originalBusiness = businesses.find(b => b.id === business.id);
    if (originalBusiness) {
      setSelectedBusiness(originalBusiness);
    }
  };

  const handleBackToCities = () => {
    setViewMode('cities');
    setBusinesses([]);
    setSelectedBusiness(null);
    setSelectedCity(null);
    setSearchTerm('');
    setCurrentCityName('');
    setShouldFitBounds(true);
    setMapZoom(4);
    setMapCenter(defaultCenter);
  };

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const getCityMarkerIcon = () => {
    if (typeof google !== 'undefined') {
      return {
        url: '/assets/images/favicon.png',
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16),
      };
    }
    return undefined;
  };

  const getBusinessMarkerIcon = (isApproved: boolean) => {
    if (typeof google !== 'undefined') {
      if (isApproved) {
        return {
          url: '/assets/images/lock.png',
          scaledSize: new google.maps.Size(32, 42),
          anchor: new google.maps.Point(16, 42),
        };
      }
      return {
        url: '/assets/images/marker.png',
        scaledSize: new google.maps.Size(30, 49),
        anchor: new google.maps.Point(15, 49),
      };
    }
    return undefined;
  };

  return (
    <section className="w-full lg:w-5/6 lg:mx-auto px-4 py-8 sm:py-12 mt-6 sm:mt-10 bg-[#f7f7f7] ">
      <h1 className="font-['Helvetica'] text-2xl sm:text-3xl lg:text-[28px] font-bold pb-4 sm:pb-6 pl-2 sm:pl-4 mb-6 sm:mb-8 border-[#e5e5e7] border-b">
        {viewMode === 'cities' ? 'All Access-friendly Cities' : `Businesses in ${currentCityName}`}
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-3 sm:p-4 shadow flex flex-col font-['Helvetica'] h-auto lg:h-[580px]">
          {viewMode === 'businesses' && (
            <button
              onClick={handleBackToCities}
              className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Cities
            </button>
          )}

          <div className="flex items-center bg-white border rounded-md p-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>
            <input
              type="text"
              placeholder={viewMode === 'cities' ? 'Search City...' : 'Search Business...'}
              className="w-full outline-none text-gray-700 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[460px] pr-2">
            {loading || loadingBusinesses ? (
              <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
                Loading {viewMode === 'cities' ? 'cities' : 'businesses'}...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-4 text-sm sm:text-base">Failed to load data</p>
            ) : viewMode === 'cities' ? (
              filteredCities.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm sm:text-base">No cities found</p>
              ) : (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCityClick(city)}
                    className="w-full flex items-center gap-3 sm:gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 sm:p-4 transition hover:bg-gray-50 text-left"
                  >
                    <div className="w-20 sm:w-24 lg:w-[128px] flex-shrink-0">
                      <img
                        src={city?.picture_url || DEFAULT_IMAGE}
                        alt={city?.city_name || 'City'}
                        className="w-20 h-16 sm:w-24 sm:h-20 lg:w-[128px] lg:h-[96px] rounded-xl sm:rounded-2xl object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{city.city_name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {city.businessCount} {city.businessCount === 1 ? 'Business' : 'Businesses'}
                      </p>
                    </div>
                  </button>
                ))
              )
            ) : (
              filteredBusinesses.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm sm:text-base">No businesses found</p>
              ) : (
                filteredBusinesses.map((business) => {
                  const isApproved = business.business_status?.toLowerCase() === "approved";

                  if (isApproved) {
                    return (
                      <div
                        key={business.id}
                        onClick={() => handleApprovedBusinessClick(business)}
                        className="w-full flex items-center gap-3 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50 text-left cursor-pointer"
                      >
                        <img
                          src={business?.logo_url || DEFAULT_BUSINESS_IMAGE}
                          alt={business.name}
                          className="rounded-lg object-cover w-16 h-12 sm:w-20 sm:h-16 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_BUSINESS_IMAGE;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{business.name}</h3>
                            <span className="px-2 py-0.5 text-xs font-semibold capitalize rounded bg-blue-100 text-blue-800 whitespace-nowrap">
                              {business.business_status === "approved"
                                ? "Submitted"
                                : business.business_status}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
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
                      className="w-full flex items-center gap-3 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50 text-left"
                    >
                      <img
                        src={business?.logo_url || DEFAULT_BUSINESS_IMAGE}
                        alt={business.name}
                        className="rounded-lg object-cover w-16 h-12 sm:w-20 sm:h-16 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_BUSINESS_IMAGE;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{business.name}</h3>
                          {business.business_status && (
                            <span className="px-2 py-0.5 text-xs font-semibold capitalize rounded bg-green-100 text-green-800 whitespace-nowrap">
                              {business.business_status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {business.address}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Map */}
        <div className="w-full lg:w-2/3 h-[400px] sm:h-[500px] lg:h-[580px] rounded-lg shadow mb-26">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm sm:text-base">Loading map...</p>
            </div>
          ) : error && viewMode === 'cities' ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm sm:text-base px-4 text-center">Error: {error}</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onMapLoad}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {viewMode === 'cities' && validCities.map((city) => (
                <Marker
                  key={city.id}
                  position={{ lat: city.latitude!, lng: city.longitude! }}
                  onClick={() => handleCityClick(city)}
                  icon={getCityMarkerIcon()}
                />
              ))}

              {viewMode === 'businesses' && validBusinesses.map((business) => {
                const isApproved = business.business_status?.toLowerCase() === "approved";
                return (
                  <Marker
                    key={business.id}
                    position={{ lat: business.latitude!, lng: business.longitude! }}
                    onClick={() => handleBusinessMarkerClick(business)}
                    icon={getBusinessMarkerIcon(isApproved)}
                  />
                );
              })}

              {selectedBusiness && selectedBusiness.latitude && selectedBusiness.longitude && (() => {
                const lat = parseFloat(selectedBusiness.latitude.toString());
                const lng = parseFloat(selectedBusiness.longitude.toString());
                const isApproved = selectedBusiness.business_status?.toLowerCase() === "approved";

                if (!isNaN(lat) && !isNaN(lng)) {
                  return (
                    <InfoWindow
                      position={{ lat, lng }}
                      onCloseClick={() => setSelectedBusiness(null)}
                    >
                      <div style={{ padding: "8px", maxWidth: "250px" }}>
                        <h3 style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
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
                              backgroundColor: isApproved ? "#fee2e2" : "#dbeafe",
                              color: isApproved ? "#991b1b" : "#1e40af",
                            }}
                          >
                            {/* {selectedBusiness.business_status.toUpperCase()} */}
                            {selectedBusiness?.business_status === "approved"
                              ? "SUBMITTED"
                              : selectedBusiness?.business_status?.toUpperCase()}
                          </span>
                        )}
                        <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px" }}>
                          {selectedBusiness.address}
                        </p>
                        {selectedBusiness.phone_number && (
                          <p style={{ fontSize: "14px", color: "#4b5563" }}>
                            {selectedBusiness.phone_number}
                          </p>
                        )}
                        {isApproved ? (
                          <button
                            onClick={() => handleApprovedBusinessClick(selectedBusiness)}
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
                        ) : (
                          <Link
                            href={`/business-profile/${selectedBusiness.id}`}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#2563eb",
                              color: "white",
                              padding: "12px 16px",
                              borderRadius: "4px",
                              textDecoration: "none",
                              width: "100%",
                              textAlign: "center",
                              marginTop: "8px",
                              fontSize: "14px",
                            }}
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </InfoWindow>
                  );
                }
                return null;
              })()}
            </GoogleMap>
          )}
        </div>
      </div>

      {/* Claim Confirm Modal */}
      {claimConfirmOpen && claimBusiness && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setClaimConfirmOpen(false);
                setClaimBusiness(null);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 pr-8">
              Claim this business?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-5">
              Would you like to claim{" "}
              <span className="font-semibold">{claimBusiness.name}</span> and
              manage its details?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setClaimConfirmOpen(false);
                  setClaimBusiness(null);
                }}
                className="px-5 py-2 rounded-full border font-semibold hover:bg-gray-50 text-sm sm:text-base"
              >
                No
              </button>

              <button
                disabled={claimLoading}
                onClick={async () => {
                  try {
                    setClaimLoading(true);
                    await addBusinessToClaimCart(claimBusiness);
                    setClaimConfirmOpen(false);
                    setAddedToCartOpen(true);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to add to cart. Please try again.");
                  } finally {
                    setClaimLoading(false);
                  }
                }}
                className={`px-5 py-2 rounded-full bg-[#0519ce] text-white font-semibold hover:opacity-90 text-sm sm:text-base ${claimLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
              >
                {claimLoading ? "Adding..." : "Yes, claim"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Added To Cart Modal */}
      {addedToCartOpen && claimBusiness && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setAddedToCartOpen(false);
                setClaimBusiness(null);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                ✓
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Added to cart
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-semibold">{claimBusiness.name}</span>{" "}
                  has been added to your claim cart.
                </p>
              </div>
            </div>

            <div className="bg-[#f0f1ff] border border-blue-200 rounded-xl p-3 sm:p-4 mb-5">
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
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
                className="px-5 py-2 rounded-full border font-semibold hover:bg-gray-50 text-sm sm:text-base"
              >
                Add more businesses
              </button>

              <button
                onClick={() => {
                  window.location.href = "/checkout";
                }}
                className="px-5 py-2 rounded-full bg-[#0519ce] text-white font-semibold hover:opacity-90 text-sm sm:text-base"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login/Signup Modal for Locked Business */}
      {businessForModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBusinessForModal(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 pr-8">
              Business Details
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
              <img
                src={businessForModal?.logo_url || DEFAULT_BUSINESS_IMAGE}
                alt={businessForModal?.name}
                className="w-full sm:w-32 h-32 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <span className="text-sm sm:text-base text-gray-600 font-semibold block sm:inline">
                    Business Name:{" "}
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 break-words">
                    {businessForModal?.name}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-sm sm:text-base text-gray-600 font-semibold block sm:inline">
                    Business Address:{" "}
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 break-words">
                    {businessForModal?.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f0f1ff] border-2 border-blue-200 rounded-lg p-4 sm:p-5 mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                This profile is currently locked. If you are the business owner,
                please sign up or log in to claim this profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => {
                  setOpenLoginModal(true);
                  setBusinessForModal(null);
                }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#0519ce] text-[#0519ce] rounded-full font-semibold hover:bg-blue-50 transition-all text-sm sm:text-base w-full sm:w-auto"
              >
                Log in
              </button>

              <button
                onClick={() => {
                  setOpenSignupModal(true);
                  setBusinessForModal(null);
                }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#0519ce] text-white rounded-full font-semibold hover:bg-[#0519ce] transition-all text-sm sm:text-base w-full sm:w-auto"
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