import React from 'react'

export default function Mapsections() {
  return (
    <section className="  w-5/6 lg:mx-auto px-4 py-12 mt-10">
      <h1 className="font-['Helvetica'] md:text-4xl lg:text-[48px] text-4xl font-bold mb-8">
        Interactive Map
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="w-full lg:w-2/3 h-[450px] rounded-lg overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19850.555599679546!2d-0.1277589!3d51.5073509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b33e9c1f5a5%3A0x6d9c4f9d8e3df8f7!2sLondon%2C%20UK!5e0!3m2!1sen!2s!4v1696892684507!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-4 shadow flex flex-col font-['Helvetica']">
          {/* Search Box */}
          <div className="flex items-center bg-white border rounded-md p-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Business..."
              className="w-full outline-none text-gray-700"
            />

            <label
              htmlFor="filterToggle"
              className="border border-gray-300 text-gray-700 rounded-md px-3 py-2 hover:bg-gray-100 flex items-center gap-1 z-10 bg-white cursor-pointer transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 018 18v-4.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
              Filter
            </label>
          </div>

          {/* Location List */}
          <div className="space-y-4 overflow-y-auto max-h-[360px] pr-2">
            {[
              {
                name: '12 West Brewing',
                address: '12 W Main St, Mesa, AZ 85201, USA',
              },
              {
                name: 'Abrams Planetarium',
                address: '755 Science Rd, East Lansing, MI 48824, USA',
              },
              {
                name: 'AC Hotel by Marriott Lansing',
                address: '3160 E Michigan Ave, Lansing, MI 48912, USA',
              },
              {
                name: 'Active Living For All',
                address: '2101 E State St, Hermitage, PA 16148, USA',
              },
              {
                name: 'Blue Owl Coffee',
                address: '1149 S Washington Ave, Lansing, MI 48910, USA',
              },
            ].map((place, index) => (
              <a
                key={index}
                href="/businessdetail"
                className="flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md p-3 transition hover:bg-gray-50"
              >
                <img
                  src="https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/dX0bIKmg86veqjBkh4IS/pub/IA4TYJ966rpTtErQpEtG.png"
                  alt={place.name}
                  className="rounded-lg object-cover w-20 h-16"
                />
                <div className="pe-2">
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                  <div className="flex">
                    <img
                      src="/assets/images/location.png"
                      alt="Location"
                      className="w-5 h-5"
                    />
                    <p className="ps-2 text-sm text-gray-600">{place.address}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>

  )
}
