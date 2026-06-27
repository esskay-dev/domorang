'use client'
import { useRef } from 'react'
import Link from 'next/link'
import ListingCard from './ListingCard'

export default function AreaListingsRow({ area, listings }) {
  const scrollRef = useRef(null)

  function scroll(direction) {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl md:text-2xl font-black text-gray-900">Homes in {area}</h3>
        <div className="flex items-center gap-3">
          <Link
            href={`/listings?area=${encodeURIComponent(area)}`}
            className="text-teal-500 font-semibold text-sm hover:underline hidden sm:inline"
          >
            View all →
          </Link>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {listings.map((listing, idx) => (
          <div key={`${area}-${listing.id}-${idx}`} className="snap-start flex-shrink-0 w-[260px] md:w-[280px]">
            <ListingCard listing={listing} comingSoon={listing.comingSoon} />
          </div>
        ))}
      </div>
    </div>
  )
}