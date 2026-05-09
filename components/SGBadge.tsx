'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Profile } from '@/types';

interface Props {
  profile: Profile;
}

export default function SGBadge({ profile }: Props) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const profileUrl = `${origin}/profile/${profile.id}`;

  const memberSince = new Date(profile.member_since).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden w-full max-w-sm">
      {/* Header bar */}
      <div className="bg-[#006B3C] px-4 py-2.5">
        <span className="text-white font-bold text-sm tracking-wide">Student Gigs 🇬🇭</span>
      </div>

      {/* Body */}
      <div className="p-4 flex gap-4">
        {/* Profile info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{profile.full_name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {profile.programme} · Level {profile.level}
          </p>
          <p className="text-xs text-gray-500">{profile.hall} Hall</p>

          {/* Role pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {profile.is_worker && (
              <span className="inline-flex items-center bg-[#006B3C] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Worker 💼
              </span>
            )}
            {profile.is_poster && (
              <span className="inline-flex items-center bg-[#006B3C] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Poster 📋
              </span>
            )}
          </div>

          {/* Trust badge */}
          <div className="mt-2">
            {profile.student_id ? (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                ✓ UG ID Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                ✓ UG Verified
              </span>
            )}
          </div>

          {/* Available now */}
          {profile.available_now && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <span className="text-xs text-green-700 font-semibold">Available Now</span>
            </div>
          )}

          {/* Member since */}
          <p className="text-xs text-gray-400 mt-2">Since {memberSince}</p>
        </div>

        {/* QR code */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1">
          {origin ? (
            <QRCodeSVG
              value={profileUrl}
              size={80}
              bgColor="#ffffff"
              fgColor="#006B3C"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded animate-pulse" />
          )}
          <p className="text-xs text-gray-400">Scan me</p>
        </div>
      </div>

      {/* Footer strip */}
      <div className="bg-[#006B3C] px-4 py-1.5 text-center">
        <span className="text-white text-xs font-medium tracking-wide">University of Ghana, Legon</span>
      </div>
    </div>
  );
}
