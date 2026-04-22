'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/layout/Navigation'
import { BookOpen, ArrowRight, Clock, CheckCircle, Play, Lock, ChevronRight } from 'lucide-react'

const allCourses = [
  { code: 'MCSA-101', title: 'Introduction to Municipal Claims', slug: 'mcsa-101-introduction', level: 'beginner', duration: 90 },
  { code: 'MCSA-102', title: 'Vehicle Classification System', slug: 'mcsa-102-vehicle-classification', level: 'beginner', duration: 120 },
  { code: 'MCSA-103', title: 'Documentation & Photo Standards', slug: 'mcsa-103-documentation-standards', level: 'beginner', duration: 75 },
  { code: 'MCSA-104', title: 'Labor Control Without Labor Guides', slug: 'mcsa-104-labor-control', level: 'intermediate', duration: 105 },
  { code: 'MCSA-105', title: 'Municipal Equipment Valuation', slug: 'mcsa-105-valuation', level: 'intermediate', duration: 90 },
  { code: 'MCSA-106', title: 'Repair Facility Selection', slug: 'mcsa-106-repair-routing', level: 'intermediate', duration: 75 },
  { code: 'MCSA-107', title: 'Police & Law Enforcement Vehicles', slug: 'mcsa-107-police-vehicles', level: 'intermediate', duration: 120 },
  { code: 'MCSA-108', title: 'Ambulance & EMS Vehicle Claims', slug: 'mcsa-108-ambulance', level: 'advanced', duration: 135 },
  { code: 'MCSA-109', title: 'Fire Apparatus Claims', slug: 'mcsa-109-fire-apparatus', level: 'advanced', duration: 150 },
  { code: 'MCSA-110', title: 'Municipal Fleet & Public Works Equipment', slug: 'mcsa-110-municipal-fleet', level: 'intermediate', duration: 105 },
  { code: 'MCSA-201', title: 'Certified Municipal Claims Adjuster (CMCA)', slug: 'mcsa-201-cmca-certification', level: 'certification', duration: 240 },
  { code: 'MCSA-301', title: 'File Compliance & Quality Review', slug: 'mcsa-301-compliance', level: 'advanced', duration: 90 },
]

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
  certification: 'bg-yellow-100 text-yellow-700',
}

export default function DashboardCoursesPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setLoading(false)
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading...</div>
    </div>
  )

  const coreCount = allCourses.filter(c => c.code.startsWith('MCSA-1')).length
  const totalMinutes = allCourses.reduce((sum, c) => sum + c.duration, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-20">
        <div className="bg-navy-900 px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">My Courses</span>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Training Library</h1>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold-400" /> {allCourses.length} Courses Available
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" /> {Math.round(totalMinutes / 60)} Hours Total Content
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold-400" /> All Included with Membership
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* CMCA Progress Banner */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">CMCA Certification Progress</div>
              <div className="text-white font-bold mb-2">Complete all 10 core courses to unlock the CMCA exam</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-700" />
                </div>
                <span className="text-slate-300 text-sm whitespace-nowrap">0 / 10 complete</span>
              </div>
            </div>
            <Link href="/accreditation" className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
              View Requirements
            </Link>
          </div>

          {/* Core Curriculum */}
          <h2 className="text-lg font-bold text-navy-900 mb-4">Core Curriculum — CMCA Required</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {allCourses.filter(c => ['MCSA-101','MCSA-102','MCSA-103','MCSA-104','MCSA-105','MCSA-106','MCSA-107','MCSA-108','MCSA-109','MCSA-110'].includes(c.code)).map((course, i) => (
              <div key={course.slug} className="bg-white rounded-xl border border-slate-200 hover:border-navy-300 hover:shadow-md transition-all overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0 text-navy-700 font-bold text-xs" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-slate-400">{course.code}</span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${levelColors[course.level]}`}>
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    </div>
                    <div className="font-semibold text-navy-900 text-sm leading-snug">{course.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.duration} min
                    </div>
                  </div>
                  <Link href={`/training/${course.slug}`}
                    className="flex items-center gap-1.5 bg-navy-900 hover:bg-navy-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap">
                    <Play className="w-3 h-3" /> Start
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Courses */}
          <h2 className="text-lg font-bold text-navy-900 mb-4">Additional Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCourses.filter(c => ['MCSA-201','MCSA-301'].includes(c.code)).map(course => (
              <div key={course.slug} className={`bg-white rounded-xl border-2 ${course.code === 'MCSA-201' ? 'border-gold-300' : 'border-slate-200'} hover:shadow-md transition-all overflow-hidden`}>
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${course.code === 'MCSA-201' ? 'bg-gold-100' : 'bg-slate-100'}`}>
                    {course.code === 'MCSA-201'
                      ? <span className="text-yellow-700 font-bold text-xs">CMCA</span>
                      : <Lock className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-slate-400">{course.code}</span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${levelColors[course.level]}`}>
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    </div>
                    <div className="font-semibold text-navy-900 text-sm leading-snug">{course.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.duration} min
                    </div>
                  </div>
                  <Link href={`/training/${course.slug}`}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${course.code === 'MCSA-201' ? 'bg-gold-500 hover:bg-gold-400 text-navy-900' : 'bg-navy-900 hover:bg-navy-700 text-white'}`}>
                    <Play className="w-3 h-3" /> Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
