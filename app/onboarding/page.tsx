'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase } from 'lucide-react';
import { addProfile, setUser } from '@/lib/store';
import type { Profile } from '@/types';

const HALLS = [
  'Volta', 'Commonwealth', 'Akuafo', 'Mensah Sarbah',
  'Legon', 'Jean Nelson Aka', 'EFI', 'Pentagon', 'Off-campus',
];

const LEVELS = ['100', '200', '300', '400'];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none flex-shrink-0 ${on ? 'bg-[#006B3C]' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [programme, setProgramme] = useState('');
  const [level, setLevel] = useState('100');
  const [hall, setHall] = useState('Volta');
  const [studentId, setStudentId] = useState('');
  const [isWorker, setIsWorker] = useState(true);
  const [isPoster, setIsPoster] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('sg_pending_email');
    if (!email) {
      router.replace('/login');
    } else {
      setPendingEmail(email);
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!pendingEmail) return;

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      full_name: fullName.trim(),
      programme: programme.trim(),
      level,
      hall,
      student_id: studentId.trim() || null,
      is_worker: isWorker,
      is_poster: isPoster,
      available_now: false,
      member_since: new Date().toISOString(),
      email: pendingEmail,
    };

    addProfile(newProfile);
    setUser(newProfile);
    sessionStorage.removeItem('sg_pending_email');
    router.push('/dashboard');
  }

  if (!pendingEmail) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-10 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-[#006B3C]" />
          <span className="text-sm font-semibold text-[#006B3C]">Student Gigs</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Set up your profile</h1>
        <p className="text-sm text-gray-500 mt-1">Signing in as <span className="font-medium text-gray-700">{pendingEmail}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            autoFocus
            placeholder="e.g. Ama Owusu"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
          />
        </div>

        {/* Programme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Programme</label>
          <input
            type="text"
            value={programme}
            onChange={e => setProgramme(e.target.value)}
            placeholder="e.g. BSc Computer Science"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
          />
        </div>

        {/* Level and Hall */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent bg-white"
            >
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hall</label>
            <select
              value={hall}
              onChange={e => setHall(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent bg-white"
            >
              {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Student ID{' '}
            <span className="text-gray-400 font-normal text-xs">
              (optional — unlocks UG ID Verified badge)
            </span>
          </label>
          <input
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            placeholder="e.g. 10987654"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
          />
        </div>

        {/* Role toggles */}
        <div className="space-y-4 pt-1">
          <p className="text-sm font-semibold text-gray-700">Your roles on the platform</p>

          <div className="flex items-start gap-3">
            <Toggle on={isWorker} onToggle={() => setIsWorker(!isWorker)} />
            <div>
              <p className="text-sm font-medium text-gray-800">I want to find work</p>
              <p className="text-xs text-gray-500 mt-0.5">Appear in the Available Now section so employers can find you</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Toggle on={isPoster} onToggle={() => setIsPoster(!isPoster)} />
            <div>
              <p className="text-sm font-medium text-gray-800">I have work to offer</p>
              <p className="text-xs text-gray-500 mt-0.5">Post gigs and jobs for other students</p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-[#006B3C] text-white font-semibold py-2.5 rounded-lg hover:bg-[#005530] transition text-sm"
        >
          Create my profile →
        </button>
      </form>
    </div>
  );
}
