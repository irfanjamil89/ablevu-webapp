"use client";

import React from "react";

// ---- Types ----
type VirtualTour = {
  id: string;
  name: string;
  display_order: number;
  link_url: string;
  active: boolean;
};

type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  virtualTours?: VirtualTour[];
  accessibilityFeatures?: any[];
  businessreviews?: any[];
  businessQuestions?: any[];
  businessPartners?: any[];
  businessCustomSections?: any[];
  businessMedia?: any[];
  // you can add more fields if needed
};

interface MaincontentProps {
  business: BusinessProfile | null;
  loading: boolean;
  error: string | null;
    setOpenVirtualTour: React.Dispatch<React.SetStateAction<boolean>>;
  
}

export default function Maincontent({
  business,
  loading,
  error,
  setOpenVirtualTour,
}: MaincontentProps) {
  // small helper to get a label from unknown objects
  const getLabel = (item: any): string =>
    item?.title ||
    item?.name ||
    item?.question ||
    item?.heading ||
    item?.label ||
    "Item";

  const activeTours: VirtualTour[] =
    business?.virtualTours?.filter((t) => t.active) || [];

  // if in future you store real images in businessMedia:
  const propertyImages: string[] =
    business?.businessMedia
      ?.map((m: any) => m.image_url || m.media_url || m.url)
      .filter(Boolean) || [];

  // ---------- Loading / Error ----------
  if (loading) {
    return (
      <div className="px-10 py-7 w-7/10">
        <div className="border p-6 rounded-3xl border-[#e5e5e7] w-full">
          <div className="animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-64 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-52 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="px-10 py-7 w-7/10">
        <p className="text-red-500">
          {error ? `Failed to fetch business profile (${error})` : "No data"}
        </p>
      </div>
    );
  }

  return (
    <div className="px-10 py-7 w-7/10">
      {/* ---------- Virtual Tours ---------- */}
      <div className="tour border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-2">Virtual Tours</h3>
        <p>Explore the location virtually to make informed decisions and plan your visit</p>
        <p className="text-xs mt-1">
          Interested in adding an accessibility virtual tour? Email{" "}
          <a href="mailto:info@ableeyes.org">
            <span className="text-[#0205d3]">info@ableeyes.org</span>
          </a>{" "}
          for more information
        </p>

        <div className="tours mt-6 flex flex-wrap justify-between gap-3">
          {activeTours.length > 0 ? (
            activeTours.map((tour) => (
              <div
                key={tour.id}
                className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]"
              >
                <div className="icon flex items-center">
                  <img
                    src="/assets/images/walking.svg"
                    alt=""
                    className="w-8 mr-4"
                  />
                  <p>{tour.name}</p>
                </div>
                <div className="link">
                  <a
                    href={tour.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0205d3] font-medium"
                  >
                    View
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No virtual tours have been added yet.
            </p>
          )}
        </div>
      </div>

      {/* ---------- Audio Tours ---------- */}
      <div className="audio my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Audio Tours</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
          <img src="/assets/images/audio.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">
            No Audio Tour to show
          </p>
        </div>
      </div>

      {/* ---------- Property Images ---------- */}
      <div className="property my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Property Images</h3>
        {propertyImages.length > 0 ? (
          <div className="flex flex-wrap gap-x-2 items-center">
            {propertyImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Property image ${index + 1}`}
                className="w-[19%] my-1.5 rounded-2xl cursor-pointer"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-2 items-center">
            {/* fallback demo images */}
            {Array.from({ length: 8 }).map((_, i) => (
              <img
                key={i}
                src="/assets/images/pool.jpg"
                alt=""
                className="w-[19%] my-1.5 rounded-2xl cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------- Accessibility Features ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Accessibility Features</h3>
        {business.accessibilityFeatures &&
        business.accessibilityFeatures.length > 0 ? (
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            {business.accessibilityFeatures.map((f: any) => (
              <li key={f.id}>{getLabel(f)}</li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No Features to show
            </p>
          </div>
        )}
      </div>

      {/* ---------- Partner Certifications / Programs ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">
          Partner Certifications/Programs
        </h3>
        {business.businessPartners && business.businessPartners.length > 0 ? (
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            {business.businessPartners.map((p: any) => (
              <li key={p.id}>{getLabel(p)}</li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No Active Partnerships
            </p>
          </div>
        )}
      </div>

      {/* ---------- Reviews ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Reviews</h3>
        {business.businessreviews && business.businessreviews.length > 0 ? (
          <ul className="space-y-3 text-sm text-gray-700">
            {business.businessreviews.map((r: any) => (
              <li key={r.id} className="border-b pb-2">
                {getLabel(r)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/link.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No reviews to show
            </p>
          </div>
        )}
      </div>

      {/* ---------- Accessibility Questions ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Accessibility Questions</h3>
        {business.businessQuestions && business.businessQuestions.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700">
            {business.businessQuestions.map((q: any) => (
              <li key={q.id}>• {getLabel(q)}</li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No Questions to show
            </p>
          </div>
        )}
      </div>

      {/* ---------- Additional Accessibility Resources ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">
          Additional Accessibility Resources
        </h3>
        {/* for now, using custom sections as resources if present */}
        {business.businessCustomSections &&
        business.businessCustomSections.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700">
            {business.businessCustomSections.map((s: any) => (
              <li key={s.id}>{getLabel(s)}</li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/link.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No Resources to show
            </p>
          </div>
        )}
      </div>

      {/* ---------- Accessibility Media ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Accessibility Media</h3>
        {business.businessMedia && business.businessMedia.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700">
            {business.businessMedia.map((m: any) => (
              <li key={m.id}>{getLabel(m)}</li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No Media to show
            </p>
          </div>
        )}
      </div>

      {/* ---------- Custom Sections ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4">Custom Sections</h3>
        {business.businessCustomSections &&
        business.businessCustomSections.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700">
            {business.businessCustomSections.map((s: any) => (
              <li key={s.id}>{getLabel(s)}</li>
            ))}
          </ul>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No Custom section to show
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
