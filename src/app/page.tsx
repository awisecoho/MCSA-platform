import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Shield, Award, BookOpen, Users, CheckCircle, ArrowRight, TrendingDown, Clock, FileCheck, Truck, Zap, Star } from 'lucide-react'

const stats = [
  { value: '12', label: 'Certification Courses', sub: 'MCSA-101 through 301' },
  { value: '3', label: 'Membership Tiers', sub: 'Adjuster to Carrier' },
  { value: '1', label: 'Credential', sub: 'CMCA Designation' },
  { value: '∞', label: 'Industry Gap', sub: 'We fill it' },
]

const problems = [
  { icon: Truck, title: 'Misclassified Vehicles', desc: 'A fire truck treated as a standard commercial truck. A Police Interceptor priced as a retail Explorer. These errors cost thousands per claim.' },
  { icon: TrendingDown, title: 'Inflated Shop Estimates', desc: 'No labor guides exist for emergency equipment. Shops "worst-case guestimate." Adjusters accept it. Carriers pay more than they should.' },
  { icon: Clock, title: 'Wrong Repair Routing', desc: 'Integrated emergency apparatus sent to a standard body shop. Supplements follow. Cycle time doubles. Municipality is furious.' },
  { icon: FileCheck, title: 'Inconsistent Documentation', desc: 'Every adjuster captures different photos in a different order. Files that reach carriers are incomplete, unauditable, and indefensible.' },
]

const features = [
  { icon: BookOpen, title: 'Structured Training', desc: '12 courses from foundational concepts through advanced apparatus claims. Every module built from real-world failure patterns.' },
  { icon: Award, title: 'CMCA Certification', desc: 'The Certified Municipal Claims Adjuster designation. Tested, credentialed, listed — the standard carriers and municipalities can rely on.' },
  { icon: Shield, title: 'Standards & SOPs', desc: 'Photo checklists, labor matrices, valuation bands, vendor reference library. Tools that replace guesswork with documented methodology.' },
  { icon: Users, title: 'Association Network', desc: 'Connect with adjusters, carriers, TPAs, and municipal risk managers working to the same standard.' },
  { icon: Zap, title: 'Labor Control System', desc: 'Task-level labor logic with reasonableness bands for emergency lighting, sirens, push bumpers, apparatus systems, and more.' },
  { icon: FileCheck, title: 'File Compliance Review', desc: 'Pass/fail compliance framework that makes file quality auditable, consistent, and defensible.' },
]

const courses = [
  { code: 'MCSA-101', title: 'Introduction to Municipal Claims', level: 'Beginner', slug: 'mcsa-101-introduction' },
  { code: 'MCSA-102', title: 'Vehicle Classification System', level: 'Beginner', slug: 'mcsa-102-vehicle-classification' },
  { code: 'MCSA-104', title: 'Labor Control Without Labor Guides', level: 'Intermediate', slug: 'mcsa-104-labor-control' },
  { code: 'MCSA-107', title: 'Police & Law Enforcement Vehicles', level: 'Intermediate', slug: 'mcsa-107-police-vehicles' },
  { code: 'MCSA-109', title: 'Fire Apparatus Claims', level: 'Advanced', slug: 'mcsa-109-fire-apparatus' },
  { code: 'MCSA-201', title: 'CMCA Certification Exam', level: 'Certification', slug: 'mcsa-201-cmca-certification' },
]

const levelColor: Record<string, string> = {
  'Beginner': 'bg-emerald-100 text-emerald-700',
  'Intermediate': 'bg-blue-100 text-blue-700',
  'Advanced': 'bg-purple-100 text-purple-700',
  'Certification': 'bg-gold-100 text-yellow-700',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* HERO */}
      <section className="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
              <Star className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">Now Enrolling — Founding Members</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-in-up delay-100" style={{fontFamily:'var(--font-playfair)'}}>
              The Standard for{' '}
              <span className="text-gold-400">Municipal</span>{' '}
              Claims.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200">
              Fire apparatus. Police interceptors. Ambulances. Public works fleet. Municipal property and equipment claims demand specialized knowledge — and MCSA provides it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link href="/membership"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30">
                Join MCSA Today <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/training"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base border border-white/20 transition-all">
                Browse Training
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-10 animate-fade-in-up delay-400">
              {['Adjuster-Built Standards', 'Field-Tested SOPs', 'Carrier-Ready Credentials'].map(t => (
                <div key={t} className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-gold-400" style={{fontFamily:'var(--font-playfair)'}}>{s.value}</div>
                  <div className="text-white text-xs font-semibold">{s.label}</div>
                  <div className="text-slate-400 text-xs">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">The Problem</div>
            <h2 className="text-4xl font-bold text-navy-900 mb-4" style={{fontFamily:'var(--font-playfair)'}}>
              Municipal claims fail at the same points — every time.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Without specialized training and standards, adjusters make the same costly errors on fire apparatus, police vehicles, and municipal fleet that drive supplements, disputes, and carrier losses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm card-hover">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 text-navy-700 font-semibold text-sm">
              <ArrowRight className="w-4 h-4 text-gold-500" />
              MCSA replaces all four failure points with documented standards.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-navy-100 text-navy-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">The Solution</div>
            <h2 className="text-4xl font-bold text-navy-900 mb-4" style={{fontFamily:'var(--font-playfair)'}}>
              A complete system, not just training.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              MCSA is the first organization to combine classification standards, labor control, valuation methodology, vendor reference, and file compliance into one integrated framework.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-200 hover:border-navy-300 hover:shadow-lg transition-all">
                <div className="w-11 h-11 bg-navy-50 group-hover:bg-navy-900 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-5 h-5 text-navy-700 group-hover:text-gold-400 transition-colors" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTRINE CALLOUT */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 hero-bg opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-1 w-16 gold-bar rounded-full mx-auto mb-8" />
          <blockquote className="text-3xl md:text-4xl font-bold text-white leading-snug mb-6" style={{fontFamily:'var(--font-playfair)'}}>
            "Municipal vehicles are purpose-built systems — not standard vehicles with add-ons. Every MCSA standard starts here."
          </blockquote>
          <p className="text-slate-400 text-sm">— MCSA Core Doctrine</p>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block bg-navy-100 text-navy-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Training</div>
              <h2 className="text-4xl font-bold text-navy-900" style={{fontFamily:'var(--font-playfair)'}}>Courses built from the field up.</h2>
            </div>
            <Link href="/training" className="hidden md:flex items-center gap-1 text-navy-700 font-semibold text-sm hover:text-navy-900">
              All 12 Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(c => (
              <Link key={c.slug} href={`/training/${c.slug}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-navy-400 hover:shadow-lg transition-all group card-hover">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{c.code}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColor[c.level]}`}>{c.level}</span>
                </div>
                <h3 className="font-bold text-navy-900 mb-3 group-hover:text-navy-700 transition-colors leading-snug">{c.title}</h3>
                <div className="flex items-center gap-1 text-navy-600 text-sm font-medium">
                  View Course <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/training" className="inline-flex items-center gap-1 text-navy-700 font-semibold">
              View All 12 Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CMCA CERTIFICATION CALLOUT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Accreditation</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>
                Earn the CMCA Designation.
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                The Certified Municipal Claims Adjuster (CMCA) is the MCSA's flagship credential. Complete the full training curriculum, pass the CMCA examination, and earn a designation that tells carriers and municipalities you've been trained and tested to the MCSA standard.
              </p>
              <ul className="space-y-2 mb-8">
                {['Complete MCSA-101 through MCSA-110', 'Pass the CMCA exam (80% required)', 'Submit a compliant sample file', 'Receive digital certificate and credential listing'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/accreditation"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl transition-colors">
                Learn About CMCA <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-48 border-4 border-gold-400/30 rounded-full flex items-center justify-center relative">
                <div className="w-36 h-36 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex flex-col items-center justify-center text-navy-900 text-center shadow-2xl shadow-gold-500/30">
                  <Award className="w-10 h-10 mb-1" />
                  <div className="font-bold text-lg leading-none" style={{fontFamily:'var(--font-playfair)'}}>CMCA</div>
                  <div className="text-xs font-medium opacity-80 mt-0.5">Certified</div>
                </div>
                <div className="absolute inset-0 border-4 border-gold-400/10 rounded-full animate-ping" style={{animationDuration:'3s'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-navy-900 mb-4" style={{fontFamily:'var(--font-playfair)'}}>
            Ready to work to the standard?
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            Professional membership includes all training, the complete resource library, SOPs, labor matrices, and your path to CMCA certification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership"
              className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors">
              View Membership Options <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/training"
              className="inline-flex items-center justify-center gap-2 border border-navy-300 text-navy-700 hover:bg-navy-50 font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Browse Free Previews
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
