'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, Award, ArrowRight, Clock, FileText, Plus, Wrench, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [certs, setCerts] = useState<any[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { router.replace('/sign-in'); return }

    // Fetch enrollment data from API
    Promise.all([
      fetch('/api/enrollments/all').then(r => r.json()).catch(() => ({ enrollments: [] })),
    ]).then(([enrData]) => {
      setEnrollments(enrData.enrollments || [])
      setDataLoaded(true)
    })
  }, [isLoaded, user, router])

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    )
  }

  const firstName = user.firstName || 'there'
  const inProgress = enrollments.filter(e => e.progress_percent > 0 && e.progress_percent < 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#07061f]">Welcome back, {firstName}</h1>
          <p className="text-gray-500 mt-1">Your MCSA member dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: BookOpen, color: 'bg-blue-100 text-blue-600', value: enrollments.length, label: 'Courses enrolled' },
            { icon: Clock,     color: 'bg-amber-100 text-amber-600', value: inProgress.length, label: 'In progress' },
            { icon: Award,     color: 'bg-emerald-100 text-emerald-600', value: certs.length, label: 'Certifications' },
          ].map(({ icon: Icon, color, value, label }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color.split(' ')[0]}`}>
                  <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#07061f]">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TOOLS ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tools/claim-package-builder"
              className="bg-[#07061f] rounded-xl p-5 flex items-center gap-4 hover:bg-[#1e1b4b] transition-colors group">
              <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#07061f]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Claim Package Builder</div>
                <div className="text-xs text-gray-400 mt-0.5">Build a complete MCSA-standard claim file</div>
              </div>
              <Plus className="w-5 h-5 text-amber-400 flex-shrink-0 group-hover:rotate-90 transition-transform duration-200" />
            </Link>

            <Link href="/tools/saved-packages"
              className="bg-white border-2 border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-amber-300 hover:shadow-sm transition-all group">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 transition-colors">
                <FileText className="w-6 h-6 text-gray-500 group-hover:text-amber-600 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Saved Claim Packages</div>
                <div className="text-xs text-gray-500 mt-0.5">View, reopen, and export saved packages</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-amber-500 transition-colors" />
            </Link>
          </div>
        </div>

        {/* ── TRAINING ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Training</h2>
            </div>
            <Link href="/training" className="text-xs text-amber-600 font-medium hover:underline">
              Browse all courses →
            </Link>
          </div>

          {!dataLoaded ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
          ) : enrollments.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {enrollments.map((e: any) => (
                <Link key={e.id} href={`/training/${e.slug}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded flex-shrink-0">
                    {e.course_code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate text-sm">{e.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-36">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${e.progress_percent}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{e.progress_percent}%</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-amber-500 transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">No courses enrolled yet</h3>
              <p className="text-gray-500 text-sm mb-4">Browse the training catalog and enroll — it's free.</p>
              <Link href="/training"
                className="inline-block bg-amber-400 text-[#07061f] font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-300 transition-colors text-sm">
                Browse Training
              </Link>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/resources" className="text-gray-500 hover:text-amber-600 transition-colors">Resource Library</Link>
          <Link href="/training" className="text-gray-500 hover:text-amber-600 transition-colors">All Courses</Link>
          <Link href="/accreditation" className="text-gray-500 hover:text-amber-600 transition-colors">CMCA Certification</Link>
          <Link href="/membership" className="text-gray-500 hover:text-amber-600 transition-colors">Membership</Link>
        </div>

      </div>
      <Footer />
    </div>
  )
}
