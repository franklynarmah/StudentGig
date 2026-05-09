'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, CheckCircle } from 'lucide-react';
import { getProfiles, setUser } from '@/lib/store';

const FEATURES = [
  'Browse quick gigs, campus jobs and university roles',
  'Get your own digital Student Gigs ID with QR code',
  'Apply directly via WhatsApp or email — no middleman',
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmed = email.trim().toLowerCase();

    if (!trimmed.endsWith('@ug.edu.gh')) {
      setError('Student Gigs is for UG Legon students only. Use your @ug.edu.gh email.');
      return;
    }

    setLoading(true);

    const profiles = getProfiles();
    const existing = profiles.find(p => p.email?.toLowerCase() === trimmed);

    if (existing) {
      setUser(existing);
      router.push('/dashboard');
    } else {
      sessionStorage.setItem('sg_pending_email', trimmed);
      router.push('/onboarding');
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">

      {/* ── Left panel (branding) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#006B3C] flex-col justify-between p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Student Gigs</span>
        </div>

        {/* Main copy */}
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

        {/* Footer */}
        <p className="text-white/40 text-xs">
          © 2026 Student Gigs · University of Ghana, Legon
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 bg-white">

        {/* Mobile-only logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <Briefcase className="w-6 h-6 text-[#006B3C]" />
          <span className="font-bold text-lg text-gray-900">Student Gigs</span>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-500 text-sm">
              Enter your UG student email to get started.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@ug.edu.gh"
                required
                autoFocus
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-2">
                Must end in <span className="font-medium text-gray-500">@ug.edu.gh</span>
              </p>
            </div>

            {error && (
              <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-500 text-base leading-none mt-0.5 flex-shrink-0">⚠</span>
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006B3C] text-white font-semibold py-3 rounded-xl hover:bg-[#005530] active:scale-[0.98] transition disabled:opacity-60 text-sm"
            >
              {loading ? 'Signing in…' : 'Continue →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Browse link */}
          <Link
            href="/gigs"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Browse gigs without signing in
          </Link>

          {/* Fine print */}
          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
            No password needed. First time here?<br />We&apos;ll set up your profile in 30 seconds.
          </p>
        </div>
      </div>

    </div>
  );
}
