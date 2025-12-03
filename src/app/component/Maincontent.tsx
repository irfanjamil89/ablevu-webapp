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
  setOpenAccessibilityFeaturePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenPropertyImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCustonSectionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAccessibilityMediaPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAccessibilityResourcesPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenQuestionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenWriteReviewsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenPartnerCertificationsPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Maincontent({
  business,
  loading,
  error,
  setOpenVirtualTour,
  setOpenAccessibilityFeaturePopup,
  setOpenPropertyImagePopup,
  setOpenCustonSectionPopup,
  setOpenAccessibilityMediaPopup,
  setOpenAccessibilityResourcesPopup,
  setOpenQuestionPopup,
  setOpenWriteReviewsPopup,
  setOpenPartnerCertificationsPopup,

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
      <div className="tour border p-6 rounded-3xl border-[#e5e5e7] w-full ">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Virtual Tours</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenVirtualTour(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Virtual Tours
              </button>
            </div>
          </div>

        </div>
        <p >Explore the location virtually to make informed decisions and plan your visit</p>
        <p className='text-xs mt-1'>Interested in adding an accessibility virtual tour? Email <a href="mailto:info@ableeyes.org" ><span className="text-[#0205d3]">info@ableeyes.org</span></a> for more information</p>
        <div className="tours mt-6 flex flex-wrap justify-between gap-5">

          {activeTours.length > 0 ? (
            activeTours.map((tour) => (
              <div key={tour.id} className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]">
                <div className="icon flex items-center">
                  <img src="/assets/images/walking.svg" alt="" className="w-8 mr-4" />
                  <p>{tour.name}</p>
                </div>
                <div className="link flex items-center space-x-2">
                  <a href={tour.link_url}>View</a>
                  <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                  <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                  <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
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
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenPropertyImagePopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Property Images
              </button>
            </div>
          </div>



        </div>
        {propertyImages.length > 0 ? (
          // <div className="flex flex-wrap gap-x-2 items-center">
          //   {propertyImages.map((src, index) => (
          //     <img
          //       key={index}
          //       src={src}
          //       alt={`Property image ${index + 1}`}
          //       className="w-[19%] my-1.5 rounded-2xl cursor-pointer"
          //     />
          //   ))}
          // </div>
          <div className="flex flex-wrap gap-x-3 items-center">
            <div className='relative box-content overflow-hidden w-1/4'>
              <img src="/assets/images/book-img.png" alt="" className="w-full my-1.5 rounded-2xl cursor-pointer" />
              <div className="absolute top-4 right-0 w-auto px-1 py-0.5 icon-box flex items-center gap-2 box-content rounded bg-[#9c9c9c91]">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>
            </div>

          </div>

        ) : (
          // <div className="flex flex-wrap gap-x-2 items-center">

          //   {Array.from({ length: 8 }).map((_, i) => (
          //     <img
          //       key={i}
          //       src="/assets/images/pool.jpg"
          //       alt=""
          //       className="w-[19%] my-1.5 rounded-2xl cursor-pointer"
          //     />
          //   ))}
          // </div>
          <div className="flex flex-wrap gap-x-3 items-center">
            <div className='relative box-content overflow-hidden w-1/4'>
              <img src="/assets/images/book-img.png" alt="" className="w-full my-1.5 rounded-2xl cursor-pointer" />
              <div className="absolute top-4 right-0 w-auto px-1 py-0.5 icon-box flex items-center gap-2 box-content rounded bg-[#9c9c9c91]">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>
            </div>


          </div>
        )}
      </div>

      {/* ---------- Accessibility Features ---------- */}
      <div className="my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Accessibility Features</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenAccessibilityFeaturePopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Accessibility Features
              </button>
            </div>
          </div>

        </div>


        {business.accessibilityFeatures &&
          business.accessibilityFeatures.length > 0 ? (
          <div className="audios py-10 rounded-xl space-y-2">
            <div className='box flex items-center gap-3'>
              <div className='w-[120px]'>
                <div className="icon-box flex items-center gap-2 box-content w-full">
                  <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                  <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                  <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
                </div>
              </div>
              <div className="heading box-content w-[100px]">
                <h3 className='text-md text-gray-500'>Physical</h3>
              </div>

              <div className="content flex flex-wrap items-start gap-2">
                <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                  <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                  <h3 className='text-sm'>Accessible entrance available</h3>
                </div>

                <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                  <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                  <h3 className='text-sm'>Accessible entrance available</h3>
                </div>

                <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                  <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                  <h3 className='text-sm'>Accessible entrance available </h3>
                </div>

                <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                  <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                  <h3 className='text-sm'>Accessible entrance available</h3>
                </div>

                <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                  <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                  <h3 className='text-sm'>Accessible entrance available</h3>
                </div>
              </div>
            </div>

          </div>
          // <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
          //   {business.accessibilityFeatures.map((f: any) => (
          //     <li key={f.id}>{getLabel(f)}</li>
          //   ))}
          // </ul>
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
          <h3 className="text-xl font-[600] mb-4">Partner Certifications/Programs</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenPartnerCertificationsPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Partner Certifications/Programs
              </button>
            </div>
          </div>

        </div>


        {business.businessPartners && business.businessPartners.length > 0 ? (
          // <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
          //   {business.businessPartners.map((p: any) => (
          //     <li key={p.id}>{getLabel(p)}</li>
          //   ))}
          // </ul>
          <div className='flex flex-wrap space-x-3 space-y-3'>
            <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm w-[22%]">

              {/* <!-- Top Row --> */}
              <div className="flex items-center text-start justify-between mb-2">

                {/* <!-- Left: Anonymous + time --> */}
                <div className="flex items-center gap-3 pr-2">
                  <div className="detail flex flex-col">
                    <div className="text-gray-700 font-semibold text-md">Hidden Disabilities</div>
                  </div>

                </div>

                {/* <!-- Right: Location --> */}
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer">
                  <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                  <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
                </div>

              </div>

              <div className='w-full flex justify-center py-5'>
                <img src="/assets/images/brand-1.png" alt="" className='w-lg' />
              </div>

              <div className="link w-full flex justify-center py-1">
                <a href="#" className='hover:underline text-sm text-[#0519CE]'>Visit Website</a>
              </div>

            </section>

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
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenWriteReviewsPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Write Reviews
              </button>
            </div>
          </div>

        </div>

        {business.businessreviews && business.businessreviews.length > 0 ? (
          // <ul className="space-y-3 text-sm text-gray-700">
          //   {business.businessreviews.map((r: any) => (
          //     <li key={r.id} className="border-b pb-2">
          //       {getLabel(r)}
          //     </li>
          //   ))}
          // </ul>
          <section className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-4 shadow-sm">

            {/* <!-- Top Row --> */}
            <div className="flex items-center justify-between mb-2">

              {/* <!-- Left: Anonymous + time --> */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-200 flex items-center justify-center">
                  <img src="/assets/images/Profile.avif"
                    className="w-10 h-10" alt="profile" />
                </div>
                <div className="detail flex flex-col">
                  <div className="text-gray-700 font-semibold text-md">Demo Admin</div>
                  <div className="text-gray-700 text-md">Dec 2, 2025</div>
                </div>

              </div>

              {/* <!-- Right: Location --> */}
              <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer pr-5">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

            </div>

            {/* <!-- Question --> */}
            <p className="text-md text-gray-900 mb-2">
              Do you have accessible restrooms?
            </p>
          </section>
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
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenQuestionPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Questions
              </button>
            </div>
          </div>


        </div>
        {business.businessQuestions && business.businessQuestions.length > 0 ? (
          // <ul className="space-y-2 text-sm text-gray-700">
          //   {business.businessQuestions.map((q: any) => (
          //     <li key={q.id}>• {getLabel(q)}</li>
          //   ))}
          // </ul>
          <section className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-4 shadow-sm">

            {/* <!-- Top Row --> */}
            <div className="flex items-center justify-between mb-2">

              {/* <!-- Left: Anonymous + time --> */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                  <img src="/assets/images/Profile.avif"
                    className="w-6 h-6" alt="profile" />
                </div>

                <div className="text-gray-700 font-semibold">Anonymous</div>
              </div>

              {/* <!-- Right: Location --> */}
              <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer pr-5">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

            </div>

            {/* <!-- Question --> */}
            <h2 className="text-md font-semibold text-gray-900 mb-2">
              Do you have accessible restrooms?
            </h2>

            {/* <!-- Textarea --> */}
            <textarea
              rows={4}
              cols={4}
              placeholder="Write your answer here..."
              className="w-full border placeholder:text-gray-600 border-gray-300 rounded-lg p-4 text-sm hover:border-[#0519CE] focus:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none"
            ></textarea>

          </section>
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
          <h3 className="text-xl font-[600] mb-4">Additional Accessibility Resources</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenAccessibilityResourcesPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Accessibility Resources
              </button>
            </div>
          </div>



        </div>
        {/* for now, using custom sections as resources if present */}
        {business.businessCustomSections &&
          business.businessCustomSections.length > 0 ? (
          // <ul className="space-y-2 text-sm text-gray-700">
          //   {business.businessCustomSections.map((s: any) => (
          //     <li key={s.id}>{getLabel(s)}</li>
          //   ))}
          // </ul>
          <div className="pr-2 flex flex-wrap justify-between text-center space-y-3">

            <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
              <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

              <div className="paragraph text-start items-center flex gap-5">
                <img src="/assets/images/file.avif" alt="file" className='w-8 h-8' />
                <p className='text-gray-700 text-sm'>
                  this section
                </p>
              </div>
            </div>

            <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
              <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

              <div className="paragraph text-start items-center flex gap-5">
                <img src="/assets/images/file.avif" alt="file" className='w-8 h-8' />
                <p className='text-gray-700 text-sm'>
                  this section
                </p>
              </div>
            </div>

            <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
              <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

              <div className="paragraph text-start items-center flex gap-5">
                <img src="/assets/images/file.avif" alt="file" className='w-8 h-8' />
                <p className='text-gray-700 text-sm'>
                  this section
                </p>
              </div>
            </div>

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
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenAccessibilityMediaPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Accessibility Media
              </button>
            </div>
          </div>

        </div>
        {business.businessMedia && business.businessMedia.length > 0 ? (
          // <ul className="space-y-2 text-sm text-gray-700">
          //   {business.businessMedia.map((m: any) => (
          //     <li key={m.id}>{getLabel(m)}</li>
          //   ))}
          // </ul>
          <div className="audios pr-2 flex flex-wrap justify-between text-center space-y-3">

            <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
              <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

              <div className="heading flex justify-between items-start">
                <h3 className="text-xl text-gray-800 text-start font-semibold mb-4 pr-2">Beer to raise money for autism awareness in Mesa</h3>
                <div
                  className="py-1 text-sm text-[#0519CE] rounded-full cursor-pointer underline transition">
                  View
                </div>
              </div>

              <div className="paragraph text-start">
                <p className='text-gray-700 text-sm'>
                  Article about Visit Mesa, 12 West Brewing Co., and Chupacabra Taproom launching Spectrum IPA during Autism Acceptance Month to raise funds and awareness.
                </p>
              </div>
            </div>

            <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
              <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

              <div className="heading flex justify-between items-start">
                <h3 className="text-xl text-gray-800 text-start font-semibold mb-4 pr-2">Beer to raise money for autism awareness in Mesa Beer to raise money for autism awareness in Mesa</h3>
                <div
                  className="py-1 text-sm text-[#0519CE] rounded-full cursor-pointer underline transition">
                  View
                </div>
              </div>

              <div className="paragraph text-start">
                <p className='text-gray-700 text-sm'>
                  Article about Visit Mesa, 12 West Brewing Co., and Chupacabra Taproom launching Spectrum IPA during Autism Acceptance Month to raise funds and awareness.
                </p>
              </div>
            </div>

          </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Custom Sections</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">


              <button onClick={() => setOpenCustonSectionPopup(true)}
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Custom Sections
              </button>
            </div>
          </div>

        </div>
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
