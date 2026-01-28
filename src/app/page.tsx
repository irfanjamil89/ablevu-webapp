import React from "react";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Herosection from "./component/Herosection";
import Citiesslider from "./component/Citiesslider";
import Mapsection from "./component/Mapsection";
import Booking from "./component/Booking";
import Cta from "./component/Cta";
import Benefit from "./component/Benefit";
import Social from "./component/Social";
import Expand from "./component/Expand";
import Testimonials from "./component/Testimonials";
import Partner from "./component/Partner";
import About from "./component/About";


export const metadata = {
  title: "AbleVu | Discover Accessible Places Near You",
  description:
    "AbleVu helps you explore accessible places, hotels, restaurants, and attractions with confidence. Join the movement for inclusive cities.",
  keywords: [
    "AbleVu",
    "accessible places",
    "inclusive tourism",
    "wheelchair friendly",
    "accessible cities",
    "disability access",
  ],
};

export default function Homepage() {
  return (
    <main>
      <Header/>
      <Herosection />
      <Citiesslider />
      <Mapsection/>
      <Booking />
      <Cta />
      <Benefit />
      <Social />
      <Expand />
      <Testimonials />
      <Partner />
      <About />
      <Footer />
    </main>
  );
}
