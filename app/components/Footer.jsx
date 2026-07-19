import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d1526] text-gray-400">
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {/* Brand + description */}
        <div>
          <h3 className="text-2xl font-bold text-[#7fb8c9] mb-4">Domorang</h3>
          <p className="leading-relaxed text-gray-400 max-w-xs">
            Domorang is committed to making property transactions safer, more
            transparent, and more trustworthy. Through rigorous verification,
            clear information, and accountability-driven processes, we help
            people find homes with greater confidence.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold tracking-wide mb-4">
            QUICK LINKS
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/rent" className="hover:text-[#7fb8c9]">
                Rent
              </Link>
            </li>
            <li>
              <Link href="/buy" className="hover:text-[#7fb8c9]">
                Buy
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-[#7fb8c9]">
                Sell
              </Link>
            </li>
            <li>
              <Link href="/find-an-agent" className="hover:text-[#7fb8c9]">
                Find an Agent
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold tracking-wide mb-4">
            CONTACT
          </h4>
          <p className="leading-relaxed mb-3">
            No. 72, Obasanjo Road, Freedom Avenue, Dutse-Bwari, Bwari Area
            Council, FCT, Abuja, Nigeria.
          </p>
          <a
            href="mailto:hello@domorang.com"
            className="text-[#7fb8c9] hover:underline"
          >
            hello@domorang.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Domorang. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#7fb8c9]">
              Privacy Policy
            </Link>
            {/* <Link href="/terms">Terms of Service</Link> once you have one */}
          </div>
        </div>
      </div>
    </footer>
  );
}