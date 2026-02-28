import Link from "next/link";
import { Brain, Zap, BarChart2, Calendar } from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: <Brain size={28} />, title: "Smart Assessment", desc: "Takes a quiz to detect your vocabulary level automatically." },
    { icon: <Zap size={28} />, title: "Spaced Repetition", desc: "Words are scheduled based on how well you know them." },
    { icon: <BarChart2 size={28} />, title: "Progress Tracking", desc: "See your mastery score, streaks, and weak areas clearly." },
    { icon: <Calendar size={28} />, title: "Daily Reviews", desc: "Only shows words that are due today — no wasted time." },
  ];

  return (
    <div className="flex flex-col items-center text-center gap-12 py-8 px-4">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4">
        <span className="bg-indigo-900 text-indigo-300 text-sm px-4 py-1 rounded-full">
          Adaptive Learning Engine
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          Learn Vocabulary<br />
          <span className="text-indigo-400">That Actually Sticks</span>
        </h1>
        <p className="text-gray-400 max-w-lg text-base sm:text-lg">
          LexiFlow uses spaced repetition to schedule your reviews at the perfect time — so you remember more with less effort.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
  <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-base sm:text-lg text-center">
    🚀 Start Learning
  </Link>
  <Link href="/login" className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-xl font-semibold text-base sm:text-lg text-center">
  Already a member? Login
  </Link>
</div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left flex gap-4">
            <div className="text-indigo-400 mt-1 shrink-0">{f.icon}</div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">{f.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}