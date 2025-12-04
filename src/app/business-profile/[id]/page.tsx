"use client";

import React, { useEffect, useState, useCallback } from "react";
import { use } from "react";
import BusinessSidebar from "@/app/component/BusinessSidebar";
import Maincontent from "@/app/component/Maincontent";
import BusinessDetail from "@/app/component/BusinessDetail";
import Operatinghours from "@/app/component/Operatinghours";
import Profilesocial from "@/app/component/Profilesocial";
import Profileabout from "@/app/component/Profileabout";
import VirtualTour from "@/app/component/VirtualTour";
import AccessibilityFeaturePopup from "@/app/component/AccessibilityFeaturePopup";
import PropertyImagePopup from "@/app/component/PropertyImagePopup";
import CustomSectionPopup from "@/app/component/CustomSectionPopup";
import AccessibilityMediaPopup from "@/app/component/AccessibilityMediaPopup";
import AccessibilityResourcesPopup from "@/app/component/AccessibilityResourcesPopup";
import QuestionPopup from "@/app/component/QuestionPopup";
import WriteReviewsPopup from "@/app/component/WriteReviewsPopup";
import PartnerCertificationPopup from "@/app/component/PartnerCertificationPopup";

type BusinessProfile = any;
type BusinessType = any;

// same shape jo Maincontent me group ke liye use hoga
type AccessibilityFeatureGroup = {
  typeId: string;
  typeName: string;
  items: any[]; // business.accessibilityFeatures ke items
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [OpenDetailPopup, setOpenDetailPopup] = useState(false);
  const [OpenOperatingHours, setOpenOperatingHours] = useState(false);
  const [OpenSocialLinks, setOpenSocialLinks] = useState(false);
  const [OpenAboutModal, setOpenAboutModal] = useState(false);

  // ⭐ virtual tour state (popup + selected tour)
  const [OpenVirtualTour, setOpenVirtualTourState] = useState(false);
  const [selectedVirtualTour, setSelectedVirtualTour] = useState<any | null>(
    null
  );

  // ⭐ Accessibility Feature: popup + edit state
  const [OpenAccessibilityFeaturePopup, setOpenAccessibilityFeaturePopup] =
    useState(false);
  const [editFeatureTypeId, setEditFeatureTypeId] = useState<string | null>(
    null
  );
  const [editFeatureIds, setEditFeatureIds] = useState<string[]>([]);

  const [OpenPropertyImagePopup, setOpenPropertyImagePopup] = useState(false);
  const [OpenCustonSectionPopup, setOpenCustonSectionPopup] = useState(false);

  // ⭐ Accessibility Media: popup + selected media (for edit)
  const [OpenAccessibilityMediaPopup, setOpenAccessibilityMediaPopupState] =
    useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  // ⭐ Additional Resources: popup + selected resource (for edit)
  const [
    OpenAccessibilityResourcesPopup,
    setOpenAccessibilityResourcesPopupState,
  ] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  const [OpenQuestionPopup, setOpenQuestionPopup] = useState(false);
  const [OpenWriteReviewsPopup, setOpenWriteReviewsPopup] = useState(false);
  const [OpenPartnerCertificationsPopup, setOpenPartnerCertificationsPopup] =
    useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  // 🔁 Common function: business profile + business types fetch karo
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();

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

  // ---- Virtual tour popup opener (used by "Add Virtual Tours" button) ----
  const handleSetOpenVirtualTour = (open: boolean) => {
    if (open) {
      // create mode by default
      setSelectedVirtualTour(null);
    }
    setOpenVirtualTourState(open);
  };

  // ---- Virtual tour actions for Maincontent icons ----
  const handleEditVirtualTour = (tour: any) => {
    // map API fields → popup fields
    setSelectedVirtualTour({
      id: tour.id,
      name: tour.name,
      linkUrl: tour.link_url,
      displayOrder: tour.display_order,
      active: tour.active,
    });
    setOpenVirtualTourState(true);
  };

  const handleDeleteVirtualTour = async (tour: any) => {
    if (!API_BASE_URL || !business) return;
    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    if (!window.confirm("Delete this virtual tour?")) return;

    const res = await fetch(
      `${API_BASE_URL}/business-virtual-tours/delete/${tour.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const t = await res.text();
      console.error(t || "Failed to delete tour");
      alert("Failed to delete tour");
      return;
    }

    await fetchAllData();
  };

  const handleToggleVirtualTourActive = async (tour: any) => {
    if (!API_BASE_URL || !business) return;
    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const payload = {
      active: !tour.active,
      businessId: business.id,
    };

    const res = await fetch(
      `${API_BASE_URL}/business-virtual-tours/update/${tour.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const t = await res.text();
      console.error(t || "Failed to update active state");
      alert("Failed to update active state");
      return;
    }

    await fetchAllData();
  };

  // ---- Review delete handler ----
  const handleDeleteReview = async (review: any) => {
    if (!API_BASE_URL || !business) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/business-reviews/delete/${review.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        let msg = "Failed to delete review";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(msg);
      }

      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete review");
    }
  };

  // ---- Question delete handler ----
  const handleDeleteQuestion = async (question: any) => {
    if (!API_BASE_URL || !business) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/business-questions/delete/${question.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        let msg = "Failed to delete question";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(msg);
      }

      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete question");
    }
  };

  // ---- Partner delete handler ----
  const handleDeletePartner = async (partner: any) => {
    if (!API_BASE_URL || !business) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const confirmDelete = window.confirm(
      "Delete this partner certification/program?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/partner/delete/${partner.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let msg = "Failed to delete partner";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(msg);
      }

      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete partner");
    }
  };

  // ---- Additional Accessibility Resource delete handler ----
  const handleDeleteAdditionalResource = async (resource: any) => {
    if (!API_BASE_URL || !business) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const confirmDelete = window.confirm(
      "Delete this accessibility resource?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/additional-resource/delete/${resource.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        let msg = "Failed to delete resource";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(msg);
      }

      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete resource");
    }
  };

  // ---- Business Media delete handler ----
  const handleDeleteBusinessMedia = async (media: any) => {
    if (!API_BASE_URL || !business) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const confirmDelete = window.confirm(
      "Delete this accessibility media item?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/business-media/delete/${media.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        let msg = "Failed to delete media";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(msg);
      }

      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete media");
    }
  };

  // ---- Accessibility Media: Add button popup handler ----
  const handleSetOpenAccessibilityMediaPopup: React.Dispatch<
    React.SetStateAction<boolean>
  > = (value) => {
    if (typeof value === "function") {
      setOpenAccessibilityMediaPopupState((prev) => {
        const next = value(prev);
        if (next) {
          // Add Media → blank form
          setSelectedMedia(null);
        }
        return next;
      });
    } else {
      if (value) {
        setSelectedMedia(null);
      }
      setOpenAccessibilityMediaPopupState(value);
    }
  };

  // ---- Accessibility Media: edit handler (yellow pencil) ----
  const handleEditBusinessMedia = (media: any) => {
    setSelectedMedia(media); // pre-fill form
    setOpenAccessibilityMediaPopupState(true);
  };

  // ---- Additional Resources: Add button popup handler ----
  const handleSetOpenAccessibilityResourcesPopup: React.Dispatch<
    React.SetStateAction<boolean>
  > = (value) => {
    if (typeof value === "function") {
      setOpenAccessibilityResourcesPopupState((prev) => {
        const next = value(prev);
        if (next) {
          // Add Resources → edit clear
          setSelectedResource(null);
        }
        return next;
      });
    } else {
      if (value) {
        setSelectedResource(null);
      }
      setOpenAccessibilityResourcesPopupState(value);
    }
  };

  // ---- Additional Resources: edit handler (yellow pencil) ----
  const handleEditAdditionalResource = (resource: any) => {
    setSelectedResource(resource); // pre-fill form
    setOpenAccessibilityResourcesPopupState(true);
  };

  // ---- Accessibility Feature: Add button ----
  const handleSetOpenAccessibilityFeaturePopup: React.Dispatch<
    React.SetStateAction<boolean>
  > = (value) => {
    if (typeof value === "function") {
      setOpenAccessibilityFeaturePopup((prev) => {
        const next = value(prev);
        if (next) {
          // ADD mode → edit state clear
          setEditFeatureTypeId(null);
          setEditFeatureIds([]);
        }
        return next;
      });
    } else {
      if (value) {
        // ADD mode → edit state clear
        setEditFeatureTypeId(null);
        setEditFeatureIds([]);
      }
      setOpenAccessibilityFeaturePopup(value);
    }
  };

  // ---- Accessibility Feature: edit handler (group pencil) ----
  const handleEditAccessibilityFeatureGroup = (
    group: AccessibilityFeatureGroup
  ) => {
    // group.items ke andar accessible_feature_id hona chahiye
    const ids =
      group.items
        ?.map((item: any) => item.accessible_feature_id)
        .filter((x: string | undefined) => !!x) || [];

    setEditFeatureTypeId(group.typeId);
    setEditFeatureIds(ids);
    setOpenAccessibilityFeaturePopup(true);
  };

  // ---- Accessibility Feature: delete handler (group trash) ----
  const handleDeleteAccessibilityFeatureGroup = async (
    group: AccessibilityFeatureGroup
  ) => {
    if (!API_BASE_URL || !business) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete all accessibility features of type "${group.typeName}"?`
    );
    if (!confirmDelete) return;

    try {
      // group.items ke andar har item ka id join-table id hona chahiye
      for (const f of group.items) {
        await fetch(
          `${API_BASE_URL}/business-accessible-feature/delete/${f.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete accessibility features");
    }
  };

  // 🌟 Return UI
  return (
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
          // ⭐ custom handler
          setOpenVirtualTour={handleSetOpenVirtualTour}
          setOpenAccessibilityFeaturePopup={handleSetOpenAccessibilityFeaturePopup}
          setOpenPropertyImagePopup={setOpenPropertyImagePopup}
          setOpenCustonSectionPopup={setOpenCustonSectionPopup}
          setOpenAccessibilityMediaPopup={handleSetOpenAccessibilityMediaPopup}
          setOpenAccessibilityResourcesPopup={
            handleSetOpenAccessibilityResourcesPopup
          }
          setOpenQuestionPopup={setOpenQuestionPopup}
          setOpenWriteReviewsPopup={setOpenWriteReviewsPopup}
          setOpenPartnerCertificationsPopup={
            setOpenPartnerCertificationsPopup
          }
          // ⭐ Virtual tour icon handlers
          onEditVirtualTour={handleEditVirtualTour}
          onDeleteVirtualTour={handleDeleteVirtualTour}
          onToggleVirtualTourActive={handleToggleVirtualTourActive}
          // ⭐ Review delete handler
          onDeleteReview={handleDeleteReview}
          // ⭐ Question delete handler
          onDeleteQuestion={handleDeleteQuestion}
          // ⭐ Partner delete handler
          onDeletePartner={handleDeletePartner}
          // ⭐ Additional resource handlers
          onDeleteAdditionalResource={handleDeleteAdditionalResource}
          onEditAdditionalResource={handleEditAdditionalResource}
          // ⭐ Business media handlers
          onDeleteBusinessMedia={handleDeleteBusinessMedia}
          onEditBusinessMedia={handleEditBusinessMedia}
          // ⭐ Accessibility Feature group handlers
          onEditAccessibilityFeatureGroup={handleEditAccessibilityFeatureGroup}
          onDeleteAccessibilityFeatureGroup={
            handleDeleteAccessibilityFeatureGroup
          }
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
          setOpenVirtualTour={handleSetOpenVirtualTour}
          tour={selectedVirtualTour}
          onUpdated={fetchAllData} // UI refresh
        />
      )}

      {OpenAccessibilityFeaturePopup && business && (
        <AccessibilityFeaturePopup
          businessId={business.id}
          setOpenAccessibilityFeaturePopup={setOpenAccessibilityFeaturePopup}
          initialTypeId={editFeatureTypeId || undefined}
          initialFeatureIds={editFeatureIds}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenPropertyImagePopup && business && (
        <PropertyImagePopup
          businessId={business.id}
          setOpenPropertyImagePopup={setOpenPropertyImagePopup}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenCustonSectionPopup && business && (
        <CustomSectionPopup
          businessId={business.id}
          setOpenCustonSectionPopup={setOpenCustonSectionPopup}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenAccessibilityMediaPopup && business && (
        <AccessibilityMediaPopup
          businessId={business.id}
          setOpenAccessibilityMediaPopup={setOpenAccessibilityMediaPopupState}
          media={selectedMedia}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenAccessibilityResourcesPopup && business && (
        <AccessibilityResourcesPopup
          businessId={business.id}
          setOpenAccessibilityResourcesPopup={
            setOpenAccessibilityResourcesPopupState
          }
          resource={selectedResource}
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}

      {OpenQuestionPopup && business && (
        <QuestionPopup
          businessId={business.id}
          setOpenQuestionPopup={setOpenQuestionPopup}
          onUpdated={fetchAllData}
        />
      )}

      {OpenWriteReviewsPopup && business && (
        <WriteReviewsPopup
          businessId={business.id}
          setOpenWriteReviewsPopup={setOpenWriteReviewsPopup}
          onUpdated={fetchAllData}
        />
      )}

      {OpenPartnerCertificationsPopup && business && (
        <PartnerCertificationPopup
          businessId={business.id}
          setOpenPartnerCertificationsPopup={
            setOpenPartnerCertificationsPopup
          }
          onUpdated={async (updated) => {
            setBusiness(updated);
            await fetchAllData();
          }}
        />
      )}
    </div>
  );
}