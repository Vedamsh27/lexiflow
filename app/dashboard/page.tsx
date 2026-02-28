'use client';

import { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, Flame, Star } from 'lucide-react';
import Link from 'next/link';

type Word = {
  id: string;
  word: string;
  definition: string;
};

export default function DashboardPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [streak, setStreak] = useState(0);
  const [reviewedToday, setReviewedToday] = useState(true);
  const [wordOfDay, setWordOfDay] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/daily-words', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setWords(data.words || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load words');
        setLoading(false);
      });

    fetch('/api/streak', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setStreak(data.streak ?? 0);
        setReviewedToday(data.reviewedToday ?? true);
      });

    fetch('/api/word-of-the-day', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setWordOfDay(data.word ?? null));
    fetch('/api/profile', {
  headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTotalWords(data.totalWords ?? 0));
  }, []);

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-400 p-4">{error}</p>;

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Words for Today 👋</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">You have {words.length} words to learn today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 sm:p-5 flex flex-col gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm">
            <BookOpen className="text-indigo-400 shrink-0" size={18} />
            <span className="hidden sm:inline">Due Today</span>
            <span className="sm:hidden">Due</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{words.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 sm:p-5 flex flex-col gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm">
            <TrendingUp className="text-green-400 shrink-0" size={18} />
            <span className="hidden sm:inline">Total Words</span>
            <span className="sm:hidden">Total</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{totalWords}</p>
        </div>
        <div className="bg-gray-900 border border-orange-800 rounded-2xl p-3 sm:p-5 flex flex-col gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm">
            <Flame className="text-orange-400 shrink-0" size={18} />
            <span>Streak</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{streak}<span className="text-sm sm:hidden">d</span><span className="hidden sm:inline"> {streak === 1 ? 'day' : 'days'}</span></p>
        </div>
      </div>

      {/* Streak Warning */}
      {streak > 0 && !reviewedToday && (
        <div className="bg-red-950 border border-red-700 rounded-2xl p-4 flex items-start gap-3">
          <Flame className="text-red-400 shrink-0 mt-0.5" size={20} />
          <p className="text-red-300 font-medium text-sm sm:text-base">Review today or you'll lose your {streak}-day streak!</p>
        </div>
      )}

      {/* Word of the Day */}
      {wordOfDay && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-3">
            <Star size={16} /> WORD OF THE DAY
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{wordOfDay.word}</p>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">{wordOfDay.definition}</p>
        </div>
      )}

      {/* CTA */}
      <div className="bg-indigo-900 border border-indigo-700 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Ready to review?</h3>
          <p className="text-indigo-300 text-sm mt-1">{words.length} words are waiting.</p>
        </div>
        <Link href="/review" className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 w-full sm:w-auto text-center">
          Start Review →
        </Link>
      </div>

      {/* Word List */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">📚 Today's Words</h2>
        <div className="flex flex-col gap-3">
          {words.map((w) => (
            <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 sm:px-5 py-4">
              <p className="font-semibold text-white">{w.word}</p>
              <p className="text-sm text-gray-400 mt-1">{w.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}