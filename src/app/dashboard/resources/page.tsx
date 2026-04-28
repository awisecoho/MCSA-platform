import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { sql } from '@/lib/db'
import { FileText, ExternalLink } from 'lucide-react'

export default async function DashboardResourcesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const resources = await sql`
    SELECT * FROM mcsa_resources ORDER BY created_at DESC
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-[#07061f] mb-6">Resource Library</h1>
        {resources.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Resources coming soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((r: any) => (
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
                    className="flex-shrink-0 text-gray-400 hover:text-amber-500">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
