"use client";
import ReviewTypeForm from "@/app/component/ReviewTypeForm";
import ReviewTypeTable from "@/app/component/ReviewTypeTable";
import React, { useState } from "react";


export default function Page() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="w-full min-h-screen bg-white px-6 py-5">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Review Type
        </h1>

        {/* Add New Feature Modal */}
        <ReviewTypeForm onSuccess={() => setRefresh(refresh + 1)} />
      </div>

      {/* Table */}
      <ReviewTypeTable refresh={refresh} />
    </div>
  );
}

