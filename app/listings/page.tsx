import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import ListingsFilters from '../components/ListingsFilters'
import { api } from '../../lib/api'
import Link from 'next/link'
import { Home } from 'lucide-react'

const ITEMS_PER_PAGE = 9

export default async function ListingsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedParams = (await searchParams) || {}
  const type = resolvedParams?.type || 'all'

  const selectedAreas: string[] = resolvedParams?.area
    ? String(resolvedParams.area).split(',').filter(Boolean)
    : []
  const selectedTypes: string[] = resolvedParams?.ptype
    ? String(resolvedParams.ptype).split(',').filter(Boolean)
    : []
  const minPrice = resolvedParams?.minPrice ? parseInt(resolvedParams.minPrice) : undefined
  const maxPrice = resolvedParams?.maxPrice ? parseInt(resolvedParams.maxPrice) : undefined
  const bedroomsParam: string | undefined = resolvedParams?.bedrooms
  const currentPage = Math.max(1, parseInt(resolvedParams?.page) || 1)

  let listings: any[] = []
  try {
    const res = await api.listings.getAll(resolvedParams)
    listings = res?.listings || []
  } catch (err) {
    console.error('Failed to fetch listings from NestJS server:', err)
  }

  const allPlaceholders = [
    { id: '1', title: 'Modern 3 Bedroom Flat', price: 2500000, listing_type: 'rent', bedrooms: 3, bathrooms: 2, size_sqft: 1200, area: 'Wuse 2', status: 'verified', images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&q=80'] },
    { id: '2', title: '2 Bedroom Apartment', price: 2500000, listing_type: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 900, area: 'Garki', status: 'verified', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&q=80'] },
    { id: '3', title: 'Modern 3 Bedroom Terrace Duplex', price: 75000000, listing_type: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 1650, area: 'Lokogoma', status: 'verified', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80'] },
    { id: '4', title: '3 Bedroom Flat', price: 187000000, listing_type: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 1500, area: 'Gwarinpa', status: 'verified', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&q=80'] },
    { id: '5', title: '4 Bedroom Detached Duplex', price: 320000000, listing_type: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 2200, area: 'Maitama', status: 'verified', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80'] },
    { id: '6', title: 'Self-Contain Studio', price: 1200000, listing_type: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 450, area: 'Kubwa', status: 'verified', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80'] },
    { id: '7', title: '5 Bedroom Luxury Mansion', price: 750000000, listing_type: 'sale', bedrooms: 5, bathrooms: 5, size_sqft: 4500, area: 'Asokoro', status: 'verified', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80'] },
    { id: '8', title: '2 Bedroom Bungalow', price: 3500000, listing_type: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 1100, area: 'Jabi', status: 'verified', images: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=500&q=80'] },
    { id: '9', title: '3 Bedroom Semi-Detached', price: 95000000, listing_type: 'sale', bedrooms: 3, bathrooms: 2, size_sqft: 1350, area: 'Lugbe', status: 'verified', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'] },
  ]

  function applyClientFilters(list: any[]) {
    return list.filter(l => {
      if (type !== 'all' && l.listing_type !== type) return false
      if (selectedAreas.length && !selectedAreas.includes(l.area)) return false
      if (minPrice !== undefined && l.price < minPrice) return false
      if (maxPrice !== undefined && l.price > maxPrice) return false
      if (bedroomsParam) {
        if (bedroomsParam === '4+' && l.bedrooms < 4) return false
        if (bedroomsParam !== '4+' && l.bedrooms !== parseInt(bedroomsParam)) return false
      }
      if (selectedTypes.length && l.property_type && !selectedTypes.includes(l.property_type)) return false
      return true
    })
  }

  const filteredPlaceholders = applyClientFilters(allPlaceholders)
  const displayListings = listings && listings.length > 0 ? listings : filteredPlaceholders

  const totalPages = Math.max(1, Math.ceil(displayListings.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedListings = displayListings.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )

  function buildPageHref(page: number) {
    const params = new URLSearchParams()
    if (type !== 'all') params.set('type', type)
    if (selectedAreas.length) params.set('area', selectedAreas.join(','))
    if (selectedTypes.length) params.set('ptype', selectedTypes.join(','))
    if (minPrice !== undefined) params.set('minPrice', String(minPrice))
    if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice))
    if (bedroomsParam) params.set('bedrooms', bedroomsParam)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return qs ? `/listings?${qs}` : '/listings'
  }

  const areas = ['Wuse 2', 'Maitama', 'Garki', 'Gwarinpa', 'Lokogoma', 'Asokoro', 'Kubwa', 'Jabi', 'Lugbe', 'Kado', 'Life Camp']
  const propertyTypes = ['Flat / Apartment', 'Duplex', 'Bungalow', 'Self Contain', 'Land']

  const pageTitle = type === 'rent'
    ? 'Properties for Rent in Abuja'
    : type === 'sale'
    ? 'Properties for Sale in Abuja'
    : 'All Property Listings in Abuja'

  const pageSubtitle = type === 'rent'
    ? 'Browse verified homes available for rent across Abuja.'
    : type === 'sale'
    ? 'Browse verified homes and properties available for sale across Abuja.'
    : 'Browse verified homes for rent and sale across Abuja.'

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      <div className="bg-[#d9edf0] px-4 pt-8 pb-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{pageTitle}</h1>
          <p className="text-gray-500 text-sm mb-4">{pageSubtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 pb-6">
            <div className="flex-1 flex items-center bg-white rounded-full shadow-sm px-4 py-2">
              <input
                type="text"
                placeholder="Search area, neighborhood or address..."
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
              />
              <button className="bg-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-teal-600 transition">
                Search
              </button>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'rent', label: 'For Rent' },
                { value: 'sale', label: 'For Sale' },
              ].map(t => (
                <Link
                  key={t.value}
                  href={t.value === 'all' ? '/listings' : `/listings?type=${t.value}`}
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition ${
                    type === t.value
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-teal-500'
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="lg:w-72 flex-shrink-0">
            <ListingsFilters areas={areas} propertyTypes={propertyTypes} />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">{displayListings.length} properties</strong> found
                {type !== 'all' && <span> — {type === 'rent' ? 'For Rent' : 'For Sale'}</span>}
              </p>
              <select className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white outline-none text-gray-700">
                <option>Newest first</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {displayListings.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center">
                <Home size={48} className="text-teal-300 mx-auto mb-4" />
                <h3 className="font-black text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or check back soon.</p>
                <Link href="/listings" className="px-6 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition">
                  View All Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link
                    key={p}
                    href={buildPageHref(p)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${p === safePage ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-200 text-gray-600 hover:border-teal-500'}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}