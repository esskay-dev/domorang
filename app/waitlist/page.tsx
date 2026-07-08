"use client"

import Link from 'next/link'

export default function WaitlistPage() {
  const GOOGLE_FORM_URL = "https://forms.gle/jbceQUC1cFN1Tp4D7"

  return (
    <main className="min-h-screen bg-[#d9edf0]">
      {/* HEADER */}
      <header className="bg-white border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-center">
          <span className="text-2xl font-black text-teal-600 tracking-tight">Domorang</span>
        </div>
      </header>

      {/* TAG STRIP - Moving Marquee */}
      <div className="overflow-hidden bg-teal-500 py-2.5">
        <div className="flex whitespace-nowrap animate-marquee gap-3 text-xs font-semibold tracking-wider text-white/90 uppercase">
          <span>Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆</span>
          <span>Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆</span>
        </div>
      </div>

      {/* HERO */}
      <section className="px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-teal-100 rounded-full px-5 py-2 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">65 people</span> already on the list
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Be First When<br />
          <span className="text-teal-500">Domorang</span><br />
          Launches.
        </h1>

        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10">
          Early access. Verified listings. No fake agents. Just real homes in Abuja done right.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => window.open(GOOGLE_FORM_URL, "_blank")}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transition-colors"
          >
            Join the Waitlist →
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Takes less than a minute
          </p>
        </div>
      </section>
    </main>
  )
}