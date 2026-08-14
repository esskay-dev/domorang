'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { api } from '../../lib/api'

const defaultAgents = [
  { id: '1', agency_name: 'Okeke Properties', area_of_operation: 'Maitama', verification_status: 'verified', rating: 4.8, total_reviews: 34, profiles: { full_name: 'Aminu Okeke', phone: '+2348012345678' } },
  { id: '2', agency_name: 'Abuja Homes Ltd', area_of_operation: 'Wuse 2', verification_status: 'verified', rating: 4.5, total_reviews: 21, profiles: { full_name: 'Chioma Adeyemi', phone: '+2348023456789' } },
  { id: '3', agency_name: 'Capital Properties', area_of_operation: 'Garki', verification_status: 'verified', rating: 4.9, total_reviews: 58, profiles: { full_name: 'Emeka Okafor', phone: '+2348034567890' } },
  { id: '4', agency_name: 'Gwarinpa Realty', area_of_operation: 'Gwarinpa', verification_status: 'verified', rating: 4.3, total_reviews: 15, profiles: { full_name: 'Fatima Bello', phone: '+2348045678901' } },
  { id: '5', agency_name: 'Lokogoma Estates', area_of_operation: 'Lokogoma', verification_status: 'verified', rating: 4.7, total_reviews: 29, profiles: { full_name: 'Ibrahim Musa', phone: '+2348056789012' } },
  { id: '6', agency_name: 'Prime Abuja Homes', area_of_operation: 'Asokoro', verification_status: 'verified', rating: 4.6, total_reviews: 42, profiles: { full_name: 'Ngozi Eze', phone: '+2348067890123' } },
]

function AgentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded-full w-16 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 mb-4">
        <div className="h-8 bg-gray-100 rounded" />
        <div className="h-8 bg-gray-100 rounded" />
        <div className="h-8 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-gray-100 rounded-full" />
        <div className="flex-1 h-9 bg-gray-100 rounded-full" />
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedArea, setSelectedArea] = useState('All')

  const areas = ['All', 'Wuse 2', 'Maitama', 'Garki', 'Gwarinpa', 'Lokogoma', 'Asokoro', 'Kubwa', 'Jabi', 'Lugbe', 'Life Camp']

  useEffect(() => {
    loadAgents()
  }, [search, selectedArea])

  async function loadAgents() {
    setLoading(true)
    try {
      const data = await api.agents.getAll(search, selectedArea)
      setAgents(data && data.length > 0 ? data : defaultAgents)
    } catch (err) {
      console.error('Failed to fetch agents:', err)
      setAgents(defaultAgents)
    }
    setLoading(false)
  }

  const filtered = agents.filter(agent => {
    const matchesSearch = search === '' ||
      agent.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      agent.agency_name?.toLowerCase().includes(search.toLowerCase())
    const matchesArea = selectedArea === 'All' || agent.area_of_operation === selectedArea
    return matchesSearch && matchesArea
  })

  const getInitials = (name: string) => {
    if (!name) return 'AG'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const waLink = (phone: string) => {
    const digits = phone ? phone.replace(/\D/g, '') : ''
    return 'https://wa.me/' + digits + '?text=Hi, I found you on Domorang'
  }

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      <div className="bg-teal-500 px-4 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Find a Verified Agent</h1>
        <p className="text-white/80 text-sm mb-8 max-w-md mx-auto">
          Every agent on Domorang is identity-verified. Browse, compare, and connect with confidence.
        </p>
        <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by agent name or agency..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent py-2"
          />
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-1.5 rounded-full border-2 font-semibold text-sm whitespace-nowrap transition ${selectedArea === area ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-200 text-gray-600'}`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {loading ? (
            <span className="inline-block h-4 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            <><strong className="text-gray-900">{filtered.length} verified agents</strong> in Abuja</>
          )}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <AgentCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-bold text-gray-700">No agents found</div>
            <div className="text-sm text-gray-500 mt-1">Try a different search or area filter</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(agent => (
              <div key={agent.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <Link href={"/agents/" + agent.id} className="block mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {getInitials(agent.profiles?.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-gray-900 truncate hover:text-teal-600 transition">{agent.profiles?.full_name}</div>
                      <div className="text-sm text-gray-500 truncate">{agent.agency_name}</div>
                      {agent.verification_status === 'verified' && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="grid grid-cols-3 gap-2 text-center bg-[#d9edf0] rounded-xl p-3 mb-4">
                  <div>
                    <div className="font-black text-gray-900 text-sm">{agent.rating || 0}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">{agent.total_reviews || 0}</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-xs truncate">{agent.area_of_operation}</div>
                    <div className="text-xs text-gray-500">Area</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={waLink(agent.profiles?.phone)} target="_blank" rel="noreferrer" className="flex-1 text-center py-2.5 bg-green-500 text-white rounded-full font-bold text-xs">
                    WhatsApp
                  </a>
                  <a href={"tel:" + agent.profiles?.phone} className="flex-1 text-center py-2.5 bg-teal-500 text-white rounded-full font-bold text-xs">
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-teal-500 px-4 py-12 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Are you an agent?</h2>
        <p className="text-white/80 text-sm mb-6 max-w-sm mx-auto">
          Join Domorang as a verified agent and get access to thousands of active property seekers in Abuja.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3 bg-white text-teal-600 rounded-full font-bold text-sm">
          Join as an Agent
        </Link>
      </div>

      <footer className="bg-gray-900 text-white px-4 py-8 text-center">
        <div className="text-xl font-black text-teal-400 mb-2">Domorang</div>
        <p className="text-xs text-gray-500">2026 Domorang. All rights reserved.</p>
      </footer>
    </main>
  )
}