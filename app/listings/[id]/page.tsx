import Navbar from '../../components/Navbar'
import { createSupabaseServer } from '../../../lib/supabase-server'
import Link from 'next/link'
import ListingGallery from '../../components/ListingGallery'
import ListingVideo from '../../components/ListingVideo'
import {
  Heart,
  Share2,
  BedDouble,
  Bath,
  Ruler,
  Home,
  Car,
  MapPin,
  BadgeCheck,
  Check,
  AlertTriangle,
  AtSign,
  Globe,
  MessageCircle,
  Phone,
  Flag,
} from 'lucide-react'

export default async function ListingDetailPage({ params }: { params: Promise<any> }) {
  const supabase = await createSupabaseServer()
  const resolvedParams = await params

  const { data: listing } = await supabase
    .from('listings')
    .select('*, agents(*)')
    .eq('id', resolvedParams.id)
    .single()

  let agentProfile: { full_name: string; phone: string } | null = null
  if (listing?.agents?.profile_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', listing.agents.profile_id)
      .single()
    agentProfile = profile
  }

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
    description: 'This beautifully finished modern terrace duplex is located in the fast-growing Lokogoma district of Abuja. The property sits in a serene, well-secured estate with 24-hour security and uninterrupted power supply.\n\nThe ground floor features a spacious open-plan living and dining area, a fully fitted kitchen with modern appliances, a guest toilet, and direct access to a private courtyard. Upstairs houses three generously sized bedrooms — the master bedroom comes with an en-suite bathroom and built-in wardrobes.\n\nInspectionis available on request — contact the agent to schedule a visit.',
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

  const agentName = agentProfile?.full_name || 'Agent'
  const agentPhone = agentProfile?.phone || ''
  const agentAgency = display.agents?.agency_name || 'Independent Agent'
  const agentInitials = agentName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', maximumFractionDigits: 0
  }).format(display.price)

  const whatsappMsg = encodeURIComponent(
    `Hi, I found your listing on Domorang and I'm interested in the ${display.title} in ${display.area}. Is it still available?`
  )
  const whatsappNumber = agentPhone.replace(/\D/g, '')

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">
        <Link href="/" className="text-teal-500 hover:underline">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/listings" className="text-teal-500 hover:underline">Listings</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700 truncate">{display.title}</span>
      </div>

      {/* GALLERY */}
      <ListingGallery
        images={display.images || []}
        title={display.title}
        isVerified={display.status === 'verified'}
        listingType={display.listing_type}
        videoUrl={display.video_url}
      />

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
                  <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-teal-500 transition">
                    <Heart className="w-4 h-4 text-gray-600" strokeWidth={2} />
                  </button>
                  <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-teal-500 transition">
                    <Share2 className="w-4 h-4 text-gray-600" strokeWidth={2} />
                  </button>
                </div>
              </div>
              <h1 className="text-xl font-black text-gray-900 mb-1">{display.title}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} /> {display.area}, {display.city}, FCT
              </p>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
              <div className="grid grid-cols-3 md:grid-cols-5 divide-x divide-gray-100">
                {[
                  { Icon: BedDouble, val: display.bedrooms, label: 'Bedrooms' },
                  { Icon: Bath, val: display.bathrooms, label: 'Bathrooms' },
                  { Icon: Ruler, val: display.size_sqft?.toLocaleString(), label: 'Sqft' },
                  { Icon: Home, val: display.property_type, label: 'Type' },
                  { Icon: Car, val: display.parking || 0, label: 'Parking' },
                ].map((s, i) => (
                  <div key={i} className="p-4 text-center">
                    <s.Icon className="w-5 h-5 mx-auto mb-1 text-[#31768a]" strokeWidth={1.75} />
                    <div className="font-black text-gray-900 text-sm">{s.val}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {display.description && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
                <h2 className="font-black text-gray-900 mb-3">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{display.description}</p>
              </div>
            )}

            {/* Amenities */}
            {display.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
                <h2 className="font-black text-gray-900 mb-3">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {display.amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-[#e6f7f7] rounded-lg px-3 py-2 text-sm text-gray-800">
                      <Check className="w-4 h-4 text-teal-500" strokeWidth={2.5} /> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <h2 className="font-black text-gray-900 mb-3">Location</h2>
              <div className="rounded-xl overflow-hidden h-64">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126092.7!2d7.3986!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf7da48d0d%3A0x99a8fe4168c50bc8!2s${encodeURIComponent((display.area || 'Abuja') + ', Abuja, Nigeria')}!5e0!3m2!1sen!2sng!4v1`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                <strong className="text-gray-800">{display.area}, Abuja FCT</strong>
              </p>
            </div>

            {/* Safety Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong>Safety tip:</strong> Never pay before inspecting a property. Domorang does not collect rent on behalf of agents. Report suspicious listings immediately.</span>
              </p>
            </div>
          </div>

          {/* RIGHT — AGENT CARD (desktop only) */}
          <aside className="lg:w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Listed by Agent</p>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {agentInitials}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{agentName}</div>
                  <div className="text-xs text-gray-500">{agentAgency}</div>
                </div>
              </div>

              {display.agents?.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Verified Agent
                </span>
              )}

              {display.agents?.bio && (
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {display.agents.bio}
                </p>
              )}

              {(display.agents?.instagram_url || display.agents?.website_url) && (
                <div className="flex gap-2 mb-4">
                  {display.agents?.instagram_url && (
                    <a
                      href={display.agents.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#31768a] border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#0ECFC0] transition"
                    >
                      <AtSign className="w-3.5 h-3.5" strokeWidth={2} /> Instagram
                    </a>
                  )}
                  {display.agents?.website_url && (
                    <a
                      href={display.agents.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#31768a] border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#0ECFC0] transition"
                    >
                      <Globe className="w-3.5 h-3.5" strokeWidth={2} /> Website
                    </a>
                  )}
                </div>
              )}

              {display.inspection_fee && (
                <div className="bg-[#e6f7f7] rounded-xl p-3 mb-4 text-sm">
                  <span className="text-gray-600">Inspection fee: </span>
                  <strong className="text-gray-900">₦{display.inspection_fee.toLocaleString()}</strong>
                </div>
              )}

              <div className="flex flex-col gap-3 mb-4">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-full font-bold text-sm hover:bg-green-600 transition"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={2} /> WhatsApp Agent
                </a>
                {agentPhone && (
                  <a
                    href={`tel:${agentPhone}`}
                    className="flex items-center justify-center gap-2 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition"
                  >
                    <Phone className="w-4 h-4" strokeWidth={2} /> Call Agent
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 text-center">
                <div>
                  <div className="font-black text-gray-900">{display.agents?.total_reviews || 0}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>
                <div>
                  <div className="font-black text-gray-900">{display.agents?.rating ? `${display.agents.rating}★` : '—'}</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              <button className="w-full mt-4 text-xs text-gray-400 hover:text-red-500 transition text-center flex items-center justify-center gap-1.5">
                <Flag className="w-3.5 h-3.5" strokeWidth={2} /> Report this listing
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE STICKY CONTACT BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 z-50 shadow-lg">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-full font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={2} /> WhatsApp
        </a>
        {agentPhone && (
          <a
            href={`tel:${agentPhone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-500 text-white rounded-full font-bold text-sm"
          >
            <Phone className="w-4 h-4" strokeWidth={2} /> Call
          </a>
        )}
      </div>

    </main>
  )
}