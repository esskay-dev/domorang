'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { api } from '../../../lib/api'

export default function AgentProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    agencyName: '',
    area: '',
    bio: '',
    instagramUrl: '',
    websiteUrl: '',
  })

  useEffect(() => {
    async function load() {
      try {
        const userRes = await api.auth.getMe()
        if (!userRes || !userRes.id) { router.push('/signin'); return }
        if (userRes.profile?.role !== 'agent') { router.push('/'); return }

        setUserId(userRes.id)
        setForm({
          fullName: userRes.profile?.full_name || '',
          phone: userRes.profile?.phone || '',
          agencyName: userRes.agent?.agency_name || '',
          area: userRes.agent?.area_of_operation || '',
          bio: userRes.agent?.bio || '',
          instagramUrl: userRes.agent?.instagram_url || '',
          websiteUrl: userRes.agent?.website_url || '',
        })
      } catch (err) {
        console.error('Failed to load agent profile:', err)
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!userId) return
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      await api.users.updateMe({
        full_name: form.fullName,
        phone: form.phone,
      })

      await api.agents.updateProfile({
        agency_name: form.agencyName,
        area_of_operation: form.area,
        bio: form.bio,
        instagram_url: form.instagramUrl,
        website_url: form.websiteUrl,
      })

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d9edf0]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">Loading your profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#d9edf0]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Edit Your Profile</h1>
        <p className="text-gray-500 text-sm mb-6">This information appears on your listings so renters can learn more about you before reaching out.</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 mb-4">Profile updated successfully.</div>}

          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Basic Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-bold text-gray-700 mb-1">Agency / Company Name</label>
            <input name="agencyName" value={form.agencyName} onChange={handleChange} placeholder="e.g. Okeke Properties Ltd" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 mb-1">Area of Operation</label>
            <select name="area" value={form.area} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
              <option value="">Select area</option>
              {['Wuse 2','Maitama','Garki','Gwarinpa','Lokogoma','Asokoro','Kubwa','Jabi','Lugbe','Multiple Areas'].map(a => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-t border-gray-100 pt-4">About You</p>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell renters a bit about your experience, specialties, and how you work..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs font-bold text-gray-700 mb-1">Instagram</label>
            <input name="instagramUrl" value={form.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/yourhandle" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 mb-1">Website / Other Link</label>
            <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="https://yourwebsite.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="text-teal-500 font-bold">← Back to Domorang</Link>
        </p>
      </div>
    </div>
  )
}