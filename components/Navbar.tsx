'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Briefcase, Menu, X } from 'lucide-react';
import { getUser, logout } from '@/lib/store';
import type { Profile } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setHydrated(true);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:opacity-80 transition">
            <Briefcase className="w-5 h-5 text-[#006B3C]" />
            <span>Student Gigs</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/gigs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Gig Board
            </Link>
            {hydrated && user ? (
              <>
                <Link href="/gigs/new" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  Post a Gig
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : hydrated ? (
              <Link
                href="/login"
                className="bg-[#006B3C] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#005530] transition"
              >
                Login
              </Link>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link
              href="/gigs"
              className="text-sm font-medium text-gray-700 py-2.5 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Gig Board
            </Link>
            {user ? (
              <>
                <Link
                  href="/gigs/new"
                  className="text-sm font-medium text-gray-700 py-2.5 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Post a Gig
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 py-2.5 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-medium text-red-500 py-2.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-1 bg-[#006B3C] text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
