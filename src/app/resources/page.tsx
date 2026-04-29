'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useUser } from '@clerk/nextjs'
import { FileText, ExternalLink, Lock, BookOpen, ClipboardList, Wrench, Scale, Loader2 } from 'lucide-react'
import Link from 'next/link'

const typeColors: Record<string, string> = {
  'OEM Reference':      'bg-blue-100 text-blue-700',
  'Reference Guide':    'bg-violet-100 text-violet-700',
  'Checklist':          'bg-emerald-100 text-emerald-700',
  'Template':           'bg-amber-100 text-amber-700',
  'Training':           'bg-sky-100 text-sky-700',
  'Regulatory Standard':'bg-red-100 text-red-700',
  'OEM Support':        'bg-indigo-100 text-indigo-700',
}

const typeIcons: Record<string, any> = {
  'OEM Reference':      BookOpen,
  'Reference Guide':    BookOpen,
  'Checklist':          ClipboardList,
  'Template':           FileText,
  'Training':           Wrench,
  'Regulatory Standard':Scale,
  'OEM Support':        Wrench,
}

const ALL_TYPES = ['All', 'OEM Reference', 'Reference Guide', 'Checklist', 'Template', 'Training', 'Regulatory Standard']

export default function ResourcesPage() {
  const { user, isLoaded } = useUser()
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'member'>('all')

  useEffect(() => {
    fetch('/api/resources', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setResources(d.resources || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = resources.filter(r => {
    if (filter !== 'All' && r.resource_type !== filter) return false
    if (accessFilter === 'free' && r.access_level !== 'free') return false
    if (accessFilter === 'member' && r.access_level !== 'member') return false
    return true
  })

  const freeCount = resources.filter(r => r.access_level === 'free').length
  const memberCount = resources.filter(r => r.access_level === 'member').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="bg-[#07061f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
          <p className="text-gray-300 max-w-2xl">
            OEM documentation, field checklists, templates, and MCSA standards references.
            Member resources include printable checklists, valuation tables, and scope note templates.
          </p>
          {!loading && (
            <div className="flex gap-5 mt-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                {freeCount} free resources
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                {memberCount} member resources
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Access filter */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            {(['all', 'free', 'member'] as const).map(a => (
              <button key={a} onClick={() => setAccessFilter(a)}
                className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${accessFilter === a ? 'bg-[#07061f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                {a === 'all' ? 'All' : a === 'free' ? 'Free' : 'Members Only'}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            {ALL_TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${filter === t ? 'bg-[#07061f] text-white border-[#07061f]' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resource list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No resources match these filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r: any) => {
              const isMember = r.access_level === 'member'
              const isLocked = isMember && !user
              const Icon = typeIcons[r.resource_type] || FileText
              const badgeColor = typeColors[r.resource_type] || 'bg-gray-100 text-gray-600'

              const inner = (
                <div className={`flex items-start gap-4 p-5 rounded-xl border transition-all h-full
                  ${isLocked
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : r.external_url
                      ? 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50 cursor-pointer'
                      : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                    ${isLocked ? 'bg-gray-200' : isMember ? 'bg-amber-100' : 'bg-blue-100'}`}>
                    {isLocked
                      ? <Lock className="w-5 h-5 text-gray-400" />
                      : <Icon className={`w-5 h-5 ${isMember ? 'text-amber-600' : 'text-blue-600'}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[#07061f]">{r.title}</span>
                      {isMember && !isLocked && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Member</span>
                      )}
                      {isLocked && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">Members Only</span>
                      )}
                    </div>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1.5 ${badgeColor}`}>
                      {r.resource_type}
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
                    {isLocked && (
                      <Link href="/sign-up" className="inline-block mt-2 text-xs text-amber-600 font-medium hover:underline">
                        Create free account to access →
                      </Link>
                    )}
                  </div>
                  {!isLocked && r.external_url && (
                    <ExternalLink className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              )

              if (!isLocked && r.external_url) {
                return (
                  <a key={r.id} href={r.external_url} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                )
              }
              return <div key={r.id}>{inner}</div>
            })}
          </div>
        )}

        {/* Join CTA for logged-out users */}
        {isLoaded && !user && memberCount > 0 && (
          <div className="mt-8 bg-[#07061f] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white mb-1">
                {memberCount} member resources available
              </h3>
              <p className="text-gray-400 text-sm">
                Printable checklists, valuation tables, scope templates, routing guides, and more.
                Free account required.
              </p>
            </div>
            <Link href="/sign-up"
              className="flex-shrink-0 bg-amber-400 text-[#07061f] font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-300 transition-colors text-sm whitespace-nowrap">
              Create Free Account
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
