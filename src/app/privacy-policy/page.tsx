import React from 'react'
import Header from '../component/Header2'
import Footer from '../component/Footer'

export default function Privacypolicy() {
  return (

    <div>
      <Header/>
      <div className="w-full flex justify-center bg-white text-black py-10">
      <div className="2xl:max-w-7xl lg:max-w-6xl md:max-w-4xl w-full px-6 space-y-10 container m-auto">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Privacy Policy</h1>
          <p className="text-sm mt-5 text-start">
            <strong>Effective Date:</strong> February 21, 2025
          </p>
        </div>

        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">1. Introduction</h2>
          <p className="text-base leading-relaxed">
            Welcome to AbleVu Inc. (&quot;AbleVu,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Your privacy is
            important to us, and we are committed to protecting the information you
            share with us. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our website, sign up as a
            user, contributor, or business, and interact with our platform. By using
            AbleVu, you agree to the terms outlined in this Privacy Policy. If you do
            not agree, please do not use our services.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">2. Information We Collect</h2>
          <p className="text-base leading-relaxed">
            We collect the following types of information based on your role on the
            platform:
          </p>
        </section>

        {/* A. Users */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">A. General Users (Visitors & Account Holders)</h3>
          <ul className="text-base space-y-1 list-disc pl-6">
            <li><strong>Personal Information:</strong> Name, email address, and other contact details if you create an account.</li>
            <li><strong>Usage Data:</strong> Pages visited, search queries, and interactions with business profiles.</li>
            <li><strong>Device & Technical Data:</strong> IP address, browser type, and cookies for analytics and functionality.</li>
          </ul>
        </section>

        {/* B. Contributors */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">B. Contributors</h3>
          <ul className="text-base space-y-1 list-disc pl-6">
            <li><strong>Personal Information:</strong> Name, email, phone number, payment details, and preferences.</li>
            <li><strong>Submitted Content:</strong> Accessibility assessments, images, and written descriptions.</li>
            <li><strong>Payment Information:</strong> Banking or PayPal details processed securely by third-party providers.</li>
          </ul>
        </section>

        {/* C. Businesses */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">C. Businesses</h3>
          <ul className="text-base space-y-1 list-disc pl-6">
            <li><strong>Business Information:</strong> Business name, address, website, accessibility details, and other information.</li>
            <li><strong>Subscription Data:</strong> Payment details for unlocking profiles and subscriptions.</li>
            <li><strong>Interaction Data:</strong> Reviews, messages, and profile engagement.</li>
            <li><strong>Payment Information:</strong> Banking or PayPal details handled by secure third-party processors.</li>
          </ul>
        </section>

        {/* 3. How We Use Your Info */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
          <p className="text-base leading-relaxed">We use collected information to:</p>
          <ul className="text-base list-disc pl-6 space-y-1">
            <li>Provide, personalize, and improve the AbleVu platform.</li>
            <li>Help users find accessibility information.</li>
            <li>Process contributor payments.</li>
            <li>Send updates, promotions, and service notifications.</li>
            <li>Prevent fraud and ensure security.</li>
          </ul>
        </section>

        {/* 4. Sharing */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">4. How We Share Your Information</h2>
          <p className="text-base leading-relaxed">
            We do not sell or rent your personal information. However, we may share
            information in the following ways:
          </p>
          <ul className="text-base list-disc pl-6 space-y-1">
            <li><strong>With Businesses:</strong> To review submitted accessibility profiles.</li>
            <li><strong>With Third-Party Providers:</strong> Payment processing, analytics, and hosting.</li>
            <li><strong>For Legal Reasons:</strong> To comply with laws or protect platform security.</li>
          </ul>
        </section>

        {/* 5. Security */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">5. Data Security</h2>
          <p className="text-base leading-relaxed">
            We implement security measures to protect your personal information.
            However, no online platform is 100% secure. Please take precautions when
            sharing personal details.
          </p>
        </section>

        {/* 6. Choices & Rights */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">6. Your Choices & Rights</h2>
          <p className="text-base leading-relaxed">Depending on your role, you have the following rights:</p>
          <ul className="text-base list-disc pl-6 space-y-1">
            <li><strong>Access & Correction:</strong> Update or correct information in your account.</li>
            <li><strong>Deletion Requests:</strong> Request account deletion (some data may be retained).</li>
            <li><strong>Email Preferences:</strong> Opt out of marketing emails.</li>
          </ul>
        </section>

        {/* 7. Cookies */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">7. Cookies & Tracking Technologies</h2>
          <p className="text-base leading-relaxed">
            We use cookies to enhance site experience and analyze usage. You may
            manage cookie settings within your browser.
          </p>
        </section>

        {/* 8. Third-Party Links */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">8. Third-Party Links</h2>
          <p className="text-base leading-relaxed">
            AbleVu may contain links to third-party sites. We are not responsible for
            their policies or content. Please review their privacy practices.
          </p>
        </section>

        {/* 9. Children’s Privacy */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">9. Children’s Privacy</h2>
          <p className="text-base leading-relaxed">
            AbleVu is not intended for children under 13. We do not knowingly collect
            data from minors. If you believe we have, please contact us.
          </p>
        </section>

        {/* 10. Changes */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">10. Changes to This Privacy Policy</h2>
          <p className="text-base leading-relaxed">
            We may update this Privacy Policy. Changes will be posted with an updated
            effective date. Continued use of the platform indicates acceptance.
          </p>
        </section>

        {/* 11. Contact */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">11. Contact Us</h2>
          <p className="text-base leading-relaxed">
            For questions about this Privacy Policy, contact us at:
            support@AbleVu.com
          </p>
        </section>

      </div>
    </div>
    <Footer/>
    </div>


  )
}
