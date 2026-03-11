import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b14] text-[#e0e8ff] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          SDE 1 Frontend Interview Prep
        </h1>
        <p className="text-lg text-[#8fa0c0] leading-relaxed">
          The ultimate preparation guide for high-paying frontend developer
          jobs. Track your progress through core Data Structures tailored for UI
          roles, and deep-dive into JavaScript, React, and System Design.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
          <Link
            href="/round-1"
            className="flex items-center gap-3 px-6 py-4 bg-[#1a2540] hover:bg-[#2a3a5a] border border-[#2a3a5a] rounded-xl transition-all group"
          >
            <span className="text-2xl">🧮</span>
            <div className="text-left">
              <h2 className="font-bold text-[#e0e8ff] text-lg group-hover:text-blue-400 transition-colors">
                Start Round 1
              </h2>
              <p className="text-xs text-[#7a8aaa] font-mono">
                DSA & Problem Solving
              </p>
            </div>
          </Link>

          <Link
            href="/round-2"
            className="flex items-center gap-3 px-6 py-4 bg-[#1a2540] hover:bg-[#2a3a5a] border border-[#2a3a5a] rounded-xl transition-all group"
          >
            <span className="text-2xl">⚛️</span>
            <div className="text-left">
              <h2 className="font-bold text-[#e0e8ff] text-lg group-hover:text-purple-400 transition-colors">
                Start Round 2
              </h2>
              <p className="text-xs text-[#7a8aaa] font-mono">
                JS, React & System Design
              </p>
            </div>
          </Link>
        </div>

        <div className="pt-12 text-sm text-[#444d6a] font-mono">
          Progress is saved automatically in your browser.
        </div>
      </div>
    </main>
  );
}
