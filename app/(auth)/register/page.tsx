'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      return;
    }

    // After successful register, go to login so user can sign in
    router.push('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="text-gray-400 text-sm mt-1">Start building your vocabulary today</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Vedamsh"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
