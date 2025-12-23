"use client";

import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Link from "next/link";

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

interface ApiResponse {
  items: City[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 37.0902,  // Center of USA
  lng: -95.7129
};

export default function CitiesMap() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(4);  // Good zoom level for USA
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(true);

  const DEFAULT_IMAGE = "https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=256,h=181,f=auto,dpr=0.75,fit=cover,q=75/f1744979714205x630911143129575800/Untitled%20design%20%2829%29.png";

  // Filter cities with search term
  const filteredCities = cities.filter((city) =>
    city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter cities with valid coordinates for map display
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

  useEffect(() => {
    fetchCities();
  }, []);

  // Auto-fit bounds when cities load
  useEffect(() => {
    if (map && validCities.length > 0 && shouldFitBounds) {
      fitBoundsToMarkers();
    }
  }, [map, validCities, shouldFitBounds]);

  const fetchCities = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}accessible-city/list`);

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

  const fitBoundsToMarkers = () => {
    if (!map) return;

    const validMapCities = validCities.filter(c => c.latitude && c.longitude);
    
    if (validMapCities.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    validMapCities.forEach(city => {
      bounds.extend({ lat: city.latitude!, lng: city.longitude! });
    });

    map.fitBounds(bounds);
  };

  const handleCityClick = (city: City) => {
    const lat = city.latitude ? parseFloat(city.latitude.toString()) : null;
    const lng = city.longitude ? parseFloat(city.longitude.toString()) : null;
    
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setShouldFitBounds(false);  // Disable auto-fit when clicking a city
      setSelectedCity(city);
      setMapCenter({ lat, lng });
      setMapZoom(12);
      
      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(12);
      }
    }
  };

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  // Create marker icon using a reliable public icon URL
  
  // const getMarkerIcon = () => {
  //   if (typeof google !== 'undefined') {
  //     return {
  //       url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',  // Google's reliable marker icon
  //       scaledSize: new google.maps.Size(32, 32),
  //     };
  //   }
  //   return undefined;
  // };

  const getMarkerIcon = () => {
    if (typeof google !== 'undefined') {
      return {
        url: '/assets/images/favicon.png',
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16), // Center the icon on the coordinates
      };
    }
    return undefined;
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
                      src={city?.picture_url || DEFAULT_IMAGE}
                      alt={city?.city_name || 'City'}
                      className="w-[128px] h-[96px] rounded-2xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{city.city_name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {city.businessCount} {city.businessCount === 1 ? 'Business' : 'Businesses'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

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
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {validCities.map((city) => (
                <Marker
                  key={city.id}
                  position={{ lat: city.latitude!, lng: city.longitude! }}
                  onClick={() => setSelectedCity(city)}
                  icon={getMarkerIcon()}
                />
              ))}

              {selectedCity && selectedCity.latitude && selectedCity.longitude && (() => {
                const lat = parseFloat(selectedCity.latitude.toString());
                const lng = parseFloat(selectedCity.longitude.toString());
                if (!isNaN(lat) && !isNaN(lng)) {
                  return (
                    <InfoWindow
                      position={{ lat, lng }}
                      onCloseClick={() => setSelectedCity(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-bold text-base mb-1">{selectedCity.city_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedCity.businessCount} {selectedCity.businessCount === 1 ? 'Business' : 'Businesses'}
                        </p>
                        {selectedCity.featured && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Featured
                          </span>
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
    </section>
  );
}