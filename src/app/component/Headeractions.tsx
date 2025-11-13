// "use client";
// import React, { useEffect, useState } from "react";
// import Login from "./Login";
// import Signup from "./Signup";
// import { FaUserCircle } from "react-icons/fa";

// const HeaderAuthButtons: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isMounted, setIsMounted] = useState(false); // ✅ to ensure client-side render only
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [openLoginModal, setOpenLoginModal] = useState(false);
//   const [openSignupModal, setOpenSignupModal] = useState(false);

//   // Run only on client after hydration
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!isMounted) return; // wait until component is mounted on client

//     const token = localStorage.getItem("access_token");
//     setIsLoggedIn(!!token);
//   }, [isMounted]);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     setIsLoggedIn(false);
//     window.location.href = "/"; // redirect after logout
//   };

//   if (!isMounted) return null; // ⛔ prevent SSR mismatch during hydration

//   return (
//     <div className=" flex items-center space-x-3">
//       {!isLoggedIn ? (
//         <>
//           {/* Auth Buttons */}
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setOpenSignupModal(true)}
//               className="rounded-full cursor-pointer border border-[rgba(5,25,206,1)] py-3 px-5 text-[rgba(5,25,206,1)] transition hover:bg-[rgba(5,25,206,1)] hover:text-white"
//             >
//               Sign Up
//             </button>
//             <button
//               onClick={() => setOpenLoginModal(true)}
//               className="rounded-full cursor-pointer bg-[rgba(5,25,206,1)] py-3 px-6 text-white transition hover:bg-[#0414a8]"
//             >
//               Log In
//             </button>
//           </div>

//           {/* Modals */}
//           {openLoginModal && (
//             <Login
//               setOpenLoginModal={setOpenLoginModal}
//               setOpenSignupModal={setOpenSignupModal}
//             />
//           )}
//           {openSignupModal && (
//             <Signup
//               setOpenSignupModal={setOpenSignupModal}
//               setOpenLoginModal={setOpenLoginModal}
//             />
//           )}
//         </>
//       ) : (
//         // Logged-in state
//         <div className="relative user-dropdown">
//           <FaUserCircle
//             className="text-[38px] text-[rgba(5,25,206,1)] cursor-pointer"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           />
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
//               <ul className="text-sm text-gray-700">
//                 <li>
//                   <button
//                     onClick={() => (window.location.href = "/businessdashboard")}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                   >
//                     Dashboard
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeaderAuthButtons;
