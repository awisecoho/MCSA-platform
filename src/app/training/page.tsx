import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, Clock, Award, ArrowRight, Filter, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'


const courseImages: Record<string, string> = {
  'foundations': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
  'vehicle-classification': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'documentation': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
  'labor-control': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&q=80',
  'valuation': 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80',
  'repair-routing': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  'specialty-apparatus': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
  'compliance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
}

const levelColor: Record<string, string> = {
  'beginner': 'bg-emerald-100 text-emerald-700',
  'intermediate': 'bg-blue-100 text-blue-700',
  'advanced': 'bg-purple-100 text-purple-700',
}

const levelLabel: Record<string, string> = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
}

async function getCourses() {
  const { data } = await supabase
    .from('mcsa_courses')
    .select('*, mcsa_course_categories(name, slug, icon)')
    .eq('is_published', true)
    .order('order_index')
  return data || []
}

async function getCategories() {
  const { data } = await supabase
    .from('mcsa_course_categories')
    .select('*')
    .order('order_index')
  return data || []
}

export default async function TrainingPage() {
  const [courses, categories] = await Promise.all([getCourses(), getCategories()])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Header */}
      <div className="bg-navy-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Training</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>
            MCSA Training Catalog
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg">
            12 courses built from real municipal claims failure patterns. From foundational classification through advanced apparatus and CMCA certification.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm text-white">
              <BookOpen className="w-4 h-4 text-gold-400" /> 12 Courses
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm text-white">
              <Clock className="w-4 h-4 text-gold-400" /> 20+ Hours Content
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm text-white">
              <Award className="w-4 h-4 text-gold-400" /> 1 CMCA Certification
            </div>
          </div>
        </div>
      </div>

      {/* Certification callout */}
      <div className="bg-gold-500 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-navy-900 text-sm font-semibold">
            <Award className="w-4 h-4" />
            Members get all courses free. Non-members can purchase individually.
          </div>
          <Link href="/membership" className="text-navy-900 font-bold text-sm underline underline-offset-2 hover:opacity-80">
            Join MCSA →
          </Link>
        </div>
      </div>

      {/* Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map(cat => {
          const catCourses = courses.filter(c => c.category_id === cat.id)
          if (catCourses.length === 0) return null
          return (
            <div key={cat.id} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-slate-200" />
                <h2 className="text-lg font-bold text-navy-900 whitespace-nowrap">{cat.name}</h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catCourses.map(course => (
                  <Link key={course.id} href={`/training/${course.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-navy-400 hover:shadow-xl transition-all overflow-hidden card-hover">
                    {/* Course image */}
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={courseImages[course.mcsa_course_categories?.slug || 'foundations'] || courseImages['foundations']}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                      {course.is_certification && <div className="absolute top-2 right-2 bg-gold-500 text-navy-900 text-xs font-bold px-2 py-0.5 rounded">CMCA</div>}
                    </div>
                    {/* Top accent */}
                    <div className={`h-1 ${course.is_certification ? 'gold-bar' : 'bg-navy-700'}`} />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          {course.slug.split('-').slice(0,2).join('-').toUpperCase()}
                        </span>
                        {course.is_certification ? (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <Award className="w-3 h-3" /> Certification
                          </span>
                        ) : (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColor[course.level] || 'bg-slate-100 text-slate-600'}`}>
                            {levelLabel[course.level] || course.level}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-navy-900 mb-2 leading-snug group-hover:text-navy-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration_minutes} min
                        </div>
                        <div className="flex items-center gap-1 text-navy-600 text-sm font-semibold group-hover:gap-2 transition-all">
                          {course.is_member_free ? 'Free for Members' : `$${(course.price_cents / 100).toFixed(0)}`}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Footer />
    </div>
  )
}
