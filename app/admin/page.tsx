'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [pendingListings, setPendingListings] = useState<any[]>([])
  const [pendingAgents, setPendingAgents] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, verified: 0, agents: 0, verifiedAgents: 0 })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/signin?redirectTo=/admin'; return }

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!prof) { window.location.href = '/'; return }
    setProfile(prof)

    const { data: listings } = await supabase.from('listings').select('*').eq('status', 'pending')
    const { data: agents } = await supabase.from('agents').select('*, profiles(full_name)').eq('verification_status', 'pending')
    const { count: total } = await supabase.from('listings').select('*', { count: 'exact', head: true })
    const { count: verified } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'verified')
    const { count: agentTotal } = await supabase.from('agents').select('*', { count: 'exact', head: true })
    const { count: agentVerified } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified')

    setPendingListings(listings || [])
    setPendingAgents(agents || [])
    setStats({ total: total || 0, verified: verified || 0, agents: agentTotal || 0, verifiedAgents: agentVerified || 0 })
    setLoading(false)
  }

  async function approveListing(id: string) {
    await supabase.from('listings').update({ status: 'verified' }).eq('id', id)
    setPendingListings(prev => prev.filter(l => l.id !== id))
  }

  async function rejectListing(id: string) {
    await supabase.from('listings').update({ status: 'rejected' }).eq('id', id)
    setPendingListings(prev => prev.filter(l => l.id !== id))
  }

  async function verifyAgent(id: string) {
    await supabase.from('agents').update({ verification_status: 'verified' }).eq('id', id)
    setPendingAgents(prev => prev.filter(a => a.id !== id))
  }

  async function rejectAgent(id: string) {
    await supabase.from('agents').update({ verification_status: 'rejected' }).eq('id', id)
    setPendingAgents(prev => prev.filter(a => a.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen bg-[#d9edf0] flex items-center justify-center">
      <div className="text-teal-500 font-bold text-lg">Loading admin...</div>
    </div>
  )

  const verifiedRatio = stats.total ? Math.round((stats.verified / stats.total) * 100) : 0

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <nav className="sticky top-0 z-50 bg-gray-900 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-black text-teal-400">Domorang</Link>
          <span className="bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{profile?.full_name}</span>
          <Link href="/" className="text-gray-400 text-sm hover:text-white transition">← Back to site</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Listings', val: stats.total, icon: '🏠', color: 'bg-white' },
            { label: 'Verified Listings', val: stats.verified, icon: '✓', color: 'bg-green-50' },
            { label: 'Total Agents', val: stats.agents, icon: '🤝', color: 'bg-white' },
            { label: 'Verified Agents', val: stats.verifiedAgents, icon: '🔒', color: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-5 shadow-sm`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-gray-900">{s.val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TRUST SCORE */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-gray-900">Verified Listings Ratio</h3>
            <span className="text-2xl font-black text-teal-500">{verifiedRatio}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-teal-500 h-3 rounded-full" style={{ width: `${verifiedRatio}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Target: 90%+ verified listings. Your most important trust metric.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PENDING LISTINGS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900">Pending Listings</h2>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingListings.length} pending
              </span>
            </div>
            {pendingListings.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {pendingListings.map((listing) => (
                  <div key={listing.id} className="p-4 flex items-start gap-4">
                    {listing.images?.[0] && (
                      <img src={listing.images[0]} alt={listing.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm truncate">{listing.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">📍 {listing.area} · ₦{listing.price?.toLocaleString()} · {listing.listing_type}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => approveListing(listing.id)} className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-80 transition">✓ Approve</button>
                      <button onClick={() => rejectListing(listing.id)} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-80 transition">✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">🎉 No pending listings!</div>
            )}
          </div>

          {/* PENDING AGENTS */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-sm">Pending Agents</h2>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingAgents.length}</span>
            </div>
            {pendingAgents.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {pendingAgents.map((agent) => (
                  <div key={agent.id} className="p-4">
                    <div className="font-bold text-gray-900 text-sm">{agent.profiles?.full_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{agent.agency_name}</div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => verifyAgent(agent.id)} className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-80 transition">✓ Verify</button>
                      <button onClick={() => rejectAgent(agent.id)} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-80 transition">✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 text-xs">No pending agents</div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}