import { Flame, Star, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Day Streak", value: "7 🔥", icon: <Flame className="text-orange-400" size={22} /> },
  { label: "Words Mastered", value: "42", icon: <Star className="text-yellow-400" size={22} /> },
  { label: "Due Today", value: "12", icon: <BookOpen className="text-indigo-400" size={22} /> },
  { label: "Retention Rate", value: "84%", icon: <TrendingUp className="text-green-400" size={22} /> },
];

const weakWords = [
  { word: "Ephemeral", mastery: 20, due: "Today" },
  { word: "Perfidious", mastery: 35, due: "Today" },
  { word: "Obstreperous", mastery: 15, due: "Overdue" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Good evening, Vedamsh 👋</h1>
        <p className="text-gray-400 mt-1">You have 12 words due for review today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">{s.icon}{s.label}</div>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-indigo-900 border border-indigo-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to review?</h3>
          <p className="text-indigo-300 text-sm mt-1">12 words are waiting. Estimated time: ~8 minutes.</p>
        </div>
        <Link href="/review" className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50">
          Start Review →
        </Link>
      </div>

      {/* Weak Words */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">⚠️ Weak Areas</h2>
        <div className="flex flex-col gap-3">
          {weakWords.map((w, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{w.word}</p>
                <p className="text-xs text-gray-500 mt-0.5">Due: {w.due}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Mastery</p>
                <p className="text-lg font-bold text-red-400">{w.mastery}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
