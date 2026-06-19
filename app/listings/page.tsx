import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { createSupabaseServer } from '../../lib/supabase-server'
import Link from 'next/link'

export default async function ListingsPage({ searchParams }: { searchParams: Promise<any> }) {
  const supabase = await createSupabaseServer()
  const resolvedParams = await searchParams
  const type = resolvedParams?.type || 'all'

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'verified')
    .order('created_at', { ascending: false })

  if (type !== 'all') {
    query = query.eq('listing_type', type)
  }

  const { data: listings } = await query

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

  // Filter placeholders by type when no real data exists
  const filteredPlaceholders = type !== 'all'
    ? allPlaceholders.filter(l => l.listing_type === type)
    : allPlaceholders

  const displayListings = listings && listings.length > 0 ? listings : filteredPlaceholders

  const areas = ['Wuse 2', 'Maitama', 'Garki', 'Gwarinpa', 'Lokogoma', 'Asokoro', 'Kubwa', 'Jabi', 'Lugbe', 'Kado', 'Life Camp']

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

      {/* PAGE HEADER */}
      <div className="bg-[#d9edf0] px-4 pt-8 pb-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{pageTitle}</h1>
          <p className="text-gray-500 text-sm mb-4">{pageSubtitle}</p>

          {/* Search + Type Tabs */}
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

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-gray-900">Filters</h3>
                <button className="text-teal-500 text-sm font-semibold">Clear all</button>
              </div>

              {/* Area */}
              <div className="mb-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Area</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {areas.map(area => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-teal-500 w-4 h-4" />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range (₦)</div>
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Min" className="w-0 flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
                  <span className="text-gray-400 text-sm flex-shrink-0">—</span>
                  <input type="number" placeholder="Max" className="w-0 flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bedrooms</div>
                <div className="flex gap-2 flex-wrap">
                  {['Any', '1', '2', '3', '4+'].map(b => (
                    <button key={b} className="px-3 py-1.5 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-teal-500 hover:text-teal-500 transition">
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Property Type</div>
                <div className="space-y-2">
                  {['Flat / Apartment', 'Duplex', 'Bungalow', 'Self Contain', 'Land'].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-teal-500 w-4 h-4" />
                      <span className="text-sm text-gray-700">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* RESULTS */}
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
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="font-black text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-500 text-sm mb-6">No {type === 'rent' ? 'rental' : 'sale'} properties yet. Check back soon.</p>
                <Link href="/listings" className="px-6 py-3 bg-teal-500 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition">
                  View All Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {displayListings.length > 0 && (
              <div className="flex justify-center gap-2 mt-10">
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} className={`w-9 h-9 rounded-full border-2 text-sm font-bold transition ${p === 1 ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-200 text-gray-600 hover:border-teal-500'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}