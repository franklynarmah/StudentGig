'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getUser, addGig } from '@/lib/store';
import type { Gig } from '@/types';

const GIG_TYPES = ['Quick Gig', 'Campus Job', 'University Role', 'External', 'NGO'];
const PAY_TYPES = ['Fixed', 'Hourly', 'Daily', 'Monthly', 'Negotiable'];

export default function NewGigPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gigType, setGigType] = useState('Quick Gig');
  const [payType, setPayType] = useState('Fixed');
  const [payAmount, setPayAmount] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getUser()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = getUser();
    if (!user) return;

    setSubmitting(true);

    const newGig: Gig = {
      id: crypto.randomUUID(),
      poster_id: user.id,
      title: title.trim(),
      description: description.trim(),
      gig_type: gigType,
      pay_type: payType,
      pay_amount: payType !== 'Negotiable' && payAmount ? parseFloat(payAmount) : null,
      location: location.trim(),
      contact: contact.trim(),
      is_open: true,
      created_at: new Date().toISOString(),
    };

    addGig(newGig);
    router.push(`/gigs/${newGig.id}`);
  }

  if (!ready) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      <Link href="/gigs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft className="w-4 h-4" />
        Back to Gigs
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post a Gig</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details — applicants will contact you directly via WhatsApp or email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
            maxLength={120}
            placeholder="e.g. Event Ushers Needed"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">What&apos;s needed</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the gig — requirements, schedule, dress code, anything relevant…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition resize-none"
          />
        </div>

        {/* Gig type and Pay type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gig Type</label>
            <select
              value={gigType}
              onChange={e => setGigType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent bg-white"
            >
              {GIG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pay Type</label>
            <select
              value={payType}
              onChange={e => setPayType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent bg-white"
            >
              {PAY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Pay amount */}
        {payType !== 'Negotiable' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pay Amount (GHS)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 pointer-events-none">
                GHS
              </span>
              <input
                type="number"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                min="0"
                step="1"
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg pl-12 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
              />
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Great Hall, Volta Hall, Remote"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Contact{' '}
            <span className="text-gray-400 font-normal text-xs">— phone number or email</span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder="0241234567 or you@ug.edu.gh"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition"
          />
          <p className="text-xs text-gray-400 mt-1">
            Phone numbers generate a WhatsApp apply button. Emails generate a mailto link.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-full bg-[#006B3C] text-white font-semibold py-3 rounded-xl hover:bg-[#005530] transition disabled:opacity-50 text-sm"
        >
          {submitting ? 'Posting…' : 'Post Gig →'}
        </button>
      </form>
    </div>
  );
}
