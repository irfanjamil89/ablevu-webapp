// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "@/app/component/Providers";
import Chatbot from "./component/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AbleVu | Discover Accessible Places Near You",
  description: "AbleVu helps you explore accessible places, hotels, restaurants, and attractions with confidence. Join the movement for inclusive cities.",
  keywords: [
    "AbleVu",
    "accessible places",
    "inclusive tourism",
    "wheelchair friendly",
    "accessible cities",
    "disability access",
  ],
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Maps Places API Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
        
        {/* Chatbot appears on all pages */}
       <Chatbot/>
      </body>
    </html>
  );
}