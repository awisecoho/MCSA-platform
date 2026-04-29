'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, Clock, ArrowRight, Award, Loader2 } from 'lucide-react'

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
  Certification: 'bg-amber-100 text-amber-700',
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(res => {
        console.log('[training] /api/courses status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('[training] courses received:', data)
        setCourses(data.courses || data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('[training] fetch error:', err)
        setError('Failed to load courses')
        setLoading(false)
      })
  }, [])

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
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-amber-600 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses found.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
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
