import React from 'react'
import type { Metadata } from "next";
import Maincontent from '../component/Maincontent'
import BusinessSidebar from '../component/BusinessSidebar';

export const metadata: Metadata = {
  title: "Become a Contributor | AbleVu Accessibility Platform",
  description:
    "Join the AbleVu Contributor Network to help map accessible businesses and public spaces. Share insights, earn recognition, and make your city more inclusive.",
    keywords: [
      "accessible business",
      "wheelchair friendly",
      "AbleVu listing",
    ],
};

export default function page() {
  return (
    <div className='flex'>
        <BusinessSidebar/>   
        <Maincontent/>   
    </div>
  )
}
