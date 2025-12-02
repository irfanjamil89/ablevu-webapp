"use client";

import React, { useEffect, useState, useCallback } from "react";
import BusinessSidebar from "@/app/component/BusinessSidebar";
import Maincontent from "@/app/component/Maincontent";
import BusinessDetail from "@/app/component/BusinessDetail";
import Operatinghours from "@/app/component/Operatinghours";
import Profilesocial from "@/app/component/Profilesocial";
import Profileabout from "@/app/component/Profileabout";
import VirtualTour from "@/app/component/VirtualTour";

type BusinessProfile = any;
type BusinessType = any;

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [OpenDetailPopup, setOpenDetailPopup] = useState(false);
  const [OpenOperatingHours, setOpenOperatingHours] = useState(false);
  const [OpenSocialLinks, setOpenSocialLinks] = useState(false);
  const [OpenAboutModal, setOpenAboutModal] = useState(false);
  const [OpenVirtualTour, setOpenVirtualTour] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 🔁 Common function: business profile + business types fetch karo
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      // 1️⃣ Fetch business profile
      const profileRes = await fetch(
        `${API_BASE_URL}/business/business-profile/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!profileRes.ok) throw new Error("Failed to fetch business profile");

      const profileData = await profileRes.json();
      setBusiness(profileData);

      // 2️⃣ Fetch business-types
      const typeRes = await fetch(
        `${API_BASE_URL}/business-type/list?page=1&limit=1000`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!typeRes.ok) throw new Error("Failed to fetch business types");

      const typeData = await typeRes.json();

      const types = Array.isArray(typeData)
        ? typeData
        : typeData.items || typeData.data || [];

      setBusinessTypes(types);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, id]);

  useEffect(() => {
    if (id && API_BASE_URL) {
      fetchAllData();
    }
  }, [id, API_BASE_URL, fetchAllData]);
  // ⬆️ ab ESLint khush

  // 🌟 Return UI (yahan se tumhara existing JSX as-is)
  return (
<<<<<<< Updated upstream
    <div>
      <div className="flex">
        <BusinessSidebar
          business={business}
          businessTypes={businessTypes}
          loading={loading}
          error={error}
          setOpenDetailPopup={setOpenDetailPopup}
          setOpenOperatingHours={setOpenOperatingHours}
          setOpenSocialLinks={setOpenSocialLinks}
          setOpenAboutModal={setOpenAboutModal}
        />
        <Maincontent
          business={business}
          loading={loading}
          error={error}
          setOpenVirtualTour={setOpenVirtualTour}
        />
      </div>

      {OpenDetailPopup && business && (
        <BusinessDetail
          businessId={business.id}
          setOpenDetailPopup={setOpenDetailPopup}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenOperatingHours && business && (
        <Operatinghours
          businessId={business.id}
          setOpenOperatingHours={setOpenOperatingHours}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenSocialLinks && business && (
        <Profilesocial
          businessId={business.id}
          setOpenSocialLinks={setOpenSocialLinks}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenAboutModal && business && (
        <Profileabout
          businessId={business.id}
          setOpenAboutModal={setOpenAboutModal}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenVirtualTour && business && (
        <VirtualTour
          businessId={business.id}
          setOpenVirtualTour={setOpenVirtualTour}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}
=======
    <div className='flex'>
      <BusinessSidebar businessId={businessId}/>
      <Maincontent businessId={businessId} />
>>>>>>> Stashed changes
    </div>
  );
}
