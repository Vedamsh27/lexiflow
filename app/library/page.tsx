'use client';

import { useEffect, useState } from 'react';

type WordWithProgress = {
  id: string;
  word: string;
  definition: string;
  mastery: number;
  nextReview: string | null;
};

export default function LibraryPage() {
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/library', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setWords(data.words || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
      Loading library...
    </div>
  );

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Word Library</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">{words.length} words in your library.</p>
      </div>

      <input
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white w-full focus:outline-none focus:border-indigo-500"
      />

      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No words found. Start reviewing to build your library!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((w) => (
          <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white">{w.word}</h3>
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                w.mastery >= 70 ? 'bg-green-900 text-green-300' :
                w.mastery >= 40 ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {w.mastery >= 70 ? 'Mastered' : w.mastery >= 40 ? 'Learning' : 'New'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{w.definition}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    w.mastery >= 70 ? 'bg-green-500' :
                    w.mastery >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${w.mastery}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{w.mastery}%</span>
            </div>
            {w.nextReview && (
              <p className="text-xs text-gray-600">Next review: {new Date(w.nextReview).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}