'use client'
import { useState } from 'react'

function getYouTubeId(url: string): string | null {
  if (!url) return null
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }
    return null
  } catch {
    return null
  }
}

export default function ListingGallery({
  images,
  title,
  isVerified,
  listingType,
  videoUrl,
}: {
  images: string[]
  title: string
  isVerified: boolean
  listingType: string
  videoUrl?: string | null
}) {
  const [openAt, setOpenAt] = useState<number | null>(null)
  const [tab, setTab] = useState<'photos' | 'video'>('photos')
  const [isPlaying, setIsPlaying] = useState(false)

  const photos = images && images.length > 0 ? images : []
  const videoId = videoUrl ? getYouTubeId(videoUrl) : null
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  const hasVideo = Boolean(videoUrl)

  function prev() {
    if (openAt === null) return
    setOpenAt((openAt - 1 + photos.length) % photos.length)
  }
  function next() {
    if (openAt === null) return
    setOpenAt((openAt + 1) % photos.length)
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 mb-6">

        {/* Tab toggle — bigger, brand teal, only shows if there's a video to switch to */}
        {hasVideo && (
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setTab('photos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                tab === 'photos'
                  ? 'bg-[#0ECFC0] text-[#0D1F3C] shadow-md scale-105'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#0ECFC0]'
              }`}
            >
              📷 Photos {photos.length > 0 && `(${photos.length})`}
            </button>
            <button
              onClick={() => setTab('video')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                tab === 'video'
                  ? 'bg-[#0ECFC0] text-[#0D1F3C] shadow-md scale-105'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#0ECFC0]'
              }`}
            >
              🎥 Video Tour
            </button>
          </div>
        )}

        {tab === 'photos' || !hasVideo ? (
          <>
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden"
              style={{ height: photos.length > 1 ? '420px' : '320px' }}
            >
              {/* Main image */}
              <div
                className={`relative overflow-hidden bg-gray-100 cursor-pointer ${photos.length > 1 ? 'col-span-2' : 'col-span-3'}`}
                onClick={() => photos.length > 0 && setOpenAt(0)}
              >
                {photos[0] ? (
                  <img src={photos[0]} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🏠</div>
                )}
                {isVerified && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
                <span className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${listingType === 'rent' ? 'bg-teal-500' : 'bg-blue-600'}`}>
                  {listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>

              {/* Side images */}
              {photos.length > 1 && (
                <div className="hidden md:flex flex-col gap-2">
                  {photos.slice(1, 3).map((img, i) => {
                    const isLastSlot = i === 1 && photos.length > 3
                    return (
                      <div
                        key={i}
                        className="flex-1 relative overflow-hidden bg-gray-100 cursor-pointer"
                        onClick={() => setOpenAt(i + 1)}
                      >
                        <img src={img} alt={`photo ${i + 2}`} className="w-full h-full object-cover" />
                        {isLastSlot && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black text-lg hover:bg-black/60 transition">
                            +{photos.length - 3} more
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Mobile thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto md:hidden pb-1">
                {photos.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => setOpenAt(i + 1)}
                  >
                    <img src={img} alt={`photo ${i + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {photos.length > 0 && (
              <button
                onClick={() => setOpenAt(0)}
                className="mt-2 text-sm font-bold text-teal-600 hover:underline"
              >
                View all {photos.length} photo{photos.length > 1 ? 's' : ''} →
              </button>
            )}
          </>
        ) : (
          /* VIDEO TAB — same footprint as the photo grid above */
          <div
            className="relative rounded-2xl overflow-hidden bg-black"
            style={{ height: '420px' }}
          >
            {videoId ? (
              isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="group relative w-full h-full"
                  aria-label="Play video tour"
                >
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt="Video tour thumbnail"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#0ECFC0] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-y-[14px] border-y-transparent border-l-[22px] border-l-[#0D1F3C] ml-1.5" />
                    </div>
                  </div>
                </button>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <a
                  href={videoUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-bold text-sm hover:underline"
                >
                  🎥 Watch video tour →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIGHTBOX (photos only) */}
      {openAt !== null && photos[openAt] && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center px-4"
          onClick={() => setOpenAt(null)}
        >
          <button
            onClick={() => setOpenAt(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold w-10 h-10 flex items-center justify-center hover:opacity-70"
          >
            ×
          </button>
          <div className="text-white text-sm absolute top-5 left-5 font-bold">
            {openAt + 1} / {photos.length}
          </div>
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-2 md:left-6 text-white text-4xl font-bold w-12 h-12 flex items-center justify-center hover:opacity-70"
            >
              ‹
            </button>
          )}
          <img
            src={photos[openAt]}
            alt={`photo ${openAt + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-2 md:right-6 text-white text-4xl font-bold w-12 h-12 flex items-center justify-center hover:opacity-70"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}