'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Copy, Check, Share2, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import {
  getUser,
  setUser as persistUser,
  getGigsByPosterId,
  updateProfile,
  toggleGigOpen,
  deleteGig,
} from '@/lib/store';
import SGBadge from '@/components/SGBadge';
import type { Profile, Gig } from '@/types';

const GIG_TYPE_COLORS: Record<string, string> = {
  'Quick Gig': 'bg-amber-100 text-amber-700',
  'Campus Job': 'bg-blue-100 text-blue-700',
  'University Role': 'bg-green-100 text-green-700',
  'External': 'bg-purple-100 text-purple-700',
  'NGO': 'bg-teal-100 text-teal-700',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [copied, setCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');

  const load = useCallback(() => {
    const u = getUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u);
    setGigs(getGigsByPosterId(u.id));
  }, [router]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (user) setProfileUrl(`${window.location.origin}/profile/${user.id}`);
  }, [user]);

  function handleToggleAvailable() {
    if (!user) return;
    const updated: Profile = { ...user, available_now: !user.available_now };
    updateProfile(user.id, { available_now: updated.available_now });
    persistUser(updated);
    setUser(updated);
  }

  function copyLink() {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleToggleGig(id: string) {
    toggleGigOpen(id);
    setGigs(prev => prev.map(g => g.id === id ? { ...g, is_open: !g.is_open } : g));
  }

  function handleDeleteGig(id: string) {
    if (!confirm('Delete this gig? This cannot be undone.')) return;
    deleteGig(id);
    setGigs(prev => prev.filter(g => g.id !== id));
  }

  if (!user) return null;

  const waShareText = encodeURIComponent(`Check out my Student Gigs profile: ${profileUrl}`);
  const firstName = user.full_name.split(' ')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Hi, {firstName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Your Student Gigs dashboard</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
        {/* Left column — badge + controls */}
        <div className="space-y-4">
          <SGBadge profile={user} />

          {/* Available Now toggle */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Available Now</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user.available_now ? 'You appear in the Available Now strip' : 'Toggle on to appear in Available Now'}
                </p>
              </div>
              <button
                onClick={handleToggleAvailable}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none ${user.available_now ? 'bg-[#006B3C]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${user.available_now ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Share profile */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-2.5">
            <p className="text-sm font-semibold text-gray-800">Share your profile</p>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 w-full text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition border border-gray-200"
            >
              {copied
                ? <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                : <Copy className="w-4 h-4 text-gray-500 flex-shrink-0" />
              }
              <span>{copied ? 'Copied to clipboard!' : 'Copy profile link'}</span>
            </button>
            <a
              href={`https://wa.me/?text=${waShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full text-sm text-white bg-[#25D366] hover:bg-[#1da851] px-3 py-2 rounded-lg transition"
            >
              <Share2 className="w-4 h-4 flex-shrink-0" />
              <span>Share to WhatsApp</span>
            </a>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/gigs"
              className="text-center text-sm font-semibold text-[#006B3C] border-2 border-[#006B3C] py-2.5 rounded-xl hover:bg-[#e8f5ef] transition"
            >
              Browse Gigs →
            </Link>
            <Link
              href="/gigs/new"
              className="text-center text-sm font-semibold text-white bg-[#006B3C] py-2.5 rounded-xl hover:bg-[#005530] transition"
            >
              Post a Gig →
            </Link>
          </div>
        </div>

        {/* Right column — gigs */}
        <div>
          {user.is_poster ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">My Gigs</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{gigs.length} gig{gigs.length !== 1 ? 's' : ''} posted</p>
                </div>
                <Link
                  href="/gigs/new"
                  className="flex items-center gap-1 text-sm font-semibold text-[#006B3C] hover:opacity-80"
                >
                  <Plus className="w-4 h-4" />
                  Post new
                </Link>
              </div>

              {gigs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center">
                  <p className="text-2xl mb-3">📋</p>
                  <p className="text-gray-600 font-medium mb-1">No gigs posted yet</p>
                  <p className="text-gray-400 text-sm mb-5">Post your first gig to start receiving applications</p>
                  <Link
                    href="/gigs/new"
                    className="inline-block bg-[#006B3C] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#005530] transition"
                  >
                    Post a Gig →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {gigs.map(gig => (
                    <div
                      key={gig.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${GIG_TYPE_COLORS[gig.gig_type] ?? 'bg-gray-100 text-gray-600'}`}>
                              {gig.gig_type}
                            </span>
                            <span className={`text-xs font-semibold ${gig.is_open ? 'text-green-600' : 'text-gray-400'}`}>
                              {gig.is_open ? '● Open' : '○ Closed'}
                            </span>
                          </div>
                          <Link
                            href={`/gigs/${gig.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-[#006B3C] transition leading-snug"
                          >
                            {gig.title}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">{gig.location}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleToggleGig(gig.id)}
                            title={gig.is_open ? 'Close gig' : 'Reopen gig'}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#006B3C] hover:bg-[#e8f5ef] transition"
                          >
                            {gig.is_open
                              ? <ToggleRight className="w-5 h-5 text-[#006B3C]" />
                              : <ToggleLeft className="w-5 h-5" />
                            }
                          </button>
                          <button
                            onClick={() => handleDeleteGig(gig.id)}
                            title="Delete gig"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-2xl mb-3">🔍</p>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Looking for work?</h2>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Toggle <strong>Available Now</strong> on the left to appear in the Available Now strip so employers can find you.
                Browse the gig board to apply to open gigs.
              </p>
              <Link
                href="/gigs"
                className="inline-block text-sm font-semibold text-[#006B3C] hover:underline"
              >
                Browse open gigs →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
