function getYouTubeEmbedUrl(url: string): string | null {
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
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
      }
    }
    return null
  } catch {
    return null
  }
}

export default function ListingVideo({ videoUrl }: { videoUrl: string | null | undefined }) {
  if (!videoUrl) return null

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  if (!embedUrl) {
    // Not a recognizable YouTube link — show it as a plain link instead of breaking
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-black text-gray-900 mb-3">Property Video</h2>
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-teal-600 font-bold text-sm hover:underline break-all"
        >
          🎥 Watch video tour →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <h2 className="font-black text-gray-900 mb-3">Property Video</h2>
      <div className="rounded-xl overflow-hidden aspect-video">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}