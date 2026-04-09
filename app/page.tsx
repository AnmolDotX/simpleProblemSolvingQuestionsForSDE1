import Link from "next/link";

export default function Home() {
  const companies = [
    "STRIPE",
    "SLICE",
    "RAZORPAY",
    "CRED",
    "VERCEL",
    "SWIGGY",
    "ZOMATO",
    "PAYTM",
    "ZEPTO",
    "AIRBNB",
    "UBER",
    "DISCORD",
  ];

  return (
    <main className="min-h-screen bg-[#020604] text-zinc-300 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
      {/* <RetroGrid /> */}

      <div className="max-w-3xl text-center space-y-12 z-10 w-full mt-12">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs font-mono font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Updated for 2026 Experiences
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-medium font-montserrat tracking-tight leading-tight text-white drop-shadow-sm">
            Crack the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-300">
              Frontend
            </span>{" "}
            <br className="hidden md:block" />
            Interview.
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto font-mono mt-4">
            Curated, high-signal questions for SDE 1 UI roles. Master React
            internals, modern JavaScript, System Design, and UI-focused DSA.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/round-1"
              className="group relative flex items-center justify-center gap-3 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-montserrat rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-sm font-medium hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <span>Round 1: DSA & Logic</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>

            <Link
              href="/round-2"
              className="group flex items-center justify-center gap-3 px-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 text-white font-montserrat rounded-full transition-all duration-300"
            >
              <span>Round 2: Core Frontend</span>
              <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors">
                ⚛️
              </span>
            </Link>
          </div>

          <div className="text-xs text-zinc-600 font-mono tracking-wider">
            PROGRESS SAVED LOCALLY. NO LOGIN REQUIRED.
          </div>
        </div>

        {/* Marquee Section */}
        <div className="pt-6 pb-12 w-full flex flex-col items-center">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-[0.2em] mb-6">
            Prepare for top engineering teams
          </p>

          <div
            className="w-full max-w-5xl overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee space-x-12 whitespace-nowrap">
              {/* Double array to create infinite seamless loop */}
              {[...companies, ...companies].map((name, idx) => (
                <div
                  key={idx}
                  className="text-zinc-500 font-montserrat font-bold text-xl md:text-2xl opacity-50 flex items-center gap-12"
                >
                  {name}
                  {/* Divider dot */}
                  <span className="text-zinc-800 text-sm">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
