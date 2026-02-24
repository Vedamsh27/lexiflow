const words = [
  { word: "Ephemeral", definition: "Short-lived", mastery: 20, level: "Advanced", due: "Today" },
  { word: "Ubiquitous", definition: "Present everywhere", mastery: 75, level: "Intermediate", due: "3 days" },
  { word: "Loquacious", definition: "Very talkative", mastery: 90, level: "Intermediate", due: "7 days" },
  { word: "Sycophant", definition: "A flatterer", mastery: 55, level: "Advanced", due: "2 days" },
  { word: "Ameliorate", definition: "To improve", mastery: 40, level: "Beginner", due: "Tomorrow" },
];

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Word Library</h1>
        <p className="text-gray-400 mt-1">All your words and their current mastery levels.</p>
      </div>

      <input
        type="text"
        placeholder="Search words..."
        className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white w-full max-w-sm focus:outline-none focus:border-indigo-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {words.map((w, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{w.word}</h3>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{w.level}</span>
            </div>
            <p className="text-gray-400 text-sm">{w.definition}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${w.mastery >= 70 ? "bg-green-500" : w.mastery >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${w.mastery}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{w.mastery}%</span>
            </div>
            <p className="text-xs text-gray-600">Next review: {w.due}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
