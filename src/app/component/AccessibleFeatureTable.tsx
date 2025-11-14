import React from 'react';

export default function AccessibleFeatureTable() {
  return (
    <>
    <input type="radio" name="menuGroup" id="none" className="hidden" defaultChecked />

              <div className="h-auto  rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
                    <tr>
                      <th scope="col" className="w-auto lg:w-[800px] py-3 pr-3 pl-3">ID</th>
                      <th scope="col" className="w-auto lg:w-[800px] py-3 pr-3 pl-3">Title</th>
                      <th scope="col" className="px-6 py-3">Feature Type</th>
                      <th scope="col" className="px-6 py-3">Business Categories</th>
                      <th scope="col" className="px-3 py-3 text-right"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {/* Reusable Row Component Pattern */}
                    {[
                      ["ASL Video Tour Available", "Auditory"],
                      ["Descriptive Device", "Visual"],
                      ["Hearing Impaired System", "Auditory"],
                      ["Hearing Impaired System", "Visual"],
                      ["Headphone/Speech Mode available", "Auditory"],
                      ["Audio Jack", "Auditory"],
                    ].map(([title, type], index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 pr-4 pl-3">{index +1}</td>
                        <td className="px-6 pr-4 pl-3">{title}</td>
                        <td className="px-6 py-4">{type}</td>
                        <td className="px-6 py-4">-</td>

                        {/* Dropdown Cell */}
                        <td className="relative px-6 py-4 text-right">
                          {/* Radio Input */}
                          <input
                            type="radio"
                            name="menuGroup"
                            id={`menuToggle${index}`}
                            className="hidden peer"
                          />

                          {/* Trigger Icon */}
                          <label
                            htmlFor={`menuToggle${index}`}
                            className="cursor-pointer text-gray-500 text-2xl select-none"
                          >
                            ⋮
                          </label>

                          {/* Invisible overlay to close when clicked outside */}
                          <label
                            htmlFor="none"
                            className="hidden peer-checked:block fixed inset-0 z-40"
                          ></label>

                          {/* Dropdown Menu */}
                          <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                            <button className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm">
                              ✏️ Edit
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg">
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
        </>
  );
}
