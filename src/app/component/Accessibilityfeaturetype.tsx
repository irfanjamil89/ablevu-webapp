"use client";
import React, { useState } from "react";
import FeatureTypeForm from "./FeatureTypeForm";
import FeatureTypeTable from "./FeatureTypeTable";

export default function AccessibilityFeatureType() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="w-full min-h-screen bg-white px-6 py-5">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Accessibility Feature Type
        </h1>

        {/* Add New Feature Modal */}
        <FeatureTypeForm onSuccess={() => setRefresh(refresh + 1)} />
      </div>

      {/* Table */}
      <FeatureTypeTable refresh={refresh} />
    </div>
  );
}
