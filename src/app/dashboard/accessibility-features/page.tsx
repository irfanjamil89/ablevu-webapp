import React from 'react'
import AccessibilityFeatureForm from '@/app/component/AccessibilityFeatureForm'
import AccessibleFeatureTable from '@/app/component/AccessibleFeatureTable'




export default function page() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <div
        className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">

          {/* <!-- Header Row --> */}
          <div className="w-full min-h-screen bg-white px-6 py-5">

            {/* <!-- Header --> */}
            <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
              {/* <!-- Title --> */}

              <h1 className="text-2xl font-semibold text-gray-900">Accessible Features (6)</h1>

              <AccessibilityFeatureForm/>

              
            </div>

            {/* <!-- Empty State Content --> */}
            <section className="flex-1">

              <AccessibleFeatureTable/>


            </section>
          </div>

        </div>

      </div>
    </div>

    
  )
}

