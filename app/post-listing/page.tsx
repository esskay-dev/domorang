'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'
import Navbar from '../components/Navbar'
import { Home, Key, Check, MapPin, AlertTriangle, Camera, X, PartyPopper, ArrowLeft, ArrowRight } from 'lucide-react'

const AREAS = ['Wuse 2','Maitama','Garki','Gwarinpa','Lokogoma','Asokoro','Kubwa','Jabi','Lugbe','Kado','Life Camp','Apo','Gaduwa']
const AMENITIES = ['24/7 Security','Constant Power','Fitted Kitchen','Borehole Water','Boys Quarters','Swimming Pool','Gym','Prepaid Meter','Pop Ceiling','Tiled Floors','Air Conditioning','Perimeter Fence','Gate House','CCTV','Wi-Fi Ready']

// Abuja area coordinates for map centering
const AREA_COORDS: Record<string, [number, number]> = {
  'Wuse 2':    [9.0631, 7.4891],
  'Maitama':   [9.0820, 7.4836],
  'Garki':     [9.0442, 7.4855],
  'Gwarinpa':  [9.1147, 7.3994],
  'Lokogoma':  [8.9733, 7.4142],
  'Asokoro':   [9.0372, 7.5122],
  'Kubwa':     [9.1411, 7.3053],
  'Jabi':      [9.0785, 7.4303],
  'Lugbe':     [8.9936, 7.3614],
  'Kado':      [9.0921, 7.4214],
  'Life Camp': [9.1001, 7.3861],
  'Apo':       [8.9974, 7.5103],
  'Gaduwa':    [8.9625, 7.4531],
}

// Leaflet map pin picker component
function MapPinPicker({ area, lat, lng, onChange }: {
  area: string
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}) {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mapRef.current) return // already initialized

    // Dynamically import leaflet
    import('leaflet').then(L => {
      // Fix default icon path issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const center = AREA_COORDS[area] || [9.0579, 7.4951]
      if (mapRef.current) {
  mapRef.current.remove()
  mapRef.current = null
}
const map = L.map(containerRef.current!).setView(center, 15)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Custom teal pin
      const tealIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;
          background:#31768a;
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.3)
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      })

      // If coords already set, show marker
      if (lat && lng) {
        markerRef.current = L.marker([lat, lng], { icon: tealIcon }).addTo(map)
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng
        onChange(lat, lng)
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng], { icon: tealIcon }).addTo(map)
        }
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, []) // only on mount

  // Re-center when area changes
  useEffect(() => {
    if (!mapRef.current) return
    const center = AREA_COORDS[area]
    if (center) mapRef.current.setView(center, 15)
  }, [area])

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        style={{ height: '280px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}
      />
      {lat && lng ? (
        <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
          <MapPin size={14} /> Pin set: {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      ) : (
        <p className="text-xs text-gray-400">Tap anywhere on the map to drop a pin on the exact location.</p>
      )}
    </div>
  )
}

export default function PostListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [leafletLoaded, setLeafletLoaded] = useState(false)

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
    latitude: null as number | null,
    longitude: null as number | null,
  })

  // Load Leaflet CSS once
  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setLeafletLoaded(true); return }
    const link = document.createElement('link')
    link.id = 'leaflet-css'
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.onload = () => setLeafletLoaded(true)
    document.head.appendChild(link)
  }, [])

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
      let imageUrls: string[] = []
      if (images.length > 0) {
        try {
          const uploadRes = await api.uploads.uploadImages(images)
          imageUrls = uploadRes.urls || []
        } catch (uploadErr: any) {
          setError(`Photo upload failed: ${uploadErr.message || 'Error uploading files'}`)
          setLoading(false)
          return
        }
      }

      await api.listings.create({
        title: form.title,
        description: form.description,
        listing_type: form.listing_type,
        property_type: form.property_type,
        condition: form.condition || undefined,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
        toilets: parseInt(form.toilets) || 0,
        size_sqft: parseInt(form.size_sqft) || undefined,
        parking: parseInt(form.parking) || undefined,
        area: form.area,
        street_address: form.street_address || undefined,
        amenities: selectedAmenities,
        images: imageUrls,
        video_url: form.video_url || undefined,
        inspection_fee: parseFloat(form.inspection_fee) || undefined,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
      })

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const steps = ['Basic Info', 'Location Pin', 'Details', 'Photos', 'Review']

  if (success) return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <PartyPopper size={48} className="text-teal-500 mx-auto mb-4" />
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
                  {i + 1 < step ? <Check size={14} /> : i + 1}
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
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Listing Type</h3>
              <p className="text-gray-500 text-xs mb-4">Is this property for rent or for sale?</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'rent', label: 'For Rent', icon: Home },
                  { val: 'sale', label: 'For Sale', icon: Key },
                ].map(t => (
                  <button key={t.val} onClick={() => setForm({ ...form, listing_type: t.val })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition ${form.listing_type === t.val ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-200 text-gray-600'}`}>
                    <t.icon size={16} /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Property Information</h3>
                <p className="text-gray-500 text-xs mb-4">Tell us about the property.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Listing Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Modern 3 Bedroom Terrace Duplex in Lokogoma" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
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

        {/* STEP 2 — MAP PIN */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Pin Your Property on the Map</h3>
                <p className="text-gray-500 text-xs">
                  This helps renters and buyers find your property on Domorang's map.
                  {form.area && <span className="text-teal-500 font-medium"> Map is centred on {form.area}.</span>}
                </p>
              </div>

              {!form.area && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Go back and select an area first — the map will centre there automatically.
                </div>
              )}

              {leafletLoaded && (
                <MapPinPicker
                  area={form.area || 'Maitama'}
                  lat={form.latitude}
                  lng={form.longitude}
                  onChange={(lat, lng) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))}
                />
              )}

              {!leafletLoaded && (
                <div className="h-64 rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  Loading map...
                </div>
              )}

              <p className="text-xs text-gray-400">
                This step is optional but strongly recommended. You can skip it and add a pin later.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3 — DETAILS */}
        {step === 3 && (
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
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Amenities & Features</h3>
              <p className="text-gray-500 text-xs mb-4">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition ${selectedAmenities.includes(a) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-700'}`}>
                    <Check size={14} className={selectedAmenities.includes(a) ? 'text-teal-500' : 'text-gray-300'} />
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — PHOTOS */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Property Photos</h3>
              <p className="text-gray-500 text-xs mb-4">Upload at least 3 photos. Listings with more photos get 3x more inquiries.</p>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={src} alt={`photo ${i+1}`} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition">
                <input type="file" multiple accept="image/*" onChange={e => handleImages(e.target.files)} className="hidden" />
                <Camera size={32} className="text-teal-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-gray-700 mb-1">Tap to upload photos</div>
                <div className="text-xs text-gray-400">JPG, PNG — max 20MB each</div>
                <span className="inline-block mt-3 px-4 py-1.5 bg-teal-500 text-white rounded-full text-xs font-bold">Choose Photos</span>
              </label>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Video Tour (Optional)</h3>
              <p className="text-gray-500 text-xs mb-3">Add a YouTube or Google Drive link.</p>
              <input name="video_url" type="url" value={form.video_url} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
          </div>
        )}

        {/* STEP 5 — REVIEW */}
        {step === 5 && (
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
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Location Pin</div>
                  <div className="font-bold text-gray-900 mt-0.5 flex items-center gap-1">
                    {form.latitude ? (<><MapPin size={14} className="text-teal-500" /> Set</>) : '—'}
                  </div>
                </div>
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
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span><strong>Verification Notice:</strong> After submitting, our team will verify your listing within <strong>24 hours</strong>. Fraudulent listings will result in account suspension.</span>
              </p>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex justify-between items-center mt-6">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 px-6 py-3 border-2 border-gray-200 rounded-full font-bold text-sm text-gray-700 hover:border-gray-300 transition">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button onClick={() => setStep(step + 1)} className="flex items-center gap-1.5 px-8 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition">
              {step === 2 && !form.latitude ? 'Skip for now' : 'Continue'} <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-1.5 px-8 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition disabled:opacity-60">
              {loading ? 'Submitting...' : (<>Submit for Verification <Check size={16} /></>)}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}