"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

// Interfaces
interface LinkedType {
  id: string;
  business_id: string | null;
  partner_id: string;
  active: boolean;
  created_by: string;
  modified_by: string | null;
  created_at: string;
  modified_at: string;
}

interface Partner {
  id: string;
  name: string;
  description: string | null;
  tags: string | null;
  image_url: string | null;
  web_url: string | null;
  active: boolean;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
  linkedTypes: LinkedType[];
}

interface ApiResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Partner[];
}

export default function Partner() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (partners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Move to next slide, loop back to start if at the end
        return (prevIndex + 1) % partners.length;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [partners.length]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}partner/list?page=1&limit=1000`);
      const data: ApiResponse = await response.json();

      // Filter only active partners
      const activePartners = data.items.filter(partner => partner.active);
      setPartners(activePartners);
      setError(null);
    } catch (err) {
      setError('Failed to load partners');
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVisiblePartners = () => {
    if (partners.length === 0) return [];
    
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % partners.length;
      visible.push(partners[index]);
    }
    return visible;
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="lg:w-5/6 lg:mx-auto bg-gray-100 rounded-2xl flex justify-center items-center py-10 px-10">
          <p className="text-gray-500">Loading partners...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="lg:w-5/6 lg:mx-auto bg-gray-100 rounded-2xl flex justify-center items-center py-10 px-10">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  const visiblePartners = getVisiblePartners();

  return (
    <section className="bg-white py-16">
      <div className="lg:w-5/6 lg:mx-auto bg-gray-100 rounded-2xl py-10 px-10">
        
        {/* Slider Container */}
        <div className="relative">
          <div className="flex justify-center items-center gap-10 flex-wrap md:flex-nowrap">
            {visiblePartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="w-full md:w-1/4 flex justify-center transition-all duration-500 ease-in-out"
              >
                <Link
                  href={partner.web_url || '#'}
                  className="flex justify-center"
                >
                  <img
                    src={partner?.image_url || "/assets/images/HDS_RGB-2048x610.png"}
                    alt={`${partner.name} logo`}
                    className="object-contain w-[180px] h-[100px]"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/HDS_RGB-2048x610.png";
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          {partners.length > 4 && (
            <div className="flex justify-center gap-2 mt-8">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}