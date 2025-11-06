import React from 'react'
import type { Metadata } from "next";
import Header from '../component/Header'
import Footer from '../component/Footer'
import Mapsection from '../component/Mapsection'
import Cta from '../component/Cta'
import Social from '../component/Social'
import Expand from '../component/Expand'
import Testimonials from '../component/Testimonials'
import Partner from '../component/Partner'
import About from '../component/About'
import Contributorhero from '../component/Contributorhero'
import Infosection from '../component/Infosection'
import Contribute from '../component/Contribute'

export const metadata: Metadata = {
  title: "Become a Contributor | AbleVu Accessibility Platform",
  description:
    "Join the AbleVu Contributor Network to help map accessible businesses and public spaces. Share insights, earn recognition, and make your city more inclusive.",
  keywords: [
    "AbleVu contributor",
    "accessibility mapping",
    "inclusive community",
    "disability inclusion",
    "accessible places",
    "volunteer accessibility",
  ],
  
};


export default function Contributor() {

  
  return (
    
    <div>
        <Header/>
        <Contributorhero/>
        <Contribute/>
        <Infosection/>
        <Mapsection/>
        <Cta/>
        <Social/>
        <Testimonials/>
        <Expand/>
        <Partner/>
        <About/>
        <Footer/>
    </div>

  )
}
