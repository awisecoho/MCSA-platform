'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/layout/Navigation'
import { User, CreditCard, Bell, LogOut, ChevronRight, Save, Shield } from 'lucide-react'

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await supabase.from('mcsa_profiles').select('*').eq('id', session.user.id).single()
      setProfile(data)
      setLoading(false)
    })
  }, [router])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('mcsa_profiles').update({
      first_name: profile.first_name,
      last_name: profile.last_name,
      organization: profile.organization,
      job_title: profile.job_title,
      phone: profile.phone,
    }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-20">
        <div className="bg-navy-900 px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Settings</span>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Account Settings</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <User className="w-5 h-5 text-navy-700" />
              <h2 className="font-bold text-navy-900">Profile Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                  <input type="text" value={profile?.first_name || ''} onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                  <input type="text" value={profile?.last_name || ''} onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input type="email" value={profile?.email || ''} disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed. Contact support for assistance.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization</label>
                <input type="text" value={profile?.organization || ''} onChange={e => setProfile({ ...profile, organization: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  placeholder="Company or agency name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job title</label>
                <input type="text" value={profile?.job_title || ''} onChange={e => setProfile({ ...profile, job_title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  placeholder="e.g. Independent Adjuster" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input type="tel" value={profile?.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  placeholder="(555) 555-5555" />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Membership */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <Shield className="w-5 h-5 text-navy-700" />
              <h2 className="font-bold text-navy-900">Membership</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Current Plan</div>
                  <div className="text-slate-500 text-xs mt-0.5 capitalize">{profile?.role || 'member'}</div>
                </div>
                <span className="bg-gold-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/membership" className="flex-1 text-center border border-navy-300 text-navy-700 hover:bg-navy-50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  View Plans
                </Link>
                <button className="flex-1 text-center border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Manage Billing
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-50">
              <h2 className="font-bold text-red-700 text-sm">Account Actions</h2>
            </div>
            <div className="p-6">
              <button onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-sm transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
