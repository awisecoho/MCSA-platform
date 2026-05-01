'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {
  FileText, ExternalLink, Lock, Loader2,
  Search, Video, Link as LinkIcon, BookOpen, LayoutGrid
} from 'lucide-react'

const CATEGORIES = ['All', 'OEM', 'Diagram', 'Standards']
const COURSES = [
  { slug: '', label: 'All Courses' },
  { slug: 'mcsa-107-police-vehicles', label: 'MCSA-107 Police Vehicles' },
  { slug: 'mcsa-108-ambulance',       label: 'MCSA-108 Ambulance' },
  { slug: 'mcsa-109-fire-apparatus',  label: 'MCSA-109 Fire Apparatus' },
  { slug: 'mcsa-110-municipal-fleet', label: 'MCSA-110 Municipal Fleet' },
]

const TYPE_ICON: Record<string, any> = {
  pdf:          FileText,
  link:         LinkIcon,
  video:        Video,
  video_library:Video,
}

const CATEGORY_COLOR: Record<string, string> = {
  OEM:       'bg-blue-100 text-blue-700',
  Diagram:   'bg-violet-100 text-violet-700',
  Standards: 'bg-red-100 text-red-700',
}

const COURSE_LABEL: Record<string, string> = {
  'mcsa-107-police-vehicles': 'Police Vehicles',
  'mcsa-108-ambulance':       'Ambulance',
  'mcsa-109-fire-apparatus':  'Fire Apparatus',
  'mcsa-110-municipal-fleet': 'Municipal Fleet',
}

async function logClick(resourceId: string) {
  fetch('/api/resource-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceId }),
  }).catch(() => {})
}

export default function ResourcesPage() {
  const { user, isLoaded } = useUser()
  const [resources, setResources]   = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [course, setCourse]         = useState('')
  const [accessTab, setAccessTab]   = useState<'all'|'free'|'member'>('all')

  const fetchResources = useCallback(() => {
    const params = new URLSearchParams()
    if (course) params.set('course', course)
    if (category !== 'All') params.set('category', category)
    if (search.trim()) params.set('q', search.trim())
    setLoading(true)
    fetch(`/api/resources?${params}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setResources(d.resources || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [course, category, search])

  useEffect(() => {
    // Debounce search
    const t = setTimeout(fetchResources, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchResources, search])

  const filtered = resources.filter(r => {
    if (accessTab === 'free' && r.access_level !== 'free') return false
    if (accessTab === 'member' && r.access_level !== 'member') return false
    return true
  })

  const total   = resources.length
  const freeN   = resources.filter(r => r.access_level === 'free').length
  const memberN = resources.filter(r => r.access_level === 'member').length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* Header */}
      <div className="bg-[#07061f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
            <BookOpen className="w-4 h-4" />
            <span>MCSA Resource Library</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">OEM Documentation & Field References</h1>
          <p className="text-gray-300 max-w-2xl">
            Manufacturer installation guides, wiring diagrams, product manuals, and standards documents
            organized by course. Free resources are open to all. Member resources require a free account.
          </p>
          {!loading && (
            <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-400">
              <span><span className="text-white font-semibold">{total}</span> total resources</span>
              <span><span className="text-emerald-400 font-semibold">{freeN}</span> free</span>
              <span><span className="text-amber-400 font-semibold">{memberN}</span> member</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, source, or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Course select */}
          <select
            value={course}
            onChange={e => setCourse(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:border-amber-400">
            {COURSES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>

        {/* Category + Access tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors
                  ${category === cat ? 'bg-[#07061f] text-white border-[#07061f]' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            {(['all','free','member'] as const).map(a => (
              <button key={a} onClick={() => setAccessTab(a)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize
                  ${accessTab===a ? 'bg-[#07061f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                {a === 'all' ? 'All' : a === 'free' ? 'Free' : 'Members Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No resources match these filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r: any) => {
              const locked  = r.access_level === 'member' && !user
              const TypeIcon = TYPE_ICON[r.type] || LinkIcon
              const catColor = CATEGORY_COLOR[r.category] || 'bg-gray-100 text-gray-600'

              return (
                <div key={r.id}
                  className={`flex flex-col bg-white border rounded-xl p-5 transition-all
                    ${locked ? 'border-gray-200 opacity-80' : 'border-gray-200 hover:border-amber-300 hover:shadow-sm'}`}>

                  {/* Top row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                      ${locked ? 'bg-gray-100' : r.access_level === 'member' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                      {locked
                        ? <Lock className="w-4 h-4 text-gray-400" />
                        : <TypeIcon className={`w-4 h-4 ${r.access_level==='member' ? 'text-amber-600' : 'text-blue-600'}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#07061f] leading-snug">{r.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{r.source_name}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                      {r.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium uppercase">
                      {r.type}
                    </span>
                    {r.course_slug && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#07061f]/5 text-[#07061f] font-medium">
                        {COURSE_LABEL[r.course_slug] || r.course_slug}
                      </span>
                    )}
                    {r.access_level === 'member' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                        {locked ? 'Member Only' : 'Member'}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{r.description}</p>

                  {/* Action */}
                  <div className="mt-4">
                    {locked ? (
                      <Link href="/sign-up"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-semibold hover:underline">
                        <Lock className="w-3 h-3" />
                        Create free account to access
                      </Link>
                    ) : r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => logClick(r.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#07061f] text-white text-xs font-semibold rounded-lg hover:bg-[#1e1b4b] transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Resource
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Link coming soon</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Member CTA */}
        {isLoaded && !user && memberN > 0 && (
          <div className="mt-8 bg-[#07061f] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white mb-1">
                {memberN} member resources in this library
              </h3>
              <p className="text-gray-400 text-sm">
                OEM installation manuals, wiring diagrams, and operator guides. Free account required.
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
