import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="bg-navy-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Terms of Use</span>
          </div>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Terms of Use</h1>
          <p className="text-slate-400 mt-2 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 prose-mcsa">
          <h2>Acceptance of Terms</h2>
          <p>By accessing or using the MCSA platform at municipalclaims.org, you agree to be bound by these Terms of Use. If you do not agree, do not use the platform.</p>

          <h2>Membership and Access</h2>
          <p>MCSA membership grants you access to training courses, resources, and certification programs as described on the Membership page. Membership is personal and non-transferable. You may not share your account credentials.</p>
          <p>Carrier and TPA memberships include a specified number of team seats. Each seat is for one individual user. Seat sharing is not permitted.</p>

          <h2>Payments and Refunds</h2>
          <p>Monthly memberships may be canceled at any time; access continues through the end of the paid period. Annual memberships include a 14-day satisfaction guarantee. After 14 days, annual memberships are non-refundable.</p>
          <p>Individual course purchases are non-refundable once you have accessed course content.</p>

          <h2>Certifications</h2>
          <p>MCSA certifications are issued based on completion of required coursework and passing of examinations. MCSA reserves the right to revoke certifications in cases of academic dishonesty, misrepresentation, or conduct contrary to the MCSA standards.</p>
          <p>Certifications are personal credentials and may not be transferred. Listing your MCSA credential with inaccurate information (e.g., claiming CMCA status without completing requirements) is prohibited.</p>

          <h2>Intellectual Property</h2>
          <p>All MCSA content — including course materials, SOPs, matrices, standards documents, and the MCSA name and logo — is the intellectual property of the Municipal Claims Standards Association. You may not reproduce, distribute, or create derivative works from MCSA content without written permission.</p>

          <h2>Disclaimer</h2>
          <p>MCSA training and standards are provided for educational purposes. Nothing in MCSA materials constitutes legal, regulatory, or professional advice. MCSA does not guarantee specific outcomes from applying its standards. Users are responsible for compliance with applicable laws and regulations in their jurisdiction.</p>

          <h2>Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, MCSA shall not be liable for indirect, incidental, or consequential damages arising from use of the platform or its content.</p>

          <h2>Changes to Terms</h2>
          <p>MCSA may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the updated Terms. Material changes will be communicated by email to active members.</p>

          <h2>Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:info@municipalclaims.org" className="text-navy-700">info@municipalclaims.org</a>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
