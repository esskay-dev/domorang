'use client'
import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Home, CheckCircle2, Heart, MapPin, BedDouble, Bath, Ruler, Flag } from 'lucide-react'

export default function ListingCard({ listing, comingSoon = false }) {
  const {
    id, title, price, listing_type, property_type,
    bedrooms, bathrooms, size_sqft, area, images, status
  } = listing

  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reported, setReported] = useState(false)

  const formattedPrice = price
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency', currency: 'NGN', maximumFractionDigits: 0
      }).format(price)
    : null

  async function handleSave(e) {
    e.preventDefault()
    e.stopPropagation()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/signin'; return }

    if (saved) {
      await supabase.from('saved_listings').delete().eq('user_id', user.id).eq('listing_id', id)
      setSaved(false)
    } else {
      await supabase.from('saved_listings').upsert({ user_id: user.id, listing_id: id })
      setSaved(true)
    }
    setSaving(false)
  }

  async function handleReport(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!reportReason) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/signin'; return }
    await supabase.from('reports').insert({
      listing_id: id,
      reporter_id: user.id,
      reason: reportReason,
    })
    setReported(true)
    setReporting(false)
  }

  const CardWrapper = comingSoon ? 'div' : Link
  const wrapperProps = comingSoon ? {} : { href: `/listings/${id}` }

  return (
    <div className="relative group">
      <CardWrapper {...wrapperProps} className={`block ${comingSoon ? 'cursor-default' : ''}`}>
        <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-teal-50 transition-all duration-300 ${comingSoon ? 'opacity-60' : 'hover:shadow-lg hover:-translate-y-1'}`}>

          <div className="relative h-48 md:h-52 overflow-hidden bg-teal-50">
            {images?.[0] ? (
              <img
                src={images[0]}
                alt={comingSoon ? `More homes coming soon to ${area}` : title}
                className={`w-full h-full object-cover transition-transform duration-300 ${comingSoon ? '' : 'group-hover:scale-105'}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-50">
                <Home size={40} className="text-teal-300" />
              </div>
            )}

            {comingSoon ? (
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gray-500">
                Coming Soon
              </span>
            ) : (
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${listing_type === 'rent' ? 'bg-teal-500' : 'bg-blue-600'}`}>
                {listing_type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
            )}

            {!comingSoon && status === 'verified' && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-green-500 flex items-center gap-1">
                <CheckCircle2 size={13} /> Verified
              </span>
            )}

            {!comingSoon && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${saved ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-400'}`}
              >
                <Heart size={16} className={saved ? 'fill-current' : ''} />
              </button>
            )}
          </div>

          <div className="p-4">
            {comingSoon ? (
              <div className="py-2">
                <div className="text-sm font-bold text-gray-700 mb-1">More homes coming soon</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={12} /> {area}, Abuja
                </div>
              </div>
            ) : (
              <>
                <div className="text-lg font-black text-gray-900">
                  {formattedPrice}
                  {listing_type === 'rent' && <span className="text-sm font-normal text-gray-500"> / year</span>}
                </div>
                <div className="text-sm font-semibold text-gray-800 mt-1 mb-1 line-clamp-1">{title}</div>
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin size={12} /> {area}, Abuja
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BedDouble size={14} /> {bedrooms} Bed</span>
                    <span className="flex items-center gap-1"><Bath size={14} /> {bathrooms} Bath</span>
                    {size_sqft && <span className="flex items-center gap-1"><Ruler size={14} /> {size_sqft} sqft</span>}
                  </div>
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setReporting(true) }}
                    className="text-gray-300 hover:text-red-400 transition"
                    title="Report listing"
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardWrapper>

      {!comingSoon && reporting && (
        <div className="absolute inset-0 z-10 bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="font-black text-gray-900 mb-1 text-sm">Report this listing</div>
            <p className="text-xs text-gray-500 mb-3">Help us keep Domorang safe and trustworthy.</p>
            <div className="space-y-2">
              {[
                { val: 'fake_property', label: 'Fake or non-existent property' },
                { val: 'wrong_price', label: 'Wrong or misleading price' },
                { val: 'already_rented', label: 'Already rented or sold' },
                { val: 'agent_unreachable', label: 'Agent is unreachable' },
                { val: 'scam', label: 'Suspected scam' },
              ].map(r => (
                <label key={r.val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="report"
                    value={r.val}
                    checked={reportReason === r.val}
                    onChange={() => setReportReason(r.val)}
                    className="accent-teal-500"
                  />
                  <span className="text-xs text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={e => { e.preventDefault(); setReporting(false); setReportReason('') }}
              className="flex-1 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleReport}
              disabled={!reportReason}
              className="flex-1 py-2 bg-red-500 text-white rounded-full text-xs font-bold disabled:opacity-40"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}

      {!comingSoon && reported && (
        <div className="absolute inset-0 z-10 bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <CheckCircle2 size={32} className="text-green-500 mb-2" />
          <div className="font-black text-gray-900 text-sm mb-1">Report Submitted</div>
          <p className="text-xs text-gray-500 mb-4">Thank you. Our team will review this listing.</p>
          <button
            onClick={e => { e.preventDefault(); setReported(false) }}
            className="px-5 py-2 bg-teal-500 text-white rounded-full text-xs font-bold"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}