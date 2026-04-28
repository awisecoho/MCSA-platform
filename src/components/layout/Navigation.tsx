'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Menu, X, ChevronDown, Shield } from 'lucide-react'

const trainingLinks = [
  { href: '/training', label: 'All Courses' },
  { href: '/training/mcsa-101-introduction', label: 'MCSA-101: Introduction' },
  { href: '/training/mcsa-107-police-vehicles', label: 'MCSA-107: Police Vehicles' },
  { href: '/training/mcsa-108-ambulance', label: 'MCSA-108: Ambulances' },
  { href: '/training/mcsa-109-fire-apparatus', label: 'MCSA-109: Fire Apparatus' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [trainingOpen, setTrainingOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#07061f] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <div className="font-bold text-[#07061f] leading-none text-sm">MCSA</div>
              <div className="text-xs text-gray-500 leading-none">Municipal Claims Standards</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname === '/about' ? 'text-[#07061f] bg-gray-100' : 'text-gray-600 hover:text-[#07061f] hover:bg-gray-50'}`}>
              About
            </Link>

            {/* Training dropdown */}
            <div className="relative" onMouseEnter={() => setTrainingOpen(true)} onMouseLeave={() => setTrainingOpen(false)}>
              <Link href="/training" className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${pathname.startsWith('/training') ? 'text-[#07061f] bg-gray-100' : 'text-gray-600 hover:text-[#07061f] hover:bg-gray-50'}`}>
                Training <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              {trainingOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 mt-1">
                  {trainingLinks.map(l => (
                    <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#07061f]">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/accreditation" className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname === '/accreditation' ? 'text-[#07061f] bg-gray-100' : 'text-gray-600 hover:text-[#07061f] hover:bg-gray-50'}`}>
              Accreditation
            </Link>
            <Link href="/resources" className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname === '/resources' ? 'text-[#07061f] bg-gray-100' : 'text-gray-600 hover:text-[#07061f] hover:bg-gray-50'}`}>
              Resources
            </Link>
            <Link href="/membership" className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname === '/membership' ? 'text-[#07061f] bg-gray-100' : 'text-gray-600 hover:text-[#07061f] hover:bg-gray-50'}`}>
              Membership
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-[#07061f] transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-[#f59e0b] text-[#07061f] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#fbbf24] transition-colors">
                Join MCSA
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-[#07061f] transition-colors">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-1">
          <Link href="/about" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/training" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Training</Link>
          <Link href="/accreditation" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Accreditation</Link>
          <Link href="/resources" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Resources</Link>
          <Link href="/membership" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Membership</Link>
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <SignedOut>
              <Link href="/sign-in" className="flex-1 text-center py-2 text-sm border border-gray-200 rounded-lg text-gray-700" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/sign-up" className="flex-1 text-center py-2 text-sm bg-[#f59e0b] text-[#07061f] font-semibold rounded-lg" onClick={() => setMobileOpen(false)}>Join MCSA</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="flex-1 text-center py-2 text-sm border border-gray-200 rounded-lg text-gray-700" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  )
}
