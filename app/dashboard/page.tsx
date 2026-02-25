'use client';

import { useEffect, useState } from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';

type Word = {
  id: string;
  word: string;
  definition: string;
};

export default function DashboardPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  if (loading) return <p className="text-white p-8">Loading...</p>;
  if (error) return <p className="text-red-400 p-8">{error}</p>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Words for Today 👋</h1>
        <p className="text-gray-400 mt-1">You have {words.length} words to learn today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <BookOpen className="text-indigo-400" size={22} /> Due Today
          </div>
          <p className="text-2xl font-extrabold text-white">{words.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <TrendingUp className="text-green-400" size={22} /> Total Words
          </div>
          <p className="text-2xl font-extrabold text-white">{words.length}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-900 border border-indigo-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to review?</h3>
          <p className="text-indigo-300 text-sm mt-1">{words.length} words are waiting.</p>
        </div>
        <Link href="/review" className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50">
          Start Review →
        </Link>
      </div>

      {/* Word List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">📚 Today's Words</h2>
        <div className="flex flex-col gap-3">
          {words.map((w) => (
            <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
              <p className="font-semibold text-white">{w.word}</p>
              <p className="text-sm text-gray-400 mt-1">{w.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
