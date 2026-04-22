import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, BookOpen, Award, CheckCircle, ChevronRight, Lock, Play, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getCourse(slug: string) {
  const { data } = await supabase
    .from('mcsa_courses')
    .select('*, mcsa_course_categories(name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

async function getModules(courseId: string) {
  const { data } = await supabase
    .from('mcsa_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index')
  return data || []
}

const levelLabel: Record<string, string> = {
  beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
}
const levelColor: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug)
  if (!course) notFound()
  const modules = await getModules(course.id)
  const previewModule = modules.find(m => m.is_preview) || modules[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-navy-900 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/training" className="hover:text-white">Training</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white truncate max-w-xs">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {course.is_certification ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-gold-500/20 text-gold-400">
                    <Award className="w-3.5 h-3.5" /> Certification Course
                  </span>
                ) : (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColor[course.level] || 'bg-slate-200 text-slate-700'}`}>
                    {levelLabel[course.level] || course.level}
                  </span>
                )}
                {course.mcsa_course_categories && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-300">
                    {course.mcsa_course_categories.name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-snug" style={{fontFamily:'var(--font-playfair)'}}>
                {course.title}
              </h1>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">{course.description}</p>
              {course.long_description && (
                <p className="text-slate-400 leading-relaxed">{course.long_description}</p>
              )}

              <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-300">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold-400" />{course.duration_minutes} minutes</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold-400" />{modules.length} modules</div>
                {course.is_certification && <div className="flex items-center gap-2"><Award className="w-4 h-4 text-gold-400" />Earn CMCA upon completion</div>}
              </div>
            </div>

            {/* Enrollment card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
                <div className="text-center mb-6">
                  {course.is_member_free ? (
                    <>
                      <div className="text-3xl font-bold text-navy-900 mb-1" style={{fontFamily:'var(--font-playfair)'}}>Free</div>
                      <div className="text-sm text-slate-500">with MCSA membership</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-navy-900 mb-1">${(course.price_cents / 100).toFixed(0)}</div>
                      <div className="text-sm text-slate-500">one-time purchase</div>
                    </>
                  )}
                </div>

                <Link href="/login?redirect=/dashboard/courses"
                  className="block w-full text-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 rounded-xl mb-3 transition-colors">
                  Enroll Now
                </Link>
                <Link href="/membership"
                  className="block w-full text-center border border-gold-400 text-gold-600 hover:bg-gold-50 font-semibold py-3 rounded-xl mb-4 transition-colors text-sm">
                  Get All Courses — Join MCSA
                </Link>

                <ul className="space-y-2.5 mt-4">
                  {['Access to all modules', 'Downloadable resources', 'Progress tracking', course.is_certification ? 'CMCA exam included' : 'Module quizzes'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">

            {/* Preview module */}
            {previewModule && (
              <div className="bg-white rounded-2xl border border-slate-200 mb-8 overflow-hidden">
                <div className="bg-navy-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-navy-700" />
                  <span className="font-semibold text-navy-900 text-sm">Preview: {previewModule.title}</span>
                  <span className="ml-auto text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Free Preview</span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="prose-mcsa max-w-none">
                    {previewModule.content?.split('\n').map((line: string, i: number) => {
                      if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>
                      if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>
                      if (line.startsWith('- ')) return <li key={i} style={{marginLeft:'1.5rem'}}>{line.replace('- ', '')}</li>
                      if (line === '') return <br key={i} />
                      return <p key={i}>{line}</p>
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Remaining modules (locked) */}
            {modules.filter(m => m.id !== previewModule?.id).length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-navy-900">Course Modules</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Enroll or log in to access all modules</p>
                </div>
                {modules.map((module, idx) => (
                  <div key={module.id} className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 ${module.is_preview ? 'bg-emerald-50/30' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${module.is_preview ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {module.is_preview ? <Play className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-navy-900">{module.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{module.duration_minutes} min</div>
                    </div>
                    {module.is_preview && (
                      <span className="text-xs text-emerald-600 font-semibold">Free</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What you'll learn */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-navy-900 mb-4">What you'll learn</h3>
              <ul className="space-y-2.5">
                {course.long_description?.split('.').filter((s: string) => s.trim().length > 20).slice(0, 5).map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />
                    {point.trim()}.
                  </li>
                ))}
              </ul>
            </div>

            {/* Related courses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-navy-900 mb-4">Complete the Curriculum</h3>
              <p className="text-sm text-slate-600 mb-4">Earn the CMCA designation by completing all 10 core courses and passing the certification exam.</p>
              <Link href="/accreditation" className="flex items-center gap-1 text-navy-700 font-semibold text-sm hover:gap-2 transition-all">
                CMCA Requirements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
