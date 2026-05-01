'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import Link from 'next/link'
import {
  Users, UserPlus, Shield, Clock, CheckCircle,
  XCircle, AlertTriangle, Trash2, ChevronRight,
  Mail, Building2
} from 'lucide-react'

const STATUS_STYLE: Record<string, string> = {
  invited:  'bg-blue-100 text-blue-700',
  active:   'bg-emerald-100 text-emerald-700',
  expired:  'bg-gray-100 text-gray-500',
  revoked:  'bg-red-100 text-red-600',
}

export default function TestersPage() {
  const { user, isLoaded } = useUser()
  const meta = user?.publicMetadata as Record<string, string> | undefined
  const isAdmin = meta?.role === 'admin'

  const [testers, setTesters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    fetch('/api/admin/testers')
      .then(r => r.json())
      .then(d => { setTesters(d.testers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isAdmin])

  async function revoke(id: string, email: string) {
    if (!confirm(`Revoke tester access for ${email}?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/testers/${id}`, { method: 'DELETE' })
      setTesters(prev => prev.filter(t => t.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/testers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setTesters(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  if (!isLoaded) return null

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Admin Access Required</h2>
          <Link href="/dashboard" className="text-amber-600 font-medium hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const stats = {
    total: testers.length,
    invited: testers.filter(t => t.status === 'invited').length,
    active: testers.filter(t => t.status === 'active').length,
    expired: testers.filter(t => t.expires_at && new Date(t.expires_at) < new Date()).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#07061f]">Tester Management</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage invited testers and their access status</p>
          </div>
          <Link href="/admin/invite-tester"
            className="flex items-center gap-2 bg-[#07061f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1e1b4b] transition-colors">
            <UserPlus className="w-4 h-4" />
            Invite Tester
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Invited', value: stats.total, color: 'text-[#07061f]' },
            { label: 'Pending', value: stats.invited, color: 'text-blue-600' },
            { label: 'Active', value: stats.active, color: 'text-emerald-600' },
            { label: 'Expired', value: stats.expired, color: 'text-gray-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tester list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#07061f] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : testers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-2">No testers invited yet</h3>
            <p className="text-gray-400 text-sm mb-5">Invite someone to test the MCSA platform with tester-level access</p>
            <Link href="/admin/invite-tester"
              className="inline-flex items-center gap-2 bg-amber-400 text-[#07061f] font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-300 text-sm">
              <UserPlus className="w-4 h-4" />
              Invite First Tester
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {testers.map((t: any) => {
                const isExpired = t.expires_at && new Date(t.expires_at) < new Date()
                const effectiveStatus = isExpired ? 'expired' : t.status
                return (
                  <div key={t.id} className="px-5 py-4 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-700">
                      {(t.first_name?.[0] || t.email[0]).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">
                          {[t.first_name, t.last_name].filter(Boolean).join(' ') || t.email}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[effectiveStatus] || 'bg-gray-100 text-gray-500'}`}>
                          {effectiveStatus}
                        </span>
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                          Tester
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />{t.email}
                        </span>
                        {t.organization && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Building2 className="w-3 h-3" />{t.organization}
                          </span>
                        )}
                        {t.expires_at && (
                          <span className={`flex items-center gap-1 text-xs ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                            <Clock className="w-3 h-3" />
                            {isExpired ? 'Expired' : 'Expires'} {new Date(t.expires_at).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          Invited {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {t.notes && (
                        <p className="text-xs text-gray-400 mt-1.5 italic">{t.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {t.status === 'invited' && (
                        <button onClick={() => updateStatus(t.id, 'active')}
                          className="text-xs text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
                          Mark Active
                        </button>
                      )}
                      <button onClick={() => revoke(t.id, t.email)} disabled={deleting === t.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Admin nav links */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
          <Link href="/dashboard" className="text-gray-500 hover:text-amber-600 transition-colors">← Dashboard</Link>
          <Link href="/admin/invite-tester" className="text-gray-500 hover:text-amber-600 transition-colors">Invite Tester</Link>
        </div>
      </div>
    </div>
  )
}
