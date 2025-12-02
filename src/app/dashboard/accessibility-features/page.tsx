"use client";
import React from "react";
import AccessibilityFeatureForm from "@/app/component/AccessibilityFeatureForm";
import AccessibleFeatureTable from "@/app/component/AccessibleFeatureTable";
import { useState, useRef } from "react";

export default function Page() {
  const [featuresCount, setFeaturesCount] = useState(0);

  const tableRef = useRef<{ fetchFeatures: () => void }>(null);

  return (
    <div className="w-full bg-white px-6 py-5">
      {/* Header */}
      <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Accessible Features ({featuresCount})
        </h1>
        <AccessibilityFeatureForm
          onSuccess={() => {
            tableRef.current?.fetchFeatures();
          }}
        />
      </div>
      {/* Table */}
      <AccessibleFeatureTable
       onCountChange={setFeaturesCount}
      ref={tableRef}
      />
    </div>
  );
}
