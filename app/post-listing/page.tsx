'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

const AREAS = ['Wuse 2','Maitama','Garki','Gwarinpa','Lokogoma','Asokoro','Kubwa','Jabi','Lugbe','Kado','Life Camp','Apo','Gaduwa']
const AMENITIES = ['24/7 Security','Constant Power','Fitted Kitchen','Borehole Water','Boys Quarters','Swimming Pool','Gym','Prepaid Meter','Pop Ceiling','Tiled Floors','Air Conditioning','Perimeter Fence','Gate House','CCTV','Wi-Fi Ready']

export default function PostListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const [form, setForm] = useState({
    listing_type: 'rent',
    title: '',
    property_type: '',
    condition: '',
    price: '',
    inspection_fee: '',
    area: '',
    street_address: '',
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    size_sqft: '',
    parking: '',
    description: '',
    video_url: '',
  })

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  const handleImages = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).slice(0, 10)
    setImages(prev => [...prev, ...newFiles])
    newFiles.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setImagePreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      // Get agent record
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

      const { data: agent } = await supabase
        .from('agents').select('*').eq('profile_id', user.id).single()

      if (!agent) {
        setError('You need an agent account to post listings. Please sign up as an agent.')
        setLoading(false); return
      }

      // Upload images to Supabase storage
      const imageUrls: string[] = []
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, image)
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('listing-images').getPublicUrl(fileName)
          imageUrls.push(urlData.publicUrl)
        }
      }

      // Insert listing
      const { error: insertError } = await supabase.from('listings').insert({
        agent_id: agent.id,
        title: form.title,
        description: form.description,
        listing_type: form.listing_type,
        property_type: form.property_type,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        toilets: parseInt(form.toilets),
        size_sqft: parseInt(form.size_sqft),
        parking: parseInt(form.parking),
        area: form.area,
        street_address: form.street_address,
        city: 'Abuja',
        amenities: selectedAmenities,
        images: imageUrls,
        video_url: form.video_url,
        inspection_fee: parseFloat(form.inspection_fee) || null,
        status: 'pending', // goes to admin for verification
      })

      if (insertError) { setError(insertError.message); setLoading(false); return }
      setSuccess(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const steps = ['Basic Info', 'Details', 'Photos', 'Review']

  if (success) return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Listing Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your property has been submitted for verification. We'll review it within 24 hours and notify you once it's live.</p>
          <div className="flex gap-3">
            <Link href="/listings" className="flex-1 py-3 bg-teal-500 text-white rounded-full font-bold text-sm text-center hover:bg-teal-600 transition">
              View Listings
            </Link>
            <button onClick={() => { setSuccess(false); setStep(1) }} className="flex-1 py-3 border-2 border-teal-500 text-teal-500 rounded-full font-bold text-sm hover:bg-teal-500 hover:text-white transition">
              Post Another
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      {/* PAGE HEADER */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-black text-gray-900 mb-1">Post a Listing</h1>
          <p className="text-gray-500 text-sm">Fill in your property details — we'll verify and publish within 24 hours.</p>
        </div>
      </div>

      {/* PROGRESS STEPS */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i + 1 < step ? 'bg-teal-500 text-white' :
                  i + 1 === step ? 'bg-teal-500 text-white' :
                  'border-2 border-gray-200 text-gray-400'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${i + 1 === step ? 'text-teal-500' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}

        {/* STEP 1 — BASIC INFO */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Listing Type */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Listing Type</h3>
              <p className="text-gray-500 text-xs mb-4">Is this property for rent or for sale?</p>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: 'rent', label: '🏠 For Rent' }, { val: 'sale', label: '🔑 For Sale' }].map(t => (
                  <button key={t.val} onClick={() => setForm({ ...form, listing_type: t.val })}
                    className={`py-3 rounded-xl border-2 font-bold text-sm transition ${form.listing_type === t.val ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-200 text-gray-600'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Property Information</h3>
                <p className="text-gray-500 text-xs mb-4">Tell us about the property.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Listing Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Modern 3 Bedroom Terrace Duplex in Lokogoma" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                <p className="text-xs text-gray-400 mt-1">Be specific — good titles get more views.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Property Type *</label>
                  <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                    <option value="">Select</option>
                    {['Flat / Apartment','Duplex (Terrace)','Duplex (Semi-Detached)','Duplex (Detached)','Bungalow','Self Contain','Mini Flat','Land','Commercial'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Condition</label>
                  <select name="condition" value={form.condition} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                    <option value="">Select</option>
                    {['Newly Built','Furnished','Semi-Furnished','Unfurnished','Renovated'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₦) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 2500000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Inspection Fee (₦)</label>
                  <input name="inspection_fee" type="number" value={form.inspection_fee} onChange={handleChange} placeholder="e.g. 10000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Location</h3>
                <p className="text-gray-500 text-xs">Where exactly is the property?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Area *</label>
                  <select name="area" value={form.area} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                    <option value="">Select area</option>
                    {AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input value="Abuja" readOnly className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street / Landmark</label>
                <input name="street_address" value={form.street_address} onChange={handleChange} placeholder="e.g. Behind NNPC, Lokogoma Phase 2" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                <p className="text-xs text-gray-400 mt-1">Exact address won't be shown publicly.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — DETAILS */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Property Details</h3>
                <p className="text-gray-500 text-xs">Specific details help renters and buyers filter better.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'bedrooms', label: 'Bedrooms' },
                  { name: 'bathrooms', label: 'Bathrooms' },
                  { name: 'toilets', label: 'Toilets' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{f.label}</label>
                    <select name={f.name} value={(form as any)[f.name]} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                      <option value="">—</option>
                      {['1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Size (sqft)</label>
                  <input name="size_sqft" type="number" value={form.size_sqft} onChange={handleChange} placeholder="e.g. 1650" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Parking</label>
                  <select name="parking" value={form.parking} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                    <option value="">—</option>
                    {['None','1','2','3+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the property — mention key features, estate facilities, access roads..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 h-32 resize-none" />
                <p className="text-xs text-gray-400 mt-1">More detail = more inquiries.</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Amenities & Features</h3>
              <p className="text-gray-500 text-xs mb-4">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition ${selectedAmenities.includes(a) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-700'}`}>
                    <span className={`font-bold ${selectedAmenities.includes(a) ? 'text-teal-500' : 'text-gray-300'}`}>✓</span>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — PHOTOS */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Property Photos</h3>
              <p className="text-gray-500 text-xs mb-4">Upload at least 3 photos. Listings with more photos get 3x more inquiries.</p>

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={src} alt={`photo ${i+1}`} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition">
                <input type="file" multiple accept="image/*" onChange={e => handleImages(e.target.files)} className="hidden" />
                <div className="text-3xl mb-2">📸</div>
                <div className="text-sm font-bold text-gray-700 mb-1">Tap to upload photos</div>
                <div className="text-xs text-gray-400">JPG, PNG — max 20MB each</div>
                <span className="inline-block mt-3 px-4 py-1.5 bg-teal-500 text-white rounded-full text-xs font-bold">Choose Photos</span>
              </label>

              {imagePreviews.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">{imagePreviews.length} photo{imagePreviews.length !== 1 ? 's' : ''} selected</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Video Tour (Optional)</h3>
              <p className="text-gray-500 text-xs mb-3">Add a YouTube or Google Drive link.</p>
              <input name="video_url" type="url" value={form.video_url} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
          </div>
        )}

        {/* STEP 4 — REVIEW */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">Review Your Listing</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Type', val: form.listing_type === 'rent' ? 'For Rent' : 'For Sale' },
                  { label: 'Property Type', val: form.property_type || '—' },
                  { label: 'Price', val: form.price ? `₦${parseInt(form.price).toLocaleString()}` : '—' },
                  { label: 'Area', val: form.area || '—' },
                  { label: 'Bedrooms', val: form.bedrooms || '—' },
                  { label: 'Bathrooms', val: form.bathrooms || '—' },
                  { label: 'Size', val: form.size_sqft ? `${form.size_sqft} sqft` : '—' },
                  { label: 'Inspection Fee', val: form.inspection_fee ? `₦${parseInt(form.inspection_fee).toLocaleString()}` : '—' },
                ].map((r, i) => (
                  <div key={i}>
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">{r.label}</div>
                    <div className="font-bold text-gray-900 mt-0.5">{r.val}</div>
                  </div>
                ))}
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Photos</div>
                  <div className="flex gap-2 flex-wrap">
                    {imagePreviews.slice(0, 5).map((src, i) => (
                      <img key={i} src={src} className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Verification Notice:</strong> After submitting, our team will verify your listing within <strong>24 hours</strong>. Fraudulent listings will result in account suspension.
              </p>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between items-center mt-6">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 border-2 border-gray-200 rounded-full font-bold text-sm text-gray-700 hover:border-gray-300 transition">
              ← Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="px-8 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit for Verification ✓'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}