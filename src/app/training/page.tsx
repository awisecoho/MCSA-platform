export const dynamic = 'force-dynamic'

import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, Clock, ArrowRight, Award } from 'lucide-react'

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
  Certification: 'bg-amber-100 text-amber-700',
}

async function getCourses() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://mcsa-platform.vercel.app'
    const res = await fetch(`${base}/api/courses`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.courses || []
  } catch {
    return []
  }
}

export default async function TrainingPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="bg-[#07061f] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-amber-400 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>MCSA Training Curriculum</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Municipal Claims Training</h1>
          <p className="text-gray-300 max-w-2xl text-lg">
            12 courses built from field experience. From classification fundamentals
            through fire apparatus and the CMCA certification exam.
          </p>
          <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />12 courses
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />50 modules
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />CMCA certification
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Courses loading...</h3>
            <p className="text-gray-500 text-sm">
              If this persists, the database may still be seeding.{' '}
              <Link href="/training" className="text-amber-600 underline">Refresh the page.</Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/training/${course.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-amber-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    {course.course_code}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${levelColors[course.level] || 'bg-gray-100 text-gray-600'}`}>
                    {course.level}
                  </span>
                </div>
                <h3 className="font-semibold text-[#07061f] text-base mb-2 group-hover:text-amber-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />{course.duration_hours}h
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-medium group-hover:gap-2 transition-all">
                    Start course <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
