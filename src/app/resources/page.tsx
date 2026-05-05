'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Loader2, Search, FileText, Video, Link as LinkIcon, BookOpen, ExternalLink } from 'lucide-react'

const CATEGORIES = ['All', 'OEM', 'Diagram', 'Standards']
const COURSES = [
  { slug: '', label: 'All Courses' },
  { slug: 'mcsa-107-police-vehicles', label: 'MCSA-107 Police Vehicles' },
  { slug: 'mcsa-108-ambulance',       label: 'MCSA-108 Ambulance' },
  { slug: 'mcsa-109-fire-apparatus',  label: 'MCSA-109 Fire Apparatus' },
  { slug: 'mcsa-110-municipal-fleet', label: 'MCSA-110 Municipal Fleet' },
]
const TYPE_ICON: Record<string, any> = { pdf: FileText, link: LinkIcon, video: Video }
const CATEGORY_COLOR: Record<string, string> = {
  OEM: 'bg-blue-100 text-blue-700',
  Diagram: 'bg-violet-100 text-violet-700',
  Standards: 'bg-red-100 text-red-700',
}
const COURSE_LABEL: Record<string, string> = {
  'mcsa-107-police-vehicles': 'Police Vehicles',
  'mcsa-108-ambulance':       'Ambulance',
  'mcsa-109-fire-apparatus':  'Fire Apparatus',
  'mcsa-110-municipal-fleet': 'Municipal Fleet',
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [course, setCourse]       = useState('')

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
    const t = setTimeout(fetchResources, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchResources, search])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="bg-[#07061f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
            <BookOpen className="w-4 h-4" />
            <span>MCSA Resource Library</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">OEM Documentation & Field References</h1>
          <p className="text-gray-300 max-w-2xl">
            Manufacturer installation guides, wiring diagrams, product manuals, and standards documents
            organized by course.
          </p>
          {!loading && (
            <p className="text-sm text-gray-400 mt-4">
              <span className="text-white font-semibold">{resources.length}</span> resources
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by title, source, or description..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400" />
          </div>
          <select value={course} onChange={e => setCourse(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:border-amber-400">
            {COURSES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors
                  ${category === cat ? 'bg-[#07061f] text-white border-[#07061f]' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400'}`}>
                {cat}
                {cat !== 'All' && resources.filter(r => r.category === cat).length > 0 && (
                  <span className="ml-1 text-xs opacity-60">({resources.filter(r => r.category === cat).length})</span>
                )}
              </button>
            ))}
          </div>
          {(search || category !== 'All' || course) && (
            <button onClick={() => { setSearch(''); setCategory('All'); setCourse('') }}
              className="text-xs text-amber-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>
        ) : resources.length === 0 && (course || category !== 'All' || search) ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-gray-500 mb-1">No resources match these filters</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setCourse('') }}
              className="text-xs text-amber-600 hover:underline mt-1">Clear filters</button>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-gray-500 mb-1">Resource library loading</p>
            <p className="text-xs text-gray-400">If this persists, the library may still be indexing.</p>
            <button onClick={() => window.location.reload()}
              className="mt-3 text-xs text-amber-600 hover:underline">Refresh</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((r: any) => {
              const Icon = TYPE_ICON[r.type] || LinkIcon
              const catColor = CATEGORY_COLOR[r.category] || 'bg-gray-100 text-gray-600'
              return (
                <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-blue-100">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#07061f] leading-snug group-hover:text-amber-700 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{r.source_name}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-amber-400 transition-colors mt-0.5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>{r.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">{r.type}</span>
                    {r.course_slug && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#07061f]/5 text-[#07061f] font-medium">
                        {COURSE_LABEL[r.course_slug] || r.course_slug}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{r.description}</p>
                </a>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
