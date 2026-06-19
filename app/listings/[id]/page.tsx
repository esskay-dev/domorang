import Navbar from '../../components/Navbar'
import { createSupabaseServer } from '../../../lib/supabase-server'
import Link from 'next/link'

export default async function ListingDetailPage({ params }: { params: Promise<any> }) {
  const supabase = await createSupabaseServer()
  const resolvedParams = await params

  const { data: listing } = await supabase
    .from('listings')
    .select('*, agents(*)')
    .eq('id', resolvedParams.id)
    .single()

  const display = listing || {
    id: resolvedParams.id,
    title: 'Modern 3 Bedroom Terrace Duplex',
    price: 75000000,
    listing_type: 'rent',
    property_type: 'Duplex',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    size_sqft: 1650,
    parking: 2,
    area: 'Lokogoma',
    city: 'Abuja',
    description: 'This beautifully finished modern terrace duplex is located in the fast-growing Lokogoma district of Abuja. The property sits in a serene, well-secured estate with 24-hour security and uninterrupted power supply.\n\nThe ground floor features a spacious open-plan living and dining area, a fully fitted kitchen with modern appliances, a guest toilet, and direct access to a private courtyard. Upstairs houses three generously sized bedrooms — the master bedroom comes with an en-suite bathroom and built-in wardrobes.\n\nInspection is available on request — contact the agent to schedule a visit.',
    amenities: ['24/7 Security', 'Constant Power', 'Fitted Kitchen', 'Borehole Water', 'Boys Quarters', 'Prepaid Meter', 'Pop Ceiling', 'Tiled Floors', '2 Parking Spaces', 'Perimeter Fence'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&q=80',
    ],
    inspection_fee: 10000,
    status: 'verified',
    agents: {
      agency_name: 'Okeke Properties',
      verification_status: 'verified',
      rating: 4.8,
      total_reviews: 34,
    }
  }

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', maximumFractionDigits: 0
  }).format(display.price)

  const whatsappMsg = encodeURIComponent(`Hi, I found your listing on Domorang and I'm interested in the ${display.title} in ${display.area}. Is it still available?`)

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">
        <Link href="/" className="text-teal-500 hover:underline">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/listings" className="text-teal-500 hover:underline">Listings</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{display.title}</span>
      </div>

      {/* GALLERY */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden h-64 md:h-[420px]">
          <div className="col-span-2 relative overflow-hidden">
            <img src={display.images?.[0]} alt={display.title} className="w-full h-full object-cover" />
            {display.status === 'verified' && (
              <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ✓ Verified
              </span>
            )}
            <span className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${display.listing_type === 'rent' ? 'bg-teal-500' : 'bg-blue-600'}`}>
              {display.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          <div className="hidden md:flex flex-col gap-2">
            {display.images?.[1] && (
              <div className="flex-1 overflow-hidden">
                <img src={display.images[1]} alt="photo 2" className="w-full h-full object-cover" />
              </div>
            )}
            {display.images?.[2] && (
              <div className="flex-1 relative overflow-hidden">
                <img src={display.images[2]} alt="photo 3" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-black/50 transition">
                  +5 Photos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 pb-24 lg:pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN */}
          <div className="flex-1">

            {/* Price & Title */}
            <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                <div className="text-2xl md:text-3xl font-black text-gray-900">
                  {formattedPrice}
                  {display.listing_type === 'rent' && (
                    <span className="text-base font-normal text-gray-500"> / year</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-teal-500 transition text-lg">🤍</button>
                  <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-teal-500 transition text-lg">🔗</button>
                </div>
              </div>
              <h1 className="text-xl font-black text-gray-900 mb-1">{display.title}</h1>
              <p className="text-gray-500 text-sm">📍 {display.area}, {display.city}, FCT</p>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
              <div className="grid grid-cols-3 md:grid-cols-5 divide-x divide-gray-100">
                {[
                  { icon: '🛏', val: display.bedrooms, label: 'Bedrooms' },
                  { icon: '🚿', val: display.bathrooms, label: 'Bathrooms' },
                  { icon: '📐', val: display.size_sqft?.toLocaleString(), label: 'Sqft' },
                  { icon: '🏠', val: display.property_type, label: 'Type' },
                  { icon: '🚗', val: display.parking || 0, label: 'Parking' },
                ].map((s, i) => (
                  <div key={i} className="p-4 text-center">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="font-black text-gray-900 text-sm">{s.val}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <h2 className="font-black text-gray-900 mb-3">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{display.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <h2 className="font-black text-gray-900 mb-3">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {display.amenities?.map((a: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-[#e6f7f7] rounded-lg px-3 py-2 text-sm text-gray-800">
                    <span className="text-teal-500 font-bold">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <h2 className="font-black text-gray-900 mb-3">Location</h2>
              <div className="rounded-xl overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762!2d7.4198!3d8.9786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0ba6f0ed4c85%3A0xabc!2sLokogoma%2C%20Abuja!5e0!3m2!1sen!2sng!4v1"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                <strong className="text-gray-800">{display.area}, Abuja FCT</strong> — approximately 25 minutes from Abuja city centre.
              </p>
            </div>

            {/* Safety Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Safety tip:</strong> Never pay before inspecting a property. Domorang does not collect rent on behalf of agents. Report suspicious listings immediately.
              </p>
            </div>
          </div>

          {/* RIGHT — AGENT CARD (desktop only) */}
          <aside className="lg:w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Listed by Agent</p>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  AO
                </div>
                <div>
                  <div className="font-bold text-gray-900">Aminu Okeke</div>
                  <div className="text-xs text-gray-500">{display.agents?.agency_name || 'Independent Agent'}</div>
                </div>
              </div>

              {display.agents?.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  ✓ Verified Agent
                </span>
              )}

              {display.inspection_fee && (
                <div className="bg-[#e6f7f7] rounded-xl p-3 mb-4 text-sm">
                  <span className="text-gray-600">Inspection fee: </span>
                  <strong className="text-gray-900">₦{display.inspection_fee.toLocaleString()}</strong>
                </div>
              )}

              <div className="flex flex-col gap-3 mb-4">
                <a
                  href={`https://wa.me/2348100000000?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-full font-bold text-sm hover:bg-green-600 transition"
                >
                  💬 WhatsApp Agent
                </a>
                <a
                  href="tel:+2348100000000"
                  className="flex items-center justify-center gap-2 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition"
                >
                  📞 Call Agent
                </a>
                <button className="py-3 border-2 border-teal-500 text-teal-500 rounded-full font-bold text-sm hover:bg-teal-500 hover:text-white transition">
                  ✉️ Send Message
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 text-center">
                <div>
                  <div className="font-black text-gray-900">{display.agents?.total_reviews || 0}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>
                <div>
                  <div className="font-black text-gray-900">{display.agents?.rating || '—'}★</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div>
                  <div className="font-black text-gray-900">3 yrs</div>
                  <div className="text-xs text-gray-500">On Domorang</div>
                </div>
              </div>

              {/* Report listing */}
              <button className="w-full mt-4 text-xs text-gray-400 hover:text-red-500 transition text-center">
                🚩 Report this listing
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE STICKY CONTACT BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 z-50 shadow-lg">
        <a
          href={`https://wa.me/2348100000000?text=${whatsappMsg}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-full font-bold text-sm"
        >
          💬 WhatsApp
        </a>
        <a
          href="tel:+2348100000000"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-500 text-white rounded-full font-bold text-sm"
        >
          📞 Call
        </a>
      </div>

    </main>
  )
}