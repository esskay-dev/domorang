'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function SignUpPage() {
  const [role, setRole] = useState('renter')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', agencyName: '', area: ''
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.firstName || !form.email || !form.password) {
      setError('Please fill in all required fields.'); return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return
    }
    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
            role: role,
          }
        }
      })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }

      // Create profile record
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: `${form.firstName} ${form.lastName}`,
          phone: form.phone,
          role: role,
        })

        // If agent, create agent record
        if (role === 'agent') {
          await supabase.from('agents').insert({
            profile_id: data.user.id,
            agency_name: form.agencyName,
            area_of_operation: form.area,
            verification_status: 'pending',
          })
        }
      }
      setSuccess(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-screen bg-[#d9edf0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Account Created!</h2>
        <p className="text-gray-500 text-sm mb-6">Check your email to confirm your account, then sign in.</p>
        <Link href="/signin" className="block w-full py-3 bg-teal-500 text-white rounded-full font-bold hover:bg-teal-600 transition">
          Go to Sign In
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#d9edf0] flex flex-col">

      {/* NAV */}
      <nav className="bg-white shadow-sm px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-teal-500">Domorang</Link>
        <p className="text-sm text-gray-500">Already have an account? <Link href="/signin" className="text-teal-500 font-bold">Sign In</Link></p>
      </nav>

      <div className="flex flex-1">

        {/* LEFT PANEL — hidden on mobile */}
        <div className="hidden lg:flex flex-1 bg-teal-500 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-white/5" />
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Find your next home<br /><span className="opacity-75">in Abuja — verified.</span>
          </h2>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-sm">
            Join thousands of renters, buyers, and agents already using Domorang to make property transactions simple and transparent.
          </p>
          <div className="space-y-4">
            {[
              { icon: '✓', title: 'Verified Listings Only', sub: 'Every property confirmed before going live.' },
              { icon: '🔒', title: 'Safe & Transparent', sub: 'No hidden fees. Contact agents directly.' },
              { icon: '⚡', title: 'Free to Browse', sub: 'Search and contact listings at no cost.' },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white flex-shrink-0">{p.icon}</div>
                <div>
                  <div className="text-white font-bold text-sm">{p.title}</div>
                  <div className="text-white/70 text-xs">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — FORM */}
        <div className="flex-1 lg:max-w-lg bg-white flex flex-col justify-center px-6 py-8 overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-6">Get started — it's free.</p>

            {/* ROLE SELECTOR */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { val: 'renter', icon: '🏠', title: "I'm a Renter / Buyer", sub: 'Looking for a home' },
                { val: 'agent', icon: '🤝', title: "I'm an Agent / Landlord", sub: 'Listing a property' },
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setRole(r.val)}
                  className={`border-2 rounded-xl p-4 text-center transition cursor-pointer ${role === r.val ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-sm font-bold text-gray-900">{r.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.sub}</div>
                </button>
              ))}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}

            {/* FORM FIELDS */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aminu" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Okeke" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>

            {/* AGENT EXTRA FIELDS */}
            {role === 'agent' && (
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Agency Details</p>
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Agency / Company Name</label>
                  <input name="agencyName" value={form.agencyName} onChange={handleChange} placeholder="e.g. Okeke Properties Ltd" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Area of Operation</label>
                  <select name="area" value={form.area} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                    <option value="">Select area</option>
                    {['Wuse 2','Maitama','Garki','Gwarinpa','Lokogoma','Asokoro','Kubwa','Jabi','Lugbe','Multiple Areas'].map(a => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition disabled:opacity-60 mb-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account? <Link href="/signin" className="text-teal-500 font-bold">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}