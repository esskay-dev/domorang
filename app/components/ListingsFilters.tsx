'use client'
import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ListingsFilters({ areas, propertyTypes }: { areas: string[]; propertyTypes: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    searchParams.get('area')?.split(',').filter(Boolean) || []
  )
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('ptype')?.split(',').filter(Boolean) || []
  )
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any')

  function toggleArea(area: string) {
    setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
  }

  function toggleType(t: string) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())
    selectedAreas.length ? params.set('area', selectedAreas.join(',')) : params.delete('area')
    selectedTypes.length ? params.set('ptype', selectedTypes.join(',')) : params.delete('ptype')
    minPrice ? params.set('minPrice', minPrice) : params.delete('minPrice')
    maxPrice ? params.set('maxPrice', maxPrice) : params.delete('maxPrice')
    bedrooms !== 'Any' ? params.set('bedrooms', bedrooms) : params.delete('bedrooms')
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    setSelectedAreas([])
    setSelectedTypes([])
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('Any')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('area')
    params.delete('ptype')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('bedrooms')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-black text-gray-900">Filters</h3>
        <button onClick={clearAll} className="text-teal-500 text-sm font-semibold">Clear all</button>
      </div>

      <div className="mb-5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Area</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {areas.map(area => (
            <label key={area} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selectedAreas.includes(area)} onChange={() => toggleArea(area)} className="accent-teal-500 w-4 h-4" />
              <span className="text-sm text-gray-700">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range (₦)</div>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-0 flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
          <span className="text-gray-400 text-sm flex-shrink-0">—</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-0 flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bedrooms</div>
        <div className="flex gap-2 flex-wrap">
          {['Any', '1', '2', '3', '4+'].map(b => (
            <button key={b} onClick={() => setBedrooms(b)} className={`px-3 py-1.5 rounded-full border-2 text-sm font-semibold transition ${bedrooms === b ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-200 text-gray-600 hover:border-teal-500 hover:text-teal-500'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Property Type</div>
        <div className="space-y-2">
          {propertyTypes.map(t => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)} className="accent-teal-500 w-4 h-4" />
              <span className="text-sm text-gray-700">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={applyFilters} className="w-full py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition">
        Apply Filters
      </button>
    </div>
  )
}
