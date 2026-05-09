'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { getProfiles, setUser } from '@/lib/store';

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
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 justify-center mb-3">
            <Briefcase className="w-7 h-7 text-[#006B3C]" />
            <span className="text-2xl font-bold text-gray-900">Student Gigs</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mt-1">Use your UG student email to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Student Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="yourname@ug.edu.gh"
              required
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006B3C] text-white font-semibold py-2.5 rounded-lg hover:bg-[#005530] transition disabled:opacity-60 text-sm"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-xs text-gray-400 text-center pt-1">
            No password needed. First time? We'll set up your profile.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Just browsing?{' '}
          <Link href="/gigs" className="text-[#006B3C] font-medium hover:underline">
            Browse gigs without signing in →
          </Link>
        </p>
      </div>
    </div>
  );
}
