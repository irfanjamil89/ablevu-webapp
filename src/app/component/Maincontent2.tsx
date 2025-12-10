"use client";

import React, { useEffect, useState } from "react";

// ---- Types ----
type VirtualTour = {
  id: string;
  name: string;
  display_order: number | null;
  link_url: string;
  active: boolean;
  created_at: string;
  modified_at: string;
};

type AccessibilityFeature = {
  id: string;
  business_id: string;
  accessible_feature_id: string;
  optional_answer: string | null;
  active: boolean;
  created_at: string;
  modified_at: string;

  // if later you join master
  title?: string;
  name?: string;
  feature_name?: string;
  featureType?: { id: string; name: string };
  accessible_feature?: { id: string; title: string };

  // (just in case backend direct id bhej dey)
  accessible_feature_type_id?: string;
};

type AccessibilityFeatureGroup = {
  typeId: string;
  typeName: string;
  items: AccessibilityFeature[];
};

type BusinessReview = {
  id: string;
  business_id: string;
  review_type_id: string;
  description: string;
  approved: boolean;
  approvedAt: string | null;
  active: boolean;
  created_at: string;
  modified_at: string;
  reviewer_name?: string;
  user?: { id: string; name: string };
};

type BusinessQuestion = {
  id: string;
  business_id: string;
  question: string;
  answer: string | null;
  active: boolean;
  show_name: boolean;
  created_at: string;
  modified_at: string;
  user?: { id: string; name: string };
};

type BusinessPartnerItem = {
  id: string; // join row id
  business_id: string;
  partner_id: string;
  active: boolean;
  created_at: string;
  modified_at: string;

  // if backend later populates partner details:
  partner?: {
    id: string;
    name: string;
    image_url?: string | null;
    logo_url?: string | null;
    web_url?: string | null;
    link?: string | null;
  };
};

type BusinessCustomSection = {
  id: string;
  business_id: string;
  label?: string;
  heading?: string;
  title?: string;
  description?: string;
  content?: string;
  active: boolean;
  created_at?: string;
  modified_at?: string;
};

type BusinessMedia = {
  id: string;
  business_id: string;
  label?: string;
  title?: string;
  link?: string;
  link_url?: string;
  url?: string;
  image_url?: string;
  media_url?: string;
  description?: string;
  summary?: string;
  active: boolean;
  created_at?: string;
  modified_at?: string;
};

type AdditionalAccessibilityResource = {
  id: string;
  business_id: string;
  label: string;
  link: string;
  active: boolean;
  created_at: string;
  modified_at: string;
};

type BusinessScheduleItem = {
  id: string;
  day: string;
  opening_time: string;
  closing_time: string;
  opening_time_text: string;
  closing_time_text: string;
  active: boolean;
  created_at: string;
  modified_at: string;
};

type BusinessImage = {
  id: string;
  name: string;
  description: string;
  tags: string | null;
  image_url: string | null;
  business_id: string;
  active: boolean;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
};


// ⭐ feature-type list ka type (API: accessible-feature-types/list)
type AccessibleFeatureTypeMaster = {
  id: string;
  name?: string;
  title?: string;
  label?: string;
};

// ⭐ accessible-feature master (API: accessible-feature/list)
type AccessibleFeatureLinkedType = {
  id: string;
  accessible_feature_id: string;
  accessible_feature_type_id: string;
  active: boolean;
};

type AccessibleFeatureMaster = {
  id: string;
  title: string;
  slug: string;
  linkedTypes?: AccessibleFeatureLinkedType[];
};

type BusinessProfile = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  website: string | null;
  email: string | null;
  phone_number: string | null;

  active: boolean;
  blocked: boolean;
  business_status: string | null;
  views: number;

  facebook_link?: string | null;
  instagram_link?: string | null;
  logo_url?: string | null;
  marker_image_url?: string | null;
  place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;

  created_at: string;
  modified_at: string;

  virtualTours?: VirtualTour[];
  accessibilityFeatures?: AccessibilityFeature[];
  businessreviews?: BusinessReview[];
  businessQuestions?: BusinessQuestion[];
  businessPartners?: BusinessPartnerItem[];
  businessCustomSections?: BusinessCustomSection[];
  businessMedia?: BusinessMedia[];
  businessSchedule?: BusinessScheduleItem[];
  businessRecomendations?: any[];
  additionalaccessibilityresources?: AdditionalAccessibilityResource[];
};

interface MaincontentProps {
  business: BusinessProfile | null;
  businessImages: BusinessImage[];
  loading: boolean;
  error: string | null;

  // 🔹 now simple function, matches Page.tsx
  setOpenVirtualTour: (open: boolean) => void;

  setOpenAccessibilityFeaturePopup: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onEditAccessibilityFeature?: (feature: AccessibilityFeature) => void;
  onDeleteAccessibilityFeature?: (feature: AccessibilityFeature) => void;
  onEditAccessibilityFeatureGroup?: (
    group: AccessibilityFeatureGroup
  ) => void;
  onDeleteAccessibilityFeatureGroup?: (
    group: AccessibilityFeatureGroup
  ) => void;
  setOpenPropertyImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCustonSectionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAccessibilityMediaPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAccessibilityResourcesPopup: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setOpenQuestionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenWriteReviewsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenPartnerCertificationsPopup: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  // handlers for virtual tour icons
  onEditVirtualTour?: (tour: VirtualTour) => void;
  onDeleteVirtualTour?: (tour: VirtualTour) => void;
  onToggleVirtualTourActive?: (tour: VirtualTour) => void;

  // ⭐ handler for review delete icon
  onDeleteReview?: (review: BusinessReview) => void;

  // ⭐ handler for question delete icon
  onDeleteQuestion?: (question: BusinessQuestion) => void;

  onDeletePartner?: (partner: any) => void;
  onDeleteAdditionalResource?: (
    resource: AdditionalAccessibilityResource
  ) => void;
  onEditAdditionalResource?: (
    resource: AdditionalAccessibilityResource
  ) => void;
  onDeleteBusinessMedia?: (media: any) => void;

  onEditBusinessMedia?: (media: any) => void;
  onDeleteBusinessImage?: (image: BusinessImage) => void;

  // ⭐⭐ Global feedback handlers from Page
  showSuccess: (title: string, message: string, onClose?: () => void) => void;
  showError: (title: string, message: string, onClose?: () => void) => void;
}

export default function Maincontent({
  business,
  businessImages,
  loading,
  error,
  setOpenVirtualTour,
  setOpenAccessibilityFeaturePopup,
  onEditAccessibilityFeatureGroup,
  onDeleteAccessibilityFeatureGroup,
  setOpenPropertyImagePopup,
  setOpenCustonSectionPopup,
  setOpenAccessibilityMediaPopup,
  setOpenAccessibilityResourcesPopup,
  setOpenQuestionPopup,
  setOpenWriteReviewsPopup,
  setOpenPartnerCertificationsPopup,
  onEditVirtualTour,
  onDeleteVirtualTour,
  onToggleVirtualTourActive,
  onDeleteReview,
  onDeleteQuestion,
  onDeletePartner,
  onDeleteAdditionalResource,
  onEditAdditionalResource,
  onDeleteBusinessMedia,
  onEditBusinessMedia,
  onDeleteBusinessImage,

  showSuccess,
  showError,
}: MaincontentProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ⭐ master lists
  const [featureTypes, setFeatureTypes] =
    useState<AccessibleFeatureTypeMaster[]>([]);
  const [allFeatures, setAllFeatures] = useState<AccessibleFeatureMaster[]>([]);

  // ⭐ feature types list load (accessible-feature-types/list)
  useEffect(() => {
    if (!API_BASE_URL) return;

    const fetchTypes = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/accessible-feature-types/list?limit=100&page=1`
        );
        if (!res.ok) {
          console.error("Failed to load feature types", res.status);
          return;
        }

        const data = await res.json();
        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.items)) items = data.items;
        else if (Array.isArray(data.data)) items = data.data;

        setFeatureTypes(items);
      } catch (e) {
        console.error("Error loading feature types", e);
      }
    };

    fetchTypes();
  }, [API_BASE_URL]);

  // ⭐ accessible-feature master list load (accessible-feature/list)
  useEffect(() => {
    if (!API_BASE_URL) return;

    const fetchFeatures = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/accessible-feature/list?limit=1000&page=1`
        );
        if (!res.ok) {
          console.error("Failed to load accessible features", res.status);
          return;
        }

        const data = await res.json();
        const items: AccessibleFeatureMaster[] = Array.isArray(data)
          ? data
          : data.items || data.data || [];
        setAllFeatures(items);
      } catch (e) {
        console.error("Error loading accessible features", e);
      }
    };

    fetchFeatures();
  }, [API_BASE_URL]);

  // small helper to get a label from unknown objects
  const getLabel = (item: any): string =>
    item?.title ||
    item?.name ||
    item?.question ||
    item?.heading ||
    item?.label ||
    item?.description ||
    "Item";

  // specific helper for accessibility features
  const getAccessibilityLabel = (f: AccessibilityFeature): string =>
    f.title ||
    f.name ||
    f.feature_name ||
    f.featureType?.name ||
    f.accessible_feature?.title ||
    f.optional_answer ||
    f.accessible_feature_id;

  // ⭐ map: featureId -> featureTypeId (master list se)
  const featureIdToTypeId: Record<string, string> = {};
  allFeatures.forEach((f) => {
    const activeLink = f.linkedTypes?.find((lt) => lt.active);
    if (activeLink) {
      featureIdToTypeId[f.id] = activeLink.accessible_feature_type_id;
    }
  });

  // ⭐ helper: typeId se naam lao
  const getTypeNameFromId = (typeId: string): string => {
    if (!typeId || typeId === "other") return "Other";
    const t = featureTypes.find((ft) => ft.id === typeId);
    return t?.name || t?.title || t?.label || "Other";
  };

  const activeTours: VirtualTour[] =
    business?.virtualTours?.filter((t) => t.active) || [];

  const propertyImages: string[] =
    business?.businessMedia
      ?.map((m: any) => m.image_url || m.media_url || m.url)
      .filter(Boolean) || [];

  const currentBusinessImages = businessImages.filter(
    (img) => img.business_id === business?.id && img.active
  );


  console.log(currentBusinessImages);
  // ⭐ groups pre-compute (same typeId -> same group)
  const featureGroups: AccessibilityFeatureGroup[] =
    business?.accessibilityFeatures && business.accessibilityFeatures.length > 0
      ? Object.values(
          (business.accessibilityFeatures || []).reduce(
            (
              acc: Record<string, AccessibilityFeatureGroup>,
              f: AccessibilityFeature
            ) => {
              // is business feature ka type id master list se
              const typeId =
                featureIdToTypeId[f.accessible_feature_id] ||
                f.featureType?.id ||
                f.accessible_feature_type_id ||
                "other";

              const safeTypeId = typeId || "other";
              const typeName = getTypeNameFromId(safeTypeId);

              if (!acc[safeTypeId]) {
                acc[safeTypeId] = { typeId: safeTypeId, typeName, items: [] };
              }
              acc[safeTypeId].items.push(f);
              return acc;
            },
            {}
          )
        )
      : [];

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
      <div className="tour border p-6 rounded-3xl border-[#e5e5e7] w-full ">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Virtual Tours</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenVirtualTour(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Virtual Tours
              </button>
            </div>
          </div>
        </div>
        <p>
          Explore the location virtually to make informed decisions and plan
          your visit
        </p>
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
                <div className="link flex items-center space-x-2">
                  <a
                    href={tour.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0519CE] underline text-sm"
                  >
                    View
                  </a>
                  {/* GREEN TICK → active toggle */}
                  <img
                    src="/assets/images/green-tick.svg"
                    alt="green-tick"
                    className="w-5 h-5 cursor-pointer"
                  />
                  {/* YELLOW PENCIL → edit popup */}
                  <img
                    src="/assets/images/yellow-pencil.svg"
                    alt="yellow-pencil"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onEditVirtualTour?.(tour)}
                  />
                  {/* RED DELETE → delete API */}
                  <img
                    src="/assets/images/red-delete.svg"
                    alt="red-delete"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onDeleteVirtualTour?.(tour)}
                  />
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Property Images</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenPropertyImagePopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Property Images
              </button>
            </div>
          </div>
        </div>

        {currentBusinessImages.length > 0 ? (
          <div className="flex flex-wrap gap-2 items-center">
            {currentBusinessImages.map((image, index) => (
              <div
                key={image.id || index}
                className="relative box-content overflow-hidden w-[24%]"
              >
                <img
                  src={`https://ablevu-storage.s3.us-east-1.amazonaws.com/business-images/${image.id}.png`}
                  alt={image.name || `Property image ${index + 1}`}
                  className="w-full my-1.5 rounded-2xl cursor-pointer object-cover h-36"
                />
                <div className="absolute top-2 right-2 w-auto px-1 py-0.5 icon-box flex items-center gap-2 box-content rounded bg-[#9c9c9c91]">
                  <img
                    src="/assets/images/green-tick.svg"
                    alt="green-tick"
                    className="w-5 h-5 cursor-pointer"
                  />
                  <img
                    src="/assets/images/yellow-pencil.svg"
                    alt="yellow-pencil"
                    className="w-5 h-5 cursor-pointer"
                  />
                  <img
                    src="/assets/images/red-delete.svg"
                    alt="red-delete"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onDeleteBusinessImage?.(image)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">
              No property images to show
            </p>
          </div>
        )}
      </div>

      {/* ---------- Accessibility Features ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Accessibility Features</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenAccessibilityFeaturePopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Accessibility Features
              </button>
            </div>
          </div>
        </div>

        {featureGroups.length > 0 ? (
          <div className="audios py-6 rounded-xl space-y-4">
            {featureGroups.map((group) => (
              <div key={group.typeId} className="box flex items-start gap-3">
                {/* left icons */}
                <div className="w-[120px]">
                  <div className="icon-box flex items-center gap-2 box-content w-full">
                    <img
                      src="/assets/images/green-tick.svg"
                      alt="green-tick"
                      className="w-5 h-5 cursor-pointer"
                    />
                    <img
                      src="/assets/images/red-delete.svg"
                      alt="red-delete"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() =>
                        onDeleteAccessibilityFeatureGroup?.(group)
                      }
                    />
                  </div>
                </div>

                {/* type name: Physical, Sensory, ... */}
                <div className="heading box-content w-[120px]">
                  <h3 className="text-md text-gray-700 font-semibold">
                    {group.typeName}
                  </h3>
                </div>

                {/* selected features as pills */}
                <div className="content flex flex-wrap items-start gap-2">
                  {group.items.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto"
                    >
                      <img
                        src="/assets/images/tick.svg"
                        alt="tick"
                        className="w-5 h-5"
                      />
                      <h3 className="text-sm">{getAccessibilityLabel(f)}</h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">
            Partner Certifications/Programs
          </h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenPartnerCertificationsPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Partner Certifications/Programs
              </button>
            </div>
          </div>
        </div>

        {business.businessPartners && business.businessPartners.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {business.businessPartners.map((p: any) => {
              const partner = p.partner || p;

              const partnerName = partner.name || getLabel(partner);
              const partnerImage = partner.image_url || partner.logo_url;
              const partnerUrl = partner.web_url || partner.link;

              return (
                <section
                  key={p.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm w-[22%] min-w-[220px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 pr-2">
                      <div className="detail flex flex-col">
                        <div className="text-gray-700 font-semibold text-md">
                          {partnerName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer">
                      <img
                        src="/assets/images/green-tick.svg"
                        alt="green-tick"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="/assets/images/red-delete.svg"
                        alt="red-delete"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => onDeletePartner?.(p.partner?.id)}
                      />
                    </div>
                  </div>

                  <div className="w-full flex justify-center py-5">
                    {partnerImage ? (
                      <img
                        src={partnerImage}
                        alt={partnerName}
                        className="max-h-20 object-contain"
                      />
                    ) : (
                      <img
                        src="/assets/images/brand-1.png"
                        alt=""
                        className="max-h-20 object-contain"
                      />
                    )}
                  </div>

                  {partnerUrl && (
                    <div className="link w-full flex justify-center py-1">
                      <a
                        href={partnerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm text-[#0519CE]"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Reviews</h3>
          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenWriteReviewsPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Write Reviews
              </button>
            </div>
          </div>
        </div>

        {business.businessreviews && business.businessreviews.length > 0 ? (
          <div className="space-y-4">
            {business.businessreviews.map((r) => {
              const reviewer = r.reviewer_name || "Anonymous user";
              const dateSource = r.approvedAt || r.created_at;
              const dateText = dateSource
                ? new Date(dateSource).toLocaleDateString()
                : "";
              const text = r.description;

              return (
                <section
                  key={r.id}
                  className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src="/assets/images/Profile.avif"
                          className="w-10 h-10"
                          alt="profile"
                        />
                      </div>
                      <div className="detail flex flex-col">
                        <div className="text-gray-700 font-semibold text-md">
                          {reviewer}
                        </div>
                        {dateText && (
                          <div className="text-gray-700 text-md">
                            {dateText}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer pr-5">
                      {r.approved && (
                        <img
                          src="/assets/images/green-tick.svg"
                          alt="green-tick"
                          className="w-5 h-5 cursor-pointer"
                        />
                      )}
                      <img
                        src="/assets/images/red-delete.svg"
                        alt="red-delete"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => onDeleteReview?.(r)}
                      />
                    </div>
                  </div>

                  <p className="text-md text-gray-900 mb-2">{text}</p>
                </section>
              );
            })}
          </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Accessibility Questions</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenQuestionPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Questions
              </button>
            </div>
          </div>
        </div>

        {business.businessQuestions && business.businessQuestions.length > 0 ? (
          <div className="space-y-4">
            {business.businessQuestions.map((q) => {
              const shouldShowName = q.show_name && q.user?.name;
              const displayName = shouldShowName ? q.user!.name : "Anonymous";

              return (
                <section
                  key={q.id}
                  className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src="/assets/images/Profile.avif"
                          className="w-6 h-6"
                          alt="profile"
                        />
                      </div>

                      <div className="text-gray-700 font-semibold">
                        {displayName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer pr-5">
                      <img
                        src="/assets/images/green-tick.svg"
                        alt="green-tick"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="/assets/images/red-delete.svg"
                        alt="red-delete"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => onDeleteQuestion?.(q)}
                      />
                    </div>
                  </div>

                  <h2 className="text-md font-semibold text-gray-900 mb-2">
                    {q.question}
                  </h2>

                  {q.answer ? (
                    <div className="mt-2 border border-gray-200 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800">{q.answer}</p>
                    </div>
                  ) : (
                    <textarea
                      rows={4}
                      cols={4}
                      placeholder="Write your answer here..."
                      className="w-full border placeholder:text-gray-600 border-gray-300 rounded-lg p-4 text-sm hover:border-[#0519CE] focus:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none mt-2"
                    ></textarea>
                  )}
                </section>
              );
            })}
          </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">
            Additional Accessibility Resources
          </h3>
          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenAccessibilityResourcesPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Accessibility Resources
              </button>
            </div>
          </div>
        </div>

        {business.additionalaccessibilityresources &&
          business.additionalaccessibilityresources.length > 0 ? (
          <div className="pr-2 flex flex-wrap justify-between gap-3">
            {business.additionalaccessibilityresources.map((r) => (
              <div
                key={r.id}
                className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]"
              >
                <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                  <img
                    src="/assets/images/green-tick.svg"
                    alt="green-tick"
                    className="w-5 h-5 cursor-pointer"
                  />
                  <img
                    src="/assets/images/yellow-pencil.svg"
                    alt="yellow-pencil"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onEditAdditionalResource?.(r)}
                  />
                  <img
                    src="/assets/images/red-delete.svg"
                    alt="red-delete"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onDeleteAdditionalResource?.(r)}
                  />
                </div>

                <div className="paragraph text-start items-center flex gap-5">
                  <img
                    src="/assets/images/file.avif"
                    alt="file"
                    className="w-8 h-8"
                  />
                  <div>
                    <p className="text-gray-800 text-sm font-semibold">
                      {r.label}
                    </p>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0519CE] underline break-all"
                    >
                      {r.link}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Accessibility Media</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenAccessibilityMediaPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Accessibility Media
              </button>
            </div>
          </div>
        </div>

        {business.businessMedia && business.businessMedia.length > 0 ? (
          <div className="audios pr-2 flex flex-wrap justify-between text-center gap-3">
            {business.businessMedia.map((m: any) => (
              <div
                key={m.id}
                className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[48%]"
              >
                <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                  <img
                    src="/assets/images/green-tick.svg"
                    alt="green-tick"
                    className="w-5 h-5 cursor-pointer"
                  />
                  <img
                    src="/assets/images/yellow-pencil.svg"
                    alt="yellow-pencil"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onEditBusinessMedia?.(m)}
                  />
                  <img
                    src="/assets/images/red-delete.svg"
                    alt="red-delete"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onDeleteBusinessMedia?.(m)}
                  />
                </div>

                <div className="heading flex justify-between items-start">
                  <h3 className="text-xl text-gray-800 text-start font-semibold mb-4 pr-2">
                    {m.label || m.title || getLabel(m)}
                  </h3>

                  {m.link || m.link_url || m.url ? (
                    <a
                      href={m.link || m.link_url || m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 text-sm text-[#0519CE] rounded-full cursor-pointer underline transition"
                    >
                      View
                    </a>
                  ) : null}
                </div>

                <div className="paragraph text-start">
                  <p className="text-gray-700 text-sm">
                    {m.description || m.summary || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Media to show</p>
          </div>
        )}
      </div>

      {/* ---------- Custom Sections ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Custom Sections</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenCustonSectionPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition"
              >
                Add Custom Sections
              </button>
            </div>
          </div>
        </div>

        {business.businessCustomSections &&
          business.businessCustomSections.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700">
            {business.businessCustomSections.map((s: any) => (
              <li key={s.id} className="border-b pb-2">
                <div className="font-semibold">
                  {s.heading || s.title || s.label || getLabel(s)}
                </div>

                {(s.description || s.content) && (
                  <p className="text-gray-600 mt-1">
                    {s.description || s.content}
                  </p>
                )}
              </li>
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
