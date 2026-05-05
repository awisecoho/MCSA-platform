'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, Clock, ArrowRight, Award, ChevronRight, Loader2, Play, FileText } from 'lucide-react'

const LEVEL_STYLE: Record<string, string> = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced:     'bg-purple-100 text-purple-700',
  Certification:'bg-amber-100 text-amber-700',
}

const TRACK_ORDER = [
  { label: 'Foundation',    levels: ['Beginner'],     color: 'border-emerald-300 bg-emerald-50',  dot: 'bg-emerald-500' },
  { label: 'Core Skills',   levels: ['Intermediate'], color: 'border-blue-300 bg-blue-50',        dot: 'bg-blue-500' },
  { label: 'Specialty',     levels: ['Advanced'],     color: 'border-purple-300 bg-purple-50',    dot: 'bg-purple-500' },
  { label: 'Certification', levels: ['Certification'],color: 'border-amber-300 bg-amber-50',      dot: 'bg-amber-500' },
]

export default function TrainingPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setCourses(d.courses || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-[#07061f] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-amber-400 mb-3">
              <BookOpen className="w-4 h-4" />
              <span>MCSA Training Curriculum</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Municipal Claims Training</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              12 courses built from field experience. Start with the Foundation track
              and work through to CMCA certification — or go straight to the apparatus
              type you're working on.
            </p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />12 courses
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />50 modules
              </span>
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />Reference videos
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />CMCA certification
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Start here callout */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">New to municipal claims?</span>
            <Link href="/training/mcsa-101-introduction"
              className="flex items-center gap-1.5 font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Start with MCSA-101: Introduction
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Courses temporarily unavailable</h3>
            <p className="text-gray-400 text-sm max-w-md">
              The course catalog is being updated. Try refreshing in a moment.
            </p>
            <button onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-amber-400 text-[#07061f] font-semibold text-sm rounded-lg hover:bg-amber-300 transition-colors">
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {TRACK_ORDER.map(track => {
              const trackCourses = courses.filter(c => track.levels.includes(c.level))
              if (!trackCourses.length) return null
              return (
                <div key={track.label}>
                  {/* Track header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-3 h-3 rounded-full ${track.dot}`} />
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {track.label} Track
                    </h2>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">{trackCourses.length} course{trackCourses.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Course cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {trackCourses.map((course: any) => (
                      <CourseCard key={course.id} course={course} levelStyle={LEVEL_STYLE[course.level]} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function CourseCard({ course, levelStyle }: { course: any; levelStyle: string }) {
  return (
    <Link href={`/training/${course.slug}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">

      {/* Color bar */}
      <div className={`h-1 w-full ${levelStyle.split(' ')[0].replace('text', 'bg').replace('-700','-400')}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {course.course_code}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${levelStyle}`}>
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#07061f] text-base mb-2 group-hover:text-amber-700 transition-colors leading-snug">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-4">
          {course.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{course.duration_hours}h
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
            Open course <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
