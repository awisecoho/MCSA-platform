'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import Link from 'next/link'
import {
  UserPlus, CheckCircle, AlertTriangle, ArrowRight,
  Mail, Shield, Clock, Users, ChevronRight
} from 'lucide-react'

const ROLE_PERMISSIONS = [
  { label: 'Sign in', tester: true, member: true },
  { label: 'View full member dashboard', tester: true, member: true },
  { label: 'View all courses & lesson content', tester: true, member: true },
  { label: 'Enroll in courses', tester: true, member: true },
  { label: 'View videos & resources', tester: true, member: true },
  { label: 'Use Claim Package Builder (full)', tester: true, member: true },
  { label: 'Download member-only resources', tester: false, member: true },
  { label: 'Export clean PDF packets', tester: false, member: true },
  { label: 'Download CSV exports', tester: false, member: true },
  { label: 'Access admin pages', tester: false, member: false },
]

export default function InviteTesterPage() {
  const { user, isLoaded } = useUser()
  const meta = user?.publicMetadata as Record<string, string> | undefined
  const isAdmin = meta?.role === 'admin'

  const [form, setForm] = useState({
    email: '', first_name: '', last_name: '',
    organization: '', notes: '', expires_at: '', send_welcome: true,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; email?: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const e = {...prev}; delete e[key]; return e })
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/invite-tester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, message: data.message, email: form.email })
        setForm({ email: '', first_name: '', last_name: '', organization: '', notes: '', expires_at: '', send_welcome: true })
      } else {
        setResult({ success: false, message: data.error || 'Failed to send invitation' })
      }
    } catch {
      setResult({ success: false, message: 'Network error — please try again' })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) return null

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Admin Access Required</h2>
          <p className="text-gray-500 text-sm mb-6">You need admin privileges to access this page.</p>
          <Link href="/dashboard" className="text-amber-600 font-medium hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link href="/admin/testers" className="hover:text-gray-600">Testers</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Invite Tester</span>
            </div>
            <h1 className="text-2xl font-bold text-[#07061f]">Invite a Tester</h1>
            <p className="text-gray-500 text-sm mt-1">
              Send a Clerk invitation with tester-role access. Testers get full platform access except downloads and clean exports.
            </p>
          </div>
          <Link href="/admin/testers"
            className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-4 py-2 bg-white hover:border-gray-400 transition-colors">
            <Users className="w-4 h-4 text-gray-500" />
            View All Testers
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-500" />
                <h2 className="font-semibold text-[#07061f] text-sm">Tester Details</h2>
              </div>

              {result && (
                <div className={`mx-6 mt-6 p-4 rounded-xl flex items-start gap-3 ${result.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  {result.success
                    ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className={`text-sm font-medium ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                      {result.message}
                    </p>
                    {result.success && result.email && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-emerald-600">
                          ✓ Invitation email sent to <strong>{result.email}</strong>
                        </p>
                        <p className="text-xs text-emerald-600">
                          ✓ Role assigned: <strong>Tester</strong>
                        </p>
                        <p className="text-xs text-emerald-600">
                          ✓ Tester record saved to database
                        </p>
                        <Link href="/admin/testers" className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium hover:underline mt-1">
                          View all testers <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={submit} className="px-6 py-6 space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="tester@example.com"
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-amber-400 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input value={form.first_name} onChange={e => set('first_name', e.target.value)}
                      placeholder="Jane"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input value={form.last_name} onChange={e => set('last_name', e.target.value)}
                      placeholder="Adjuster"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <input value={form.organization} onChange={e => set('organization', e.target.value)}
                    placeholder="Claims company, carrier, agency..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                    rows={3} placeholder="Why this person was invited, what they're evaluating..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none" />
                </div>

                {/* Expiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Access Expires (optional)
                    </span>
                  </label>
                  <input type="date" value={form.expires_at} onChange={e => set('expires_at', e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  <p className="text-xs text-gray-400 mt-1">Leave blank for no expiration. Does not automatically revoke Clerk access — you must do that manually.</p>
                </div>

                {/* Send welcome email */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Send Welcome / Invite Email</p>
                    <p className="text-xs text-blue-600 mt-0.5">Clerk will send a sign-up link directly to the tester</p>
                  </div>
                  <button type="button" onClick={() => set('send_welcome', !form.send_welcome)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.send_welcome ? 'bg-blue-500' : 'bg-gray-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.send_welcome ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#07061f] text-white font-semibold rounded-xl hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 text-sm">
                  <UserPlus className="w-4 h-4" />
                  {loading ? 'Sending Invitation...' : 'Send Tester Invitation'}
                </button>
              </form>
            </div>
          </div>

          {/* Right panel — permissions */}
          <div className="space-y-4">
            {/* Role badge preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Role Assigned</h3>
              <div className="flex items-center gap-2">
                <span className="bg-violet-100 text-violet-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                  Tester
                </span>
                <span className="text-xs text-gray-400">via Clerk publicMetadata</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                The tester will receive a Clerk invitation email with a sign-up link.
                Their account will automatically have <code className="bg-gray-100 px-1 rounded">role: tester</code> set in public metadata.
              </p>
            </div>

            {/* Permissions comparison */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tester vs Member</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {ROLE_PERMISSIONS.map((p, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${p.tester ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                        {p.tester ? '✓' : '✕'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 flex-1">{p.label}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400">✓ = Tester has access · ✕ = Blocked for testers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
