'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import ListingCard from '../../components/ListingCard'
import { supabase } from '../../../lib/supabase'
import { MapPin, Star, CheckCircle2, Link2, Check } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'

const defaultAgent = {
  agency_name: 'Okeke Properties',
  area_of_operation: 'Maitama',
  verification_status: 'verified',
  rating: 4.8,
  total_reviews: 34,
  bio: '',
  instagram_url: '',
  website_url: '',
  profiles: { full_name: 'Aminu Okeke', phone: '+2348012345678' }
}

const defaultListings = [
  { id: '1', title: 'Modern 3 Bedroom Flat', price: 2500000, listing_type: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1200, area: 'Maitama', status: 'verified', images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&q=80'] },
  { id: '2', title: '4 Bedroom Detached Duplex', price: 320000000, listing_type: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 2200, area: 'Maitama', status: 'verified', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80'] },
]

const defaultReviews = [
  { id: '1', rating: 5, comment: 'Very professional and responsive. The property was exactly as described.', agent_showed_up: true, property_as_described: true, profiles: { full_name: 'Chidi O.' }, created_at: '2026-05-10' },
  { id: '2', rating: 4, comment: 'Good agent. Showed up on time and was knowledgeable about the area.', agent_showed_up: true, property_as_described: true, profiles: { full_name: 'Fatima B.' }, created_at: '2026-04-22' },
  { id: '3', rating: 5, comment: 'Found my apartment through this agent. Highly recommend!', agent_showed_up: true, property_as_described: true, profiles: { full_name: 'Emmanuel A.' }, created_at: '2026-03-15' },
]

export default function AgentProfilePage() {
  const params = useParams()
  const [agent, setAgent] = useState<any>(defaultAgent)
  const [listings, setListings] = useState<any[]>(defaultListings)
  const [reviews, setReviews] = useState<any[]>(defaultReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', agent_showed_up: true, property_as_described: true })
  const [submitting, setSubmitting] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)

  useEffect(() => {
    loadAgent()
  }, [])

  async function loadAgent() {
    const { data: agentData } = await supabase
      .from('agents')
      .select('*, profiles(full_name, phone)')
      .eq('id', params.id)
      .single()
    if (agentData) setAgent(agentData)

    const { data: listingsData } = await supabase
      .from('listings')
      .select('*')
      .eq('agent_id', params.id)
      .eq('status', 'verified')
    if (listingsData && listingsData.length > 0) setListings(listingsData)

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('agent_id', params.id)
      .order('created_at', { ascending: false })
    if (reviewsData && reviewsData.length > 0) setReviews(reviewsData)
  }

  async function submitReview() {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/signin'; return }
    await supabase.from('reviews').insert({
      agent_id: params.id,
      reviewer_id: user.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      agent_showed_up: reviewForm.agent_showed_up,
      property_as_described: reviewForm.property_as_described,
    })
    setReviewDone(true)
    setShowReviewForm(false)
    setSubmitting(false)
    loadAgent()
  }

  const getInitials = (name: string) => {
    if (!name) return 'AG'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const waLink = (phone: string) => {
    const digits = phone ? phone.replace(/\D/g, '') : ''
    return 'https://wa.me/' + digits + '?text=Hi, I found you on Domorang and would like to enquire about a property.'
  }

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/" className="text-teal-500 hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/agents" className="text-teal-500 hover:underline">Agents</Link>
          <span className="mx-2">›</span>
          <span>{agent.profiles?.full_name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <div className="text-center mb-5">
                <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-2xl mx-auto mb-3">
                  {getInitials(agent.profiles?.full_name)}
                </div>
                <div className="font-black text-gray-900 text-lg">{agent.profiles?.full_name}</div>
                <div className="text-sm text-gray-500">{agent.agency_name}</div>
                {agent.verification_status === 'verified' && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mt-2">
                    <CheckCircle2 size={14} /> Verified Agent
                  </span>
                )}
              </div>

              {agent.bio && (
                <p className="text-sm text-gray-600 leading-relaxed text-center mb-5">
                  {agent.bio}
                </p>
              )}

              {(agent.instagram_url || agent.website_url) && (
                <div className="flex justify-center gap-2 mb-5">
                  {agent.instagram_url && (
                    <a href={agent.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#31768a] border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#0ECFC0] transition"
                    >
                      <FaInstagram size={14} /> Instagram
                    </a>
                  )}
                  {agent.website_url && (
                    <a href={agent.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#31768a] border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#0ECFC0] transition"
                    >
                      <Link2 size={14} /> Website
                    </a>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center bg-[#d9edf0] rounded-xl p-3 mb-5">
                <div>
                  <div className="font-black text-gray-900 flex items-center justify-center gap-1">
                    {agent.rating || 0} <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div>
                  <div className="font-black text-gray-900">{agent.total_reviews || 0}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>
                <div>
                  <div className="font-black text-gray-900">{listings.length}</div>
                  <div className="text-xs text-gray-500">Listings</div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-5">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{agent.area_of_operation}, Abuja</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a href={waLink(agent.profiles?.phone)} target="_blank" rel="noreferrer" className="w-full text-center py-3 bg-green-500 text-white rounded-full font-bold text-sm">
                  WhatsApp Agent
                </a>
                <a href={"tel:" + agent.profiles?.phone} className="w-full text-center py-3 bg-teal-500 text-white rounded-full font-bold text-sm">
                  Call Agent
                </a>
                <button onClick={() => setShowReviewForm(true)} className="w-full text-center py-3 border-2 border-teal-500 text-teal-500 rounded-full font-bold text-sm">
                  Leave a Review
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">

            {showReviewForm && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Rate this Agent</h3>
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="transition">
                        <Star
                          size={26}
                          className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4 flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={reviewForm.agent_showed_up} onChange={e => setReviewForm({ ...reviewForm, agent_showed_up: e.target.checked })} className="accent-teal-500 w-4 h-4" />
                    Agent showed up
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={reviewForm.property_as_described} onChange={e => setReviewForm({ ...reviewForm, property_as_described: e.target.checked })} className="accent-teal-500 w-4 h-4" />
                    Property as described
                  </label>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Your Comment</label>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Describe your experience with this agent..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 h-24 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowReviewForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-500">Cancel</button>
                  <button onClick={submitReview} disabled={submitting} className="flex-1 py-2.5 bg-teal-500 text-white rounded-full text-sm font-bold disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            )}

            {reviewDone && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 text-sm font-semibold">
                Thank you! Your review has been submitted.
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-black text-gray-900">Active Listings</h3>
              </div>
              {listings.length > 0 ? (
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listings.map((listing: any) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">No active listings yet.</div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Reviews</h3>
                <span className="text-sm text-gray-500">{reviews.length} reviews</span>
              </div>
              {reviews.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{review.profiles?.full_name || 'Anonymous'}</div>
                          <div className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star
                              key={i}
                              size={14}
                              className={i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      <div className="flex gap-3 mt-2">
                        {review.agent_showed_up && (
                          <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            <Check size={12} /> Agent showed up
                          </span>
                        )}
                        {review.property_as_described && (
                          <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            <Check size={12} /> As described
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">No reviews yet. Be the first to review this agent.</div>
              )}
            </div>

          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white px-4 py-8 text-center mt-8">
        <div className="text-xl font-black text-teal-400 mb-2">Domorang</div>
        <p className="text-xs text-gray-500">2026 Domorang. All rights reserved.</p>
      </footer>
    </main>
  )
}