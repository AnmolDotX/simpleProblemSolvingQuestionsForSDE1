import Link from "next/link";

const EXTERNAL_RESOURCES = [
  {
    href: "https://www.greatfrontend.com/interviews/gfe75",
    label: "GFE 75",
    sublabel: "GreatFrontEnd",
    desc: "75 curated frontend interview questions covering React, JavaScript, CSS, and system design.",
    tag: "Frontend Focused",
  },
  {
    href: "https://www.greatfrontend.com/interviews/blind75",
    label: "Blind 75",
    sublabel: "GreatFrontEnd",
    desc: "The classic 75 LeetCode problems every software engineer should know. Great for DSA prep.",
    tag: "DSA Classic",
  },
];

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
    "FLIPKART",
    "MEESHO",
    "GROWW",
  ];

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-zinc-300 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-stone-800/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-2xl text-center space-y-10 z-10 w-full mt-12 px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/60 border border-stone-700/30 text-stone-400 text-xs font-mono tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
          Updated for 2026 Experiences
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-semibold font-montserrat tracking-tight leading-tight text-stone-100">
            Crack the{" "}
            <span className="text-stone-300">Frontend</span>{" "}
            Interview.
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xl mx-auto font-mono mt-3">
            Curated, high-signal questions for SDE 1 UI roles. Master React
            internals, modern JavaScript, system design, and machine coding.
          </p>
        </div>

        {/* Primary CTA — Flipkart Prep */}
        <div className="w-full text-left">
          <Link
            href="/flipkart"
            className="group flex items-center gap-4 px-5 py-4 rounded-lg border transition-all duration-200"
            style={{
              background: "#161412",
              borderColor: "#3a3028",
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-stone-200 font-semibold text-sm font-montserrat">
                  Flipkart SDE 1 Prep
                </span>
                <span className="text-stone-500 text-xs font-mono">
                  · Latest Interview Questions
                </span>
                <span className="ml-auto text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-900/30 text-amber-500/80 border border-amber-800/30 tracking-widest">
                  HOT · 2026
                </span>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                JavaScript core, React hooks, Redux, system design, machine coding, and behavioral — all from real Flipkart SDE 1 interviews.
              </p>
            </div>
            <span className="text-stone-600 group-hover:text-stone-300 transition-colors text-sm flex-shrink-0">
              →
            </span>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-stone-800/60" />
          <span className="text-stone-600 text-[10px] font-mono tracking-widest">ALSO EXPLORE</span>
          <div className="flex-1 h-px bg-stone-800/60" />
        </div>

        {/* External Resources */}
        <div className="w-full flex flex-col gap-3 text-left">
          {EXTERNAL_RESOURCES.map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-4 rounded-lg border transition-all duration-200"
              style={{
                background: "#111",
                borderColor: "#1e1e1e",
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-stone-300 font-medium text-sm font-montserrat">
                    {r.label}
                  </span>
                  <span className="text-stone-600 text-xs font-mono">
                    · {r.sublabel}
                  </span>
                  <span className="ml-auto text-[9px] font-mono text-stone-600 tracking-widest">
                    {r.tag}
                  </span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed line-clamp-1">
                  {r.desc}
                </p>
              </div>
              <span className="text-stone-700 group-hover:text-stone-400 transition-colors text-xs flex-shrink-0 font-mono">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="text-[10px] text-stone-700 font-mono tracking-widest pb-2">
          PROGRESS SAVED LOCALLY · NO LOGIN REQUIRED
        </div>

        {/* Marquee */}
        <div className="pb-12 w-full flex flex-col items-center">
          <p className="text-[10px] text-stone-700 font-mono uppercase tracking-[0.2em] mb-5">
            Prepare for top engineering teams
          </p>

          <div
            className="w-full max-w-2xl overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee space-x-10 whitespace-nowrap">
              {[...companies, ...companies].map((name, idx) => (
                <div
                  key={idx}
                  className="text-stone-700 font-montserrat font-semibold text-base md:text-lg flex items-center gap-10"
                >
                  {name}
                  <span className="text-stone-800 text-xs">·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
