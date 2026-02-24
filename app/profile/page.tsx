export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account settings.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-white">Account Info</h2>
        <div className="flex flex-col gap-4">
          {["Name", "Email"].map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">{field}</label>
              <input
                type="text"
                defaultValue={field === "Name" ? "Vedamsh" : "vedamsh@example.com"}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg w-full">
          Save Changes
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">Your Stats</h2>
        {[["Proficiency Level", "Intermediate"], ["Total Words Learned", "42"], ["Days Active", "14"]].map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="text-gray-400">{k}</span>
            <span className="text-white font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <button className="text-red-400 hover:text-red-300 text-sm text-left">
        Reset proficiency level (retake assessment)
      </button>
    </div>
  );
}
