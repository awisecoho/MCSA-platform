'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useMemo } from 'react'
import remarkGfm from 'remark-gfm'
import {
  Clock, BookOpen, CheckCircle, ExternalLink,
  FileText, Youtube, ArrowLeft, ChevronRight,
  ChevronLeft, AlignLeft, Play, AlertCircle
} from 'lucide-react'

// ─── VIDEO DATA ───────────────────────────────────────────────────────────────

const VIDEOS: Record<string, { title: string; desc: string; id: string; src: string; mod: string }[]> = {
  'mcsa-101-introduction': [
    { title: 'What Is a Municipal Claim? An Adjuster Introduction', desc: 'Overview of municipal vehicle types, what makes them different from private fleet, and why standard tools fail on emergency apparatus.', id: 'X8HYpfePBQY', src: 'Ford Pro', mod: 'Module 1' },
    { title: 'How Municipalities Manage Fleet — Public Works Perspective', desc: 'Fleet lifecycle, procurement, maintenance records, and why claim documentation requirements differ from private fleet.', id: 'dV6bwsomneA', src: 'Rosenbauer America', mod: 'Module 2' },
  ],
  'mcsa-103-documentation-standards': [
    { title: 'Emergency Vehicle Documentation — Field Walk-Through', desc: 'How to photograph a fully equipped police vehicle — four corners, emergency equipment, console, partition, and damage zones.', id: 'msVEhQENp3g', src: 'Emergency Vehicle Upfitter', mod: 'Module 1' },
  ],
  'mcsa-104-labor-control': [
    { title: 'Emergency Equipment Upfitting — Labor Reality', desc: 'A shop walk-through showing the actual work involved in emergency equipment installation. Context for understanding labor scope.', id: '7n_pYfjRsvM', src: 'Emergency Vehicle Upfitter', mod: 'Module 1' },
    { title: 'How Long Does It Take to Upfit a Police Vehicle?', desc: 'Real-world labor breakdown for a complete police interceptor upfit — helps calibrate MCSA labor ranges.', id: 'msVEhQENp3g', src: 'Emergency Vehicle Upfitter', mod: 'Module 2' },
  ],
  'mcsa-105-valuation': [
    { title: 'Whelen Engineering Product Line Overview', desc: 'Full Whelen product family — understanding the range helps identify what band a damaged component falls into for valuation.', id: 'zv64bVE00XY', src: 'Whelen Engineering', mod: 'Module 2' },
  ],
  'mcsa-102-vehicle-classification': [
    { title: 'Ford Pro VIS 2.0 — Upfitting Webinar', desc: 'Official Ford Pro webinar on the Upfitter Interface System, factory wiring architecture, and PIU-specific features.', id: 'X8HYpfePBQY', src: 'Ford Pro', mod: 'Module 2' },
  ],
  'mcsa-106-repair-facility': [
    { title: 'Emergency Vehicle Upfitting — Shop Walkthrough', desc: 'What a Tier 2 specialty upfitter shop looks like — capability, equipment, and workflow from a real facility.', id: 'msVEhQENp3g', src: 'Emergency Vehicle Upfitter', mod: 'Module 1' },
  ],
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
    { title: 'Fisher Engineering — Introduction to Plow Hydraulics', desc: 'Official Fisher training on plow hydraulic systems — essential for evaluating hidden damage.', id: '8umoHfPh9YA', src: 'Fisher Engineering', mod: 'Module 2' },
  ],
}

// ─── LEVEL COLORS ─────────────────────────────────────────────────────────────

const LEVEL_COLOR: Record<string, string> = {
  Beginner:      'bg-emerald-100 text-emerald-700',
  Intermediate:  'bg-blue-100 text-blue-700',
  Advanced:      'bg-purple-100 text-purple-700',
  Certification: 'bg-amber-100 text-amber-700',
}

// ─── LEARNING OUTCOMES ───────────────────────────────────────────────────────

const OUTCOMES: Record<string, string[]> = {
  'mcsa-101-introduction': [
    'Explain why municipal apparatus claims require a different framework than standard commercial vehicles',
    'Identify the 7 active steps of every municipal claim and the failure point at each step',
    'Describe the roles of the municipality, carrier, IA, and repair facility in the claims ecosystem',
  ],
  'mcsa-102-vehicle-classification': [
    'Classify any municipal vehicle into Tier 1, 2, or 3 without hesitation',
    'Identify factory differences between PIU and retail Explorer, and PPV and civilian Tahoe',
    'Apply the classify-up rule and explain why under-classification is the most costly error',
    'Recognize system trigger conditions that require adjacent-system inspection',
  ],
  'mcsa-103-documentation-standards': [
    'Execute the complete MCSA photo sequence for each vehicle tier',
    'Build a carrier-ready component inventory from a field inspection',
    'Apply MCSA file naming conventions and folder structure standards',
    'Identify the 6 elements a carrier quality reviewer looks for in a municipal file',
  ],
  'mcsa-104-labor-control': [
    'Decompose any emergency equipment labor estimate into task-level line items',
    'Apply MCSA labor reasonableness ranges to the 10 highest-variance task categories',
    'Identify and reject lump-sum labor billing on any file',
    'Apply quantity scaling rules to repetitive identical tasks',
  ],
  'mcsa-105-valuation': [
    'Apply MCSA 2024 valuation bands to all major emergency equipment categories',
    'Determine when an OEM quote is required versus when a band applies',
    'Apply condition factors based on equipment age and pre-loss condition',
    'Evaluate whether a shop invoice constitutes valid market evidence',
  ],
  'mcsa-106-repair-facility': [
    'Apply the MCSA repair hierarchy to any vehicle tier and damage type combination',
    'Structure split routing decisions and document the rationale',
    'Explain hidden damage triggers for fire apparatus, ambulance, and police vehicle losses',
    'Define return-to-service standards for municipal emergency apparatus',
  ],
  'mcsa-107-police-vehicles': [
    'Identify the four primary police platforms and their factory law enforcement differences',
    'Recognize Whelen, Federal Signal, Code 3, and SoundOff systems by architecture',
    'Scope a complete police vehicle claim including interior systems and integrated equipment',
    'Apply the airbag deployment trigger protocol to interior system assessment',
  ],
  'mcsa-108-ambulance': [
    'Classify Type I, II, III, and I-AD ambulances and identify the module manufacturer',
    'Identify the critical inspection points unique to Type III cab-module connection',
    'Evaluate whether a remount analysis is appropriate for a given loss',
    'Structure a total loss calculation for an ambulance under replacement cost coverage',
  ],
  'mcsa-109-fire-apparatus': [
    'Execute the first-30-minutes protocol at a fire apparatus loss scene',
    'Apply the system trigger matrix to any collision damage location',
    'Identify NFPA 1911 and 1071 requirements and include them correctly in the file',
    'Make and document the routing decision for OEM-authorized versus capable-shop repair',
  ],
  'mcsa-110-municipal-fleet': [
    'Evaluate a plow truck claim using the hydraulic evaluation protocol',
    'Inspect a dump body both with body down and body raised — document both conditions',
    'Apply split routing to public works equipment with multiple damage types',
    'Identify aerial boom truck damage requiring OEM involvement',
  ],
  'mcsa-301-file-compliance': [
    'Score any municipal claim file against the 25-point MCSA compliance checklist',
    'Identify and apply the 5 automatic failure triggers',
    'Deliver actionable compliance feedback by category',
    'Build a QA sampling program with appropriate triggers and KPIs',
  ],
  'mcsa-201-cmca-certification': [
    'Demonstrate mastery of all MCSA-101 through MCSA-301 core competencies',
    'Pass the 60-question CMCA proctored examination with 80% or higher',
    'Earn the Certified Municipal Claims Adjuster (CMCA) designation',
  ],
}

// ─── MARKDOWN COMPONENTS ──────────────────────────────────────────────────────

const md: any = {
  h2: ({ children }: any) => (
    <h2 className="text-xl font-bold text-[#07061f] mt-8 mb-3 pb-2 border-b-2 border-amber-200 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-sm font-semibold text-gray-500 mt-4 mb-1 uppercase tracking-wider">{children}</h4>
  ),
  p: ({ children }: any) => (
    <p className="text-gray-700 leading-relaxed mb-4 last:mb-0">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-outside ml-5 mb-4 space-y-1.5">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside ml-5 mb-4 space-y-1.5">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-gray-700 leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-amber-400 bg-amber-50 px-5 py-3 my-5 rounded-r-xl text-amber-900 text-sm leading-relaxed [&>p]:mb-0">
      {children}
    </blockquote>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }: any) => (
    <em className="italic text-gray-700">{children}</em>
  ),
  code: ({ inline, children }: any) =>
    inline
      ? <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[0.85em] font-mono">{children}</code>
      : <pre className="bg-gray-900 text-gray-100 rounded-xl px-5 py-4 overflow-x-auto text-sm font-mono my-5 leading-relaxed"><code>{children}</code></pre>,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-[#07061f]">{children}</thead>,
  th: ({ children }: any) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">{children}</th>
  ),
  tbody: ({ children }: any) => <tbody className="divide-y divide-gray-100">{children}</tbody>,
  tr: ({ children }: any) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
  td: ({ children }: any) => <td className="px-4 py-2.5 text-gray-700 leading-relaxed">{children}</td>,
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-medium">
      {children}
    </a>
  ),
  hr: () => <hr className="border-gray-200 my-6" />,
}

// ─── MEMOIZED CONTENT RENDERER ───────────────────────────────────────────────
// Prevents re-renders on every state change (enrolled, completed, tab switch)

import React from 'react'

const MemoizedContent = React.memo(function MemoizedContent({ content }: { content: string }) {
  if (!content) return (
    <div className="text-center py-12 text-gray-400">
      <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Content loading...</p>
    </div>
  )
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
        {content}
      </ReactMarkdown>
    </div>
  )
})

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

type Tab = 'lesson' | 'videos' | 'resources'

export default function CoursePage() {
  const params   = useParams()
  const slug     = params.slug as string
  const { user, isLoaded } = useUser()

  const [course,       setCourse]       = useState<any>(null)
  const [modules,      setModules]      = useState<any[]>([])
  const [activeModule, setActiveModule] = useState<any>(null)
  const [enrollment,   setEnrollment]   = useState<any>(null)
  const [completed,    setCompleted]    = useState<Set<string>>(new Set())
  const [resources,    setResources]    = useState<any[]>([])
  const [tab,          setTab]          = useState<Tab>('lesson')
  const [loading,      setLoading]      = useState(true)
  const [enrolling,    setEnrolling]    = useState(false)
  const [completing,   setCompleting]   = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)

  const videos = VIDEOS[slug] || []

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [courseRes, resourceRes] = await Promise.all([
        fetch(`/api/courses/${slug}`),
        fetch(`/api/resources?course=${slug}`),
      ])

      if (!courseRes.ok) return

      const data = await courseRes.json()
      setCourse(data.course)
      const mods = data.modules || []
      setModules(mods)
      if (mods.length > 0) setActiveModule(mods[0])

      if (resourceRes.ok) {
        const rd = await resourceRes.json()
        setResources(rd.resources || [])
      }

      if (user) {
        const enrRes = await fetch(`/api/enrollments?courseId=${data.course.id}`)
        if (enrRes.ok) {
          const enrData = await enrRes.json()
          setEnrollment(enrData.enrollment || null)
          setCompleted(new Set(enrData.completed || []))
        }
      }
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  useEffect(() => { if (isLoaded) load() }, [isLoaded, load])

  async function enroll() {
    if (!user || !course) return
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      })
      if (res.ok) setEnrollment((await res.json()).enrollment)
    } finally { setEnrolling(false) }
  }

  async function markComplete() {
    if (!enrollment || completing || !activeModule) return
    setCompleting(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: enrollment.id, moduleId: activeModule.id }),
      })
      if (res.ok) {
        setCompleted(prev => new Set([...prev, activeModule.id]))
        const idx = modules.findIndex(m => m.id === activeModule.id)
        if (idx < modules.length - 1) setActiveModule(modules[idx + 1])
      }
    } finally { setCompleting(false) }
  }

  const activeIdx     = modules.findIndex(m => m.id === activeModule?.id)
  const isDone        = activeModule ? completed.has(activeModule.id) : false
  const totalDone     = completed.size
  const progress      = modules.length > 0 ? Math.round((totalDone / modules.length) * 100) : 0
  const allComplete   = modules.length > 0 && totalDone === modules.length

  // ── Loading ──────────────────────────────────────────────────────────────
  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#07061f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading course...</p>
        </div>
      </div>
    </div>
  )

  if (!course) return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h2 className="font-semibold text-gray-600 mb-2">Course not found</h2>
          <Link href="/training" className="text-amber-600 hover:underline text-sm">← Back to training</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* ── Course header ────────────────────────────────────────────────── */}
      <div className="bg-[#07061f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/training"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />Back to Training
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {course.course_code}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_COLOR[course.level] || 'bg-gray-700 text-gray-300'}`}>
                  {course.level}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">{course.description}</p>

              {/* Learning outcomes */}
              {OUTCOMES[slug] && (
                <div className="mt-4 max-w-2xl">
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">What You'll Learn</p>
                  <ul className="space-y-1">
                    {OUTCOMES[slug].map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />{course.duration_hours}h
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />{modules.length} modules
                </span>
                {videos.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-amber-400" />{videos.length} video{videos.length > 1 ? 's' : ''}
                  </span>
                )}
                {resources.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />{resources.length} resource{resources.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            {enrollment ? (
              <div className="flex-shrink-0 bg-white/10 rounded-xl px-6 py-4 text-center min-w-[140px]">
                <div className="text-3xl font-bold text-amber-400">{progress}%</div>
                <div className="text-xs text-gray-400 mt-1">{totalDone} of {modules.length} done</div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : user ? (
              <button onClick={enroll} disabled={enrolling}
                className="flex-shrink-0 text-amber-400 border border-amber-400/30 hover:border-amber-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap">
                {enrolling ? 'Enrolling...' : '+ Track Progress'}
              </button>
            ) : (
              <Link href="/sign-in"
                className="flex-shrink-0 text-gray-400 hover:text-white text-sm transition-colors whitespace-nowrap">
                Sign in to track →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile module bar ────────────────────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 sticky top-0 z-10">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-between w-full py-1.5 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-gray-400" />
            <span className="truncate max-w-[200px]">
              {activeModule ? `${activeIdx + 1}. ${activeModule.title}` : 'Modules'}
            </span>
          </span>
          <span className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className="text-xs text-gray-400">{activeIdx + 1} / {modules.length}</span>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${sidebarOpen ? 'rotate-90' : ''}`} />
          </span>
        </button>
      </div>
      {sidebarOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md max-h-64 overflow-y-auto z-10 relative">
          {modules.map((mod, idx) => {
            const done   = completed.has(mod.id)
            const active = activeModule?.id === mod.id
            return (
              <button key={mod.id}
                onClick={() => { setActiveModule(mod); setTab('lesson'); setSidebarOpen(false) }}
                className={`w-full text-left px-5 py-3 flex items-center gap-3 border-b border-gray-100 last:border-0 transition-colors
                  ${active ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                  ${done ? 'bg-emerald-500' : active ? 'bg-amber-400' : 'bg-gray-200'}`}>
                  <span className={`text-xs font-bold ${done || active ? 'text-white' : 'text-gray-600'}`}>
                    {done ? '✓' : idx + 1}
                  </span>
                </div>
                <span className={`text-sm flex-1 truncate ${active ? 'font-semibold text-[#07061f]' : 'text-gray-700'}`}>
                  {mod.title}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">{mod.duration_minutes}m</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── LMS layout ───────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {modules.length} Modules
                </span>
                {enrollment && (
                  <span className="text-xs text-emerald-600 font-medium">{totalDone} done</span>
                )}
              </div>
              <nav className="overflow-y-auto max-h-[calc(100vh-320px)] divide-y divide-gray-100">
                {modules.map((mod, idx) => {
                  const done   = completed.has(mod.id)
                  const active = activeModule?.id === mod.id
                  return (
                    <button key={mod.id}
                      onClick={() => { setActiveModule(mod); setTab('lesson') }}
                      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-l-2
                        ${active ? 'bg-amber-50 border-amber-400' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5
                        ${done ? 'bg-emerald-500' : active ? 'bg-amber-400' : 'bg-gray-100'}`}>
                        {done
                          ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                          : <span className={`text-xs font-bold ${active ? 'text-[#07061f]' : 'text-gray-500'}`}>
                              {idx + 1}
                            </span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-snug ${active ? 'text-[#07061f]' : 'text-gray-700'}`}>
                          {mod.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{mod.duration_minutes} min</p>
                      </div>
                    </button>
                  )
                })}
              </nav>
              {(videos.length > 0 || resources.length > 0) && (
                <div className="border-t border-gray-100 p-3 space-y-1">
                  {videos.length > 0 && (
                    <button onClick={() => setTab('videos')}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                        ${tab === 'videos' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <Youtube className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      {videos.length} video{videos.length > 1 ? 's' : ''}
                    </button>
                  )}
                  {resources.length > 0 && (
                    <button onClick={() => setTab('resources')}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                        ${tab === 'resources' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      {resources.length} resource{resources.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-3 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              {/* Tab bar */}
              <div className="border-b border-gray-200 px-6 flex overflow-x-auto">
                {(['lesson',
                  ...(videos.length    > 0 ? ['videos']    : []),
                  ...(resources.length > 0 ? ['resources'] : []),
                ] as Tab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex-shrink-0
                      ${tab === t
                        ? 'border-amber-400 text-[#07061f]'
                        : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    {t === 'videos'    ? `Videos (${videos.length})`
                    : t === 'resources' ? `OEM Docs (${resources.length})`
                    : 'Lesson'}
                  </button>
                ))}
              </div>

              {/* ── LESSON ────────────────────────────────────────────────── */}
              {tab === 'lesson' && activeModule && (
                <div>
                  <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-medium">
                        Module {activeIdx + 1} of {modules.length}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />Completed
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-[#07061f]">{activeModule.title}</h2>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />{activeModule.duration_minutes} min read
                    </p>
                  </div>

                  <div className="px-6 py-8">
                    <MemoizedContent content={activeModule.content} />
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => activeIdx > 0 && setActiveModule(modules[activeIdx - 1])}
                      disabled={activeIdx === 0}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft className="w-4 h-4" />Prev
                    </button>

                    <div className="flex items-center gap-2">
                      {allComplete ? (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                          <CheckCircle className="w-4 h-4" />Course Complete!
                        </span>
                      ) : enrollment && !isDone ? (
                        <button onClick={markComplete} disabled={completing}
                          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-[#07061f] text-sm font-semibold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-60">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {completing ? 'Saving...' : 'Mark Complete'}
                        </button>
                      ) : !enrollment && user ? (
                        <button onClick={enroll} disabled={enrolling}
                          className="px-4 py-2 bg-[#07061f] text-white text-sm font-semibold rounded-lg hover:bg-[#1e1b4b] transition-colors disabled:opacity-60">
                          {enrolling ? '...' : 'Track Progress'}
                        </button>
                      ) : !enrollment && !user ? (
                        <Link href="/sign-in"
                          className="px-4 py-2 bg-[#07061f] text-white text-sm font-semibold rounded-lg hover:bg-[#1e1b4b] transition-colors">
                          Sign in to track
                        </Link>
                      ) : null}
                    </div>

                    <button
                      onClick={() => activeIdx < modules.length - 1 && setActiveModule(modules[activeIdx + 1])}
                      disabled={activeIdx === modules.length - 1}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      Next<ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── VIDEOS ────────────────────────────────────────────────── */}
              {tab === 'videos' && (
                <div className="p-6 space-y-8">
                  <p className="text-sm text-gray-500">
                    Manufacturer and training videos that supplement this course. Embedded from YouTube.
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

              {/* ── RESOURCES ─────────────────────────────────────────────── */}
              {tab === 'resources' && (
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-5">
                    OEM documentation, installation guides, and standards references for {course.course_code}.
                  </p>
                  {resources.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No resources for this course yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resources.map((r: any, i: number) => (
                        <a key={r.id || i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all group">
                          <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                            ${r.type === 'pdf' ? 'bg-red-100' : r.type === 'video' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                            {r.type === 'pdf'
                              ? <FileText className="w-4 h-4 text-red-600" />
                              : r.type === 'video'
                                ? <Play className="w-4 h-4 text-purple-600" />
                                : <ExternalLink className="w-4 h-4 text-blue-600" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span className="font-medium text-[#07061f] text-sm group-hover:text-amber-700 transition-colors">
                                {r.title}
                              </span>
                              {r.category && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{r.category}</span>
                              )}
                            </div>
                            {r.source_name && <p className="text-xs text-gray-400 mb-1">{r.source_name}</p>}
                            <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-amber-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <Link href="/resources" className="text-xs text-amber-600 font-medium hover:underline">
                      View full resource library →
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Course complete banner */}
            {allComplete && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800">{course.course_code} Complete</p>
                    <p className="text-sm text-emerald-600 mt-0.5">All {modules.length} modules finished.</p>
                  </div>
                </div>
                <Link href="/training"
                  className="flex-shrink-0 bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                  Next Course →
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
