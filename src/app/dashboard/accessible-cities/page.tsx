"use client";
import React, { useState, useRef } from "react";
import AccessibleCityForm from "@/app/component/AccessibleCityForm";
import AccessibleCityTable from "@/app/component/AccessibleCityTable";

export default function Page() {
    const [CitiesCount, setCitiesCount] = useState(0);
    const tableRef = useRef<{ fetchCities: () => void }>(null);

  return (
    <div className="w-full min-h-screen bg-white px-6 py-5">

      <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Accessible Cities({CitiesCount})
        </h1>

        <AccessibleCityForm
          onSuccess={() => {
            tableRef.current?.fetchCities();
          }}
          />
      </div>

      <AccessibleCityTable
      onCountChange={setCitiesCount}
      ref = {tableRef} />
    </div>
  );
}
