'use client'
import { useEffect, useRef } from 'react'

interface Listing {
  id: string
  title: string
  price: number
  listing_type: string
  area: string
  images?: string[]
  latitude?: number
  longitude?: number
}

interface HeroMapProps {
  listings: Listing[]
}

export default function HeroMap({ listings }: HeroMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import Leaflet (browser only)
    import('leaflet').then((L) => {
      // Fix Leaflet default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Init map centered on Abuja
      const map = L.map(mapRef.current!, {
        center: [9.0579, 7.4951],
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
      })

      mapInstanceRef.current = map

      // OpenStreetMap tiles — free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add zoom control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Custom teal pin icon
      const tealIcon = (price: number, type: string) => L.divIcon({
        className: '',
        html: `
          <div style="
            background: #31768a;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(49,118,138,0.4);
            border: 2px solid white;
            position: relative;
          ">
            ${new Intl.NumberFormat('en-NG', {
              style: 'currency',
              currency: 'NGN',
              notation: 'compact',
              maximumFractionDigits: 0,
            }).format(price)}
            <div style="
              position: absolute;
              bottom: -7px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 7px solid #31768a;
            "></div>
          </div>
        `,
        iconAnchor: [40, 36],
        popupAnchor: [0, -36],
      })

      // Plot pins for listings that have coordinates
      const listingsWithCoords = listings.filter(l => l.latitude && l.longitude)

      listingsWithCoords.forEach((listing) => {
        const formatted = new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits: 0,
        }).format(listing.price)

        const popupContent = `
          <div style="width:200px; font-family: sans-serif;">
            ${listing.images?.[0]
              ? `<img src="${listing.images[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
              : `<div style="width:100%;height:80px;background:#e6f4f7;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:8px;">🏠</div>`
            }
            <div style="font-size:15px;font-weight:800;color:#111;">${formatted}</div>
            <div style="font-size:12px;color:#555;margin:3px 0 6px;">${listing.title}</div>
            <div style="font-size:11px;color:#888;margin-bottom:8px;">📍 ${listing.area}, Abuja</div>
            <a href="/listings/${listing.id}" style="
              display:block;
              text-align:center;
              background:#31768a;
              color:white;
              padding:7px;
              border-radius:20px;
              font-size:12px;
              font-weight:700;
              text-decoration:none;
            ">View Property →</a>
          </div>
        `

        L.marker([listing.latitude!, listing.longitude!], {
          icon: tealIcon(listing.price, listing.listing_type),
        })
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 220 })
      })

      // If no listings with coords, just show Abuja centered
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [listings])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />

        {/* Overlay badge */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse inline-block" />
          <span className="text-xs font-semibold text-gray-700">Live · Abuja, FCT</span>
        </div>
      </div>
    </>
  )
}