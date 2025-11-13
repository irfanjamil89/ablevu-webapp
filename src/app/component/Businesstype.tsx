import React from 'react'
import BusinessTypeForm from './BusinesstypeForm';
import BusinessTypeTable from './BusinesstypeTable';


export default function Businesstype() {
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
