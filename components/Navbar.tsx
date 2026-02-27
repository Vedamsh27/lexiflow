'use client';

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400">
        <BookOpen size={24} />
        LexiFlow
      </Link>
      <div className="flex gap-6 text-sm text-gray-300 items-center">
        <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
        <Link href="/review" className="hover:text-white">Review</Link>
        <Link href="/library" className="hover:text-white">Library</Link>
        <Link href="/quiz" className="hover:text-white">Quiz</Link>
        <Link href="/chart" className="hover:text-white">Progress</Link>
        <Link href="/profile" className="hover:text-white">Profile</Link>
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-4 py-1 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1 rounded-lg">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}