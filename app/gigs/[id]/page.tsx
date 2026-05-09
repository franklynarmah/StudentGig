'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Mail, ChevronLeft } from 'lucide-react';
import { getGigById, getProfileById } from '@/lib/store';
import SGBadge from '@/components/SGBadge';
import type { Gig, Profile } from '@/types';

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

function formatPay(gig: Gig): string {
  if (gig.pay_type === 'Negotiable' || gig.pay_amount === null) return 'Negotiable';
  const suffix: Record<string, string> = {
    Hourly: '/hr', Daily: '/day', Monthly: '/month', Fixed: ' (fixed)',
  };
  return `GHS ${gig.pay_amount}${suffix[gig.pay_type] ?? ''}`;
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export default function GigDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [gig, setGig] = useState<Gig | null>(null);
  const [poster, setPoster] = useState<Profile | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const g = getGigById(id);
    if (!g) { setNotFound(true); return; }
    setGig(g);
    setPoster(getProfileById(g.poster_id));
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Gig not found</h1>
        <p className="text-gray-500 text-sm mb-6">It may have been removed or the link is wrong.</p>
        <Link href="/gigs" className="text-[#006B3C] font-semibold hover:underline text-sm">
          ← Back to Gig Board
        </Link>
      </div>
    );
  }

  if (!gig) return null;

  const isPhone = isPhoneNumber(gig.contact);
  const isEmail = gig.contact.includes('@');
  const waUrl = isPhone
    ? `https://wa.me/${toWANumber(gig.contact)}?text=${encodeURIComponent(`Hi, I saw your gig on Student Gigs: ${gig.title}. I'd like to apply.`)}`
    : null;
  const mailUrl = isEmail
    ? `mailto:${gig.contact}?subject=${encodeURIComponent(`Application: ${gig.title}`)}&body=${encodeURIComponent(`Hi,\n\nI saw your gig on Student Gigs: "${gig.title}"\n\nI'd like to apply.`)}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/gigs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition">
        <ChevronLeft className="w-4 h-4" />
        Back to Gigs
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Badge + status */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${GIG_TYPE_COLORS[gig.gig_type] ?? 'bg-gray-100 text-gray-600'}`}>
              {gig.gig_type}
            </span>
            <span className={`flex items-center gap-1 text-xs font-medium ${gig.is_open ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${gig.is_open ? 'bg-green-500' : 'bg-gray-400'}`} />
              {gig.is_open ? 'Open' : 'Closed'}
            </span>
            <span className="text-xs text-gray-400 ml-auto">{timeAgo(gig.created_at)}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{gig.title}</h1>

          {/* Pay + location summary */}
          <div className="flex flex-wrap gap-6 bg-gray-50 rounded-xl px-4 py-3 mb-6">
            <div>
              <p className="text-xs text-gray-500 mb-0.5 font-medium">Pay</p>
              <p className="text-lg font-bold text-[#006B3C]">{formatPay(gig)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5 font-medium">Location</p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {gig.location}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">About this gig</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{gig.description}</p>
          </div>

          {/* Apply */}
          {gig.is_open && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">How to apply</h2>
              <div className="space-y-2">
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-3 rounded-xl hover:bg-[#1da851] transition text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Apply via WhatsApp
                  </a>
                )}
                {mailUrl && (
                  <a
                    href={mailUrl}
                    className="flex items-center justify-center gap-2 w-full bg-[#006B3C] text-white font-semibold py-3 rounded-xl hover:bg-[#005530] transition text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Apply via Email
                  </a>
                )}
                {!waUrl && !mailUrl && gig.contact && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-600">
                    Contact: <span className="font-medium">{gig.contact}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!gig.is_open && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 font-medium">This gig is no longer accepting applications.</p>
            </div>
          )}
        </div>

        {/* Poster sidebar */}
        {poster && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Posted by</p>
            <Link href={`/profile/${poster.id}`} className="block hover:opacity-90 transition">
              <SGBadge profile={poster} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
