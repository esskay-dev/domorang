import Navbar from './components/Navbar'
import ListingCard from './components/ListingCard'
import Link from 'next/link'

export default async function HomePage() {
  const placeholderListings = [
    { id: '1', title: '2 Bedroom Apartment', price: 2500000, listing_type: 'rent', bedrooms: 2, bathrooms: 2, size_sqft: 900, area: 'Garki', status: 'verified', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&q=80'] },
    { id: '2', title: 'Modern 3 Bedroom Terrace Duplex', price: 75000000, listing_type: 'rent', bedrooms: 3, bathrooms: 3, size_sqft: 1650, area: 'Lokogoma', status: 'verified', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80'] },
    { id: '3', title: '3 Bedroom Flat', price: 187000000, listing_type: 'sale', bedrooms: 3, bathrooms: 3, size_sqft: 1500, area: 'Gwarinpa', status: 'verified', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&q=80'] },
    { id: '4', title: '4 Bedroom Detached Duplex', price: 320000000, listing_type: 'sale', bedrooms: 4, bathrooms: 4, size_sqft: 2200, area: 'Maitama', status: 'verified', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80'] },
    { id: '5', title: 'Self-Contain Studio', price: 1200000, listing_type: 'rent', bedrooms: 1, bathrooms: 1, size_sqft: 450, area: 'Kubwa', status: 'verified', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80'] },
  ]

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#d9edf0] px-4 pt-12 pb-0 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-4">
            Modern property search and transactions in Abuja.</h1>
          <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto mb-8">
            Domorang helps people find verified properties, connect with trusted agents, and secure homes across Abuja.
          </p>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-2 max-w-2xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Area, Neighborhood or Address e.g Wuse, Maitama"
              className="flex-1 outline-none text-sm md:text-base text-gray-700 bg-transparent py-2"
            />
            <Link
              href="/listings"
              className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-teal-600 transition whitespace-nowrap"
            >
              🔍 Search
            </Link>
          </div>
        </div>

        {/* MAP */}
        <div className="max-w-5xl mx-auto rounded-t-2xl overflow-hidden h-64 md:h-96 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126092.7!2d7.3986!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf7da48d0d%3A0x99a8fe4168c50bc8!2sAbuja%2C%20Federal%20Capital%20Territory!5e0!3m2!1sen!2sng!4v1"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">Featured Listings</h2>
          <Link href="/listings" className="text-teal-500 font-semibold text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {placeholderListings.map(listing => (
            <div key={listing.id} className="snap-start flex-shrink-0 w-[280px] md:w-[calc(33.333%-14px)]">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-10">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '🏠', title: 'Rent a Home', desc: 'Find verified rental homes across Abuja without the usual stress.', cta: 'Browse Verified Homes', href: '/listings?type=rent' },
              { icon: '🔑', title: 'Buy a Home', desc: 'Access transparent property details and connect with credible professionals.', cta: 'Explore Homes for Sale', href: '/listings?type=sale' },
              { icon: '📋', title: 'Sell a Home', desc: 'Showcase your property to a targeted audience actively searching in Abuja.', cta: 'List Your Property', href: '/post-listing' },
              { icon: '🤝', title: 'Find an Agent', desc: 'Work with verified local agents who know the Abuja market inside out.', cta: 'Connect Now', href: '/agents' },
            ].map((s, i) => (
              <div key={i} className="bg-teal-500 rounded-2xl p-8 text-white text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm opacity-85 mb-5 leading-relaxed">{s.desc}</p>
                <Link href={s.href} className="inline-block px-5 py-2 border-2 border-white rounded-full text-sm font-bold hover:bg-white hover:text-teal-600 transition">
                  {s.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-teal-500 px-4 py-12">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          {[
            { num: '50+', label: 'Verified landlords & agents across Abuja' },
            { num: '2k', label: 'Active renters & home seekers monthly' },
            { num: '75%', label: 'Customer satisfaction rate' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-5xl font-black">{s.num}</div>
              <div className="text-xs md:text-sm opacity-80 mt-1 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#d9edf0] px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
          Home Search Made <span className="text-teal-500">Simple</span>,<br />
          Let's Do It Together.
        </h2>
        <p className="text-gray-500 mb-8">Join thousands of Abuja home seekers on Domorang.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/listings" className="px-8 py-3 bg-teal-500 text-white rounded-full font-bold hover:bg-teal-600 transition">
            Browse Listings
          </Link>
          <Link href="/post-listing" className="px-8 py-3 border-2 border-teal-500 text-teal-600 rounded-full font-bold hover:bg-teal-500 hover:text-white transition">
            List Your Property
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-black text-teal-400 mb-3">Domorang</div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Domorang is committed to making property transactions safer, more transparent, and more trustworthy. Through rigorous verification, clear information, and accountability-driven processes, we help people find homes and property opportunities with greater confidence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/listings?type=rent" className="hover:text-white transition">Rent</Link></li>
              <li><Link href="/listings?type=sale" className="hover:text-white transition">Buy</Link></li>
              <li><Link href="/post-listing" className="hover:text-white transition">Sell</Link></li>
              <li><Link href="/listings" className="hover:text-white transition">Find an Agent</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Plot 22, Sunrise Estate, Life Camp, Abuja.</p>
              <a href="mailto:hello@domorang.com" className="text-teal-400 hover:text-teal-300">hello@domorang.com</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
          © 2026 Domorang. All rights reserved.
        </div>
      </footer>
    </main>
  )
}