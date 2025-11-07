import React from "react";
import HeaderActions from "./Headeractions";
import Link from "next/link";
export default function Header() {


  return (
    <header className="absolute z-[1000] mt-20 w-full lg:rounded-full sm:mt-10">
      <div
        className="bg-white px-6 lg:container lg:mx-auto lg:rounded-full lg:px-6 lg:py-4 md:px-12 md:bg-transparent">
        <div
          className="flex w-full items-center justify-between rounded-full bg-white md:px-10 lg:px-0 py-2">
          <div className="relative z-20 ps-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Home">
              <img
                src="/assets/images/logo.png"
                alt="logo-Ablevu" className="w-32" />
           </Link>
          </div>

          <div
            className="flex items-center justify-end border-l lg:border-l-0 pe-4">
            <input type="checkbox" name="hamburger" id="hamburger" className="peer"
              hidden />
            <label htmlFor="hamburger"
              className="peer-checked:hamburger relative z-20 -mr-6 block cursor-pointer p-6 lg:hidden">
              <div aria-hidden="true"
                className="m-auto h-0.5 w-6 rounded bg-sky-900 transition duration-300"></div>
              <div aria-hidden="true"
                className="m-auto mt-2 h-0.5 w-6 rounded bg-sky-900 transition duration-300"></div>
            </label>

            <div
              className="fixed inset-0 w-[100%] translate-x-[-100%] border-r bg-white shadow-xl transition duration-300 peer-checked:translate-x-0 lg:static lg:w-auto lg:translate-x-0 lg:border-r-0 lg:shadow-none">
              <div className="flex h-full flex-col justify-between lg:flex-row lg:items-center">
                <ul className="space-y-8 px-6 pt-32 text-gray-700 md:pe-6 lg:flex lg:space-x-4 lg:space-y-0 lg:pt-0 font-['Roboto'] font-bold">
                  <li>
                    <Link href="/"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2">
                      <span className="text-black-800 relative">Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/business"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100">
                      <span
                        className="group-hover:text-black-800 relative">Businesses</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contributor"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100">
                      <span
                        className="group-hover:text-black-800 relative">Contributor</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/access-friendly-city"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100">
                      <span
                        className="group-hover:text-black-800 relative">Access-friendly
                        Cities</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100">
                      <span className="group-hover:text-black-800 relative">Add
                        Business</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/search"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100">
                      <span className="group-hover:text-black-800 relative">Search</span>
                    </Link>
                  </li>
                </ul>

                <HeaderActions/>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </header>




  );
}





