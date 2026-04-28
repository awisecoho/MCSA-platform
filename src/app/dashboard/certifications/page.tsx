import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { sql } from '@/lib/db'
import { Award } from 'lucide-react'

export default async function CertificationsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const certs = await sql`
    SELECT cert.*, c.title as course_title, c.course_code
    FROM mcsa_certifications cert
    JOIN mcsa_courses c ON c.id = cert.course_id
    WHERE cert.clerk_id = ${userId}
    ORDER BY cert.issued_at DESC
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-[#07061f] mb-6">My Certifications</h1>
        {certs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-2">No certifications yet</h3>
            <p className="text-sm text-gray-400">Complete MCSA-301 and pass the MCSA-201 exam to earn your CMCA.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certs.map((c: any) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-[#07061f]">CMCA — Certified Municipal Claims Adjuster</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Certificate #{c.cert_number} · Issued {new Date(c.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  {c.expires_at && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      Expires {new Date(c.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
