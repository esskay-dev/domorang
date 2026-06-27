'use client'
import Link from 'next/link'

export default function FeaturedShowcase({ listings }) {
  const slots = [...listings]
  while (slots.length < 3) {
    slots.push({ id: `empty-${slots.length}`, comingSoon: true, area: 'Abuja' })
  }
  const [left, center, right] = slots.slice(0, 3)

  return (
    <div
      className="relative flex items-end justify-center gap-4 md:gap-2 px-4 pb-16"
      style={{ perspective: '1800px' }}
    >
      <ShowcaseCard listing={left} tilt={-22} z={10} />
      <ShowcaseCard listing={center} tilt={0} z={20} elevated />
      <ShowcaseCard listing={right} tilt={22} z={10} />
    </div>
  )
}

function ShowcaseCard({ listing, tilt, z, elevated = false }) {
  const { id, title, price, listing_type, bedrooms, bathrooms, size_sqft, area, images, comingSoon } = listing

  const formattedPrice = price
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)
    : null

  const cardInner = (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/40 transition-transform duration-300 ${comingSoon ? 'opacity-60' : 'hover:scale-[1.02]'}`}
      style={{
        width: elevated ? 'clamp(220px, 26vw, 340px)' : 'clamp(180px, 21vw, 280px)',
      }}
    >
      <div className="relative h-40 md:h-52 bg-teal-50">
        {images?.[0] ? (
          <img
            src={images[0]}
            alt={comingSoon ? `More homes coming soon to ${area}` : title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
        )}

        <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm">
          🤍
        </span>

        {comingSoon ? (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gray-500">
            Coming Soon
          </span>
        ) : (
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${listing_type === 'rent' ? 'bg-teal-500' : 'bg-blue-600'}`}>
            {listing_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        )}
      </div>

      <div className="p-4">
        {comingSoon ? (
          <div className="py-1">
            <div className="text-sm font-bold text-gray-700 mb-1">More homes coming soon</div>
            <div className="text-xs text-gray-400">📍 {area}, Abuja</div>
          </div>
        ) : (
          <>
            <div className="text-base md:text-lg font-black text-gray-900">
              {formattedPrice}
              {listing_type === 'rent' && <span className="text-xs font-normal text-gray-500"> per annum</span>}
            </div>
            <div className="text-sm font-semibold text-gray-800 mt-1 mb-1 line-clamp-1">{title}</div>
            <div className="text-xs text-gray-500 mb-2">📍 {area}, Abuja</div>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>🛏 {bedrooms} Bedroom</span>
              <span>🚿 {bathrooms} Bathroom</span>
              {size_sqft && <span>📐 {size_sqft} sqft</span>}
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div
      style={{
        transform: `rotateY(${tilt}deg) ${elevated ? 'translateY(-16px) scale(1.05)' : ''}`,
        zIndex: z,
        transformStyle: 'preserve-3d',
      }}
      className="transition-transform duration-300"
    >
      {comingSoon ? (
        <div className="cursor-default">{cardInner}</div>
      ) : (
        <Link href={`/listings/${id}`}>{cardInner}</Link>
      )}
    </div>
  )
}