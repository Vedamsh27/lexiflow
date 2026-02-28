'use client';

import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    setLoggedIn(false);
    setMenuOpen(false);
    router.push('/login');
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/review', label: 'Review' },
    { href: '/library', label: 'Library' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/chart', label: 'Progress' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400">
          <BookOpen size={24} />
          LexiFlow
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 text-sm text-gray-300 items-center">
          {loggedIn && navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
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

        {/* Hamburger button (mobile only) */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 text-sm text-gray-300 border-t border-gray-800 pt-4">
          {loggedIn && navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-left border border-gray-600 text-gray-300 px-4 py-2 rounded-lg mt-2"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}