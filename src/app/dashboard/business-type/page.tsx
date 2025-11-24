import BusinessTypeForm from '@/app/component/BusinesstypeForm';
import BusinessTypeTable from '@/app/component/BusinesstypeTable';
import React from 'react'


export default function page() {
  return (
    <div className="w-full min-h-screen bg-white px-6 py-5">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Business Type</h1>
        <BusinessTypeForm/>
      </div>
      <BusinessTypeTable/>
    </div>
  );
}
