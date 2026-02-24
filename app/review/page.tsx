"use client";
import { useState } from "react";

const words = [
  { word: "Ephemeral", definition: "Lasting for a very short time.", example: "The ephemeral beauty of cherry blossoms." },
  { word: "Perfidious", definition: "Deceitful and untrustworthy.", example: "His perfidious nature was revealed over time." },
  { word: "Loquacious", definition: "Tending to talk a great deal.", example: "She was loquacious at every gathering." },
];

export default function ReviewPage() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const handleDifficulty = (level: string) => {
    console.log(`Word: ${words[index].word} marked as ${level}`);
    setFlipped(false);
    if (index + 1 < words.length) setIndex((i) => i + 1);
    else setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="text-5xl">🎉</p>
        <h2 className="text-3xl font-bold text-white">Session Complete!</h2>
        <p className="text-gray-400">You reviewed all {words.length} words. Great work!</p>
        <a href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold">
          Back to Dashboard
        </a>
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
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(index / words.length) * 100}%` }} />
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
            <p className="text-sm text-gray-500 italic">&quot;{w.example}&quot;</p>
          </>
        )}
      </div>

      {/* Difficulty Buttons */}
      {flipped && (
        <div className="flex gap-4">
          {[
            { label: "Hard", color: "bg-red-700 hover:bg-red-600" },
            { label: "Medium", color: "bg-yellow-600 hover:bg-yellow-500" },
            { label: "Easy", color: "bg-green-700 hover:bg-green-600" },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleDifficulty(btn.label)}
              className={`${btn.color} text-white font-semibold px-6 py-3 rounded-xl`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
