'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Star, CheckCircle, ArrowRight, Shield, Users,
  Award, ChevronRight, Loader2, Lock
} from 'lucide-react'

const BENEFITS = [
  {
    icon: Shield,
    title: 'Lifetime professional membership',
    desc: 'Full Professional membership — all 12 courses, CMCA certification pathway, claim package builder, OEM resource library — at no cost for life. No subscription renewals.',
  },
  {
    icon: Award,
    title: 'CMCA exam — first attempt complimentary',
    desc: 'Your first CMCA certification examination is included at no charge. The CMCA is the only credential in the industry specific to municipal apparatus claims.',
  },
  {
    icon: Users,
    title: 'Input on standards development',
    desc: 'Founding members receive an annual survey on standards updates and are invited to quarterly input calls. The people who work these claims should shape the standards that govern them.',
  },
  {
    icon: Star,
    title: 'Recognition in the MCSA founding record',
    desc: 'Your name and organization will appear in the permanent MCSA founding member record — the professionals who helped establish the first municipal claims standard.',
  },
  {
    icon: CheckCircle,
    title: 'Founding member certificate',
    desc: 'A numbered founding member certificate issued at launch, documenting your original membership in the association.',
  },
  {
    icon: ArrowRight,
    title: 'Early access to every new release',
    desc: 'New courses, updated standards, new tools — founding members get access before general release, including new apparatus types as they are added to the curriculum.',
  },
]

const ROLES = [
  'Independent Adjuster / IA',
  'Staff Adjuster',
  'Claims Manager / Supervisor',
  'Carrier — Underwriting',
  'Carrier — Claims',
  'TPA / Third Party Administrator',
  'Municipal Risk Manager',
  'Fleet Manager',
  'Emergency Vehicle Technician (EVT)',
  'Other',
]

const SEATS_TOTAL = 50
const SEATS_REMAINING = 31 // Update this manually as seats fill

export default function FoundingMemberPage() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    organization: '', role: '', notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    already_registered?: boolean
    message: string
  } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.first_name.trim()) errs.first_name = 'Required'
    if (!form.last_name.trim()) errs.last_name = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/api/founding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, already_registered: data.already_registered, message: data.message })
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong. Please try again.' })
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Header */}
      <div className="bg-[#07061f] pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#07061f] via-[#0f0d3d] to-[#1e1b6e] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Founding Membership</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              {SEATS_REMAINING} of {SEATS_TOTAL} seats remaining
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}>
              Be Part of What Sets<br />
              <span className="text-amber-400">the Standard.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
              MCSA founding members are the adjusters, managers, and carriers who recognized the gap
              in municipal claims standards before anyone else had a name for it.
              Founding membership is free, limited to {SEATS_TOTAL} seats, and closes when they're filled.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — Story + Benefits */}
          <div className="lg:col-span-3 space-y-10">

            {/* The story */}
            <div>
              <h2 className="text-xl font-bold text-[#07061f] mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}>
                Why founding membership exists
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Every standard in every industry has a founding moment — the point where enough
                  practitioners agree that informal judgment isn't good enough, and something
                  documented needs to take its place.
                </p>
                <p>
                  Municipal claims has been operating without a standard for decades. Adjusters
                  working Pierce pumpers with Mitchell guides. Carriers accepting lump-sum emergency
                  equipment labor because there's nothing to compare it against.
                  Ambulances routed to Mack truck shops because nobody built a routing protocol.
                </p>
                <p>
                  MCSA was built to change that. The founding members are the people who understood
                  the problem clearly enough to want to be part of the solution before it was finished.
                </p>
                <p className="font-medium text-[#07061f]">
                  Founding membership is permanent, free, and limited to {SEATS_TOTAL} seats.
                  There is no catch and no payment required.
                </p>
              </div>
            </div>

            {/* What you get */}
            <div>
              <h2 className="text-xl font-bold text-[#07061f] mb-5"
                style={{ fontFamily: 'var(--font-playfair)' }}>
                What founding members receive
              </h2>
              <div className="space-y-4">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mt-0.5">
                      <b.icon className="w-4.5 h-4.5 text-amber-600 w-[18px] h-[18px]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#07061f] text-sm mb-0.5">{b.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What founding is not */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <h3 className="font-semibold text-gray-700 text-sm">What founding membership is not</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">—</span>
                  Not a paid subscription that renews. Founding members never pay.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">—</span>
                  Not a commitment to purchase anything. Applying costs nothing and obligates nothing.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">—</span>
                  Not a mailing list. We won't send newsletters. We'll contact you when your seat is confirmed.
                </li>
              </ul>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">

              {/* Form header */}
              <div className="bg-[#07061f] px-6 py-5">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold text-sm">Apply for Founding Membership</span>
                </div>
                <p className="text-slate-400 text-xs">
                  {SEATS_REMAINING} seats remaining · Free · No payment required
                </p>
              </div>

              {result ? (
                /* Success / already-registered state */
                <div className="px-6 py-8 text-center">
                  {result.success ? (
                    <>
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-7 h-7 text-emerald-500" />
                      </div>
                      <h3 className="font-bold text-[#07061f] text-base mb-2">
                        {result.already_registered ? 'Already registered' : "You're on the list"}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5">
                        {result.already_registered
                          ? "Your email is already in the founding member queue. We'll be in touch when seats are confirmed."
                          : "We've received your application. We'll reach out with confirmation and access details once your seat is verified."
                        }
                      </p>
                      <div className="space-y-2">
                        <Link href="/training"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-400 text-[#07061f] font-semibold text-sm rounded-xl hover:bg-amber-300 transition-colors">
                          Browse Training Now <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/membership"
                          className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
                          View Membership Plans
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-2xl">!</span>
                      </div>
                      <h3 className="font-bold text-[#07061f] text-base mb-2">Something went wrong</h3>
                      <p className="text-sm text-gray-500 mb-5">{result.message}</p>
                      <button onClick={() => setResult(null)}
                        className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
                        Try again
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* Application form */
                <form onSubmit={submit} className="px-6 py-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        First name <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.first_name}
                        onChange={e => set('first_name', e.target.value)}
                        placeholder="Jane"
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-amber-400 transition-colors
                          ${errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.first_name && <p className="text-xs text-red-500 mt-0.5">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Last name <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.last_name}
                        onChange={e => set('last_name', e.target.value)}
                        placeholder="Adjuster"
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-amber-400 transition-colors
                          ${errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.last_name && <p className="text-xs text-red-500 mt-0.5">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Work email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@company.com"
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-amber-400 transition-colors
                        ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Organization</label>
                    <input
                      value={form.organization}
                      onChange={e => set('organization', e.target.value)}
                      placeholder="Company or agency name"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Your role</label>
                    <select
                      value={form.role}
                      onChange={e => set('role', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 transition-colors bg-white text-gray-700"
                    >
                      <option value="">Select your role...</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Why are you interested? <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      rows={3}
                      placeholder="What type of claims do you work? What problem does MCSA solve for you?"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 text-[#07061f] font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60 text-sm"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                    ) : (
                      <>Apply for Founding Membership <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    No payment required · No spam · Seats are first-come, first-served
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — existing member CTA */}
      <div className="bg-[#07061f] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm mb-2">Already have an account, or ready to start training now?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/training"
              className="px-6 py-2.5 bg-amber-400 text-[#07061f] font-semibold text-sm rounded-xl hover:bg-amber-300 transition-colors">
              Browse Training →
            </Link>
            <Link href="/membership"
              className="px-6 py-2.5 border border-white/20 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors">
              View Membership Plans
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
