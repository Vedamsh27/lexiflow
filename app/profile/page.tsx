'use client';

import { useEffect, useState } from 'react';

type Stats = {
  name: string;
  email: string;
  totalWords: number;
  mastered: number;
  learning: number;
  newWords: number;
};

export default function ProfilePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
      Loading profile...
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Your account and progress.</p>
      </div>

      {/* Account Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">Account Info</h2>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Name</span>
          <span className="text-white font-medium">{stats?.name || '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Email</span>
          <span className="text-white font-medium">{stats?.email || '—'}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">Your Stats</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{stats?.totalWords || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Total Seen</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-400">{stats?.mastered || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Mastered</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-400">{stats?.learning || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Learning</p>
          </div>
        </div>

        {/* Mastery progress bar */}
        {stats && stats.totalWords > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Overall Mastery</span>
              <span>{Math.round((stats.mastered / stats.totalWords) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-indigo-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.round((stats.mastered / stats.totalWords) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}