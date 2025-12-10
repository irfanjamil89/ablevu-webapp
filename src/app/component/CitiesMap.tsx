"use client";

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Link from "next/link";

// TypeScript Interfaces
interface City {
  id: string;
  city_name: string;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  display_order: number | null;
  picture_url: string | null;
  slug: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
  businessCount: number;
}

interface ApiResponse {
  items: City[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export default function CitiesMap() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([25, 51]);
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(true);

    const DEFAULT_IMAGE = "https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=256,h=181,f=auto,dpr=0.75,fit=cover,q=75/f1744979714205x630911143129575800/Untitled%20design%20%2829%29.png";


  // Dynamically load the map component only on client side
  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default;
        const { MapContainer, TileLayer, Marker, Popup, useMap } = await import('react-leaflet');
        
        // Create custom icon for cities
        const customIcon = new L.Icon({
          iconUrl: '/assets/images/favicon.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        // Create Map Controller component
        function MapController({ 
          center, 
          zoom, 
          cities, 
          shouldFitBounds 
        }: { 
          center: [number, number]; 
          zoom: number; 
          cities: City[];
          shouldFitBounds: boolean;
        }) {
          const map = useMap();
          
          React.useEffect(() => {
            if (shouldFitBounds && cities.length > 0) {
              // Calculate bounds to fit all markers
              const validCities = cities.filter(c => c.latitude && c.longitude);
              
              if (validCities.length > 0) {
                const bounds = L.latLngBounds(
                  validCities.map(c => [c.latitude!, c.longitude!] as [number, number])
                );
                map.fitBounds(bounds, { padding: [50, 50] });
              }
            } else if (center && !shouldFitBounds) {
              map.setView(center, zoom);
            }
          }, [center, zoom, map, cities, shouldFitBounds]);
          
          return null;
        }

        // Create the map component
        const Map = ({ cities, center, zoom, shouldFitBounds }: any) => (
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
              cities={cities}
              shouldFitBounds={shouldFitBounds}
            />
            {cities.map((city: City) => {
              if (!city.latitude || !city.longitude) return null;
              return (
                <Marker
                  key={city.id}
                  position={[city.latitude, city.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-base mb-1">{city.city_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {city.businessCount} {city.businessCount === 1 ? 'Business' : 'Businesses'}
                      </p>
                      {city.featured && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Featured
                        </span>
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
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);

      const response = await fetch('https://staging-api.qtpack.co.uk/accessible-city/list');

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const result: ApiResponse = await response.json();
      setCities(result.items || []);
      
      // Enable fit bounds for initial load
      setShouldFitBounds(true);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityClick = (city: City) => {
    if (city.latitude && city.longitude) {
      setShouldFitBounds(false); // Disable auto-fit when clicking
      setMapCenter([city.latitude, city.longitude]);
      setMapZoom(12);
    }
  };

  return (
    <section className="w-5/6 lg:mx-auto px-4 py-12 mt-10 bg-[#f7f7f7]">
      <h1 className="font-['Helvetica'] md:text-2xl lg:text-[28px] text-4xl font-bold pb-6 pl-4 mb-8 border-[#e5e5e7] border-b">
        All Access-friendly Cities
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 h-[580px]">
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
              placeholder="Search City..."
              className="w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Cities List */}
          <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2">
            {loading ? (
              <p className="text-center text-gray-500 py-4">Loading cities...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">Failed to load cities</p>
            ) : filteredCities.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No cities found</p>
            ) : (
              filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  className="w-full flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-4 transition hover:bg-gray-50 text-left"
                >
                  <div className="w-[128px] rounded-2xl">
                   
                    <img
                    src={`https://ablevu-storage.s3.us-east-1.amazonaws.com/af-city/${city?.id}.png`}
                    alt={city.city_name}
                    className="w-[128px] h-[96px] rounded-2xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src =DEFAULT_IMAGE;
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{city.city_name}</h3>
                      {/* {city.featured && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )} */}
                    </div>
                    <p className="text-sm text-gray-600">
                      {city.businessCount} {city.businessCount === 1 ? 'Business' : 'Businesses'}
                    </p>
                    {city.latitude && city.longitude && (
                      <p className="text-xs text-gray-400 mt-1">
                        {/* 📍 {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)} */}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
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
              cities={filteredCities}
              center={mapCenter}
              zoom={mapZoom}
              shouldFitBounds={shouldFitBounds}
            />
          )}
        </div>

        
      </div>
    </section>
  );
}