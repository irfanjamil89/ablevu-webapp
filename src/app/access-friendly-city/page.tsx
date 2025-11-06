import React from 'react'
import type { Metadata } from "next";
import Header from '../component/Header'
import Citieshero from '../component/Citieshero'
import Partner from '../component/Partner'
import Social from '../component/Social'
import Mapsections from '../component/Mapsection'
import Cta from '../component/Cta'
import Expand from '../component/Expand'
import About from '../component/About'
import Footer from '../component/Footer'


export const metadata: Metadata = {
  title: "Access-Friendly Cities | AbleVu",
  description:
    "Explore AbleVu’s Access-Friendly Cities — communities dedicated to accessibility, inclusion, and mobility for everyone. Discover how your city supports accessible living and tourism.",
  keywords: [
    "access friendly cities",
    "accessible cities",
    "inclusive communities",
    "urban accessibility",
    "disability friendly tourism",
    "accessible travel",
    "city accessibility programs",
  ],

};

export default function page() {
  return (
    <div>
        <Header/>
        <Citieshero/>
        <Partner/>
        <Social/>
        <Mapsections/>
        <Cta/>
        <Expand/>
        <About/>
        <Footer/>
    </div>
  )
}
