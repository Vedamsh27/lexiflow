'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Link from 'next/link';

type DayData = {
  date: string;
  count: number;
};

export default function ChartPage() {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/chart', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(d => {
        setData(d.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white p-4">Loading chart...</p>;

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto px-4 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">📊 Progress</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Words reviewed in the last 7 days.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <p className="text-gray-400 text-sm mb-1">Total this week</p>
        <p className="text-3xl sm:text-4xl font-extrabold text-white">
          {total} <span className="text-base sm:text-lg text-gray-400 font-normal">words</span>
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.count > 0 ? '#6366f1' : '#1f2937'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Link href="/dashboard" className="text-center text-gray-400 hover:text-white text-sm">
        ← Back to Dashboard
      </Link>
    </div>
  );
}