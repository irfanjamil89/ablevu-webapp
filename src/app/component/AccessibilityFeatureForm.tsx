"use client";
import React, { useEffect, useState } from 'react';

export default function AccessibilityFeatureForm() {
  const [features, setFeatures] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    // Fetch accessibility features
    fetch('http://51.75.68.69:3006/accessible-feature-types/list')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setFeatures(data.data.map((item :any) => item.name));
        } else {
          console.error('No data found in the response:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        
      });

    // Fetch business types
    fetch('http://51.75.68.69:3006/business-type/list')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setBusinessTypes(data.data);
        } else {
          console.error('No data found in the response:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loading spinner when both fetches are done
      });
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Loading State */}
      {loading && <div>Loading...</div>}

      {/* Error State */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Accessibility Features Type button */}
      <div className="relative inline-block text-left">
        {/* Hidden Toggle */}
        <input type="checkbox" id="featureToggle" className="hidden peer" />

        {/* Trigger Button */}
        <label
          htmlFor="featureToggle"
          className="flex items-center justify-between border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          Accessibility Features Type
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </label>

        {/* Dropdown Menu */}
        <div className="absolute z-10 mt-2 hidden peer-checked:block bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44">
          <ul className="py-2 text-sm text-gray-700">
            {features.map((feature, index) => (
              <li key={index}>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  {feature}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add New Business button */}
      <input type="checkbox" id="accessible-feature-toggle" className="hidden peer" />
      <label htmlFor="accessible-feature-toggle" className="px-3 py-2 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition">
        Add Accessible Feature
      </label>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
        {/* Modal Card */}
        <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
          <label htmlFor="accessible-feature-toggle" className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
            ×
          </label>

          <h2 className="text-lg font-bold text-gray-700 mb-4">Add Accessibility Feature</h2>

          <form className="space-y-5">
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">Title<span className="text-red-500 font-bold">*</span></label>
              <input type="text" placeholder="Enter Title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
            </div>

            <div className="mb-4 relative">
              <label className="block text-md font-medium text-gray-700 mb-1">Select Type <span className="text-red-500">*</span></label>

              <input type="checkbox" id="dropdownToggle" className="hidden peer" />
              <label htmlFor="dropdownToggle" className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200">
                <span className="truncate">Select Category</span>
                <svg className="w-4 h-4 text-gray-500 transition-transform duration-200 peer-checked:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </label>

              <label htmlFor="dropdownToggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>

              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md hidden peer-checked:flex flex-col">
                
                {features.map((feature, index) => (
                  <button key={index} className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Category List */}
            <div className="mt-4 overflow-hidden overflow-y-auto rounded-lg py-2 w-full max-w-xl bg-white">
              <div id="categoryList" className="flex flex-wrap justify-between gap-y-2 max-h-56 overflow-y-auto">
                <h3 className="w-full text-md font-medium text-gray-700">Select Categories</h3>

                <label className="flex w-full items-center gap-2 text-gray-700 text-sm">
                  <input id="selectAll" type="checkbox" className="h-4 w-4 text-[#0519CE] border-gray-300 rounded focus:ring-[#0519CE]" />
                  Select All
                </label>

                {businessTypes.map((business, index) => (
                  <label key={index} className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                    {/* {business.name} */}
                  </label>
                ))}
              </div>
            </div>
             <div className="flex justify-center gap-3 pt-2">
                <label htmlFor="business-toggle"
                  className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                  Cancel
                </label>
                <button type="submit"
                  className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700">
                  Save
                </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}




                     