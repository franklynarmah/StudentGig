'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Phone } from 'lucide-react';
import { getProfileById, getGigsByPosterId } from '@/lib/store';
import SGBadge from '@/components/SGBadge';
import type { Profile, Gig } from '@/types';

const GIG_TYPE_COLORS: Record<string, string> = {
  'Quick Gig': 'bg-amber-100 text-amber-700',
  'Campus Job': 'bg-blue-100 text-blue-700',
  'University Role': 'bg-green-100 text-green-700',
  'External': 'bg-purple-100 text-purple-700',
  'NGO': 'bg-teal-100 text-teal-700',
};

function isPhoneNumber(s: string): boolean {
  return /^0[0-9]{9}$/.test(s.replace(/\s/g, ''));
}

function toWANumber(phone: string): string {
  const d = phone.replace(/\D/g, '');
  return d.startsWith('0') ? '233' + d.slice(1) : d;
}

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const p = getProfileById(id);
    if (!p) { setNotFound(true); return; }
    setProfile(p);
    setGigs(getGigsByPosterId(id).filter(g => g.is_open));
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">👤</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Profile not found</h1>
        <Link href="/gigs" className="text-[#006B3C] font-semibold hover:underline text-sm">
          ← Back to Gig Board
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const phoneContacts = gigs.map(g => g.contact).filter(isPhoneNumber);
  const waNumber = phoneContacts.length > 0 ? toWANumber(phoneContacts[0]) : null;
  const waMsg = encodeURIComponent(`Hi ${profile.full_name}, I found your profile on Student Gigs!`);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/gigs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition">
        <ChevronLeft className="w-4 h-4" />
        Back to Gigs
      </Link>

      {/* Available banner */}
      {profile.available_now && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <p className="text-sm font-semibold text-green-800">
            This student is available for work right now
          </p>
        </div>
      )}

      <SGBadge profile={profile} />

      {/* WhatsApp CTA */}
      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-3 rounded-xl hover:bg-[#1da851] transition text-sm"
        >
          <Phone className="w-4 h-4" />
          Message on WhatsApp
        </a>
      )}

      {/* Poster's open gigs */}
      {profile.is_poster && gigs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Open Gigs by {profile.full_name.split(' ')[0]}
          </h2>
          <div className="space-y-3">
            {gigs.map(gig => (
              <Link
                key={gig.id}
                href={`/gigs/${gig.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${GIG_TYPE_COLORS[gig.gig_type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {gig.gig_type}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1.5 leading-snug">{gig.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{gig.location}</p>
                  </div>
                  <span className="text-sm font-bold text-[#006B3C] whitespace-nowrap flex-shrink-0">
                    {gig.pay_type === 'Negotiable' || gig.pay_amount === null
                      ? 'Negotiable'
                      : `GHS ${gig.pay_amount}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {profile.is_poster && gigs.length === 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">No open gigs from this poster right now.</p>
        </div>
      )}
    </div>
  );
}
