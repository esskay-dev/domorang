'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '../../lib/api'

type Listing = {
  id: string
  title: string
  area: string
  price: number
  listing_type: string
  images: string[]
  status: string
  created_at: string
}

type Agent = {
  id: string
  agency_name: string
  area_of_operation: string
  verification_status: string
  profiles: { full_name: string; phone: string }
}

type Stats = {
  total: number
  verified: number
  pending: number
  agents: number
  verifiedAgents: number
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [pendingListings, setPendingListings] = useState<Listing[]>([])
  const [pendingAgents, setPendingAgents] = useState<Agent[]>([])
  const [recentListings, setRecentListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, pending: 0, agents: 0, verifiedAgents: 0 })
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'agents'>('overview')
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const userRes = await api.auth.getMe()
      if (!userRes || userRes.profile?.role !== 'admin') {
        window.location.href = '/'
        return
      }
      setProfile(userRes.profile)

      const [statsRes, pendingListingsRes, pendingAgentsRes, recentListingsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getPendingListings(),
        api.admin.getPendingAgents(),
        api.listings.getFeatured(5),
      ])

      setStats({
        total: statsRes.listings.total,
        verified: statsRes.listings.verified,
        pending: statsRes.listings.pending,
        agents: statsRes.agents.total,
        verifiedAgents: statsRes.agents.verified,
      })
      setPendingListings(pendingListingsRes || [])
      setPendingAgents(pendingAgentsRes || [])
      setRecentListings(recentListingsRes || [])
    } catch (err) {
      console.error('Failed to load admin data:', err)
      window.location.href = '/signin?redirectTo=/admin'
    } finally {
      setLoading(false)
    }
  }

  async function approveListing(id: string) {
    try {
      await api.admin.approveListing(id)
      setPendingListings(prev => prev.filter(l => l.id !== id))
      setStats(prev => ({ ...prev, pending: prev.pending - 1, verified: prev.verified + 1 }))
      flash('✓ Listing approved and now live')
    } catch (err: any) {
      flash('✗ ' + (err.message || 'Action failed'))
    }
  }

  async function rejectListing(id: string) {
    try {
      await api.admin.rejectListing(id)
      setPendingListings(prev => prev.filter(l => l.id !== id))
      setStats(prev => ({ ...prev, pending: prev.pending - 1 }))
      flash('✗ Listing rejected')
    } catch (err: any) {
      flash('✗ ' + (err.message || 'Action failed'))
    }
  }

  async function verifyAgent(id: string) {
    try {
      await api.admin.verifyAgent(id)
      setPendingAgents(prev => prev.filter(a => a.id !== id))
      setStats(prev => ({ ...prev, verifiedAgents: prev.verifiedAgents + 1 }))
      flash('✓ Agent verified')
    } catch (err: any) {
      flash('✗ ' + (err.message || 'Action failed'))
    }
  }

  async function rejectAgent(id: string) {
    try {
      await api.admin.rejectAgent(id)
      setPendingAgents(prev => prev.filter(a => a.id !== id))
      flash('✗ Agent rejected')
    } catch (err: any) {
      flash('✗ ' + (err.message || 'Action failed'))
    }
  }

  function flash(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3000)
  }

  const verifiedRatio = stats.total ? Math.round((stats.verified / stats.total) * 100) : 0
  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1F3C' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/10 rounded-full mx-auto mb-4" style={{ borderTopColor: '#0ECFC0', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p className="text-white/40 text-sm">Loading dashboard…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4f8' }}>

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen sticky top-0" style={{ background: '#0D1F3C' }}>
        <div className="px-5 py-5 border-b border-white/5">
          <div className="text-lg font-black" style={{ color: '#0ECFC0' }}>Domorang</div>
          <div className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mt-0.5">Admin Console</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: '▦' },
            { id: 'listings', label: 'Listings', icon: '🏠', badge: stats.pending },
            { id: 'agents', label: 'Agents', icon: '🤝', badge: pendingAgents.length },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition"
              style={activeTab === item.id
                ? { background: 'rgba(14,207,192,0.12)', color: '#0ECFC0' }
                : { color: 'rgba(255,255,255,0.45)' }
              }
            >
              <span className="flex items-center gap-2.5">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.badge && item.badge > 0 ? (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#0ECFC0', color: '#0D1F3C' }}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: '#0ECFC0', color: '#0D1F3C' }}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{profile?.full_name}</div>
              <div className="text-[10px] text-white/30">Admin</div>
            </div>
          </div>
          <Link href="/" className="block text-center text-xs text-white/30 hover:text-white/60 transition py-1.5 rounded-lg border border-white/10 hover:border-white/20">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-black text-gray-900 text-base">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'listings' && 'Manage Listings'}
              {activeTab === 'agents' && 'Manage Agents'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Domorang · Abuja Property Platform</p>
          </div>
          <div className="flex items-center gap-3">
            {actionMsg && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: actionMsg.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: actionMsg.startsWith('✓') ? '#166534' : '#991b1b' }}>
                {actionMsg}
              </span>
            )}
            {(stats.pending > 0 || pendingAgents.length > 0) && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full animate-pulse" style={{ background: '#fef3c7', color: '#92400e' }}>
                {stats.pending + pendingAgents.length} need review
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Listings', val: stats.total, sub: `${stats.verified} verified`, color: '#0ECFC0', icon: '🏠' },
                  { label: 'Pending Review', val: stats.pending, sub: 'need your approval', color: '#f59e0b', icon: '⏳' },
                  { label: 'Total Agents', val: stats.agents, sub: `${stats.verifiedAgents} verified`, color: '#6366f1', icon: '🤝' },
                  { label: 'Trust Score', val: `${verifiedRatio}%`, sub: 'verified listings ratio', color: '#10b981', icon: '🛡️' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.color + '20', color: s.color }}>
                        LIVE
                      </span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 mb-0.5">{s.val}</div>
                    <div className="text-xs font-semibold text-gray-500">{s.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Trust ratio bar */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-black text-gray-900 text-sm">Verified Listings Ratio</div>
                    <div className="text-xs text-gray-400 mt-0.5">Your most important trust metric — target 90%+</div>
                  </div>
                  <div className="text-3xl font-black" style={{ color: verifiedRatio >= 90 ? '#10b981' : verifiedRatio >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {verifiedRatio}%
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${verifiedRatio}%`,
                      background: verifiedRatio >= 90 ? '#10b981' : verifiedRatio >= 60 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>

              {/* Quick actions if pending */}
              {(stats.pending > 0 || pendingAgents.length > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="font-black text-amber-800 mb-1">⚠️ Action Required</div>
                  <p className="text-sm text-amber-700 mb-3">
                    You have {stats.pending} pending listing{stats.pending !== 1 ? 's' : ''} and {pendingAgents.length} pending agent{pendingAgents.length !== 1 ? 's' : ''} waiting for review.
                  </p>
                  <div className="flex gap-2">
                    {stats.pending > 0 && (
                      <button onClick={() => setActiveTab('listings')} className="px-4 py-2 bg-amber-600 text-white rounded-full text-xs font-bold hover:bg-amber-700 transition">
                        Review Listings →
                      </button>
                    )}
                    {pendingAgents.length > 0 && (
                      <button onClick={() => setActiveTab('agents')} className="px-4 py-2 bg-amber-600 text-white rounded-full text-xs font-bold hover:bg-amber-700 transition">
                        Review Agents →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Recent verified listings */}
              {recentListings.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="font-black text-gray-900 text-sm">Recently Verified</div>
                    <button onClick={() => setActiveTab('listings')} className="text-xs font-semibold" style={{ color: '#0ECFC0' }}>View all →</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {recentListings.map(l => (
                      <div key={l.id} className="px-5 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {l.images?.[0] ? <img src={l.images[0]} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-lg">🏠</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{l.title}</div>
                          <div className="text-xs text-gray-400">📍 {l.area} · ₦{l.price?.toLocaleString()}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex-shrink-0">✓ Live</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── LISTINGS TAB ── */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              {pendingListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="text-4xl mb-3">🎉</div>
                  <div className="font-black text-gray-900 mb-1">All caught up!</div>
                  <div className="text-sm text-gray-400">No listings pending review right now.</div>
                </div>
              ) : (
                pendingListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-40 h-36 sm:h-auto bg-gray-100 flex-shrink-0 relative">
                        {listing.images?.[0]
                          ? <img src={listing.images[0]} className="w-full h-full object-cover" alt={listing.title} />
                          : <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                        }
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">Pending</span>
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-black text-gray-900">{listing.title}</h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: listing.listing_type === 'rent' ? '#e0f7f5' : '#dbeafe', color: listing.listing_type === 'rent' ? '#0D1F3C' : '#1e40af' }}>
                            {listing.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">📍 {listing.area}, Abuja</div>
                        <div className="text-base font-black text-gray-900 mb-3">₦{listing.price?.toLocaleString()}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveListing(listing.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black text-white transition hover:opacity-90"
                            style={{ background: '#10b981' }}
                          >
                            ✓ Approve & Publish
                          </button>
                          <button
                            onClick={() => rejectListing(listing.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black text-white transition hover:opacity-90"
                            style={{ background: '#ef4444' }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── AGENTS TAB ── */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              {pendingAgents.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="text-4xl mb-3">✅</div>
                  <div className="font-black text-gray-900 mb-1">All agents reviewed!</div>
                  <div className="text-sm text-gray-400">No agents pending verification right now.</div>
                </div>
              ) : (
                pendingAgents.map(agent => (
                  <div key={agent.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0" style={{ background: '#0D1F3C', color: '#0ECFC0' }}>
                      {agent.profiles?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-gray-900">{agent.profiles?.full_name}</div>
                      <div className="text-sm text-gray-500">{agent.agency_name}</div>
                      <div className="text-xs text-gray-400">📍 {agent.area_of_operation} · {agent.profiles?.phone}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => verifyAgent(agent.id)}
                        className="px-4 py-2 rounded-full text-xs font-black text-white transition hover:opacity-90"
                        style={{ background: '#10b981' }}
                      >
                        ✓ Verify
                      </button>
                      <button
                        onClick={() => rejectAgent(agent.id)}
                        className="px-4 py-2 rounded-full text-xs font-black text-white transition hover:opacity-90"
                        style={{ background: '#ef4444' }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}