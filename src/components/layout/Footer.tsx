import Link from 'next/link'
import { Shield, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      {/* Gold top bar */}
      <div className="h-1 gold-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-bold text-lg text-white leading-none" style={{fontFamily:'var(--font-playfair)'}}>MCSA</span>
                <span className="block text-xs text-slate-400 mt-0.5">Municipal Claims Standards</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Setting the national standard for how municipal property and equipment claims are documented, estimated, and resolved.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>info@municipalclaims.org</span>
              </div>
            </div>
          </div>

          {/* Training */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Training</h3>
            <ul className="space-y-2.5">
              {[
                ['MCSA-101: Introduction', '/training/mcsa-101-introduction'],
                ['MCSA-102: Classification', '/training/mcsa-102-vehicle-classification'],
                ['MCSA-104: Labor Control', '/training/mcsa-104-labor-control'],
                ['MCSA-105: Valuation', '/training/mcsa-105-valuation'],
                ['MCSA-107: Police Vehicles', '/training/mcsa-107-police-vehicles'],
                ['MCSA-109: Fire Apparatus', '/training/mcsa-109-fire-apparatus'],
                ['All Courses', '/training'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Association */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Association</h3>
            <ul className="space-y-2.5">
              {[
                ['About MCSA', '/about'],
                ['Membership', '/membership'],
                ['Accreditation & CMCA', '/accreditation'],
                ['Resource Library', '/resources'],
                ['Standards & SOPs', '/resources'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Members</h3>
            <ul className="space-y-2.5 mb-6">
              {[
                ['Member Login', '/login'],
                ['Dashboard', '/dashboard'],
                ['My Courses', '/dashboard/courses'],
                ['My Certifications', '/dashboard/certifications'],
                ['Resource Library', '/dashboard/resources'],
                ['Account Settings', '/dashboard/settings'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            <Link href="/membership"
              className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors">
              Join MCSA →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Municipal Claims Standards Association. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Use</Link>
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
