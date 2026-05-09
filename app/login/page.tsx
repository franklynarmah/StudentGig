'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { getUserByCredentials, getProfileById, setUser } from '@/lib/store';

const FEATURES = [
  'Browse quick gigs, campus jobs and university roles',
  'Get your own digital Student Gigs ID with QR code',
  'Apply directly via WhatsApp or email — no middleman',
];

const TEST_ACCOUNTS = [
  { name: 'Ama Owusu',    email: 'ama.owusu@ug.edu.gh',     password: 'ama123',   role: 'Worker · Poster', hall: 'Volta' },
  { name: 'Kofi Mensah',  email: 'kofi.mensah@ug.edu.gh',   password: 'kofi123',  role: 'Worker · Poster', hall: 'Commonwealth' },
  { name: 'Afia Asante',  email: 'afia.asante@ug.edu.gh',   password: 'afia123',  role: 'Worker',          hall: 'Legon' },
  { name: 'Kwame Boateng',email: 'kwame.boateng@ug.edu.gh', password: 'kwame123', role: 'Poster',          hall: 'Mensah Sarbah' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function fillAccount(acc: typeof TEST_ACCOUNTS[0]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    const credential = getUserByCredentials(email, password);
    if (!credential) {
      setError('Invalid email or password. Try one of the test accounts below.');
      setLoading(false);
      return;
    }

    const profile = getProfileById(credential.profile_id);
    if (!profile) {
      setError('Account found but profile is missing. Please reset localStorage and try again.');
      setLoading(false);
      return;
    }

    setUser(profile);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#006B3C] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Student Gigs</span>
        </div>

        <div>
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            University of Ghana, Legon
          </p>
          <h2 className="text-white text-4xl font-bold leading-tight mb-6">
            Find work.<br />Post gigs.<br />Build your<br />campus reputation.
          </h2>
          <ul className="space-y-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/40 text-xs">© 2026 Student Gigs · University of Ghana, Legon</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 bg-white overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <Briefcase className="w-6 h-6 text-[#006B3C]" />
          <span className="font-bold text-lg text-gray-900">Student Gigs</span>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-500 text-sm">Use a test account below or enter credentials.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@ug.edu.gh"
                required
                autoFocus
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-500 flex-shrink-0 mt-0.5">⚠</span>
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006B3C] text-white font-semibold py-3 rounded-xl hover:bg-[#005530] active:scale-[0.98] transition disabled:opacity-60 text-sm"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">Test accounts</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Test account cards */}
          <div className="grid grid-cols-2 gap-2">
            {TEST_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillAccount(acc)}
                className={`text-left p-3 rounded-xl border transition ${
                  email === acc.email
                    ? 'border-[#006B3C] bg-[#e8f5ef] ring-1 ring-[#006B3C]'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                }`}
              >
                <p className="text-xs font-bold text-gray-900 truncate">{acc.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{acc.hall}</p>
                <p className="text-xs text-[#006B3C] font-medium mt-1">{acc.role}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">{acc.password}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Click any card to fill in credentials
          </p>

          {/* Browse link */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <Link
              href="/gigs"
              className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Browse gigs without signing in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
