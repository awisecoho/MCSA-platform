'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/layout/Navigation'
import { BookOpen, Award, FileText, Settings, ArrowRight, Shield, CheckCircle, Clock, Star } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      const { data } = await supabase.from('mcsa_profiles').select('*').eq('id', session.user.id).single()
      setProfile(data)
      setLoading(false)
    }
    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading your dashboard...</div>
      </div>
    )
  }

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'Member'

  const quickLinks = [
    { href: '/dashboard/courses', icon: BookOpen, label: 'My Courses', desc: 'Continue your training', color: 'bg-blue-50 text-blue-600' },
    { href: '/dashboard/certifications', icon: Award, label: 'Certifications', desc: 'View your credentials', color: 'bg-gold-50 text-yellow-600' },
    { href: '/dashboard/resources', icon: FileText, label: 'Resources', desc: 'SOPs, matrices, tools', color: 'bg-emerald-50 text-emerald-600' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', desc: 'Account & membership', color: 'bg-slate-100 text-slate-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-navy-900 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Member Dashboard</p>
                <h1 className="text-3xl font-bold text-white" style={{fontFamily:'var(--font-playfair)'}}>
                  Welcome back, {firstName}.
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    {profile?.role === 'accredited' ? 'CMCA Certified' : 'MCSA Member'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-navy-300 transition-all group">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${link.color}`}>
                  <link.icon className="w-4.5 h-4.5 w-5 h-5" />
                </div>
                <div className="font-semibold text-navy-900 text-sm">{link.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{link.desc}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course progress */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-navy-900">Continue Learning</h2>
                <Link href="/training" className="text-sm text-navy-600 font-semibold hover:text-navy-900 flex items-center gap-1">
                  All Courses <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-6">Start with the foundational courses to build toward your CMCA certification.</p>
                {[
                  { code: 'MCSA-101', title: 'Introduction to Municipal Claims', slug: 'mcsa-101-introduction', done: false },
                  { code: 'MCSA-102', title: 'Vehicle Classification System', slug: 'mcsa-102-vehicle-classification', done: false },
                  { code: 'MCSA-103', title: 'Documentation & Photo Standards', slug: 'mcsa-103-documentation-standards', done: false },
                  { code: 'MCSA-104', title: 'Labor Control Without Labor Guides', slug: 'mcsa-104-labor-control', done: false },
                ].map(course => (
                  <div key={course.slug} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${course.done ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                      {course.done ? <CheckCircle className="w-4 h-4 text-white" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-slate-400 font-mono mr-2">{course.code}</span>
                      <span className="text-sm font-medium text-navy-900">{course.title}</span>
                    </div>
                    <Link href={`/training/${course.slug}`}
                      className="text-xs text-navy-600 font-semibold hover:text-navy-900 flex items-center gap-1">
                      Start <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* CMCA pathway */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 text-white">
                <Award className="w-8 h-8 text-gold-400 mb-3" />
                <h3 className="font-bold text-lg mb-2" style={{fontFamily:'var(--font-playfair)'}}>CMCA Pathway</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Complete all 10 core courses and pass the CMCA exam to earn your credential.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progress</span><span>0 / 10 courses</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gold-400 rounded-full" />
                  </div>
                </div>
                <Link href="/accreditation" className="inline-flex items-center gap-1 text-gold-400 text-sm font-semibold hover:text-gold-300">
                  View CMCA Requirements <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-navy-900 mb-3">Quick Resources</h3>
                {[
                  'Vehicle Classification Quick Guide',
                  'Municipal Claims Lifecycle Reference Card',
                ].map(r => (
                  <div key={r} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
                    <Star className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                    <Link href="/dashboard/resources" className="text-sm text-slate-700 hover:text-navy-900 transition-colors">{r}</Link>
                  </div>
                ))}
                <Link href="/dashboard/resources" className="text-xs text-navy-600 font-semibold mt-3 inline-flex items-center gap-1 hover:text-navy-900">
                  Full Library <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
