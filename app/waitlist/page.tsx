"use client"

import { useState } from 'react'
import Link from 'next/link'
import { api } from '../../lib/api'

export default function WaitlistPage() {
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('renter')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)
    try {
      await api.waitlist.join({
        email,
        full_name: fullName || undefined,
        role,
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      {/* HEADER */}
      <header className="bg-white border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-teal-600 tracking-tight">
            Domorang
          </Link>
          <Link href="/listings" className="text-sm font-bold text-teal-600 hover:underline">
            Browse Homes →
          </Link>
        </div>
      </header>

      {/* TAG STRIP - Moving Marquee */}
      <div className="overflow-hidden bg-teal-500 py-2.5">
        <div className="flex whitespace-nowrap animate-marquee gap-3 text-xs font-semibold tracking-wider text-white/90 uppercase">
          <span>Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆</span>
          <span>Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆</span>
        </div>
      </div>

      {/* HERO */}
      <section className="px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-teal-100 rounded-full px-5 py-2 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">Join 100+ others</span> on the priority list
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Be First When<br />
          <span className="text-teal-500">Domorang</span><br />
          Launches.
        </h1>

        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10">
          Early access. Verified listings. No fake agents. Just real homes in Abuja done right.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transition-colors"
          >
            Join the Waitlist →
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Takes less than a minute
          </p>
        </div>
      </section>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Thank you for joining. We'll notify you as soon as Domorang launches in your area.
                </p>
                <button
                  onClick={() => setOpenModal(false)}
                  className="bg-teal-500 text-white font-bold px-6 py-2.5 rounded-full text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Join the Waitlist</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Get early access & priority updates for real estate in Abuja.
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aminu Okeke"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">I am a</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500"
                    >
                      <option value="renter">Renter / Home Buyer</option>
                      <option value="agent">Real Estate Agent / Developer</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-full text-base shadow-md transition disabled:opacity-60"
                >
                  {loading ? 'Joining...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}