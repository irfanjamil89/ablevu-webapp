import React from "react";
import type { Metadata } from "next";
import Header from "../component/Header";
import Social from "../component/Social";
import Testimonials from "../component/Testimonials";
import Partner from "../component/Partner";
import About from "../component/About";
import Footer from "../component/Footer";
import Mapsections from "../component/Mapsection";
import Cta from "../component/Cta";
import Package from "../component/Package";
import Feature from "../component/Feature";
import Businesshero from "../component/Businesshero";
import Features from "../component/Features";

export const metadata: Metadata = {
  title: "For Businesses | Showcase Accessibility on AbleVu",
  description:
    "Join AbleVu and make your business accessible to everyone. Showcase your accessibility features, connect with inclusive customers, and grow your visibility.",
  keywords: [
    "AbleVu for businesses",
    "accessible business listing",
    "wheelchair access",
    "inclusive marketing",
    "disability friendly business",
    "ADA compliance",
    "business visibility",
  ],
  
};

// ✅ Fully SSR-rendered Business Landing Page
export default function Business() {
  return (
    <div>
      <Header />
      <Businesshero />
      <Features />
      <Mapsections />
      <Feature />
      <Partner />
      <Package />
      <Cta />
      <Social />
      <Testimonials />
      <About />
      <Footer />
    </div>
  );
}
