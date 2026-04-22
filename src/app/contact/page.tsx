import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Mail, ChevronRight, MessageSquare, Users, Award } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="bg-navy-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Contact</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair)'}}>Contact MCSA</h1>
          <p className="text-slate-300 max-w-xl">Questions about membership, training, or the CMCA? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: MessageSquare, title: 'General Inquiries', email: 'info@municipalclaims.org', desc: 'Questions about the association, standards, or getting involved.' },
            { icon: Users, title: 'Membership', email: 'membership@municipalclaims.org', desc: 'Membership options, billing, team accounts, and carrier programs.' },
            { icon: Award, title: 'Certification', email: 'certification@municipalclaims.org', desc: 'CMCA requirements, exam scheduling, and credential verification.' },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-navy-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-1">{c.title}</h3>
              <p className="text-sm text-slate-500 mb-3 leading-relaxed">{c.desc}</p>
              <a href={`mailto:${c.email}`} className="text-sm text-navy-600 font-semibold hover:text-navy-900 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {c.email}
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-navy-900 mb-6" style={{fontFamily:'var(--font-playfair)'}}>Send us a message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="First" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Last" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
              <select className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white">
                <option>General inquiry</option>
                <option>Membership question</option>
                <option>CMCA certification</option>
                <option>Carrier / TPA program</option>
                <option>Standards feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none" placeholder="Tell us how we can help..." />
            </div>
            <button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 rounded-xl transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
