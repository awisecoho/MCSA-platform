import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FileText, Lock, Download, ChevronRight, Shield, BookOpen } from 'lucide-react'

async function getResources() {
  const { data } = await supabase
    .from('mcsa_resources')
    .select('*')
    .eq('is_published', true)
    .order('order_index')
  return data || []
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Documentation: FileText,
  'Labor Control': BookOpen,
  Valuation: FileText,
  'Vendor Reference': Shield,
  'Apparatus Reference': Shield,
  Compliance: FileText,
  SOPs: FileText,
  Reference: BookOpen,
}

export default async function ResourcesPage() {
  const resources = await getResources()
  const categories = Array.from(new Set(resources.map(r => r.category)))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="bg-navy-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>Resource Library</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            SOPs, checklists, matrices, vendor references, and apparatus guides. The tools that replace guesswork with documented methodology.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-lg px-4 py-2 text-sm">
            <Lock className="w-4 h-4" />
            Most resources are member-only. <Link href="/membership" className="font-semibold underline underline-offset-2 ml-1">Join MCSA</Link> for full access.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map(cat => {
          const catResources = resources.filter(r => r.category === cat)
          const Icon = categoryIcons[cat] || FileText
          return (
            <div key={cat} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-navy-700" />
                </div>
                <h2 className="text-lg font-bold text-navy-900">{cat}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catResources.map(resource => (
                  <div key={resource.id} className={`bg-white rounded-xl border p-5 flex gap-4 transition-all ${resource.is_member_only ? 'border-slate-200' : 'border-emerald-200 hover:shadow-md cursor-pointer'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${resource.is_member_only ? 'bg-slate-100' : 'bg-emerald-50'}`}>
                      {resource.is_member_only ? <Lock className="w-4 h-4 text-slate-400" /> : <FileText className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-navy-900 text-sm leading-snug">{resource.title}</h3>
                        {resource.is_member_only ? (
                          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded flex-shrink-0">Members Only</span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex-shrink-0">Free</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{resource.description}</p>
                      {resource.is_member_only ? (
                        <Link href="/membership" className="text-xs text-navy-600 font-semibold mt-2 inline-block hover:text-navy-900">
                          Join to access →
                        </Link>
                      ) : (
                        <button className="text-xs text-emerald-600 font-semibold mt-2 inline-flex items-center gap-1 hover:text-emerald-800">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Member CTA */}
        <div className="bg-navy-900 rounded-2xl p-8 text-center mt-8">
          <Lock className="w-8 h-8 text-gold-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3" style={{fontFamily:'var(--font-playfair)'}}>Unlock the full library</h3>
          <p className="text-slate-300 mb-6">Members access all SOPs, matrices, vendor references, and apparatus guides — plus every training course.</p>
          <Link href="/membership" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl transition-colors">
            Join MCSA for Full Access
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
