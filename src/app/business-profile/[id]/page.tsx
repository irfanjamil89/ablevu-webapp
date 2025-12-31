"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import EditPropertyImagePopup from "@/app/component/EditPropertyImagePopup";
import AudioTourPopup from "@/app/component/AudioTourPopup";
import CustomMediaModal from "@/app/component/CustomMediaPopup";

type BusinessProfile = any;
type BusinessType = any;

type AccessibilityFeatureGroup = {
    typeId: string;
    typeName: string;
    items: any[];
};

// ⭐ Business Image type
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
// 🌟 Global feedback popup type
type FeedbackState = {
    type: "success" | "error" | null;
    title: string;
    message: string;
    onClose?: () => void;
};

type ConfirmState = {
    open: boolean;
    title: string;
    message: string;
    // yahan async bhi allow hai
    onConfirm?: () => void | Promise<void>;
};

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);

    const [business, setBusiness] = useState<BusinessProfile | null>(null);
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
    // ⭐ NEW: Business images state
    const [businessImages, setBusinessImages] = useState<BusinessImage[]>([]);

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
    const [OpenAudioTourPopup, setOpenAudioTourPopup] = useState(false);
    const [CustomMediaPopup, setCustomMediaPopup] = useState(false);
    

    // ⭐ Accessibility Feature: popup + edit state
    const [OpenAccessibilityFeaturePopup, setOpenAccessibilityFeaturePopup] =
        useState(false);
    const [editFeatureTypeId, setEditFeatureTypeId] = useState<string | null>(
        null
    );
    const [editFeatureIds, setEditFeatureIds] = useState<string[]>([]);

    const [OpenPropertyImagePopup, setOpenPropertyImagePopup] = useState(false);
    const [OpenEditPropertyImagePopup, setOpenEditPropertyImagePopup] = useState(false);
    const [SelectedImageId, setSelectedImageId] = useState<string>("");


    const [OpenCustonSectionPopup, setOpenCustonSectionPopup] = useState(false);
     const [OpenCustomMediaPopup, setOpenCustomMediaPopup] = useState(false);
     const [activeCustomSectionId, setActiveCustomSectionId] = useState<string | null>(null);

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

    // 🌟 Global feedback state
    const [feedback, setFeedback] = useState<FeedbackState>({
        type: null,
        title: "",
        message: "",
    });

    const [confirm, setConfirm] = useState<ConfirmState>({
        open: false,
        title: "",
        message: "",
        onConfirm: undefined,
    });

    const askConfirm = (
        title: string,
        message: string,
        onConfirm: () => void | Promise<void>
    ) => {
        setConfirm({
            open: true,
            title,
            message,
            onConfirm,
        });
    };

    const handleCloseConfirm = () => {
        setConfirm((prev) => ({ ...prev, open: false, onConfirm: undefined }));
    };


    const showSuccess = (
        title: string,
        message: string,
        onClose?: () => void
    ) => {
        setFeedback({ type: "success", title, message, onClose });
    };

    const showError = (title: string, message: string, onClose?: () => void) => {
        setFeedback({ type: "error", title, message, onClose });
    };

    const handleCloseFeedback = () => {
        if (feedback.onClose) feedback.onClose();
        setFeedback({ type: null, title: "", message: "" });
    };

    // 🔁 Common function: business profile + business types fetch karo
    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getToken();

            // 1️⃣ Fetch business profile
            const profileRes = await fetch(
                `${API_BASE_URL}/business/business-profile/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                       
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

            // 3️⃣ ⭐ NEW: Fetch business-images
            const imagesRes = await fetch(
                `${API_BASE_URL}/business-images/list`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!imagesRes.ok) throw new Error("Failed to fetch business images");

            const imagesData = await imagesRes.json();

            // Extract data array from response
            const images = imagesData.data || [];
            setBusinessImages(images);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
            showError("Error", err.message || "Something went wrong while loading.");
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
        setSelectedVirtualTour({
            id: tour.id,
            name: tour.name,
            linkUrl: tour.link_url,
            displayOrder: tour.display_order,
            active: tour.active,
        });
        setOpenVirtualTourState(true);
    };

    const handleDeleteVirtualTour = (tour: any) => {
        if (!API_BASE_URL || !business) return;
        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Virtual Tour?",
            "Are you sure you want to delete this virtual tour?",
            async () => {
                try {
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
                        throw new Error("Failed to delete tour");
                    }

                    await fetchAllData();
                    showSuccess("Deleted", "Virtual tour deleted successfully.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete tour.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };

    const handleToggleVirtualTourActive = async (tour: any) => {
        if (!API_BASE_URL || !business) return;
        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        const payload = {
            active: !tour.active,
            businessId: business.id,
        };

        try {
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
                throw new Error("Failed to update active state");
            }

            await fetchAllData();
            showSuccess(
                "Updated",
                `Virtual tour has been ${!tour.active ? "activated" : "deactivated"}.`
            );
        } catch (err: any) {
            console.error(err);
            showError(
                "Update Failed",
                err.message || "Failed to update virtual tour status."
            );
        }
    };

    // ---- Review delete handler ----
    const handleDeleteReview = (review: any) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Review?",
            "Are you sure you want to delete this review?",
            async () => {
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/business-reviews/delete/${review.id}`,
                        {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
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
                        } catch { }
                        throw new Error(msg);
                    }

                    await fetchAllData();
                    showSuccess("Deleted", "Review has been deleted successfully.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete review.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };

    // ---- Question delete handler ----
    const handleDeleteQuestion = (question: any) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Question?",
            "Are you sure you want to delete this question?",
            async () => {
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/business-questions/delete/${question.id}`,
                        {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
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
                        } catch { }
                        throw new Error(msg);
                    }

                    await fetchAllData();
                    showSuccess("Deleted", "Question has been deleted successfully.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete question.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };
    // ---- Partner delete handler ----
    const handleDeletePartner = (partnerId: string) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Partner?",
            "Are you sure you want to delete this partner certification/program?",
            async () => {
                const payload = { partner_id: partnerId };

                try {
                    const res = await fetch(
                        `${API_BASE_URL}/business-partner/delete/${business.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(payload),
                        }
                    );

                    if (!res.ok) {
                        let msg = "Failed to delete partner";
                        try {
                            const body = await res.json();
                            if (body?.message) {
                                msg = Array.isArray(body.message)
                                    ? body.message.join(", ")
                                    : body.message;
                            }
                        } catch { }
                        throw new Error(msg);
                    }

                    await fetchAllData();
                    showSuccess("Deleted", "Partner certification has been deleted.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete partner.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };

    // ---- Additional Accessibility Resource delete handler ----
    const handleDeleteAdditionalResource = (resource: any) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Resource?",
            "Are you sure you want to delete this accessibility resource?",
            async () => {
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
                        } catch { }
                        throw new Error(msg);
                    }

                    await fetchAllData();
                    showSuccess("Deleted", "Accessibility resource has been deleted.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete resource.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };

    const handleDeleteCustomSectionMedia = (media: any) => {
        if (!API_BASE_URL || !business) return;
        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }
        askConfirm(
            "Delete Media?",
            "Are you sure you want to delete this custom section media item?",
            async () => {
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/business-custom-sections-media/delete/${media.id}`,
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
                        } catch { }
                        throw new Error(msg);
                    }
                    await fetchAllData();
                    showSuccess("Deleted", "Custom section media has been deleted.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete media.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };

    const handleEditCustomSectionMedia = (media: any) => {
        setSelectedMedia(media);
        setOpenCustomMediaPopup(true);
    }
    const handleAddCustomSectionMedia = (sectionId: string) => {
  setSelectedMedia(null); 
  setActiveCustomSectionId(sectionId);
  setOpenCustomMediaPopup(true);
};


    



    // ---- Business Media delete handler ----
    const handleDeleteBusinessMedia = (media: any) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Media?",
            "Are you sure you want to delete this accessibility media item?",
            async () => {
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
                        } catch { }
                        throw new Error(msg);
                    }

                    await fetchAllData();
                    showSuccess("Deleted", "Accessibility media has been deleted.");
                } catch (err: any) {
                    console.error(err);
                    showError("Delete Failed", err.message || "Failed to delete media.");
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    }; 

    //  NEW: Business Image delete handler

    const handleDeleteBusinessImage = (image: BusinessImage) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            "Delete Business Image?",
            `Are you sure you want to delete "${image.name || 'this image'}"?`,
            async () => {
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/business-images/delete/${image.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!res.ok) {
                        let msg = "Failed to delete business image";
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
                    showSuccess(
                        "Deleted",
                        `Business image "${image.name || 'Image'}" has been deleted successfully.`
                    );
                } catch (err: any) {
                    console.error(err);
                    showError(
                        "Delete Failed",
                        err.message || "Failed to delete business image."
                    );
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };


    // const handleDeleteBusinessImage = async (image: BusinessImage) => {
    //     if (!API_BASE_URL || !business) return;

    //     const token = getToken();
    //     if (!token) {
    //         alert("No access token");
    //         return;
    //     }

    //     const confirmDelete = window.confirm("Delete this business image?");
    //     if (!confirmDelete) return;

    //     try {
    //         const res = await fetch(
    //             `${API_BASE_URL}/business-images/delete/${image.id}`,
    //             {
    //                 method: "DELETE",
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         if (!res.ok) {
    //             let msg = "Failed to delete business image";
    //             try {
    //                 const body = await res.json();
    //                 if (body?.message) {
    //                     msg = Array.isArray(body.message)
    //                         ? body.message.join(", ")
    //                         : body.message;
    //                 }
    //             } catch {
    //                 // ignore JSON parse error
    //             }
    //             throw new Error(msg);
    //         }

    //         await fetchAllData();
    //     } catch (err: any) {
    //         console.error(err);
    //         alert(err.message || "Failed to delete business image");
    //     }
    // };

    // ---- Accessibility Media: Add button popup handler ----
    const handleSetOpenAccessibilityMediaPopup: React.Dispatch<
        React.SetStateAction<boolean>
    > = (value) => {
        if (typeof value === "function") {
            setOpenAccessibilityMediaPopupState((prev) => {
                const next = value(prev);
                if (next) {
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
        setSelectedMedia(media);
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
        setSelectedResource(resource);
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
                    setEditFeatureTypeId(null);
                    setEditFeatureIds([]);
                }
                return next;
            });
        } else {
            if (value) {
                setEditFeatureTypeId(null);
                setEditFeatureIds([]);
            }
            setOpenAccessibilityFeaturePopup(value);
        }
    };

   const handleSetOpenCustomMediaPopup = (value: boolean | ((prev: boolean) => boolean)) => {
  if (typeof value === "function") {
    setOpenCustomMediaPopup((prev) => {
      const next = value(prev);
      if (next) setSelectedMedia(null);
      return next;
    });
  } else {
    if (value) setSelectedMedia(null);
    setOpenCustomMediaPopup(value);
  }
};


            

    // ---- Accessibility Feature: edit handler (group pencil) ----
    const handleEditAccessibilityFeatureGroup = (
        group: AccessibilityFeatureGroup
    ) => {
        const ids =
            group.items
                ?.map((item: any) => item.accessible_feature_id)
                .filter((x: string | undefined) => !!x) || [];

        setEditFeatureTypeId(group.typeId);
        setEditFeatureIds(ids);
        setOpenAccessibilityFeaturePopup(true);
    };

    // ---- Accessibility Feature: delete handler (group trash) ----
    const handleDeleteAccessibilityFeatureGroup = (group: AccessibilityFeatureGroup) => {
        if (!API_BASE_URL || !business) return;

        const token = getToken();
        if (!token) {
            showError("Unauthorized", "No access token found.");
            return;
        }

        askConfirm(
            `Delete "${group.typeName}" Features?`,
            `Are you sure you want to delete all accessibility features under "${group.typeName}"?`,
            async () => {
                try {
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
                    showSuccess(
                        "Deleted",
                        `All accessibility features of type "${group.typeName}" have been deleted.`
                    );
                } catch (err: any) {
                    console.error(err);
                    showError(
                        "Delete Failed",
                        err.message || "Failed to delete accessibility features."
                    );
                } finally {
                    handleCloseConfirm();
                }
            }
        );
    };


    // 🌟 Return UI
    return (
        <div>
            <div className="flex">
                <BusinessSidebar
                    business={business}
                    businessTypes={businessTypes}
                    businessOwner={business?.owner} 
                    loading={loading}
                    error={error}
                    setOpenDetailPopup={setOpenDetailPopup}
                    setOpenOperatingHours={setOpenOperatingHours}
                    setOpenSocialLinks={setOpenSocialLinks}
                    setOpenAboutModal={setOpenAboutModal}
                    // ⭐ New props for popup
                    showSuccess={showSuccess}
                    showError={showError}
                    refetchBusiness={fetchAllData}
                />

                <Maincontent
                    business={business}
                    businessImages={businessImages}
                    businessOwner={business?.owner} 
                    loading={loading}
                    error={error}
                    setOpenVirtualTour={handleSetOpenVirtualTour}
                    setOpenAudioTourPopup={setOpenAudioTourPopup}
                    setCustomMediaPopup={setCustomMediaPopup}
                    onDeleteCustomSectionMedia={handleDeleteCustomSectionMedia}
                    onEditCustomSectionMedia={handleEditCustomSectionMedia}
                    onAddCustomSectionMedia={handleAddCustomSectionMedia}
                    setOpenAccessibilityFeaturePopup={
                        handleSetOpenAccessibilityFeaturePopup
                    }
                    setOpenPropertyImagePopup={setOpenPropertyImagePopup}
                    setOpenEditPropertyImagePopup={setOpenEditPropertyImagePopup}
                    setSelectedImageId={setSelectedImageId}
                    setOpenCustonSectionPopup={setOpenCustonSectionPopup}
                    setOpenAccessibilityMediaPopup={
                        handleSetOpenAccessibilityMediaPopup
                    }
                    setOpenAccessibilityResourcesPopup={
                        handleSetOpenAccessibilityResourcesPopup
                    }
                    setOpenQuestionPopup={setOpenQuestionPopup}
                    setOpenWriteReviewsPopup={setOpenWriteReviewsPopup}
                    setOpenPartnerCertificationsPopup={
                        setOpenPartnerCertificationsPopup
                    }
                    onEditVirtualTour={handleEditVirtualTour}
                    onDeleteVirtualTour={handleDeleteVirtualTour}
                    onToggleVirtualTourActive={handleToggleVirtualTourActive}
                    onDeleteReview={handleDeleteReview}
                    onDeleteQuestion={handleDeleteQuestion}
                    onDeletePartner={handleDeletePartner}
                    onDeleteAdditionalResource={handleDeleteAdditionalResource}
                    onEditAdditionalResource={handleEditAdditionalResource}
                    onDeleteBusinessMedia={handleDeleteBusinessMedia}
                    onEditBusinessMedia={handleEditBusinessMedia}
                    onEditAccessibilityFeatureGroup={
                        handleEditAccessibilityFeatureGroup
                    }
                    onDeleteAccessibilityFeatureGroup={
                        handleDeleteAccessibilityFeatureGroup
                    }
                    // ⭐ NEW: Business image delete handler
                    onDeleteBusinessImage={handleDeleteBusinessImage}
                    showSuccess={showSuccess}
                    showError={showError}
                />
            </div>

            {OpenDetailPopup && business && (
                <BusinessDetail
                    businessId={business.id}
                    setOpenDetailPopup={setOpenDetailPopup}
                    onUpdated={async (updated) => {
                        setBusiness(updated);
                        await fetchAllData();
                        showSuccess(
                            "Details Updated",
                            "Business details updated successfully."
                        );
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
                        showSuccess(
                            "Operating Hours Updated",
                            "Operating hours updated successfully."
                        );
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
                        showSuccess(
                            "Social Links Updated",
                            "Social links updated successfully."
                        );
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
                        showSuccess(
                            "About Updated",
                            "Business about section updated successfully."
                        );
                    }}
                />
            )}

            {OpenVirtualTour && business && (
                <VirtualTour
                    businessId={business.id}
                    setOpenVirtualTour={handleSetOpenVirtualTour}
                    tour={selectedVirtualTour}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess(
                            "Virtual Tour Saved",
                            "Virtual tour has been saved successfully."
                        );
                    }}
                />
            )}

            {OpenAudioTourPopup && business && (
                <AudioTourPopup
                    businessId={business.id}
                    setOpenAudioTourPopup={setOpenAudioTourPopup}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess(
                            "Audio Tour Saved",
                            "Audio tour has been saved successfully."
                        );
                    }}
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
                        showSuccess(
                            "Accessibility Updated",
                            "Accessibility features updated successfully."
                        );
                    }}
                />
            )}

            {OpenPropertyImagePopup && business && (
                <PropertyImagePopup
                    businessId={business.id}
                    setOpenPropertyImagePopup={setOpenPropertyImagePopup}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess(
                            "Images Updated",
                            "Property images updated successfully."
                        );
                    }}
                />
            )}
            {OpenEditPropertyImagePopup && business && (
                <EditPropertyImagePopup
                    businessImageId={SelectedImageId}
                    setOpenEditPropertyImagePopup={setOpenEditPropertyImagePopup}
                    onUpdated={async (updated) => {
                        setBusiness(updated);
                        await fetchAllData();
                        showSuccess(
                            "Images Updated",
                            "Property images updated successfully."
                        );
                    }}
                />
            )}

            {OpenCustonSectionPopup && business && (
                <CustomSectionPopup
                    businessId={business.id}
                    setOpenCustonSectionPopup={setOpenCustonSectionPopup}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess(
                            "Custom Section Created",
                            "Custom section Created successfully."
                        );
                    }}
                />
            )}
            {OpenCustomMediaPopup && business && (
                <CustomMediaModal
                    businessId={business.id}
                    setCustomMediaPopup={handleSetOpenCustomMediaPopup}
                     activeCustomSectionId={activeCustomSectionId}
                     media= {selectedMedia}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess(
                            "Custom Media Saved",
                            "Custom Media has been saved successfully."
                        );
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
                        showSuccess(
                            "Media Updated",
                            "Accessibility media updated successfully."
                        );
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
                        showSuccess(
                            "Resources Updated",
                            "Accessibility resources updated successfully."
                        );
                    }}
                />
            )}

            {OpenQuestionPopup && business && (
                <QuestionPopup
                    businessId={business.id}
                    setOpenQuestionPopup={setOpenQuestionPopup}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess("Question Added", "Question added successfully.");
                    }}
                />
            )}

            {OpenWriteReviewsPopup && business && (
                <WriteReviewsPopup
                    businessId={business.id}
                    setOpenWriteReviewsPopup={setOpenWriteReviewsPopup}
                    onUpdated={async () => {
                        await fetchAllData();
                        showSuccess("Review Added", "Review added successfully.");
                    }}
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
                        showSuccess(
                            "Partners Updated",
                            "Partner certifications updated successfully."
                        );
                    }}
                />
            )}

            {/* 🌟 Global Confirm Popup */}
            {confirm.open && (
                <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                        <h2 className="text-lg font-bold mb-2">{confirm.title}</h2>
                        <p className="mb-6">{confirm.message}</p>

                        <div className="flex gap-3 justify-center">
                            <button
                                className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={handleCloseConfirm}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 rounded-full bg-[#DD3820] text-white hover:bg-red-700 cursor-pointer"
                                onClick={async () => {
                                    if (confirm.onConfirm) {
                                        await confirm.onConfirm();
                                    } else {
                                        handleCloseConfirm();
                                    }
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 🌟 Global Success/Error Popup */}
            {feedback.type && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                        <div className="flex justify-center mb-4">
                            <div
                                className={`rounded-full p-3 ${feedback.type === "success" ? "bg-[#0519CE]" : "bg-red-600"
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    {feedback.type === "success" ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
                                        />
                                    )}
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold mb-2">{feedback.title}</h2>
                        <p className="mb-4">{feedback.message}</p>
                        <button
                            className={`px-4 py-2 rounded-lg cursor-pointer text-white ${feedback.type === "success" ? "bg-[#0519CE]" : "bg-red-600"
                                }`}
                            onClick={handleCloseFeedback}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
