'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Question = {
  id: string;
  definition: string;
  answer: string;
  choices: string[];
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('/api/quiz', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      });
  }, []);

  const handleChoice = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === questions[current].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  if (loading) return <p className="text-white p-4">Loading quiz...</p>;

  if (finished) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Quiz Complete!</h1>
      <p className="text-gray-400 text-base sm:text-lg">
        You scored <span className="text-indigo-400 font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={() => {
            setCurrent(0); setScore(0); setSelected(null); setFinished(false); setLoading(true);
            const token = localStorage.getItem('token');
            fetch('/api/quiz', { headers: { Authorization: `Bearer ${token}` } })
              .then(res => res.json())
              .then(data => { setQuestions(data.questions || []); setLoading(false); });
          }}
          className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          Play Again
        </button>
        <Link href="/dashboard" className="bg-gray-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-700 text-center">
          Dashboard
        </Link>
      </div>
    </div>
  );

  const q = questions[current];

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">📝 Quiz</h1>
        <span className="text-gray-400 text-sm">{current + 1} / {questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">What word matches this definition?</p>
        <p className="text-white text-base sm:text-lg font-medium">{q.definition}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.choices.map(choice => {
          let style = 'bg-gray-900 border-gray-700 text-white hover:border-indigo-500';
          if (selected) {
            if (choice === q.answer) style = 'bg-green-950 border-green-500 text-green-300';
            else if (choice === selected) style = 'bg-red-950 border-red-500 text-red-300';
            else style = 'bg-gray-900 border-gray-700 text-gray-500';
          }
          return (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              className={`border rounded-xl p-4 text-left font-medium transition-all ${style}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {selected && (
        <button
          onClick={handleNext}
          className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 w-full"
        >
          {current + 1 >= questions.length ? 'See Results' : 'Next →'}
        </button>
      )}
    </div>
  );
}