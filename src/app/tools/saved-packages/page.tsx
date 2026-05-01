'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import Link from 'next/link'
import { FileText, Plus, Clock, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  'Draft': 'bg-gray-100 text-gray-600',
  'Field Complete': 'bg-blue-100 text-blue-700',
  'Pending Documentation': 'bg-amber-100 text-amber-700',
  'Ready for Estimate Review': 'bg-violet-100 text-violet-700',
  'Ready for Carrier Submission': 'bg-emerald-100 text-emerald-700',
  'Returned for Correction': 'bg-red-100 text-red-700',
  'Closed': 'bg-gray-100 text-gray-500',
}

export default function SavedPackagesPage() {
  const { user, isLoaded } = useUser()
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/claim-packages').then(r => r.json()).then(d => {
      setPackages(d.packages || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  if (!isLoaded) return null
  if (!user) return (
    <div className="min-h-screen bg-gray-50"><Navigation />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Sign in to view saved packages</h2>
        <Link href="/sign-in" className="bg-amber-400 text-[#07061f] font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-300 transition-colors">Sign In</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#07061f]">Saved Claim Packages</h1>
            <p className="text-gray-500 text-sm mt-0.5">{packages.length} package{packages.length!==1?'s':''}</p>
          </div>
          <Link href="/tools/claim-package-builder"
            className="flex items-center gap-1.5 bg-amber-400 text-[#07061f] font-semibold px-4 py-2.5 rounded-xl hover:bg-amber-300 transition-colors text-sm">
            <Plus className="w-4 h-4" />New Package
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-7 h-7 border-2 border-[#07061f] border-t-transparent rounded-full animate-spin"/></div>
        ) : packages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
            <h3 className="font-semibold text-gray-600 mb-2">No saved packages</h3>
            <p className="text-gray-400 text-sm mb-5">Start building your first claim package</p>
            <Link href="/tools/claim-package-builder" className="bg-amber-400 text-[#07061f] font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-300 text-sm">
              New Claim Package
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg: any) => (
              <Link key={pkg.id} href={`/tools/claim-package-builder?id=${pkg.id}`}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-amber-300 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 bg-[#07061f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-amber-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[#07061f] text-sm">{pkg.claim_number || 'Draft Package'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[pkg.file_status] || 'bg-gray-100 text-gray-600'}`}>
                      {pkg.file_status}
                    </span>
                    {pkg.compliance_score && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkg.compliance_score==='Pass'?'bg-emerald-100 text-emerald-700':pkg.compliance_score==='Fail'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>
                        {pkg.compliance_score}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {[pkg.unit_type, pkg.municipality_name, pkg.carrier_name].filter(Boolean).join(' · ')}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {(pkg.risk_flags||[]).slice(0,2).map((f: string) => (
                      <span key={f} className="text-xs text-amber-600 flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3"/>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3"/>
                    {new Date(pkg.updated_at).toLocaleDateString()}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 ml-auto"/>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
