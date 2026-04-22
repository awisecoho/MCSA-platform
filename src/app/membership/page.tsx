import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { CheckCircle, Star, ArrowRight, Shield, Users, Award, BookOpen, FileCheck, Zap, ChevronRight } from 'lucide-react'

const plans = [
  {
    name: 'Professional Member',
    slug: 'professional',
    price_monthly: 29,
    price_annual: 299,
    description: 'Full access for independent adjusters and claims professionals.',
    color: 'border-navy-300',
    headerBg: 'bg-navy-900',
    badge: null,
    features: [
      'All 12 training modules — free',
      'Complete resource library',
      'Labor & valuation matrices',
      'CMCA certification pathway',
      'Vendor reference database',
      'SOP library access',
      'Member directory listing',
      'Discounted conference rates',
    ],
    cta: 'Join as Professional',
    ctaStyle: 'bg-navy-900 hover:bg-navy-800 text-white',
  },
  {
    name: 'Carrier / TPA Member',
    slug: 'carrier',
    price_monthly: 99,
    price_annual: 999,
    description: 'For insurance carriers, TPAs, and risk management teams.',
    color: 'border-gold-400 shadow-xl shadow-gold-100',
    headerBg: 'bg-gradient-to-br from-navy-900 to-navy-700',
    badge: 'Most Popular',
    features: [
      'Everything in Professional',
      'Team member seats (up to 10)',
      'Compliance audit tools',
      'File review framework',
      'Priority support',
      'Custom carrier reporting',
      'Early access to new standards',
      'Annual standards briefing',
    ],
    cta: 'Join as Carrier / TPA',
    ctaStyle: 'bg-gold-500 hover:bg-gold-400 text-navy-900',
  },
  {
    name: 'Founding Member',
    slug: 'founding',
    price_monthly: 0,
    price_annual: 0,
    description: 'Limited founding membership for early supporters who help shape MCSA.',
    color: 'border-slate-200',
    headerBg: 'bg-slate-700',
    badge: 'Limited Availability',
    features: [
      'All Professional benefits',
      'Founding member recognition',
      'Input on standards development',
      'Complimentary conference registration',
      'Founding member certificate',
      'Name in MCSA founding record',
    ],
    cta: 'Apply for Founding',
    ctaStyle: 'bg-slate-800 hover:bg-slate-700 text-white',
  },
]

const memberBenefits = [
  { icon: BookOpen, title: 'All Training Free', desc: 'Every course in the MCSA catalog at no extra charge. New courses added automatically.' },
  { icon: FileCheck, title: 'SOPs & Checklists', desc: 'The complete MCSA standards library — photo checklists, estimate validation SOPs, compliance frameworks.' },
  { icon: Zap, title: 'Labor & Valuation Tools', desc: 'Task-level labor matrices and equipment valuation bands built from real municipal claims data.' },
  { icon: Shield, title: 'Vendor Reference Library', desc: 'Identification guides, complexity ratings, and estimating notes for 30+ manufacturers and component categories.' },
  { icon: Award, title: 'CMCA Certification Path', desc: 'Full access to the CMCA certification program — the only credential of its kind in the industry.' },
  { icon: Users, title: 'Member Network', desc: 'Connect with the growing community of adjusters, carriers, and municipal risk managers working to the MCSA standard.' },
]

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Header */}
      <div className="bg-navy-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4 justify-center">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Membership</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>
            MCSA Membership
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Join the association setting the standard for municipal property and equipment claims. Members get everything — all training, all tools, all resources.
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.slug} className={`bg-white rounded-2xl border-2 ${plan.color} overflow-hidden relative flex flex-col`}>
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.badge === 'Most Popular' ? 'bg-gold-500 text-navy-900' : 'bg-slate-100 text-slate-600'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} p-6 pb-8`}>
                <div className="text-white font-bold text-lg mb-1" style={{fontFamily:'var(--font-playfair)'}}>{plan.name}</div>
                <p className="text-slate-300 text-sm leading-relaxed">{plan.description}</p>
                <div className="mt-6">
                  {plan.price_monthly === 0 ? (
                    <div className="text-white text-3xl font-bold">Contact Us</div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-white text-4xl font-bold">${plan.price_monthly}</span>
                        <span className="text-slate-400 text-sm">/month</span>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">or ${plan.price_annual}/year (save ${(plan.price_monthly * 12) - plan.price_annual})</div>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="p-6 flex-1">
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pb-6">
                <Link href={plan.price_monthly === 0 ? '/contact' : '/register'}
                  className={`block w-full text-center font-bold py-3.5 rounded-xl transition-colors ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          All memberships include a 14-day satisfaction guarantee. Secure payment via Stripe.
        </p>
      </div>

      {/* Benefits deep-dive */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-3" style={{fontFamily:'var(--font-playfair)'}}>Everything included in Professional membership</h2>
            <p className="text-slate-600">No hidden paywalls. No per-course fees for members. Everything in the MCSA catalog, included.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberBenefits.map(b => (
              <div key={b.title} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-navy-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-navy-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center" style={{fontFamily:'var(--font-playfair)'}}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            ['Do I need to be a licensed adjuster?', 'No. MCSA membership is open to independent adjusters, carrier employees, TPAs, municipal risk managers, and anyone involved in the municipal claims space.'],
            ['How does billing work?', 'Membership is billed monthly or annually through Stripe. You can cancel anytime from your account settings. Annual memberships are non-refundable after 14 days.'],
            ['Is the CMCA certification included in membership?', 'Yes. All courses required for the CMCA, including the certification exam, are included in Professional and Carrier membership at no additional charge.'],
            ['How often is content updated?', 'MCSA standards and course content are reviewed annually and updated whenever significant industry changes occur. Members are notified of updates by email.'],
            ['Can I share my membership with colleagues?', 'Professional memberships are individual. Carrier/TPA memberships include up to 10 team seats. Contact us for larger teams.'],
          ].map(([q, a]) => (
            <div key={q} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-navy-900 mb-2 text-sm">{q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-navy-900 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>Start working to the standard.</h2>
          <p className="text-slate-300 mb-8">Join MCSA and get immediate access to every training module, tool, and resource in the catalog.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-xl transition-colors">
            Join MCSA Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
