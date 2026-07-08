'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Home } from 'lucide-react'

const TEST_LISTINGS = [
  { id: 'test-1', title: '4 Bedroom semi-detached duplex', price: 120000000, listing_type: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 3200, area: 'Life Camp', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'], rating: 4.9 },
  { id: 'test-2', title: 'Modern 3 Bedroom Flat', price: 2500000, listing_type: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1200, area: 'Wuse 2', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'], rating: 4.95 },
  { id: 'test-3', title: '2 Bedroom Apartment', price: 2500000, listing_type: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 900, area: 'Garki', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'], rating: 4.81 },
  { id: 'test-4', title: 'Luxury 5 Bedroom Mansion', price: 350000000, listing_type: 'sale', bedrooms: 5, bathrooms: 6, size_sqft: 6000, area: 'Maitama', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'], rating: 5.0 },
  { id: 'test-5', title: 'Cozy Studio Apartment', price: 800000, listing_type: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 450, area: 'Gwarinpa', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'], rating: 4.98 },
  { id: 'test-6', title: '3 Bedroom Terrace Duplex', price: 1800000, listing_type: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 1800, area: 'Jabi', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'], rating: 4.9 },
]

export default function FeaturedShowcase({ listings }) {
  const source = (!listings || listings.filter(l => !l.comingSoon).length < 3)
    ? TEST_LISTINGS
    : listings.filter(l => !l.comingSoon)

  const scrollRef = useRef(null)

  const scrollBy = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  const previewImages = source
    .map(l => l.images?.[0])
    .filter(Boolean)
    .slice(-3)

  return (
    <div className="relative group">
      <button
        onClick={() => scrollBy(-1)}
        className="hidden sm:flex absolute -left-3 top-[100px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-700 hover:scale-105 transition-transform opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        onClick={() => scrollBy(1)}
        className="hidden sm:flex absolute -right-3 top-[100px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-700 hover:scale-105 transition-transform opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        ›
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-4 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {source.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
        <SeeAllCard images={previewImages} count={source.length} />
      </div>
    </div>
  )
}

function ListingCard({ listing }) {
  const { id, title, price, listing_type, area, images, rating } = listing
  const [liked, setLiked] = useState(false)

  const formattedPrice = price
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)
    : null

  return (
    <Link href={`/listings/${id}`} className="shrink-0 snap-start" style={{ width: 'clamp(200px, 22vw, 240px)' }}>
      <div className="cursor-pointer group/card">
        <div className="relative rounded-xl overflow-hidden aspect-square mb-2">
          {images?.[0] ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-teal-50">
              <Home className="w-8 h-8 text-teal-500" strokeWidth={1.5} />
            </div>
          )}

          <span className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {listing_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>

          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center"
            aria-label="Save listing"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill={liked ? '#31768a' : 'rgba(0,0,0,0.5)'} stroke="white" strokeWidth="1.5">
              <path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.9C19.5 16.4 12 21 12 21z" />
            </svg>
          </button>
        </div>

        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="text-sm font-semibold text-gray-900 line-clamp-1">{area}, Abuja</div>
          {rating && (
            <div className="flex items-center gap-1 text-xs text-gray-700 shrink-0">
              <span>★</span>
              <span>{rating}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mb-1 line-clamp-1">{title}</div>
        <div className="text-sm text-gray-900">
          <span className="font-bold">{formattedPrice}</span>
          {listing_type === 'rent' && <span className="text-gray-500"> / year</span>}
        </div>
      </div>
    </Link>
  )
}

function SeeAllCard({ images, count }) {
  const rotations = ['-rotate-6', 'rotate-3', '-rotate-1']
  const offsets = ['left-[8%] top-[10%] w-[62%]', 'left-[30%] top-[4%] w-[62%]', 'left-[19%] top-[16%] w-[62%]']

  return (
    <Link href="/listings" className="shrink-0 snap-start" style={{ width: 'clamp(200px, 22vw, 240px)' }}>
      <div className="cursor-pointer group/card">
        <div className="relative rounded-xl overflow-hidden aspect-square mb-2" style={{ backgroundColor: '#d9edf0' }}>

          {images.map((src, i) => (
            <div
              key={i}
              className={`absolute ${offsets[i] || offsets[0]} aspect-[4/3] rounded-lg overflow-hidden shadow-lg ring-2 ring-white ${rotations[i] || rotations[0]} transition-transform duration-300 group-hover/card:${i === 1 ? 'scale-105' : 'scale-100'}`}
              style={{ zIndex: i === 1 ? 3 : i === 2 ? 2 : 1 }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/card:scale-110"
              style={{ backgroundColor: '#31768a', zIndex: 4 }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-sm font-semibold text-gray-900 mb-0.5">See all listings</div>
        <div className="text-xs text-gray-500">Browse {count}+ verified properties</div>
      </div>
    </Link>
  )
}