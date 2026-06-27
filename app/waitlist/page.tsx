"use client"

import Link from 'next/link'

export default function WaitlistPage() {
  const GOOGLE_FORM_URL = "https://forms.gle/jbceQUC1cFN1Tp4D7"

  return (
    <main className="min-h-screen bg-slate-900">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-800">
        <div className="text-2xl font-black text-teal-400">Domorang</div>
      </header>
      {/* TAG STRIP - Moving Marquee */}
      <div className="overflow-hidden border-y border-slate-800 py-3">
        <div className="flex whitespace-nowrap animate-marquee gap-3 text-xs tracking-wider text-slate-500 uppercase">
          <span>Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆</span>
          <span>Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆ Launching Soon ◆</span>
        </div>
      </div>

      {/* HERO */}
      <section className="px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="text-sm text-slate-300">
            <span className="font-bold text-white">42 people</span> already on the list
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
          Be First When<br />
          <span className="text-teal-400">Domorang</span><br />
          Launches.
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10">
          Early access. Verified listings. No fake agents. Just real homes in Abuja done right.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => window.open(GOOGLE_FORM_URL, "_blank")}
            className="bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Join the Waitlist →
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Takes less than a minute
          </p>
        </div>
      </section>
    </main>
  )
}