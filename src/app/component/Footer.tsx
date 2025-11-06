import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#0A1733] px-6 py-10 text-white text-center sm:pt-[50px] sm:text-center md:px-20 md:pt-[150px] md:text-start lg:pt-[150px] lg:text-start">
  <div className="grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:mx-auto">
    {/* Logo and Social Icons */}
    <div>
      <div className="mb-4 flex items-center justify-center lg:justify-start md:justify-start sm:justify-center">
        <img
          src="/assets/images/ablevu-white-logo.png"
          alt="AbleVu Logo"
          className="mr-2 h-20 object-contain"
        />
      </div>
      <div className="mt-4 flex space-x-4 justify-center lg:justify-start">
        <a href="#" className="hover:text-blue-400">
          <i className="fab fa-linkedin fa-lg"></i>
        </a>
        <a href="#" className="hover:text-blue-400">
          <i className="fab fa-facebook fa-lg"></i>
        </a>
        <a href="#" className="hover:text-blue-400">
          <i className="fab fa-x-twitter fa-lg"></i>
        </a>
      </div>
    </div>

    {/* Information Links */}
    <div>
      <h3 className="mb-4 font-['Roboto'] text-lg font-semibold">Information</h3>
      <ul className="space-y-2 font-['Helvetica'] text-sm">
        <li>
          <a href="#" className="hover:underline">
            FAQ
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Blog
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Support
          </a>
        </li>
      </ul>
    </div>

    {/* Company Links */}
    <div>
      <h3 className="mb-4 font-['Roboto'] text-lg font-semibold">Quick Links</h3>
      <ul className="space-y-2 font-['Helvetica'] text-sm">
        <li>
          <a href="#" className="hover:underline">
            Businesses
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contributor
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Access-friendly Cities
          </a>
        </li>
      </ul>
    </div>

    {/* Subscribe Section */}
    <div className="bg-[rgb(34,44,68)] p-4 text-start rounded-xl">
      <h3 className="mb-4 font-['Roboto'] text-lg font-semibold">Subscribe</h3>
      <form className="mb-4 flex items-center">
        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-l bg-white px-4 py-2 text-black focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-r bg-blue-500 px-4 py-2 hover:bg-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
      <p className="font-['Helvetica'] text-xs text-gray-400">
        Hello, we are Lift Media. Our goal is to translate the positive effects
        from revolutionizing how companies engage with their clients & their
        team.
      </p>
    </div>
  </div>

  <div className="mt-10 border-t border-gray-700 pt-6 text-center font-['Roboto'] text-sm text-gray-400">
    &copy; 2025 AbleVu. All rights reserved.
  </div>
</footer>

  )
}
