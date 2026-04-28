import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { sql } from '@/lib/db'
import { BookOpen, Award, ArrowRight, Clock } from 'lucide-react'

export default async function Dashboard() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()

  // Get enrollments with course info
  const enrollments = await sql`
    SELECT e.*, c.title, c.course_code, c.slug, c.level, c.duration_hours
    FROM mcsa_enrollments e
    JOIN mcsa_courses c ON c.id = e.course_id
    WHERE e.clerk_id = ${userId}
    ORDER BY e.created_at DESC
  `

  // Get certifications
  const certs = await sql`
    SELECT cert.*, c.title as course_title
    FROM mcsa_certifications cert
    JOIN mcsa_courses c ON c.id = cert.course_id
    WHERE cert.clerk_id = ${userId}
  `

  const firstName = user?.firstName || 'there'
  const inProgress = enrollments.filter((e: any) => e.progress_percent > 0 && e.progress_percent < 100)
  const notStarted = enrollments.filter((e: any) => e.progress_percent === 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#07061f]">Welcome back, {firstName}</h1>
          <p className="text-gray-500 mt-1">Your MCSA training dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#07061f]">{enrollments.length}</div>
                <div className="text-xs text-gray-500">Courses enrolled</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#07061f]">{inProgress.length}</div>
                <div className="text-xs text-gray-500">In progress</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#07061f]">{certs.length}</div>
                <div className="text-xs text-gray-500">Certifications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled courses */}
        {enrollments.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#07061f]">My Courses</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {enrollments.map((e: any) => (
                <Link key={e.id} href={`/training/${e.slug}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <span className="font-mono text-xs text-[#f59e0b] bg-amber-50 px-2 py-1 rounded">{e.course_code}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{e.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-32">
                        <div className="bg-[#f59e0b] h-1.5 rounded-full" style={{width:`${e.progress_percent}%`}}/>
                      </div>
                      <span className="text-xs text-gray-400">{e.progress_percent}%</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No courses yet</h3>
            <p className="text-gray-500 text-sm mb-4">Browse the training catalog and enroll in your first course.</p>
            <Link href="/training" className="bg-[#f59e0b] text-[#07061f] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#fbbf24] transition-colors inline-block text-sm">
              Browse Training
            </Link>
          </div>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#07061f]">Certifications</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {certs.map((c: any) => (
                <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">CMCA Certification</div>
                    <div className="text-xs text-gray-500">Cert #{c.cert_number} · Issued {new Date(c.issued_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
