import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Award, CheckCircle, BookOpen, FileCheck, ArrowRight, ChevronRight, Shield, Star } from 'lucide-react'

const pathway = [
  { step: '01', title: 'Join MCSA', desc: 'Become a Professional or Carrier member to access the full training catalog.', link: '/membership', linkLabel: 'Join now' },
  { step: '02', title: 'Complete Core Curriculum', desc: 'Finish MCSA-101 through MCSA-110 (10 courses, ~20 hours). Each course includes assessments to reinforce learning.', link: '/training', linkLabel: 'Browse courses' },
  { step: '03', title: 'Submit Sample File', desc: 'Submit one complete municipal claim file for MCSA compliance review. Demonstrates real-world application of standards.', link: null, linkLabel: null },
  { step: '04', title: 'Pass the CMCA Exam', desc: 'Sit the MCSA-201 CMCA examination. Passing score: 80%. Multiple attempts allowed with 30-day waiting period between attempts.', link: '/training/mcsa-201-cmca-certification', linkLabel: 'View exam course' },
  { step: '05', title: 'Receive CMCA Credential', desc: 'Receive your digital certificate, CMCA designation, and listing in the MCSA Certified Adjuster directory.', link: null, linkLabel: null },
]

const examTopics = [
  'MCSA Vehicle Classification System (Tier 1, 2, 3)',
  'Documentation and photo standards',
  'Labor control methodology',
  'Equipment identification and valuation',
  'Repair facility selection protocol',
  'Police interceptor systems and components',
  'Ambulance types and module construction',
  'Fire apparatus systems and OEM requirements',
  'Municipal fleet evaluation',
  'File compliance review framework',
]

export default function AccreditationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Header */}
      <div className="bg-navy-900 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Accreditation</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Professional Credential
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{fontFamily:'var(--font-playfair)'}}>
                Certified Municipal Claims Adjuster
              </h1>
              <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                The CMCA is the only professional credential in the industry for municipal property and equipment claims handling. Tested, credentialed, and listed — the designation carriers and municipalities can rely on.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                CMCA holders have completed the full MCSA training curriculum, passed the certification examination, and demonstrated file compliance to the MCSA standard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/membership" className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3.5 rounded-xl transition-colors">
                  Start Your CMCA Path <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/training" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-colors">
                  View Curriculum
                </Link>
              </div>
            </div>

            {/* Badge display */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 border-4 border-gold-400/20 rounded-full flex items-center justify-center">
                  <div className="w-44 h-44 border-4 border-gold-400/30 rounded-full flex items-center justify-center">
                    <div className="w-36 h-36 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-gold-500/30">
                      <Shield className="w-8 h-8 text-navy-900 mb-1" />
                      <div className="text-navy-900 font-bold text-xl leading-none" style={{fontFamily:'var(--font-playfair)'}}>CMCA</div>
                      <div className="text-navy-900/70 text-xs font-semibold mt-1">Certified</div>
                      <div className="text-navy-900/60 text-xs">Municipal Claims</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-white text-navy-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-slate-200">
                    MCSA Certified Adjuster
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-navy-900 mb-4 text-center" style={{fontFamily:'var(--font-playfair)'}}>
          The CMCA Pathway
        </h2>
        <p className="text-slate-600 text-center mb-12">Five steps from member to credentialed professional.</p>

        <div className="space-y-4">
          {pathway.map((step, i) => (
            <div key={step.step} className="flex gap-6 bg-white rounded-2xl border border-slate-200 p-6 hover:border-navy-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-navy-900 text-gold-400 rounded-xl flex items-center justify-center font-bold text-sm" style={{fontFamily:'var(--font-playfair)'}}>
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-navy-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                {step.link && (
                  <Link href={step.link} className="inline-flex items-center gap-1 text-navy-600 font-semibold text-sm mt-2 hover:text-navy-900 transition-colors">
                    {step.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              {i < pathway.length - 1 && (
                <div className="hidden sm:block flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-slate-200 mt-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exam Topics */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4" style={{fontFamily:'var(--font-playfair)'}}>CMCA Exam Topics</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                The CMCA examination covers all material from the 10 core courses. Passing score is 80%. The exam is 60 questions, multiple choice, and must be completed in 90 minutes.
              </p>
              <ul className="space-y-2.5">
                {examTopics.map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4" style={{fontFamily:'var(--font-playfair)'}}>Why CMCA Matters</h2>
              <div className="space-y-4">
                {[
                  { icon: Star, title: 'Carrier Confidence', desc: 'Carriers know that a CMCA-certified adjuster has been trained and tested on the standards that reduce supplements, rework, and disputes.' },
                  { icon: Shield, title: 'Municipality Trust', desc: 'Municipalities working with CMCA adjusters can expect standardized, faster, and more accurate claim resolution.' },
                  { icon: Award, title: 'Professional Identity', desc: 'The CMCA is the only credential that specifically identifies expertise in municipal property and equipment claims.' },
                  { icon: BookOpen, title: 'Continuing Development', desc: 'CMCA holders maintain their credential through annual continuing education, keeping knowledge current as standards evolve.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <item.icon className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-navy-900 text-sm mb-0.5">{item.title}</div>
                      <div className="text-xs text-slate-600 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy-900 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Award className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>Ready to earn your CMCA?</h2>
          <p className="text-slate-300 mb-8">Join MCSA and start the only certification program designed specifically for municipal claims professionals.</p>
          <Link href="/membership" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-xl transition-colors">
            Join MCSA — Start Your CMCA <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
