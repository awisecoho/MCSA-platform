import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { sql } from '@/lib/db'
import { BookOpen, ArrowRight, Clock, CheckCircle } from 'lucide-react'

export default async function MyCoursesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const enrollments = await sql`
    SELECT e.*, c.title, c.course_code, c.slug, c.level, c.duration_hours
    FROM mcsa_enrollments e
    JOIN mcsa_courses c ON c.id = e.course_id
    WHERE e.clerk_id = ${userId}
    ORDER BY e.created_at DESC
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-[#07061f] mb-6">My Courses</h1>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-2">No courses enrolled yet</h3>
            <Link href="/training" className="text-sm text-amber-600 font-medium hover:underline">
              Browse the training catalog →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((e: any) => (
              <Link key={e.id} href={`/training/${e.slug}`}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-6 py-4 hover:border-amber-300 transition-all group">
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded flex-shrink-0">
                  {e.course_code}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{e.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-40">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${e.progress_percent}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{e.progress_percent}% complete</span>
                  </div>
                </div>
                {e.progress_percent === 100
                  ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  : <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-amber-500" />
                }
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
