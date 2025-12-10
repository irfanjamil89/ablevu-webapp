"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';


// Default fallback image
const DEFAULT_IMAGE = "https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=256,h=181,f=auto,dpr=0.75,fit=cover,q=75/f1744979714205x630911143129575800/Untitled%20design%20%2829%29.png";


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


export default function Citiesslider() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {

    try {
      setLoading(true);
      const response = await fetch('https://staging-api.qtpack.co.uk/accessible-city/list');

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const data = await response.json();
      setCities(data.items || []);
    } catch (err) {
      setError(error);
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get number of visible cards based on screen size
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 500) return 1;
    if (width < 768) return 2;
    if (width < 1300) return 3;
    return 4;
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, cities.length - visibleCards);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // Auto-slide effect (optional)
  useEffect(() => {
    if (cities.length <= visibleCards) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [cities.length, visibleCards, maxIndex]);

  return (
    <div className="mx-auto relative space-y-5 z-10 w-full md:-mt-28 flex mt-10 md:w-10/12 lg:w-10/12 custom-container flex-col items-center justify-between gap-0 rounded-[25px] bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-10 lg:flex-row">
      {/* LEFT SIDE */}
      <div className="flex flex-wrap lg:w-1/4 text-center lg:text-left">
        <h2 className="w-full font-['Helvetica'] mb-5 font-bold text-gray-900 md:text-4xl lg:text-[48px] text-4xl">
          Where to?
        </h2>
        <p className="w-full font-['Helvetica'] text-base text-gray-800 md:text-lg lg:text-[18px]">
          Finding Accessibility-Transparent Cities and Businesses
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-full lg:w-3/4 flex-2">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-600">Loading cities...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <div className="relative">
            {/* SLIDER WRAPPER */}
            <div className="overflow-hidden pb-4" ref={sliderRef}>
              <div
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`
                }}
              >
                {cities.map((city) => (
                  <Link
                    key={city.id}
                    href="/access-friendly-city"
                    className="flex-shrink-0 bg-white rounded-[20px] shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{
                      width: `calc(${100 / visibleCards}% - ${(visibleCards - 1) * 16 / visibleCards}px)`
                    }}
                  >
                    <img
                      src={`https://ablevu-storage.s3.us-east-1.amazonaws.com/af-city/${city?.id}.png`}
                      alt={city.city_name}
                      className="rounded-t-[20px] w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />

                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-lg text-gray-900">{city.city_name}</h3>
                      <p className="text-sm text-gray-600">{city.businessCount} Businesses</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* NAVIGATION BUTTONS */}
            {cities.length > visibleCards && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-[-10px] top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-2xl hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all z-10"
                  aria-label="Previous cities"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="absolute right-[-10px] top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-2xl hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all z-10"
                  aria-label="Next cities"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* DOTS INDICATOR */}
            {cities.length > visibleCards && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                      ? 'bg-gray-700 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}