'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, ChevronDown } from 'lucide-react'

const navLinks = [
  { href: '/about', label: 'About' },
  {
    label: 'Training',
    children: [
      { href: '/training', label: 'All Courses' },
      { href: '/training/mcsa-101-introduction', label: 'MCSA-101: Introduction' },
      { href: '/training/mcsa-102-vehicle-classification', label: 'MCSA-102: Classification' },
      { href: '/training/mcsa-107-police-vehicles', label: 'MCSA-107: Police Vehicles' },
      { href: '/training/mcsa-108-ambulance', label: 'MCSA-108: Ambulances' },
      { href: '/training/mcsa-109-fire-apparatus', label: 'MCSA-109: Fire Apparatus' },
    ]
  },
  { href: '/accreditation', label: 'Accreditation' },
  { href: '/resources', label: 'Resources' },
  { href: '/membership', label: 'Membership' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const pathname = usePathname()
  const isDark = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBg = isDark
    ? scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    : 'bg-white shadow-sm border-b border-slate-200'

  const textColor = isDark ? 'text-white' : 'text-slate-700'
  const logoColor = isDark ? 'text-white' : 'text-navy-900'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-gold-400/30 transition-shadow">
              <Shield className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
            </div>
            <div>
              <span className={`font-bold text-lg leading-none tracking-tight ${logoColor}`} style={{fontFamily:'var(--font-playfair)'}}>MCSA</span>
              <span className={`block text-xs leading-none mt-0.5 opacity-70 ${textColor}`}>Municipal Claims Standards</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}>
                  <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor} hover:bg-white/10`}>
                    {link.label} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {dropdownOpen === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      {link.children.map(child => (
                        <Link key={child.href} href={child.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-800 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor} hover:bg-white/10 ${pathname === link.href ? 'bg-white/15' : ''}`}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${textColor} hover:bg-white/10`}>
              Sign In
            </Link>
            <Link href="/membership" className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-md">
              Join MCSA
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className={`md:hidden p-2 rounded-lg ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{link.label}</div>
                  {link.children.map(child => (
                    <Link key={child.href} href={child.href}
                      className="block px-6 py-2 text-sm text-slate-300 hover:text-white"
                      onClick={() => setMobileOpen(false)}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href}
                  className="block px-3 py-2 text-sm text-white font-medium"
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link href="/login" className="text-center py-2 text-sm text-slate-300" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/membership" className="bg-gold-500 text-navy-900 font-semibold text-sm px-4 py-2.5 rounded-lg text-center" onClick={() => setMobileOpen(false)}>Join MCSA</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
