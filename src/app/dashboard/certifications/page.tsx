'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/layout/Navigation'
import { Award, ArrowRight, Shield, BookOpen, ChevronRight, CheckCircle } from 'lucide-react'

export default function DashboardCertificationsPage() {
  const [loading, setLoading] = useState(true)
  const [certifications, setCertifications] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await supabase
        .from('mcsa_certifications')
        .select('*, mcsa_courses(title)')
        .eq('user_id', session.user.id)
      setCertifications(data || [])
      setLoading(false)
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-20">
        <div className="bg-navy-900 px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Certifications</span>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>My Certifications</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {certifications.length === 0 ? (
            /* Empty state */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center mb-6">
                <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Award className="w-10 h-10 text-gold-400" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  No certifications yet
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
                  Complete the core curriculum and pass the CMCA examination to earn your Certified Municipal Claims Adjuster credential.
                </p>
                <Link href="/dashboard/courses"
                  className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  Start Your Training <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* CMCA pathway preview */}
              <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold">CMCA Certification</div>
                    <div className="text-slate-400 text-sm">Certified Municipal Claims Adjuster</div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    { step: '01', label: 'Complete MCSA-101 through MCSA-110', done: false },
                    { step: '02', label: 'Submit a compliant sample claim file', done: false },
                    { step: '03', label: 'Pass the CMCA exam with 80%+', done: false },
                    { step: '04', label: 'Receive credential and digital certificate', done: false },
                  ].map(item => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${item.done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                        {item.done ? <CheckCircle className="w-3.5 h-3.5" /> : item.step}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-emerald-400 line-through' : 'text-slate-300'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <Link href="/accreditation" className="inline-flex items-center gap-1 text-gold-400 text-sm font-semibold hover:text-gold-300">
                  Full CMCA Requirements <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* Certification cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map(cert => (
                <div key={cert.id} className="bg-white rounded-2xl border-2 border-gold-300 overflow-hidden shadow-lg shadow-gold-100">
                  <div className="bg-gradient-to-br from-navy-900 to-navy-800 p-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-navy-900" />
                    </div>
                    <div>
                      <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">MCSA Certified</div>
                      <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>{cert.certification_name}</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Certificate Number</div>
                        <div className="font-mono font-bold text-navy-900">{cert.certificate_number}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Awarded</div>
                        <div className="font-semibold text-navy-900">{new Date(cert.awarded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                      {cert.expires_at && (
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Expires</div>
                          <div className="font-semibold text-navy-900">{new Date(cert.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Status</div>
                        <div className={`font-bold ${cert.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                          {cert.is_active ? '✓ Active' : '✗ Expired'}
                        </div>
                      </div>
                    </div>
                    {cert.certificate_url && (
                      <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-gold-400 text-gold-600 hover:bg-gold-50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                        Download Certificate PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
