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

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://staging-api.qtpack.co.uk/partner/list?page=1&limit=1000');
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

  return (
    <section className="bg-white py-16">
      <div className="lg:w-5/6 lg:mx-auto bg-gray-100 rounded-2xl py-10 px-10 overflow-hidden flex items-center justify-center flex-wrap gap-2">

        {/* First set of partners */}
        {partners.map((partner, index) => (
          <Link
            key={`first-${index}`}
            href={partner.web_url || '#'}
            className=" w-[19%] "
          >
            <img
              src={partner?.image_url || "/assets/images/HDS_RGB-2048x610.png"}
              alt={`${partner.name} logo`}
              className=" object-contain w-[140px]"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/HDS_RGB-2048x610.png";
              }}
            />
          </Link>
        ))}

      </div>

      <style jsx>{`
        .slider-container {
          overflow: hidden;
          width: 100%;
        }

        .slider-track {
          display: flex;
          gap: 2.5rem;
          width: fit-content;
          animation: slide 30s linear infinite;
        }

        .slider-item {
          width: 10rem;
          height: 5rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .slider-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}