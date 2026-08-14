'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, role, loading, signOut } = useAuth()

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[70px]">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-teal-600 tracking-tight">
            Domorang
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            <li><Link href="/listings?type=rent" className="text-teal-600 font-medium hover:opacity-70 transition">Rent</Link></li>
            <li><Link href="/listings?type=sale" className="text-teal-600 font-medium hover:opacity-70 transition">Buy</Link></li>
            <li><Link href="/post-listing" className="text-teal-600 font-medium hover:opacity-70 transition">Sell</Link></li>
            <li><Link href="/agents" className="text-teal-600 font-medium hover:opacity-70 transition">Find an Agent</Link></li>
          </ul>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-9 bg-teal-50 animate-pulse rounded-full" />
            ) : user ? (
              <>
                {role === 'agent' && (
                  <Link href="/agent/profile" className="px-5 py-2 rounded-full border-2 border-teal-600 text-teal-600 font-semibold text-sm hover:bg-teal-600 hover:text-white transition">
                    Edit Profile
                  </Link>
                )}
                {role === 'admin' && (
                  <Link href="/admin" className="px-5 py-2 rounded-full border-2 border-purple-600 text-purple-600 font-semibold text-sm hover:bg-purple-600 hover:text-white transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2 rounded-full bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="px-5 py-2 rounded-full border-2 border-teal-600 text-teal-600 font-semibold text-sm hover:bg-teal-600 hover:text-white transition">
                  Sign In
                </Link>
                <Link href="/signup" className="px-5 py-2 rounded-full bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-teal-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-teal-600 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-teal-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-teal-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/listings?type=rent" className="text-teal-600 font-medium py-2" onClick={() => setMenuOpen(false)}>Rent</Link>
          <Link href="/listings?type=sale" className="text-teal-600 font-medium py-2" onClick={() => setMenuOpen(false)}>Buy</Link>
          <Link href="/post-listing" className="text-teal-600 font-medium py-2" onClick={() => setMenuOpen(false)}>Sell</Link>
          <Link href="/agents" className="text-teal-600 font-medium py-2" onClick={() => setMenuOpen(false)}>Find an Agent</Link>
          {user ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-teal-100">
              {role === 'agent' && (
                <Link href="/agent/profile" className="text-center py-2.5 rounded-full border-2 border-teal-600 text-teal-600 font-semibold text-sm" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
              )}
              {role === 'admin' && (
                <Link href="/admin" className="text-center py-2.5 rounded-full border-2 border-purple-600 text-purple-600 font-semibold text-sm" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleSignOut} className="text-center py-2.5 rounded-full bg-teal-500 text-white font-semibold text-sm">Sign Out</button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2 border-t border-teal-100">
              <Link href="/signin" className="flex-1 text-center py-2.5 rounded-full border-2 border-teal-600 text-teal-600 font-semibold text-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/signup" className="flex-1 text-center py-2.5 rounded-full bg-teal-500 text-white font-semibold text-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}