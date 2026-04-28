import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { sql } from '@/lib/db'
import { FileText, ExternalLink, Lock } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function ResourcesPage() {
  const { userId } = await auth()

  let resources: any[] = []
  try {
    resources = await sql`SELECT * FROM mcsa_resources ORDER BY access_level, title`
  } catch { }

  const freeResources = resources.filter(r => r.access_level === 'free')
  const memberResources = resources.filter(r => r.access_level === 'member')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="bg-[#07061f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
          <p className="text-gray-300">OEM references, field guides, and MCSA standards documents.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Free Resources</h2>
          <div className="space-y-3">
            {freeResources.length === 0 && <p className="text-sm text-gray-400">No free resources yet.</p>}
            {freeResources.map((r: any) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{r.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{r.description}</div>
                </div>
                {r.external_url && (
                  <a href={r.external_url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 hover:text-amber-500 text-gray-400">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Member Resources</h2>
          <div className="space-y-3">
            {memberResources.map((r: any) => (
              userId ? (
                <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{r.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{r.description}</div>
                  </div>
                  {r.external_url && (
                    <a href={r.external_url} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 hover:text-amber-500 text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ) : (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4 opacity-70">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-500">{r.title}</div>
                    <div className="text-sm text-gray-400 mt-0.5">Members only</div>
                  </div>
                  <Link href="/sign-up" className="text-xs text-amber-600 font-medium hover:underline flex-shrink-0">
                    Join to access
                  </Link>
                </div>
              )
            ))}
            {memberResources.length === 0 && <p className="text-sm text-gray-400">Member resources coming soon.</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
