"use client";

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Link from "next/link";
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './Forgotpassword';
import Successmodal from './Successmodal';

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

interface ApiResponse {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function to validate and parse coordinates
const validateCoordinates = (lat: any, lng: any): { lat: number; lng: number } | null => {
  const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
  const longitude = typeof lng === 'string' ? parseFloat(lng) : lng;

  if (isNaN(latitude) || isNaN(longitude)) {
    console.warn('Invalid coordinates - not numbers:', { lat, lng });
    return null;
  }

  if (latitude < -90 || latitude > 90) {
    console.warn('Invalid latitude (should be -90 to 90):', latitude);
    return null;
  }

  if (longitude < -180 || longitude > 180) {
    console.warn('Invalid longitude (should be -180 to 180):', longitude);
    return null;
  }

  if (Math.abs(latitude) > 90 && Math.abs(longitude) <= 90) {
    console.warn('Coordinates might be swapped!', { lat: latitude, lng: longitude });
    return { lat: longitude, lng: latitude };
  }

  return { lat: latitude, lng: longitude };
};

export default function Mapsections() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.5073509, -0.1277589]);
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default;
        const { MapContainer, TileLayer, Marker, Popup, useMap } = await import('react-leaflet');

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create custom red lock icon for "approved" status
        const approvedIcon = new L.Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
              <path fill="#DC2626" stroke="#991B1B" stroke-width="2" d="M16 0C10.5 0 6 4.5 6 10v4H4c-1.1 0-2 0.9-2 2v20c0 1.1 0.9 2 2 2h24c1.1 0 2-0.9 2-2V16c0-1.1-0.9-2-2-2h-2v-4c0-5.5-4.5-10-10-10zm0 4c3.3 0 6 2.7 6 6v4H10v-4c0-3.3 2.7-6 6-6zm0 16c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"/>
              <path fill="none" stroke="#991B1B" stroke-width="1.5" d="M16 40L16 38"/>
            </svg>
          `),
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -42],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41]
        });

        // Default blue marker for "claimed" status
        const claimedIcon = new L.Icon.Default();

        // Create Map Controller component
        function MapController({
          center,
          zoom,
          businesses,
          shouldFitBounds
        }: {
          center: [number, number];
          zoom: number;
          businesses: Business[];
          shouldFitBounds: boolean;
        }) {
          const map = useMap();

          React.useEffect(() => {
            if (shouldFitBounds && businesses.length > 0) {
              const validBusinesses = businesses.filter(b => {
                const coords = validateCoordinates(b.latitude, b.longitude);
                return coords !== null;
              });

              if (validBusinesses.length > 0) {
                const bounds = L.latLngBounds(
                  validBusinesses.map(b => {
                    const coords = validateCoordinates(b.latitude, b.longitude)!;
                    return [coords.lat, coords.lng] as [number, number];
                  })
                );

                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
              }
            } else if (center && !shouldFitBounds) {
              map.setView(center, zoom);
            }
          }, [center, zoom, map, businesses, shouldFitBounds]);

          return null;
        }

        // Helper function to get marker icon based on business status
        const getMarkerIcon = (status: string | null) => {
          const normalizedStatus = status?.toLowerCase();
          if (normalizedStatus === 'approved') {
            return approvedIcon;
          }
          return claimedIcon;
        };

        // Create the map component
        const Map = ({ businesses, center, zoom, shouldFitBounds }: any) => (
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController
              center={center}
              zoom={zoom}
              businesses={businesses}
              shouldFitBounds={shouldFitBounds}
            />
            {businesses.map((business: Business) => {
              const coords = validateCoordinates(business.latitude, business.longitude);

              if (!coords) {
                return null;
              }

              const validLat = coords.lat;
              const validLng = coords.lng;

              if (validLat == null || validLng == null || isNaN(validLat) || isNaN(validLng)) {
                return null;
              }

              return (
                <Marker
                  key={business.id}
                  position={[coords.lat, coords.lng]}
                  icon={getMarkerIcon(business.business_status)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-base mb-1">{business.name}</h3>
                      {business.business_status && (
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mb-2 ${business.business_status.toLowerCase() === 'approved'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {business.business_status.toUpperCase()}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mb-2">{business.address}</p>
                      <p className="text-xs text-gray-400 mb-2">
                        Coords: {validLat.toFixed(6)}, {validLng.toFixed(6)}
                      </p>
                      {business.phone_number && (
                        <p className="text-sm text-gray-600">{business.phone_number}</p>
                      )}
                      {business.business_status?.toLowerCase() === 'approved' && (
                        <button
                          onClick={() => setSelectedBusiness(business)}
                          className="bg-red-700 rounded cursor-pointer hover:bg-red-800 transition-all ease-in-out text-sm block text-center p-4 text-white w-full mt-2"
                        >
                          Claim Business
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        );

        setMapComponent(() => Map);
      }
    };

    loadMap();
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);

      const response = await fetch('https://staging-api.qtpack.co.uk/business/list1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const result: ApiResponse = await response.json();

      setBusinesses(result.data || []);
      setShouldFitBounds(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBusinessClick = (business: Business) => {
    const coords = validateCoordinates(business.latitude, business.longitude);
    if (coords) {
      setShouldFitBounds(false);
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(15);
    }
  };

  return (
    <section className="w-5/6 custom-container lg:mx-auto px-4 py-12 mt-10">
      <h1 className="font-['Helvetica'] md:text-4xl lg:text-[48px] text-4xl font-bold mb-8">
        Interactive Map
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 h-[580px]">
        {/* Map */}
        <div className="w-full lg:w-2/3 h-[580px] rounded-lg shadow">
          {!MapComponent || loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-600">Loading map...</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : (
            <MapComponent
              businesses={filteredBusinesses}
              center={mapCenter}
              zoom={mapZoom}
              shouldFitBounds={shouldFitBounds}
            />
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
              <p className="text-center text-gray-500 py-4">Loading businesses...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">Failed to load businesses</p>
            ) : filteredBusinesses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No businesses found</p>
            ) : (
              filteredBusinesses.map((business) => {
                const isApproved = business.business_status?.toLowerCase() === 'approved';
                
                // For approved businesses, render a div that opens modal
                if (isApproved) {
                  return (
                    <div
                      key={business.id}
                      onClick={() => setSelectedBusiness(business)}
                      className="w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50 text-left cursor-pointer"
                    >
                      <img
                        src={business?.logo_url || "assets/images/b-img.png"}
                        alt={business.name}
                        className="rounded-lg object-cover w-20 h-16"
                      />

                      <div className="pe-2 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{business.name}</h3>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800">
                            {business.business_status}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600">{business.address}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // For claimed businesses, render Link as usual
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
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        {business.business_status && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                            {business.business_status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                        <p className="text-sm text-gray-600">{business.address}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Business Details Modal - MOVED OUTSIDE THE MAP LOOP */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl mx-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Business Details
            </h2>

            {/* Business Info */}
            <div className="flex gap-6 mb-6">
              <img
                src={selectedBusiness?.logo_url || "assets/images/b-img.png"}
                alt={selectedBusiness?.name}
                className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="mb-3">
                  <span className="text-gray-600 font-semibold">Business Name: </span>
                  <span className="text-gray-900">{selectedBusiness?.name}</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 font-semibold">Business Address: </span>
                  <span className="text-gray-900">{selectedBusiness?.address}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-semibold">Business Category: </span>
                  <span className="text-gray-900">Church</span>
                </div>
              </div>
            </div>

            {/* Lock Message Box */}
            <div className="bg-[#f0f1ff] border-2 border-blue-200 rounded-lg p-5 mb-6">
              <p className="text-gray-700 text-base leading-relaxed">
                This profile is currently locked while we wait for the business to verify their accessibility details and claim it. If you are the business owner, please sign up or log in to claim this profile.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setOpenLoginModal(true);
                  setSelectedBusiness(null);
                }}
                className="px-8 py-3 border-2 border-[#0519ce] text-[#0519ce] rounded-full font-semibold hover:bg-blue-50 transition-all text-base min-w-[140px]"
              >
                Log in
              </button>
              <button 
                onClick={() => {
                  setOpenSignupModal(true);
                  setSelectedBusiness(null);
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