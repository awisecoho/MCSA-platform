'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/layout/Navigation'
import { FileText, Download, Search, Shield, BookOpen, Wrench, DollarSign, ChevronRight, ChevronDown } from 'lucide-react'

const categoryIcons: Record<string, any> = {
  'Documentation': FileText,
  'Labor Control': Wrench,
  'Valuation': DollarSign,
  'Vendor Reference': Shield,
  'Apparatus Reference': Shield,
  'Compliance': FileText,
  'SOPs': BookOpen,
  'Reference': BookOpen,
}

export default function DashboardResourcesPage() {
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await supabase
        .from('mcsa_resources')
        .select('*')
        .eq('is_published', true)
        .order('order_index')
      setResources(data || [])
      setLoading(false)
    })
  }, [router])

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(filtered.map(r => r.category))]

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
              <span className="text-white">Resource Library</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Resource Library</h1>
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:bg-white/20 focus:border-white/40"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {categories.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              {search ? `No resources match "${search}"` : 'No resources available yet.'}
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map(cat => {
                const catResources = filtered.filter(r => r.category === cat)
                const Icon = categoryIcons[cat] || FileText
                const isOpen = expanded === cat || !expanded

                return (
                  <div key={cat} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setExpanded(expanded === cat ? null : cat)}
                      className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-navy-700" />
                      </div>
                      <span className="font-bold text-navy-900 flex-1 text-left">{cat}</span>
                      <span className="text-xs text-slate-500 mr-2">{catResources.length} items</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100">
                        {catResources.map((resource, i) => (
                          <div key={resource.id} className={`flex items-start gap-4 px-6 py-4 ${i < catResources.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50 transition-colors group`}>
                            <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FileText className="w-4 h-4 text-navy-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-navy-900 text-sm mb-0.5">{resource.title}</div>
                              <p className="text-xs text-slate-500 leading-relaxed">{resource.description}</p>
                              {resource.file_url && (
                                <a href={resource.file_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-navy-600 font-semibold mt-1.5 hover:text-navy-900">
                                  <Download className="w-3 h-3" /> Download
                                </a>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {resource.file_url ? (
                                <a href={resource.file_url} target="_blank" rel="noopener noreferrer"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                  <Download className="w-3 h-3" /> Get
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Coming soon</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
