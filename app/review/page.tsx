"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

type Word = {
  id: string;
  word: string;
  definition: string;
  example?: string;
};

export default function ReviewPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        setLoading(false);
      });
  }, []);

  const handleDifficulty = async (quality: number) => {
    const token = localStorage.getItem('token');
    const word = words[index];
    
    await fetch(`/api/words/${word.id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quality }),
    });

    setFlipped(false);
    if (index + 1 < words.length) {
      setIndex(index + 1);
    } else {
      setDone(true);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading cards...</div>;
  if (words.length === 0) return <div className="flex items-center justify-center min-h-screen text-white">No words to review today!</div>;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="text-5xl">🎉</p>
        <h2 className="text-3xl font-bold text-white">Session Complete!</h2>
        <p className="text-gray-400">You reviewed all {words.length} words. Great work!</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const w = words[index];
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Card {index + 1} of {words.length}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${((index + 1) / words.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="bg-gray-900 border border-gray-700 rounded-3xl p-10 w-full max-w-md min-h-[220px] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all text-center gap-4"
      >
        {!flipped ? (
          <>
            <p className="text-gray-500 text-sm">Tap to reveal definition</p>
            <h2 className="text-4xl font-extrabold text-white">{w.word}</h2>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-200 font-medium">{w.definition}</p>
            {w.example && <p className="text-sm text-gray-500 italic">&quot;{w.example}&quot;</p>}
          </>
        )}
      </div>

      {/* Quality Buttons 0-5 */}
      {flipped && (
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          {[0,1,2,3,4,5].map((quality) => (
            <button
              key={quality}
              onClick={() => handleDifficulty(quality)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all ${
                quality === 0 ? 'bg-red-700 hover:bg-red-600' :
                quality <= 2 ? 'bg-orange-600 hover:bg-orange-500' :
                quality <= 4 ? 'bg-yellow-500 hover:bg-yellow-400' :
                'bg-green-700 hover:bg-green-600'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
