import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Shield, Target, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react'

const values = [
  { title: 'Standards Over Guesswork', desc: 'Every MCSA tool — from labor matrices to valuation bands — replaces informal judgment with documented, repeatable methodology.' },
  { title: 'Field-Built, Not Academic', desc: 'MCSA standards are derived from real municipal claims failure patterns, not theoretical frameworks. If it causes supplements and disputes, we address it.' },
  { title: 'System Thinking', desc: 'Municipal vehicles are integrated systems. Every MCSA standard starts from this doctrine and works outward to classification, estimation, and repair.' },
  { title: 'Defensible Outcomes', desc: 'A well-handled MCSA-standard claim produces a file that is auditable, documented, and defensible — before the carrier, the municipality, or anyone else.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="bg-navy-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">About</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{fontFamily:'var(--font-playfair)'}}>
              About MCSA
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              The Municipal Claims Standards Association exists because municipal property and equipment claims have no industry authority — no standards body, no training system, no credential. We're building all of it.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-7 h-7 text-gold-400" />
          </div>
          <h2 className="text-3xl font-bold text-navy-900 mb-4" style={{fontFamily:'var(--font-playfair)'}}>Our Mission</h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            To standardize and improve how municipal property and equipment claims are documented, estimated, and resolved — reducing cost, improving defensibility, and elevating the profession.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-navy-900 mb-6" style={{fontFamily:'var(--font-playfair)'}}>The Gap We Fill</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              ['CCC / Mitchell', 'No meaningful data for emergency equipment or apparatus systems'],
              ['Manufacturer manuals', 'Cover how it\'s built — not how to estimate damage'],
              ['Vendor install guides', 'Designed for installers, not claims professionals'],
              ['Shop estimates', 'Worst-case guestimating with no independent reference'],
            ].map(([source, gap]) => (
              <div key={source} className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="font-semibold text-red-800 text-sm mb-1">{source}</div>
                <div className="text-red-700 text-sm">{gap}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-600 leading-relaxed">
            MCSA bridges the gap between engineering documentation and real-world claim execution. We translate what manufacturers know about how their equipment is built into the classification systems, labor ranges, valuation bands, and compliance frameworks that adjusters and carriers actually need.
          </p>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-navy-900 mb-6" style={{fontFamily:'var(--font-playfair)'}}>Our Operating Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {values.map(v => (
            <div key={v.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-navy-900 mb-1">{v.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Positioning Statement */}
        <div className="bg-navy-900 rounded-2xl p-8 text-center">
          <div className="h-1 w-12 gold-bar rounded-full mx-auto mb-6" />
          <p className="text-xl md:text-2xl font-bold text-white leading-snug mb-6" style={{fontFamily:'var(--font-playfair)'}}>
            "We don't just teach municipal claims — we define how they are properly handled from intake through settlement."
          </p>
          <p className="text-slate-400 text-sm mb-8">MCSA is the standards authority, not a training company. Training is how we deliver the standards.</p>
          <Link href="/membership" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl transition-colors">
            Join the Association <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
