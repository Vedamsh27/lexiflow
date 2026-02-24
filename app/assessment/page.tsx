"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { id: 1, word: "Ephemeral", options: ["Lasting forever", "Short-lived", "Very large", "Deeply emotional"], answer: "Short-lived" },
  { id: 2, word: "Ubiquitous", options: ["Rare", "Ancient", "Present everywhere", "Invisible"], answer: "Present everywhere" },
  { id: 3, word: "Loquacious", options: ["Silent", "Talkative", "Aggressive", "Clumsy"], answer: "Talkative" },
  { id: 4, word: "Sycophant", options: ["A flatterer", "A leader", "An inventor", "A warrior"], answer: "A flatterer" },
  { id: 5, word: "Ameliorate", options: ["Worsen", "Ignore", "Improve", "Destroy"], answer: "Improve" },
];

export default function AssessmentPage() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === questions[current].answer) setScore((s) => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) setCurrent((c) => c + 1);
      else setDone(true);
    }, 800);
  };

  const level = score >= 4 ? "Advanced" : score >= 2 ? "Intermediate" : "Beginner";

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white">Assessment Complete!</h2>
        <p className="text-gray-400 text-lg">You scored <span className="text-indigo-400 font-bold">{score}/{questions.length}</span></p>
        <div className="bg-gray-900 border border-indigo-700 rounded-2xl px-8 py-6">
          <p className="text-gray-400 text-sm">Your proficiency level</p>
          <p className="text-4xl font-extrabold text-indigo-400 mt-2">{level}</p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="w-full max-w-xl">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{Math.round(((current) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-xl flex flex-col gap-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">What does this word mean?</p>
          <h3 className="text-4xl font-extrabold text-white mt-2">{q.word}</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={!!selected}
              className={`px-4 py-3 rounded-xl border text-left font-medium transition-all
                ${selected === opt
                  ? opt === q.answer ? "bg-green-700 border-green-500 text-white" : "bg-red-800 border-red-600 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-200 hover:border-indigo-500 hover:bg-gray-700"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
