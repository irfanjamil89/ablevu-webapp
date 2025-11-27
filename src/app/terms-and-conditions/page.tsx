import React from 'react'
import Header from '../component/Header2'
import Footer from '../component/Footer'

export default function page() {
    return (
        <div>
          <Header/>
<div className="w-full flex justify-center bg-white text-black py-10">
            <div className="2xl:max-w-7xl lg:max-w-6xl md:max-w-4xl w-full px-6 space-y-10 container m-auto">

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-semibold">Terms and Conditions</h1>
                    <p className="text-sm mt-5 text-start">
                        <strong>Effective Date:</strong> February 21, 2025
                    </p>
                </div>

                {/* 1. Introduction */}


                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">1. Introduction</h2>
                    <p className="text-base leading-relaxed">
                        Welcome to <strong>AbleVu Inc.</strong> (&ldquo;AbleVu,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These <strong>Terms and Conditions (&quot;Terms&quot;)</strong> govern your access to and use of the AbleVu website and services, whether as a <strong>User</strong>, <strong>Contributor</strong>, or <strong>Business</strong>.
                    </p>
                    <p className="text-base leading-relaxed">
                        By using AbleVu, you agree to comply with these Terms. If you do not agree, <strong>do not use our platform.</strong>
                    </p>
                </section>

                {/* 2. Definitions */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">2. Definitions</h2>
                    <ul className="text-base space-y-1">
                        <li><strong>“User”</strong> refers to anyone who accesses the AbleVu website to browse accessibility information.</li>
                        <li><strong>“Contributor”</strong> refers to individuals who submit accessibility profiles for businesses.</li>
                        <li><strong>“Business”</strong> refers to organizations that create, claim, or unlock accessibility profiles and may subscribe to services on AbleVu.</li>
                    </ul>
                </section>

                {/* 3. Eligibility */}
                <section className="space-y-3">
                    <h3 className="text-xl font-semibold">3. Eligibility</h3>
                    <p className="text-base leading-relaxed">
                        To use AbleVu, you must:
                    </p>
                    <ul className="text-base space-y-1 list-disc pl-6">
                        <li>Be at least 18 years old.</li>
                        <li>Provide accurate and truthful information when signing up.</li>
                        <li>Agree to use the platform lawfully and ethically.</li>
                    </ul>
                    <p className="text-base leading-relaxed">
                        AbleVu <strong>reserves the right</strong> to suspend or terminate accounts that violate these Terms.
                    </p>
                </section>

                {/* 4. User Conduct */}
                <section className="space-y-3">
                    <h3 className="text-xl font-semibold">4. User Conduct</h3>
                    <p className="text-base leading-relaxed">
                        As a User, Contributor, or Business, you agree <strong>not to:</strong>
                    </p>
                    <ul className="text-base space-y-1 list-disc pl-6">
                        <li>Submit false, misleading, or unauthorized content.</li>
                        <li>Post or share confidential business information without consent.</li>
                        <li>Use the platform to harass, defame, or harm others.</li>
                        <li>Attempt to hack, disrupt, or misuse AbleVu’s website or services.</li>
                        <li>Violations may result in suspension or permanent account termination.</li>
                    </ul>
                </section>

                {/* 5. Contributor Terms */}
                <section className="space-y-3">
                    <h3 className="text-xl font-semibold">5. Contributor Terms</h3>
                    <p className="text-base leading-relaxed">
                        Contributors are individuals who <strong>submit accessibility profiles</strong> for businesses. By participating, you agree that:
                    </p>
                    <ul className="text-base space-y-1 list-disc pl-6">
                        <li>You will provide <strong>accurate and truthful</strong> accessibility information.</li>
                        <li>AbleVu may <strong>edit or remove</strong> submissions if necessary.</li>
                        <li>You will only receive <strong>payment ($100 per approved profile)</strong> if the business <strong>approves and unlocks</strong> the profile with a yearly subscription.</li>
                        <li>Payment will be processed through a third-party provider, and taxes, if applicable, are your responsibility.</li>
                        <li>AbleVu reserves the right to <strong>reject, delay, or deny payment</strong> if submissions do not meet quality standards.</li>
                    </ul>
                </section>

                {/* 6. Business Terms */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">6. Business Terms</h2>
                    <p className="text-base leading-relaxed">Businesses that claim or unlock profiles on AbleVu agree to:</p>
                    <ul className="text-base list-disc pl-6 space-y-1">
                        <li>Provide accurate and up-to-date information about their accessibility features.</li>
                        <li>Pay applicable <strong>subscription fees</strong> to unlock contributor-submitted profiles.</li>
                        <li>Refrain from <strong>false claims</strong> regarding accessibility features.</li>
                        <li>Understand that contributor-submitted profiles are based on real observations and <strong>cannot be altered to misrepresent accessibility.</strong></li>
                    </ul>
                    <p className="text-base leading-relaxed">Businesses may <strong>provide updates</strong> to their profile and can remove contributor submissions</p>

                </section>

                {/* 7. Intellectual Property */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">7. Intellectual Property</h2>
                    <p className="text-base leading-relaxed">
                        All <strong>content on AbleVu</strong> (including virtual tours, accessibility checklists, text, and images) is <strong>protected by copyright, trademark, and intellectual property laws.</strong>
                    </p>
                    <ul className="text-base list-disc pl-6 space-y-1">
                        <li>Users <strong>may not copy, sell, or distribute</strong> any content from AbleVu without written permission.</li>
                        <li>Contributors do not <strong>retain ownership</strong> of their submissions and grant AbleVu a <strong>perpetual, worldwide, royalty-free license</strong> to use, modify, and display the content.</li>
                        <li>Businesses that unlock profiles <strong>do not own</strong> the contributor-submitted content but can share it on their platforms.</li>
                    </ul>
                </section>

                {/* 8. Payments & Subscriptions */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">8. Payments & Subscriptions</h2>
                    <ul className="text-base list-disc pl-6 space-y-1">
                        <li>Contributors <strong>only get paid</strong> when a business <strong>approves and unlocks</strong> an accessibility profile.</li>
                        <li>Businesses must pay the applicable <strong>subscription fee</strong> to unlock a profile for public view.</li>
                        <li>Payments are handled through <strong>third-party payment processors</strong>, and AbleVu <strong>does not store payment information.</strong></li>
                        <li>All fees are <strong>non-refundable</strong> unless otherwise stated.</li>
                    </ul>
                </section>

                {/* 9. Privacy & Data Use */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">9. Privacy & Data Use</h2>
                    <p className="text-base leading-relaxed">AbleVu collects and processes data in accordance with our <strong>Privacy Policy.</strong> <br />
                        By using AbleVu, you <strong>agree to the collection, storage, and use of your data</strong> for account management, payments, and service improvements.
                        We do <strong>not</strong> sell personal data but may share business-related information with potential customers, marketing partners, or accessibility advocacy groups.</p>
                </section>

                {/* 10. Limitation of Liability */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">10. Limitation of Liability</h2>
                    <p className="text-base leading-relaxed">
                        AbleVu is a platform for <strong>sharing accessibility information</strong> but does not <strong>guarantee</strong> the accuracy or completeness of business listings.
                        To the fullest extent permitted by law:
                    </p>
                    <ul className="text-base list-disc pl-6 space-y-1">
                        <li>AbleVu is <strong>not liable</strong> for errors, omissions, or misrepresented accessibility details.</li>
                        <li>AbleVu is <strong>not responsible</strong> for disputes between contributors and businesses.</li>
                        <li>AbleVu is <strong>not liable</strong> for damages, lost revenue, or legal claims arising from the use of our platform.</li>
                    </ul>
                </section>

                {/* 11. Termination of Accounts */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">11. Termination of Accounts</h2>
                    <p className="text-base leading-relaxed">
                        AbleVu <strong>reserves the right</strong> to:
                    </p>
                    <ul className="text-base list-disc pl-6 space-y-1">
                        <li>Suspend or terminate accounts for violating these Terms.</li>
                        <li>Remove contributor profiles that do <strong>not meet quality standards.</strong></li>
                        <li>Refuse service to businesses that engage in <strong>false advertising or discriminatory practices.</strong></li>
                    </ul>
                    <p className="text-base leading-relaxed">
                        If your account is terminated, you may <strong>not create a new account</strong> without AbleVu’s approval.
                    </p>
                </section>

                {/* 12. Changes to Terms */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">12. Changes to Terms</h2>
                    <p className="text-base leading-relaxed">
                        AbleVu may update these <strong>Terms and Conditions</strong> from time to time. We will notify Users, Contributors, and Businesses of major changes, but it is <strong>your responsibility</strong> to review the latest Terms. <br />
                        Continued use of AbleVu <strong>after updates</strong> means you <strong>accept</strong> the revised Terms.
                    </p>
                </section>

                {/* 13. Governing Law & Dispute Resolution */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">13. Governing Law & Dispute Resolution</h2>
                    <p className="text-base leading-relaxed">
                        These Terms are governed by the laws of <strong>the State of Delaware</strong>, without regard to conflict of law principles.
                    </p>
                    <ul className="text-base list-disc pl-6 space-y-1">
                        <li>Any disputes <strong>shall first be attempted to be resolved informally</strong> by contacting AbleVu.</li>
                        <li>If unresolved, disputes shall be settled through <strong>binding arbitration in Michigan</strong>, unless both parties agree to alternative resolution methods.</li>
                    </ul>
                </section>

                {/* 14. Contact Information */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-bold">14. Contact Information</h2>
                    <p className="text-base leading-relaxed">
                        If you have any questions or concerns about these Terms, please contact us at: support@ablevu.com
                    </p>
                </section>

            </div>
        </div>
          <Footer/>
        </div>
    )
}
