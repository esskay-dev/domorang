import Navbar from './components/Navbar'
import Link from 'next/link'
import { createSupabaseServer } from '../lib/supabase-server'
import FeaturedShowcase from './components/FeaturedShowcase'
import HeroMap from './components/HeroMap'
import React from 'react'
import { ShieldCheck, BadgeX, Handshake } from 'lucide-react'



const PLACEHOLDER_AREAS = ['Garki', 'Lokogoma', 'Gwarinpa', 'Maitama', 'Kubwa']
const TARGET_COUNT = 6

function ServiceIllustration({ type }: { type: string }) {
  const illustrations: Record<string, React.ReactElement> = {
    rent: (
      <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="100" cy="130" rx="85" ry="18" fill="white" fillOpacity="0.1"/>
        <rect x="55" y="45" width="70" height="85" rx="4" fill="white" fillOpacity="0.15"/>
        <rect x="55" y="45" width="70" height="85" rx="4" stroke="white" strokeWidth="2" strokeOpacity="0.6"/>
        <polygon points="48,47 100,15 152,47" fill="white" fillOpacity="0.25"/>
        <polygon points="48,47 100,15 152,47" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
        <rect x="82" y="95" width="22" height="35" rx="11" fill="white" fillOpacity="0.3"/>
        <rect x="82" y="95" width="22" height="35" rx="11" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
        <rect x="63" y="58" width="18" height="16" rx="3" fill="white" fillOpacity="0.35"/>
        <rect x="103" y="58" width="18" height="16" rx="3" fill="white" fillOpacity="0.35"/>
        <rect x="63" y="82" width="18" height="16" rx="3" fill="white" fillOpacity="0.35"/>
        <rect x="103" y="82" width="18" height="16" rx="3" fill="white" fillOpacity="0.35"/>
        <circle cx="155" cy="90" r="10" fill="white" fillOpacity="0.4"/>
        <rect x="148" y="100" width="14" height="25" rx="4" fill="white" fillOpacity="0.3"/>
        <circle cx="38" cy="75" r="10" stroke="white" strokeWidth="2.5" strokeOpacity="0.8" fill="none"/>
        <line x1="48" y1="75" x2="62" y2="75" stroke="white" strokeWidth="2.5" strokeOpacity="0.8"/>
        <line x1="58" y1="75" x2="58" y2="81" stroke="white" strokeWidth="2.5" strokeOpacity="0.8"/>
        <line x1="62" y1="75" x2="62" y2="81" stroke="white" strokeWidth="2.5" strokeOpacity="0.8"/>
        <rect x="115" y="28" width="42" height="18" rx="4" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
        <text x="136" y="41" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fillOpacity="0.9">RENT</text>
        <ellipse cx="22" cy="118" rx="12" ry="14" fill="white" fillOpacity="0.15"/>
        <rect x="20" y="118" width="4" height="12" fill="white" fillOpacity="0.2"/>
        <ellipse cx="178" cy="120" rx="10" ry="12" fill="white" fillOpacity="0.15"/>
        <rect x="176" y="120" width="4" height="10" fill="white" fillOpacity="0.2"/>
      </svg>
    ),
    buy: (
      <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="100" cy="132" rx="85" ry="16" fill="white" fillOpacity="0.1"/>
        <rect x="40" y="40" width="80" height="90" rx="3" fill="white" fillOpacity="0.12"/>
        <rect x="40" y="40" width="80" height="90" rx="3" stroke="white" strokeWidth="2" strokeOpacity="0.55"/>
        <line x1="40" y1="55" x2="120" y2="55" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
        <line x1="40" y1="68" x2="120" y2="68" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
        <line x1="40" y1="81" x2="120" y2="81" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
        <line x1="40" y1="94" x2="120" y2="94" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
        <line x1="40" y1="107" x2="120" y2="107" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
        <path d="M148 45 L148 68 Q148 78 158 83 Q168 78 168 68 L168 45 L158 40 Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
        <path d="M152 63 L156 67 L165 56" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9"/>
        <circle cx="35" cy="70" r="14" stroke="white" strokeWidth="2.5" strokeOpacity="0.7" fill="white" fillOpacity="0.1"/>
        <line x1="45" y1="80" x2="55" y2="90" stroke="white" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round"/>
        <circle cx="170" cy="105" r="9" fill="white" fillOpacity="0.35"/>
        <rect x="163" y="114" width="14" height="22" rx="4" fill="white" fillOpacity="0.25"/>
        <line x1="130" y1="15" x2="130" y2="55" stroke="white" strokeWidth="3" strokeOpacity="0.5"/>
        <line x1="110" y1="15" x2="155" y2="15" stroke="white" strokeWidth="2.5" strokeOpacity="0.5"/>
      </svg>
    ),
    sell: (
      <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="100" cy="132" rx="80" ry="15" fill="white" fillOpacity="0.1"/>
        <rect x="45" y="65" width="80" height="65" rx="3" fill="white" fillOpacity="0.15"/>
        <rect x="45" y="65" width="80" height="65" rx="3" stroke="white" strokeWidth="2" strokeOpacity="0.6"/>
        <polygon points="38,67 85,30 132,67" fill="white" fillOpacity="0.22"/>
        <polygon points="38,67 85,30 132,67" stroke="white" strokeWidth="2" strokeOpacity="0.65"/>
        <rect x="55" y="75" width="20" height="18" rx="3" fill="white" fillOpacity="0.35"/>
        <rect x="95" y="75" width="20" height="18" rx="3" fill="white" fillOpacity="0.35"/>
        <rect x="72" y="95" width="26" height="35" rx="3" fill="white" fillOpacity="0.28"/>
        <rect x="130" y="85" width="50" height="28" rx="5" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" strokeOpacity="0.7"/>
        <line x1="155" y1="113" x2="155" y2="130" stroke="white" strokeWidth="2.5" strokeOpacity="0.5"/>
        <text x="155" y="100" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" fillOpacity="0.9">FOR SALE</text>
        <circle cx="28" cy="90" r="9" fill="white" fillOpacity="0.4"/>
        <rect x="18" y="99" width="20" height="14" rx="3" fill="white" fillOpacity="0.25"/>
      </svg>
    ),
    agent: (
      <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="100" cy="135" rx="80" ry="13" fill="white" fillOpacity="0.1"/>
        <circle cx="55" cy="72" r="14" fill="white" fillOpacity="0.3"/>
        <path d="M35 130 Q35 105 55 105 Q75 105 75 130" fill="white" fillOpacity="0.2"/>
        <circle cx="100" cy="62" r="17" fill="white" fillOpacity="0.4"/>
        <path d="M75 130 Q75 98 100 98 Q125 98 125 130" fill="white" fillOpacity="0.28"/>
        <circle cx="145" cy="72" r="14" fill="white" fillOpacity="0.3"/>
        <path d="M125 130 Q125 105 145 105 Q165 105 165 130" fill="white" fillOpacity="0.2"/>
        <rect x="68" y="18" width="64" height="42" rx="4" fill="white" fillOpacity="0.18" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
        <rect x="76" y="42" width="8" height="12" rx="2" fill="white" fillOpacity="0.5"/>
        <rect x="88" y="34" width="8" height="20" rx="2" fill="white" fillOpacity="0.5"/>
        <rect x="100" y="28" width="8" height="26" rx="2" fill="white" fillOpacity="0.5"/>
        <rect x="112" y="36" width="8" height="18" rx="2" fill="white" fillOpacity="0.5"/>
        <polyline points="80,42 92,30 104,24 116,34" stroke="white" strokeWidth="2" strokeOpacity="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="55" cy="57" r="8" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M51 57 L54 60 L59 54" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9"/>
        <circle cx="145" cy="57" r="8" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M141 57 L144 60 L149 54" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9"/>
        <rect x="155" y="40" width="32" height="18" rx="6" fill="white" fillOpacity="0.25"/>
        <polygon points="161,58 158,66 168,58" fill="white" fillOpacity="0.25"/>
        <circle cx="162" cy="49" r="2" fill="white" fillOpacity="0.6"/>
        <circle cx="171" cy="49" r="2" fill="white" fillOpacity="0.6"/>
        <circle cx="180" cy="49" r="2" fill="white" fillOpacity="0.6"/>
      </svg>
    ),
  }

  return illustrations[type] || null
}

export default async function HomePage() {
  const supabase = await createSupabaseServer()
  const { data: realListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'verified')
    .order('created_at', { ascending: false })
    .limit(6)

  const realCount = realListings?.length || 0
  const placeholdersNeeded = Math.max(0, TARGET_COUNT - realCount)

  const featuredListings = [
    ...(realListings || []).map(l => ({ ...l, comingSoon: false })),
    ...PLACEHOLDER_AREAS.slice(0, placeholdersNeeded).map((area, i) => ({
      id: `stub-${i}`,
      area,
      comingSoon: true,
    })),
  ]

  return (
    <main className="min-h-screen bg-[#d9edf0] overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#d9edf0] px-4 sm:px-6 pt-8 sm:pt-10 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">

            {/* LEFT — text + search */}
            <div className="flex-1 text-left w-full max-w-lg">

              {/* Trust badge */}
              <div className="mb-4 sm:mb-5">
                <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-teal-200 text-teal-700 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse inline-block shrink-0" />
                  <span>Verified listings only · Zero scams · Abuja</span>
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.15] tracking-tight mb-4 sm:mb-5">
                Real <span style={{ color: '#31768a' }}>Estate</span> You Can Trust in{' '}
                <span style={{ color: '#31768a' }}>Abuja.</span>
              </h1>

              {/* Subtext */}
              <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                Discover verified properties, connect with trusted agents and landlords, and make confident property decisions—all in one place.
              </p>

              {/* Search bar — stacks vertically on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-md border border-gray-100 p-2 mb-4 gap-2 sm:gap-0">
                <div className="flex items-center flex-1 px-2">
                  <svg className="shrink-0 mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#31768a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Area, neighbourhood or address"
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent py-2 min-w-0"
                  />
                </div>
                <Link
                  href="/listings"
                  className="text-white px-5 py-2.5 rounded-xl font-bold text-sm transition hover:opacity-90 whitespace-nowrap text-center"
                  style={{ backgroundColor: '#31768a' }}
                >
                  Search
                </Link>
              </div>

            </div>

            {/* RIGHT — floating map card */}
            <div className="w-full lg:w-[60%] lg:max-w-[700px]">
              <div className="relative">

                {/* Glow blobs — hidden on mobile to prevent overflow */}
                <div className="hidden sm:block absolute -top-6 -right-6 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ backgroundColor: '#31768a' }} />
                <div className="hidden sm:block absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ backgroundColor: '#31768a' }} />

                {/* Map */}
                <div className="rounded-2xl overflow-hidden h-60 sm:h-72 md:h-[420px] relative shadow-2xl ring-4 ring-white">
                  <HeroMap listings={featuredListings.filter(l => !l.comingSoon)} />

                  {/* Overlay bar — compacts on small screens */}
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-xl gap-2">
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wide">Exploring</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-800 truncate">Abuja, FCT</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      <span className="text-xs font-semibold" style={{ color: '#31768a' }}>Live Listings</span>
                    </div>
                    <Link
                      href="/listings"
                      className="text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition hover:opacity-90 whitespace-nowrap shrink-0"
                      style={{ backgroundColor: '#31768a' }}
                    >
                      Browse Map
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="relative z-10 max-w-7xl mx-auto pt-12 sm:pt-16 pb-4 px-4 sm:px-0">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">Featured Listings</h2>
          <p className="text-xs sm:text-sm mt-2" style={{ color: '#31768a' }}>Verified properties across Abuja's top neighbourhoods</p>
        </div>
        <FeaturedShowcase listings={featuredListings} />
        <div className="text-center -mt-4">
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative bg-white px-4 py-14 sm:py-20 overflow-hidden">
        <svg className="absolute -left-24 top-10 w-80 h-80 pointer-events-none" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="160" r="40" stroke="#31768a" strokeOpacity="0.08" strokeWidth="10" />
          <circle cx="160" cy="160" r="70" stroke="#31768a" strokeOpacity="0.07" strokeWidth="10" />
          <circle cx="160" cy="160" r="100" stroke="#31768a" strokeOpacity="0.06" strokeWidth="10" />
          <circle cx="160" cy="160" r="130" stroke="#31768a" strokeOpacity="0.05" strokeWidth="10" />
          <circle cx="160" cy="160" r="158" stroke="#31768a" strokeOpacity="0.04" strokeWidth="8" />
        </svg>
        <svg className="absolute -right-32 bottom-0 w-96 h-96 pointer-events-none" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="160" r="40" stroke="#31768a" strokeOpacity="0.07" strokeWidth="10" />
          <circle cx="160" cy="160" r="70" stroke="#31768a" strokeOpacity="0.06" strokeWidth="10" />
          <circle cx="160" cy="160" r="100" stroke="#31768a" strokeOpacity="0.05" strokeWidth="10" />
          <circle cx="160" cy="160" r="130" stroke="#31768a" strokeOpacity="0.045" strokeWidth="10" />
          <circle cx="160" cy="160" r="158" stroke="#31768a" strokeOpacity="0.035" strokeWidth="8" />
        </svg>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#31768a' }}>What we offer</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">Everything you need</h2>
            <p className="text-sm text-gray-500 mt-2">One platform for buying, renting, listing, and finding the right agent in Abuja</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

            <div className="rounded-2xl p-7 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" style={{ backgroundColor: '#d9edf0' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-white">
                <svg viewBox="0 0 48 48" width="28" height="28">
                  <path d="M8 24 24 10 40 24" fill="none" stroke="#31768a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="13" y="24" width="22" height="16" rx="1.5" fill="#0d2f3f" />
                  <rect x="17" y="28" width="6" height="6" rx="1" fill="#d9edf0" />
                  <rect x="25" y="28" width="6" height="6" rx="1" fill="#d9edf0" />
                  <rect x="20" y="34" width="8" height="6" fill="#88b8c4" />
                  <circle cx="36" cy="18" r="7" fill="#ffffff" />
                  <path d="M33.5 18 35.3 19.8 38.5 15.8" stroke="#31768a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Rent a Home</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Find verified rental homes across Abuja without the usual stress or scams.</p>
              <Link href="/listings?type=rent" className="inline-flex items-center justify-center px-5 py-2.5 border-2 rounded-full text-sm font-bold transition hover:bg-[#31768a] hover:text-white" style={{ borderColor: '#31768a', color: '#31768a' }}>
                Browse Homes
              </Link>
            </div>

            <div className="rounded-2xl p-7 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" style={{ backgroundColor: '#d9edf0' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-white">
                <svg viewBox="0 0 48 48" width="28" height="28">
                  <rect x="7" y="15" width="22" height="22" rx="2" fill="#31768a" />
                  <rect x="11" y="19" width="14" height="2" fill="#31768a" opacity="0.5" />
                  <rect x="11" y="24" width="14" height="2" fill="#31768a" opacity="0.5" />
                  <rect x="11" y="29" width="9" height="2" fill="#31768a" opacity="0.5" />
                  <circle cx="33" cy="30" r="8" fill="#ffffff" />
                  <path d="M39 36 43 40" stroke="#d9edf0" strokeWidth="3" strokeLinecap="round" />
                  <path d="M29.5 30 32 32.5 36.5 27" stroke="#31768a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Buy a Home</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Transparent property details and credible, verified professionals.</p>
              <Link href="/listings?type=sale" className="inline-flex items-center justify-center px-5 py-2.5 border-2 rounded-full text-sm font-bold transition hover:bg-[#31768a] hover:text-white" style={{ borderColor: '#31768a', color: '#31768a' }}>
                Explore Sales
              </Link>
            </div>

            <div className="rounded-2xl p-7 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" style={{ backgroundColor: '#d9edf0' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-white">
                <svg viewBox="0 0 48 48" width="28" height="28">
                  <path d="M9 22 24 9 39 22" fill="none" stroke="#31768a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="14" y="22" width="20" height="15" rx="1.5" fill="#d9edf0" />
                  <rect x="20" y="27" width="8" height="10" fill="#31768a" />
                  <rect x="30" y="12" width="14" height="9" rx="2" fill="#ffffff" />
                  <text x="37" y="18.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#31768a" fontFamily="sans-serif">SALE</text>
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Sell a Home</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Reach verified buyers actively searching across Abuja.</p>
              <Link href="/post-listing" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: '#31768a' }}>
                List Property
              </Link>
            </div>

          </div>

          <div className="rounded-2xl p-7 sm:p-9 flex flex-col md:flex-row items-center gap-7 bg-white border border-gray-200">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 48 48" width="30" height="30">
                <circle cx="17" cy="16" r="7" fill="#31768a" />
                <circle cx="31" cy="18" r="6" fill="#88b8c4" />
                <path d="M6 40v-2c0-6 5-11 11-11h1c5 0 9.5 3 11 8" fill="none" stroke="#31768a" strokeWidth="3" strokeLinecap="round" />
                <path d="M27 37c1-4 4.5-7 9-7h0c4 0 7.5 2.5 8.5 6.5" fill="none" stroke="#88b8c4" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-lg font-black text-gray-900 mb-1">Find a Verified Agent</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Work with background-checked, local agents who know the Abuja market inside out. No middlemen, no surprises.</p>
            </div>
            <Link href="/agents" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white transition hover:opacity-90 shrink-0" style={{ backgroundColor: '#31768a' }}>
              Connect Now
            </Link>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-16 sm:py-24 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2f3f 0%, #31768a 100%)' }}>
        <svg className="absolute -left-16 -top-16 w-72 h-72 pointer-events-none" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="160" r="70" stroke="white" strokeOpacity="0.08" strokeWidth="10" />
          <circle cx="160" cy="160" r="110" stroke="white" strokeOpacity="0.06" strokeWidth="10" />
          <circle cx="160" cy="160" r="150" stroke="white" strokeOpacity="0.04" strokeWidth="8" />
        </svg>
        <svg className="absolute -right-20 -bottom-20 w-80 h-80 pointer-events-none" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="160" r="70" stroke="white" strokeOpacity="0.07" strokeWidth="10" />
          <circle cx="160" cy="160" r="110" stroke="white" strokeOpacity="0.05" strokeWidth="10" />
          <circle cx="160" cy="160" r="150" stroke="white" strokeOpacity="0.035" strokeWidth="8" />
        </svg>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
            Home Search Made <span style={{ color: '#ffd166' }}>Simple</span>,<br />
            Let's Do It Together.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/listings" className="px-8 py-3 rounded-full font-bold transition hover:opacity-90" style={{ backgroundColor: '#ffd166', color: '#0d2f3f' }}>
              Browse Listings
            </Link>
            <Link href="/post-listing" className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-[#0d2f3f] transition">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-black text-teal-400 mb-3">Domorang</div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Domorang is committed to making property transactions safer, more transparent, and more trustworthy. Through rigorous verification, clear information, and accountability-driven processes, we help people find homes with greater confidence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/listings?type=rent" className="hover:text-white transition">Rent</Link></li>
              <li><Link href="/listings?type=sale" className="hover:text-white transition">Buy</Link></li>
              <li><Link href="/post-listing" className="hover:text-white transition">Sell</Link></li>
              <li><Link href="/listings" className="hover:text-white transition">Find an Agent</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>No. 72, Obasanjo Road, Freedom Avenue, Dutse-Bwari, Bwari Area Council, FCT, Abuja, Nigeria.</p>
              <a href="mailto:hello@domorang.com" className="text-teal-400 hover:text-teal-300">hello@domorang.com</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 Domorang. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-teal-400 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}