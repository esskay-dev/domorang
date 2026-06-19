'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function SignInForm() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (signInError) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    if (data.session) {
      const redirectTo = searchParams.get('redirectTo') || '/'
      window.location.href = redirectTo
    }
  }

  return (
    <div className="min-h-screen bg-[#d9edf0] flex flex-col">
      <nav className="bg-white shadow-sm px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-teal-500">Domorang</Link>
        <p className="text-sm text-gray-500">No account? <Link href="/signup" className="text-teal-500 font-bold">Sign Up free</Link></p>
      </nav>

      <div className="flex flex-1">
        <div className="hidden lg:flex flex-1 bg-teal-500 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-white/5" />
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Welcome back<br /><span className="opacity-75">to Domorang.</span>
          </h2>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-sm">
            Sign in to access your saved listings, contact agents, and manage your property search.
          </p>
          <div className="space-y-4">
            {[
              { icon: '❤️', title: 'Saved Listings', sub: 'Pick up where you left off.' },
              { icon: '📩', title: 'Message Agents', sub: 'Keep all conversations in one place.' },
              { icon: '🔔', title: 'Listing Alerts', sub: 'Get notified when new homes match your search.' },
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

        <div className="flex-1 lg:max-w-lg bg-white flex flex-col justify-center px-6 py-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Sign in to your account</h1>
            <p className="text-gray-500 text-sm mb-6">Good to have you back.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <Link href="#" className="text-xs text-teal-500 font-semibold">Forgot password?</Link>
              </div>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="Your password"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <button
              onClick={handleSubmit} disabled={loading}
              className="w-full py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition disabled:opacity-60 mb-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account? <Link href="/signup" className="text-teal-500 font-bold">Sign Up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#d9edf0] flex items-center justify-center">
        <div className="text-teal-500 font-bold">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}