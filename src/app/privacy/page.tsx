import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="bg-navy-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Privacy Policy</span>
          </div>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Privacy Policy</h1>
          <p className="text-slate-400 mt-2 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 prose-mcsa">
          <h2>Information We Collect</h2>
          <p>When you create an MCSA account, we collect your name, email address, and optionally your organization and job title. When you purchase a membership, payment is processed securely by Stripe — we do not store your payment card details.</p>
          <p>We collect information about your course progress, completed modules, assessment results, and certifications earned. This data is used to track your learning journey and issue credentials.</p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to operate the MCSA platform, deliver training content, issue certifications, send membership and transactional communications, and improve our services. We do not sell your personal information to third parties.</p>

          <h2>Data Storage and Security</h2>
          <p>Your data is stored securely using Supabase, a SOC 2 compliant cloud database provider. All data is encrypted at rest and in transit. We implement appropriate technical and organizational measures to protect your information.</p>

          <h2>Cookies</h2>
          <p>We use essential cookies to maintain your login session and remember your preferences. We do not use tracking or advertising cookies.</p>

          <h2>Communications</h2>
          <p>By creating an account, you agree to receive transactional emails such as membership confirmations, course completions, and certification notices. You may opt out of marketing communications at any time via the unsubscribe link in any email.</p>

          <h2>Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:privacy@municipalclaims.org" className="text-navy-700">privacy@municipalclaims.org</a>. Account deletion will permanently remove your profile, enrollment history, and certifications.</p>

          <h2>Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:privacy@municipalclaims.org" className="text-navy-700">privacy@municipalclaims.org</a>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
