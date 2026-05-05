import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  CheckCircle, XCircle, ChevronRight, Clock, FileCheck, Award, Wrench
} from 'lucide-react'

const plans = [
  {
    name: 'Professional',
    slug: 'professional',
    price_monthly: 29,
    price_annual: 299,
    save: '14%',
    description: 'For independent adjusters and individual claims professionals.',
    highlight: false,
    badge: null,
    features: [
      { label: 'All 12 MCSA courses — full content', note: null },
      { label: 'CMCA certification pathway', note: null },
      { label: 'MCSA photo checklists — all tiers', note: 'Printable PDF' },
      { label: 'Labor reasonableness ranges card', note: 'Quick reference' },
      { label: '2024 equipment valuation bands', note: 'Updated annually' },
      { label: 'OEM resource library', note: '22+ documents' },
      { label: 'Claim Package Builder — full workflow', note: null },
      { label: 'CSV export and clean PDF packet', note: null },
      { label: 'Member directory listing', note: null },
    ],
    cta: 'Join as Professional',
    ctaStyle: 'bg-[#07061f] hover:bg-[#1e1b4b] text-white',
  },
  {
    name: 'Carrier / TPA',
    slug: 'carrier',
    price_monthly: 99,
    price_annual: 999,
    save: '16%',
    description: 'For insurance carriers, TPAs, and risk management teams.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { label: 'Everything in Professional', note: null },
      { label: 'Up to 10 team member seats', note: null },
      { label: 'File compliance audit framework', note: '25-point checklist' },
      { label: 'QA program templates and KPI tracking', note: null },
      { label: 'Priority support', note: '< 1 business day' },
      { label: 'Custom carrier compliance reporting', note: null },
      { label: 'Early access to new standards', note: null },
      { label: 'Annual standards briefing', note: 'Virtual' },
    ],
    cta: 'Join as Carrier / TPA',
    ctaStyle: 'bg-amber-400 hover:bg-amber-300 text-[#07061f]',
  },
  {
    name: 'Founding Member',
    slug: 'founding',
    price_monthly: 0,
    price_annual: 0,
    save: null,
    description: 'Limited founding membership for early supporters who help shape MCSA standards.',
    highlight: false,
    badge: 'Limited',
    features: [
      { label: 'All Professional benefits', note: 'Full access' },
      { label: 'Founding member recognition', note: 'Site and materials' },
      { label: 'Input on standards development', note: 'Annual survey + calls' },
      { label: 'Complimentary conference registration', note: 'When launched' },
      { label: 'Founding member certificate', note: null },
      { label: 'Name in MCSA founding record', note: null },
    ],
    cta: 'Apply for Founding Membership →',
    ctaHref: '/founding',
    ctaStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
  },
]

const comparison = [
  { feature: 'Training', section: true },
  { feature: 'All 12 MCSA courses', pro: true, carrier: true, founding: true },
  { feature: 'CMCA certification exam', pro: true, carrier: true, founding: true },
  { feature: 'New courses added automatically', pro: true, carrier: true, founding: true },
  { feature: 'Tools', section: true },
  { feature: 'Claim Package Builder (full 9-step workflow)', pro: true, carrier: true, founding: true },
  { feature: 'Save and reopen claim packages', pro: true, carrier: true, founding: true },
  { feature: 'CSV export', pro: true, carrier: true, founding: true },
  { feature: 'Clean PDF export (no watermark)', pro: true, carrier: true, founding: true },
  { feature: 'Multi-user team seats (up to 10)', pro: false, carrier: true, founding: false },
  { feature: 'Resources', section: true },
  { feature: 'OEM documentation library', pro: true, carrier: true, founding: true },
  { feature: 'MCSA photo checklists (all tiers)', pro: true, carrier: true, founding: true },
  { feature: 'Labor reasonableness ranges card', pro: true, carrier: true, founding: true },
  { feature: '2024 equipment valuation band tables', pro: true, carrier: true, founding: true },
  { feature: 'Compliance', section: true },
  { feature: '25-point file compliance checklist', pro: true, carrier: true, founding: true },
  { feature: 'QA program templates and KPI tracking', pro: false, carrier: true, founding: false },
  { feature: 'Carrier-level compliance reporting', pro: false, carrier: true, founding: false },
  { feature: 'Support', section: true },
  { feature: 'Standard support', pro: true, carrier: true, founding: true },
  { feature: 'Priority support (< 1 business day)', pro: false, carrier: true, founding: false },
  { feature: 'Annual standards briefing', pro: false, carrier: true, founding: false },
]

const valueProps = [
  {
    icon: Clock,
    title: 'Pay for one claim. Recover the cost.',
    desc: 'At $29/month, a single correctly-scoped Tier 3 apparatus claim typically justifies the annual membership cost. The labor control methodology routinely identifies $2,000–$8,000 in unsupported line items per claim.',
  },
  {
    icon: FileCheck,
    title: 'The only structured framework for this class.',
    desc: 'No published labor guides exist for emergency equipment. No valuation database covers apparatus systems. MCSA fills the void with documented ranges derived from field data and EVT consultation — defensible under carrier audit.',
  },
  {
    icon: Award,
    title: 'A credential that means something.',
    desc: 'The CMCA is the only designation in the claims industry specific to municipal apparatus. Carriers who see CMCA on a file know the adjuster applied a documented standard — not guesswork.',
  },
  {
    icon: Wrench,
    title: 'Built for use in the field.',
    desc: 'Every tool and checklist is designed for a tablet at an inspection site. The Claim Package Builder walks through a complete file workflow — classification, photo checklist, component inventory, labor review, valuation, compliance, export.',
  },
]

const faq = [
  {
    q: 'Is there a free trial?',
    a: 'All 12 courses are open for preview without an account. Membership is required for tools (Claim Package Builder, clean exports), downloadable checklists, and CMCA certification.',
  },
  {
    q: 'What does Carrier / TPA include that Professional does not?',
    a: 'Multi-user seat management (up to 10 users), QA program templates, carrier-level compliance reporting, priority support, and early access to new standards releases. Designed for in-house teams managing a portfolio of municipal claims.',
  },
  {
    q: 'How is the CMCA exam administered?',
    a: '60-question proctored examination, 90-minute time limit, 80% passing score. Taken online through the MCSA platform. Three attempts included with a 30-day waiting period between attempts.',
  },
  {
    q: 'Are the labor ranges and valuation bands updated?',
    a: 'Yes — annually, and on an off-cycle basis when market data warrants. The 2024 edition reflects Q3–Q4 2024 distributor pricing from authorized dealers. Update history is documented in the member resource notes.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Monthly memberships can be cancelled before the next billing date. Annual memberships are non-refundable after the first 30 days. CMCA certification is retained after earning, regardless of membership status.',
  },
  {
    q: 'Is the Founding Member tier still available?',
    a: 'Founding membership is limited and offered to early supporters who help shape the MCSA standards. Contact us to apply. Availability depends on remaining seats.',
  },
]

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Header */}
      <div className="bg-[#07061f] pt-20 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Membership</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>
              MCSA Membership
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              The only membership built specifically for municipal apparatus claims.
              All training, tools, standards, and certification — in one framework.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.slug}
              className={`bg-white rounded-2xl border-2 overflow-hidden flex flex-col relative
                ${plan.highlight ? 'border-amber-400 shadow-xl shadow-amber-100/40' : 'border-gray-200'}`}>
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${plan.badge === 'Most Popular' ? 'bg-amber-400 text-[#07061f]' : 'bg-slate-100 text-slate-600'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className={`p-6 pb-7 ${plan.highlight ? 'bg-[#07061f]' : 'bg-slate-900'}`}>
                <div className="text-white font-bold text-lg mb-1">{plan.name}</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{plan.description}</p>
                <div className="flex items-end gap-2">
                  {plan.price_monthly === 0
                    ? <div className="text-3xl font-bold text-white">Free</div>
                    : <>
                        <div className="text-3xl font-bold text-white">${plan.price_monthly}</div>
                        <div className="text-slate-400 text-sm mb-1">/month</div>
                      </>
                  }
                </div>
                {plan.price_annual > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    ${plan.price_annual}/year — save {plan.save}
                  </p>
                )}
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        {f.label}
                        {f.note && <span className="text-gray-400 text-xs ml-1">— {f.note}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={(plan as any).ctaHref || '/sign-up'}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why MCSA */}
      <div className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#07061f] mb-2" style={{fontFamily:'var(--font-playfair)'}}>
              Why adjusters and carriers join
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Membership is built around the practical economics of handling municipal apparatus claims correctly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {valueProps.map((v, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border border-gray-200 hover:border-amber-200 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <v.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#07061f] text-sm mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#07061f] text-center mb-8" style={{fontFamily:'var(--font-playfair)'}}>
          Full feature comparison
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 bg-[#07061f] text-white text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-1 px-6 py-3.5">Feature</div>
            <div className="px-4 py-3.5 text-center">Professional</div>
            <div className="px-4 py-3.5 text-center text-amber-400">Carrier / TPA</div>
            <div className="px-4 py-3.5 text-center">Founding</div>
          </div>
          {comparison.map((row, i) => {
            if (row.section) return (
              <div key={i} className="grid grid-cols-4 bg-gray-50 border-t border-gray-200">
                <div className="col-span-4 px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {row.feature}
                </div>
              </div>
            )
            return (
              <div key={i} className="grid grid-cols-4 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="col-span-1 px-6 py-3 text-sm text-gray-700">{row.feature}</div>
                <div className="px-4 py-3 flex items-center justify-center">
                  {row.pro ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-200" />}
                </div>
                <div className="px-4 py-3 flex items-center justify-center">
                  {row.carrier ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-200" />}
                </div>
                <div className="px-4 py-3 flex items-center justify-center">
                  {row.founding ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-200" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#07061f] text-center mb-10" style={{fontFamily:'var(--font-playfair)'}}>
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faq.map((item, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-[#07061f] mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#07061f] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{fontFamily:'var(--font-playfair)'}}>
            Start with the training — no account required.
          </h2>
          <p className="text-slate-300 text-sm mb-7 max-w-xl mx-auto">
            Preview all 12 courses and browse the OEM resource library before joining.
            Membership unlocks tools, clean exports, and CMCA certification.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/training"
              className="px-7 py-3 bg-amber-400 text-[#07061f] font-semibold rounded-xl hover:bg-amber-300 transition-colors text-sm">
              Browse Training →
            </Link>
            <Link href="/sign-up"
              className="px-7 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
