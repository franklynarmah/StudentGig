'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getGigs, getProfiles } from '@/lib/store';
import type { Gig, Profile } from '@/types';

const GIG_TYPES = ['All', 'Quick Gig', 'Campus Job', 'University Role', 'External', 'NGO'];
const PAY_TYPES = ['All', 'Hourly', 'Daily', 'Fixed', 'Monthly', 'Negotiable'];

const GIG_TYPE_COLORS: Record<string, string> = {
  'Quick Gig': 'bg-amber-100 text-amber-700',
  'Campus Job': 'bg-blue-100 text-blue-700',
  'University Role': 'bg-green-100 text-green-700',
  'External': 'bg-purple-100 text-purple-700',
  'NGO': 'bg-teal-100 text-teal-700',
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function formatPay(gig: Gig): string {
  if (gig.pay_type === 'Negotiable' || gig.pay_amount === null) return 'Negotiable';
  const suffix: Record<string, string> = {
    Hourly: '/hr', Daily: '/day', Monthly: '/mo', Fixed: ' fixed',
  };
  return `GHS ${gig.pay_amount}${suffix[gig.pay_type] ?? ''}`;
}

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [gigType, setGigType] = useState('All');
  const [payType, setPayType] = useState('All');

  useEffect(() => {
    setGigs(getGigs());
    setProfiles(getProfiles());
  }, []);

  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));

  const availableWorkers = profiles.filter(p => p.available_now && p.is_worker);

  const filtered = gigs.filter(g => {
    if (!g.is_open) return false;
    if (gigType !== 'All' && g.gig_type !== gigType) return false;
    if (payType !== 'All' && g.pay_type !== payType) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gig Board</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} open gig{filtered.length !== 1 ? 's' : ''} at UG Legon
        </p>
      </div>

      {/* Available Now strip */}
      {availableWorkers.length > 0 && (
        <section className="mb-7">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Available Now
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {availableWorkers.map(p => (
              <Link
                key={p.id}
                href={`/profile/${p.id}`}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-[#006B3C]/30 transition w-44"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <span className="text-xs text-green-700 font-medium">Available</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{p.full_name}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{p.programme || 'UG Student'}</p>
                <p className="text-xs text-gray-400">{p.hall} Hall</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.is_worker && (
                    <span className="bg-[#e8f5ef] text-[#006B3C] text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Worker
                    </span>
                  )}
                  {p.is_poster && (
                    <span className="bg-[#e8f5ef] text-[#006B3C] text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Poster
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gig Type</p>
          <div className="flex flex-wrap gap-2">
            {GIG_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setGigType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                  gigType === t
                    ? 'bg-[#006B3C] text-white border-[#006B3C]'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pay Type</p>
          <div className="flex flex-wrap gap-2">
            {PAY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setPayType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                  payType === t
                    ? 'bg-[#006B3C] text-white border-[#006B3C]'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gig cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-semibold">No gigs match your filters</p>
          <p className="text-sm mt-1">Try selecting &quot;All&quot; to see everything</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(gig => {
            const poster = profileMap[gig.poster_id];
            return (
              <Link
                key={gig.id}
                href={`/gigs/${gig.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${GIG_TYPE_COLORS[gig.gig_type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {gig.gig_type}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 leading-snug mb-1">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {gig.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-sm font-bold text-[#006B3C]">{formatPay(gig)}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {gig.location}
                      </span>
                      {poster && (
                        <span className="text-xs text-gray-400">
                          by {poster.full_name}, {poster.hall} Hall
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 pt-0.5">{timeAgo(gig.created_at)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Post CTA */}
      <div className="mt-8 bg-[#e8f5ef] border border-[#006B3C]/20 rounded-2xl p-6 text-center">
        <p className="text-gray-800 font-semibold mb-1">Have work to offer?</p>
        <p className="text-gray-500 text-sm mb-4">Post a gig and get responses via WhatsApp or email</p>
        <Link
          href="/gigs/new"
          className="inline-block bg-[#006B3C] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#005530] transition text-sm"
        >
          Post a Gig →
        </Link>
      </div>
    </div>
  );
}
