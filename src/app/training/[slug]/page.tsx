'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Clock, BookOpen, Lock, CheckCircle, ExternalLink,
  FileText, Youtube, ArrowLeft, ChevronRight, Play
} from 'lucide-react'

// ─── CLICK TRACKING ──────────────────────────────────────────────────────────

function logResourceClick(resourceId: string) {
  fetch('/api/resource-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceId }),
  }).catch(() => {})
}

// ─── VIDEO & RESOURCE DATA ───────────────────────────────────────────────────

const VIDEOS: Record<string, { title: string; desc: string; id: string; src: string; mod: string }[]> = {
  'mcsa-107-police-vehicles': [
    { title: 'How We Upfitted This 2023 Ford Interceptor', desc: 'Real shop walkthrough — full emergency equipment installation on a PIU from start to finish.', id: 'msVEhQENp3g', src: 'Emergency Vehicle Upfitter', mod: 'Module 2' },
    { title: '80+ Hours to Upfit This Ford Interceptor', desc: 'Full labor documentation for a properly equipped police interceptor.', id: '7n_pYfjRsvM', src: 'Emergency Vehicle Upfitter', mod: 'Module 3' },
    { title: 'Ford Pro VIS 2.0 — Upfitting Webinar', desc: 'Official Ford Pro webinar on the Upfitter Interface System and factory wiring architecture.', id: 'X8HYpfePBQY', src: 'Ford Pro', mod: 'Module 1' },
    { title: 'Whelen Core System — Feature Spotlight', desc: 'How the Core integrated lighting and siren system works in practice.', id: 'zv64bVE00XY', src: 'Whelen Engineering', mod: 'Module 2' },
  ],
  'mcsa-108-ambulance': [
    { title: 'How Ambulances Are Made at Braun Industries', desc: 'Complete ambulance manufacturing — structural frames, module construction, electrical systems.', id: 'DatLUUBPS-E', src: 'Braun Ambulances', mod: 'Module 1' },
    { title: 'Braun Ambulances — 50 Years of Manufacturing', desc: 'Build process overview covering Type I and III configurations.', id: 'CQb_8ZDmBeI', src: 'Braun Ambulances', mod: 'Module 2' },
  ],
  'mcsa-109-fire-apparatus': [
    { title: 'Inside the Rosenbauer Factory', desc: 'Chassis construction, body fabrication, pump integration, electrical systems.', id: 'vccEi4ob_YU', src: 'Rosenbauer', mod: 'Module 1' },
    { title: 'Rosenbauer Motors Facility Tour', desc: 'How custom chassis and cab systems are designed and built.', id: 'dV6bwsomneA', src: 'Rosenbauer America', mod: 'Module 2' },
    { title: 'Pierce Manufacturing — Building Fire Trucks', desc: 'Pump assembly, compartment fabrication, and final build process.', id: 'm8EZCg2Y19I', src: 'FD Engineering', mod: 'Module 2' },
    { title: 'Rosenbauer Minnesota Body Facility Tour', desc: 'Body manufacturing, compartmentation, finishing.', id: 'uUo5hjD4xJk', src: 'Rosenbauer America', mod: 'Module 3' },
    { title: 'NFPA 1911 — Apparatus Inspection', desc: 'What post-collision testing is required before a fire apparatus returns to service.', id: 'U3AJi_Za6fE', src: 'Emergency Reporting', mod: 'Module 4' },
  ],
  'mcsa-110-municipal-fleet': [
    { title: 'Fisher Engineering — Introduction to Plow Hydraulics', desc: "Official Fisher training on plow hydraulic systems — essential for evaluating hidden damage.", id: '8umoHfPh9YA', src: 'Fisher Engineering', mod: 'Module 2' },
  ],
}

// Resources now loaded from DB — this object is kept only as a fallback stub
const RESOURCES_STUB: Record<string, any[]> = {
  'mcsa-102-vehicle-classification': [
    { title: 'Ford Police Interceptor Utility — Factory Features', desc: 'PIU features — 250A alternator, pre-wired circuits, factory differences from retail Explorer.', url: 'https://www.ford.com/police-vehicles/features/upfit/', type: 'web', badge: 'OEM Reference' },
  ],
  'mcsa-106-repair-facility': [
    { title: 'West Penn Vehicle Specialists — Emergency Vehicle Upfitting', desc: 'Example of a Tier 2 specialty upfitter — capabilities, process, equipment handled.', url: 'https://westpennvs.com/emergency-vehicle-upfitting/', type: 'web', badge: 'Shop Example' },
  ],
  'mcsa-107-police-vehicles': [
    { title: 'Ford Pro Upfitter Publications', desc: 'Body Builder Layout Books, wiring diagrams, upfitter interface guides for the Police Interceptor Utility.', url: 'https://www.fordpro.com/en-us/upfit/publications/', type: 'web', badge: 'OEM Reference' },
    { title: 'Whelen Install Guides', desc: 'All Whelen product installation guides — wiring complexity, connection points, system architecture.', url: 'https://www.whelen.com/support-and-training/install-guides', type: 'web', badge: 'Vendor Reference' },
    { title: 'Whelen Training & WEVT Certification', desc: 'Free Whelen training covering emergency lighting products and WEVT certification.', url: 'https://www.whelen.com/whelen-training', type: 'web', badge: 'Free Training' },
  ],
  'mcsa-108-ambulance': [
    { title: 'Braun — Type I vs Type III Guide', desc: "Braun's official comparison of Type I and III configurations — key differences for claims.", url: 'https://www.braunambulances.com/whats-the-difference-between-a-type-i-vs-type-iii-ambulance/', type: 'web', badge: 'OEM Reference' },
    { title: 'Braun Ambulance Types Overview', desc: 'Complete Braun product line — all types, chassis options, module configurations.', url: 'https://www.braunambulances.com/custom-ambulances/ambulance-types/', type: 'web', badge: 'OEM Reference' },
    { title: 'Life Line — Type I vs III Comparison', desc: 'Independent guide to type selection — chassis, fuel type, service life differences.', url: 'https://www.lifelineambulance.com/resource-center/guide-to-ambulances-types-i-vs-type-iii/', type: 'web', badge: 'Reference Guide' },
  ],
  'mcsa-109-fire-apparatus': [
    { title: 'Pierce Mfg — Product Support Hub', desc: "Pierce's official support hub — operator manuals, training, dealer network.", url: 'https://www.piercemfg.com/service/product-support', type: 'web', badge: 'OEM Support' },
    { title: 'NFPA 1911 — Standard Overview', desc: 'Standard for Inspection, Maintenance, Testing, and Retirement of In-Service Emergency Vehicles.', url: 'https://nfpa92.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=1911', type: 'web', badge: 'NFPA Standard' },
    { title: 'NFPA 1911 & 1071 — EVT Overview (IAFC)', desc: 'IAFC presentation on NFPA standards and Emergency Vehicle Technician certification requirements.', url: 'https://www.iafc.org/docs/default-source/1emerg-vehicle-mgnt/evms_nfpa1911_1071andevt.pdf', type: 'pdf', badge: 'PDF Reference' },
    { title: 'Rosenbauer America — Resource Hub', desc: 'Rosenbauer product information. Starting point for OEM documentation requests.', url: 'https://rosenbaueramerica.com', type: 'web', badge: 'OEM Reference' },
  ],
  'mcsa-110-municipal-fleet': [
    { title: 'BOSS Plow — Training & Tech Videos', desc: 'BOSS official training covering plow operation, maintenance, hydraulics.', url: 'https://bossplow.com/en/support/videos', type: 'web', badge: 'Vendor Training' },
    { title: 'Fisher Engineering — Technical Resources', desc: 'Fisher product specs and installation guides (Douglas Dynamics family).', url: 'https://fisherplows.com/', type: 'web', badge: 'Vendor Reference' },
    { title: 'BOSS Plow Parts Glossary', desc: 'A-frame, hydraulic manifold, lift cylinder, cutting edge — terminology for documenting damage.', url: 'https://info.bossplow.com/blog/blog/bid/157843/the-ultimate-glossary-of-snow-plow-parts-terminology', type: 'web', badge: 'Terminology' },
  ],
}

// ─── MARKDOWN RENDERER ──────────────────────────────────────────────────────

function renderMd(content: string) {
  if (!content) return null
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let k = 0
  let tableRows: React.ReactNode[] = []

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`t${k++}`} className="overflow-x-auto my-5 rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )
      tableRows = []
    }
  }

  const parseLine = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={i} className="font-semibold text-gray-900">{p.slice(2, -2)}</strong>
      if (p.startsWith('`') && p.endsWith('`'))
        return <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">{p.slice(1, -1)}</code>
      return p
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Table row
    if (line.startsWith('|') && !line.match(/^\|[-\s|]+\|$/)) {
      const cells = line.split('|').filter(c => c.trim())
      const isHeader = lines[i + 1]?.match(/^\|[-\s|]+\|$/)
      tableRows.push(
        <tr key={`tr${k++}`} className={isHeader ? 'bg-[#07061f]' : 'border-t border-gray-100 hover:bg-gray-50'}>
          {cells.map((c, ci) => isHeader
            ? <th key={ci} className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wide">{c.trim()}</th>
            : <td key={ci} className="px-3 py-2.5 text-gray-700">{parseLine(c.trim())}</td>
          )}
        </tr>
      )
      continue
    }

    // Non-table line — flush any pending table
    flushTable()

    if (!line.trim()) continue

    if (line.startsWith('## ')) {
      elements.push(<h2 key={k++} className="text-lg font-bold text-[#07061f] mt-7 mb-3 pb-2 border-b-2 border-amber-200">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={k++} className="text-base font-semibold text-gray-800 mt-5 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={k++} className="text-sm font-semibold text-gray-700 mt-4 mb-1 uppercase tracking-wide">{line.slice(5)}</h4>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={k++} className="ml-5 list-disc text-gray-700 mb-1.5 leading-relaxed">
          {parseLine(line.slice(2))}
        </li>
      )
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={k++} className="ml-5 list-decimal text-gray-700 mb-1.5 leading-relaxed">
          {parseLine(line.replace(/^\d+\. /, ''))}
        </li>
      )
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={k++} className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 my-4 rounded-r-lg text-amber-900 text-sm">
          {parseLine(line.slice(2))}
        </blockquote>
      )
    } else {
      elements.push(
        <p key={k++} className="text-gray-700 leading-relaxed mb-3">
          {parseLine(line)}
        </p>
      )
    }
  }
  flushTable()
  return <div className="space-y-0.5">{elements}</div>
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

type Tab = 'lesson' | 'videos' | 'resources'

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user, isLoaded } = useUser()

  const [course, setCourse] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [activeModule, setActiveModule] = useState<any>(null)
  const [tab, setTab] = useState<Tab>('lesson')
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [completing, setCompleting] = useState(false)

  const [dbResources, setDbResources] = useState<any[]>([])
  const videos = VIDEOS[slug] || []
  const resources = dbResources.length > 0 ? dbResources : (RESOURCES_STUB[slug] || [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/courses/${slug}`)
      if (!res.ok) { setLoading(false); return }
      const data = await res.json()
      setCourse(data.course)
      const mods = data.modules || []
      setModules(mods)
      if (mods.length > 0) setActiveModule(mods[0])

      if (user) {
        const enrRes = await fetch(`/api/enrollments?courseId=${data.course.id}`)
        if (enrRes.ok) {
          const enrData = await enrRes.json()
          setEnrollment(enrData.enrollment || null)
          setCompleted(new Set(enrData.completed || []))
        }
      }
      // Fetch DB resources for this course
      try {
        const rRes = await fetch(`/api/resources?course=${slug}`, { cache: 'no-store' })
        if (rRes.ok) { const rd = await rRes.json(); setDbResources(rd.resources || []) }
      } catch { /* non-fatal */ }
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  useEffect(() => {
    if (isLoaded) load()
  }, [isLoaded, load])

  async function enroll() {
    if (!user) { router.push('/sign-in'); return }
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setEnrollment(data.enrollment)
      }
    } finally {
      setEnrolling(false)
    }
  }

  async function markComplete(moduleId: string) {
    if (!enrollment || completing) return
    setCompleting(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: enrollment.id, moduleId }),
      })
      if (res.ok) {
        setCompleted(prev => new Set([...prev, moduleId]))
        const idx = modules.findIndex(m => m.id === moduleId)
        if (idx < modules.length - 1) setActiveModule(modules[idx + 1])
      }
    } finally {
      setCompleting(false)
    }
  }

  const canAccess = (_m: any) => true // All content open during testing
  const progress = modules.length > 0 ? Math.round((completed.size / modules.length) * 100) : 0
  const activeIdx = modules.findIndex(m => m.id === activeModule?.id)

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#07061f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading course...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Course not found</h2>
            <Link href="/training" className="text-amber-600 hover:underline text-sm">← Back to training</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* Course header */}
      <div className="bg-[#07061f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/training" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Training
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {course.course_code}
                </span>
                <span className="text-xs text-gray-400">{course.level}</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" />{course.duration_hours}h total</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-amber-400" />{modules.length} modules</span>
                {videos.length > 0 && <span className="flex items-center gap-1.5"><Youtube className="w-4 h-4 text-amber-400" />{videos.length} videos</span>}
              </div>
            </div>
            <div className="flex-shrink-0">
              {enrollment ? (
                <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
                  <div className="text-3xl font-bold text-amber-400">{progress}%</div>
                  <div className="text-xs text-gray-400 mt-1">{completed.size} of {modules.length} modules</div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                    <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : user ? (
                <button onClick={enroll} disabled={enrolling}
                  className="bg-amber-400 text-[#07061f] font-semibold px-7 py-3 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60 text-sm">
                  {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
                </button>
              ) : (
                <Link href="/sign-in"
                  className="bg-amber-400 text-[#07061f] font-semibold px-7 py-3 rounded-xl hover:bg-amber-300 transition-colors inline-block text-sm">
                  Sign In to Enroll
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LMS body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-4">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Modules</h3>
              </div>
              <nav className="divide-y divide-gray-100">
                {modules.map((mod, idx) => {
                  const acc = canAccess(mod)
                  const done = completed.has(mod.id)
                  const active = activeModule?.id === mod.id
                  return (
                    <button key={mod.id}
                      onClick={() => { if (acc) { setActiveModule(mod); setTab('lesson') } }}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
                        ${active ? 'bg-amber-50 border-l-2 border-amber-400' : 'hover:bg-gray-50'}
                        'cursor-pointer'`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-colors
                        ${done ? 'bg-emerald-500' : active ? 'bg-amber-400' : 'bg-gray-100'}`}>
                        {done
                          ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                          : false
                            ? <Lock className="w-3 h-3 text-gray-400" />
                            : <span className="text-xs font-bold text-gray-600">{idx + 1}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium leading-snug ${active ? 'text-[#07061f]' : !acc ? 'text-gray-400' : 'text-gray-800'}`}>
                          {mod.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs text-gray-400">{mod.duration_minutes} min</span>
                          
                        </div>
                      </div>
                    </button>
                  )
                })}
              </nav>
              {(videos.length > 0 || resources.length > 0) && (
                <div className="border-t border-gray-100 p-3 space-y-1">
                  {videos.length > 0 && (
                    <button onClick={() => setTab('videos')}
                      className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors
                        ${tab === 'videos' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{videos.length} reference videos</span>
                    </button>
                  )}
                  {resources.length > 0 && (
                    <button onClick={() => setTab('resources')}
                      className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors
                        ${tab === 'resources' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{resources.length} OEM resources</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              {/* Tab bar */}
              <div className="border-b border-gray-200 px-6 flex gap-0">
                {(['lesson', ...(videos.length > 0 ? ['videos'] : []), ...(resources.length > 0 ? ['resources'] : [])] as Tab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors capitalize -mb-px
                      ${tab === t ? 'border-amber-400 text-[#07061f]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    {t === 'videos' ? `Videos (${videos.length})` : t === 'resources' ? `Resources (${resources.length})` : 'Lesson'}
                  </button>
                ))}
              </div>

              {/* LESSON TAB */}
              {tab === 'lesson' && activeModule && (
                true ? (
                  <div>
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 font-medium">
                          Module {activeIdx + 1} of {modules.length}
                        </span>
                        {activeModule.is_preview && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Free Preview
                          </span>
                        )}
                        {completed.has(activeModule.id) && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-[#07061f]">{activeModule.title}</h2>
                      <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {activeModule.duration_minutes} min read
                      </p>
                    </div>

                    <div className="px-6 py-6">
                      {activeModule.content
                        ? renderMd(activeModule.content)
                        : <div className="text-center py-12 text-gray-400">
                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p>Module content is being loaded.</p>
                          </div>
                      }
                    </div>

                    {enrollment && (
                      <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => activeIdx > 0 && setActiveModule(modules[activeIdx - 1])}
                          disabled={activeIdx === 0}
                          className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-default transition-colors">
                          ← Previous
                        </button>
                        {!completed.has(activeModule.id) ? (
                          <button onClick={() => markComplete(activeModule.id)} disabled={completing}
                            className="px-6 py-2 text-sm bg-amber-400 text-[#07061f] font-semibold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-60">
                            {completing ? 'Saving...' : 'Mark Complete & Continue →'}
                          </button>
                        ) : activeIdx < modules.length - 1 ? (
                          <button onClick={() => setActiveModule(modules[activeIdx + 1])}
                            className="px-6 py-2 text-sm bg-[#07061f] text-white font-semibold rounded-lg hover:bg-[#1e1b4b] transition-colors">
                            Next Module →
                          </button>
                        ) : (
                          <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" /> Course Complete!
                          </span>
                        )}
                      </div>
                    )}

                    {!enrollment && !user && (
                      <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-amber-50 text-center">
                        <p className="text-sm text-amber-800 mb-3">
                          Sign in to track your progress across all modules.
                        </p>
                        <Link href="/sign-in"
                          className="inline-flex items-center gap-2 px-5 py-2 bg-[#07061f] text-white text-sm font-semibold rounded-lg hover:bg-[#1e1b4b] transition-colors">
                          Sign In to Track Progress
                        </Link>
                      </div>
                    )}


                  </div>
                ) : (
                  <div className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-7 h-7 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Module Locked</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                      {user ? 'Enroll in this course to unlock all modules and track your progress.'
                        : 'Create a free account and enroll to access this module.'}
                    </p>
                    {user ? (
                      <button onClick={enroll} disabled={enrolling}
                        className="bg-amber-400 text-[#07061f] font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-300 transition-colors text-sm disabled:opacity-60">
                        {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
                      </button>
                    ) : (
                      <Link href="/sign-up"
                        className="bg-amber-400 text-[#07061f] font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-300 transition-colors inline-block text-sm">
                        Create Free Account
                      </Link>
                    )}
                  </div>
                )
              )}

              {/* VIDEOS TAB */}
              {tab === 'videos' && (
                <div className="p-6 space-y-8">
                  <p className="text-sm text-gray-500">
                    Publicly available manufacturer and training videos that supplement the course material.
                    These are embedded directly from YouTube.
                  </p>
                  {videos.map((v, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="aspect-video bg-gray-900">
                        <iframe
                          src={`https://www.youtube.com/embed/${v.id}`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title={v.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{v.mod}</span>
                          <span className="text-xs text-gray-400">{v.src}</span>
                        </div>
                        <h4 className="font-semibold text-[#07061f] text-sm">{v.title}</h4>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RESOURCES TAB */}
              {tab === 'resources' && (
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-5">
                    OEM documentation, installation guides, and standards references for {course.course_code}.
                    All links open in a new tab.
                  </p>
                  {resources.length === 0 ? (
                    <p className="text-gray-400 text-center py-8 text-sm">No resources for this course yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {resources.map((r: any, i: number) => {
                        // DB resource shape: {id, title, description, url, type, category, source_name, access_level}
                        // Stub shape: {title, desc, url, type, badge}
                        const isDb = !!r.id
                        const title = r.title
                        const desc = isDb ? r.description : r.desc
                        const url = r.url
                        const type = r.type
                        const badge = isDb ? (r.category || r.type?.toUpperCase()) : r.badge
                        const locked = isDb && r.access_level === 'member' && !user
                        const isPdf = type === 'pdf'
                        const isVideo = type === 'video' || type === 'video_library'

                        return locked ? (
                          <div key={r.id || i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 opacity-75">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gray-200">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-gray-500 text-sm">{title}</span>
                                <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">Member Only</span>
                              </div>
                              <p className="text-sm text-gray-400">{desc}</p>
                            </div>
                            <Link href="/sign-up" className="text-xs text-amber-600 font-semibold hover:underline flex-shrink-0 mt-1">
                              Join to access
                            </Link>
                          </div>
                        ) : (
                          <a key={r.id || i} href={url || '#'} target="_blank" rel="noopener noreferrer"
                            onClick={() => r.id && logResourceClick(r.id)}
                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all group">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                              ${isPdf ? 'bg-red-100' : isVideo ? 'bg-purple-100' : 'bg-blue-100'}`}>
                              {isPdf
                                ? <FileText className="w-5 h-5 text-red-600" />
                                : isVideo
                                  ? <Youtube className="w-5 h-5 text-purple-600" />
                                  : <ExternalLink className="w-5 h-5 text-blue-600" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <span className="font-medium text-[#07061f] text-sm group-hover:text-amber-700 transition-colors">
                                  {title}
                                </span>
                                {badge && (
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">{badge}</span>
                                )}
                                {isDb && r.source_name && (
                                  <span className="text-xs text-gray-400 flex-shrink-0">{r.source_name}</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-amber-400" />
                          </a>
                        )
                      })}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/resources" className="text-xs text-amber-600 font-medium hover:underline">
                      View full resource library →
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
