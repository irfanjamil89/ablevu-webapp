"use client";

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';


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
}

interface ApiResponse {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Mapsections() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.5073509, -0.1277589]);
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [MapComponent, setMapComponent] = useState<any>(null);

  // Dynamically load the map component only on client side
  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default;
        const { MapContainer, TileLayer, Marker, Popup, useMap } = await import('react-leaflet');
        

        // Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create Map Controller component
        function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
          const map = useMap();
          React.useEffect(() => {
            if (center) {
              map.setView(center, zoom);
            }
          }, [center, zoom, map]);
          return null;
        }

        // Create the map component
        const Map = ({ businesses, center, zoom }: any) => (
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
            <MapController center={center} zoom={zoom} />
            {businesses.map((business: Business) => {
              if (!business.latitude || !business.longitude) return null;
              return (
                <Marker
                  key={business.id}
                  position={[business.latitude, business.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-base mb-1">{business.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{business.address}</p>
                      {business.phone_number && (
                        <p className="text-sm text-gray-600">📞 {business.phone_number}</p>
                      )}
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Visit Website
                        </a>
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
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('https://staging-api.qtpack.co.uk/business/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const result: ApiResponse = await response.json();
      setBusinesses(result.data || []);

      if (result.data && result.data.length > 0) {
        const firstBusiness = result.data[0];
        if (firstBusiness.latitude && firstBusiness.longitude) {
          setMapCenter([firstBusiness.latitude, firstBusiness.longitude]);
        }
      }

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
    if (business.latitude && business.longitude) {
      setMapCenter([business.latitude, business.longitude]);
      setMapZoom(15);
    }
  };

  return (
    <section className="w-5/6 lg:mx-auto px-4 py-12 mt-10">
      <h1 className="font-['Helvetica'] md:text-4xl lg:text-[48px] text-4xl font-bold mb-8">
        Interactive Map
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="w-full lg:w-2/3 h-[450px] rounded-lg overflow-hidden shadow">
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
          <div className="space-y-4 overflow-y-auto max-h-[360px] pr-2">
            {loading ? (
              <p className="text-center text-gray-500 py-4">Loading businesses...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">Failed to load businesses</p>
            ) : filteredBusinesses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No businesses found</p>
            ) : (
              filteredBusinesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => handleBusinessClick(business)}
                  className="w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50 text-left"
                >
                  <img
                    src={business.logo_url || "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/dX0bIKmg86veqjBkh4IS/pub/IA4TYJ966rpTtErQpEtG.png"}
                    alt={business.name}
                    className="rounded-lg object-cover w-20 h-16"
                  />
                  <div className="pe-2 flex-1">
                    <h3 className="font-semibold text-lg">{business.name}</h3>
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
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}