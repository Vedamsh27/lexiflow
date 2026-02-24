import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400">
        <BookOpen size={24} />
        LexiFlow
      </Link>
      <div className="flex gap-6 text-sm text-gray-300">
        <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
        <Link href="/review" className="hover:text-white">Review</Link>
        <Link href="/library" className="hover:text-white">Library</Link>
        <Link href="/profile" className="hover:text-white">Profile</Link>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1 rounded-lg">
          Login
        </Link>
      </div>
    </nav>
  );
}
