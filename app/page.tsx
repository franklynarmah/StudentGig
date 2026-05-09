import Link from 'next/link';
import { Briefcase, IdCard } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 flex-1 flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center w-full">
          <div className="inline-flex items-center gap-2 bg-[#e8f5ef] text-[#006B3C] text-sm font-medium px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#006B3C]" />
            University of Ghana, Legon
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Student Gigs
          </h1>

          <p className="text-xl sm:text-2xl text-[#006B3C] font-semibold mb-3">
            Find work. Post gigs. Build your campus reputation.
          </p>

          <p className="text-gray-500 text-base max-w-lg mx-auto mb-10">
            The gig and jobs platform for University of Ghana, Legon students.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/gigs"
              className="bg-[#006B3C] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#005530] transition text-base"
            >
              Find Work →
            </Link>
            <Link
              href="/login"
              className="border-2 border-[#006B3C] text-[#006B3C] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#e8f5ef] transition text-base"
            >
              Post a Gig →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-11 h-11 bg-[#e8f5ef] rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-[#006B3C]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Gig Board</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Browse quick gigs, campus jobs, and university roles posted by students and verified employers.
              </p>
              <Link href="/gigs" className="inline-block mt-4 text-sm font-semibold text-[#006B3C] hover:underline">
                Browse gigs →
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-11 h-11 bg-[#e8f5ef] rounded-xl flex items-center justify-center mb-4">
                <IdCard className="w-5 h-5 text-[#006B3C]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Student Gigs ID</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every student gets a verified digital identity badge with a QR code. Share it on WhatsApp. Build a work record that follows you after graduation.
              </p>
              <Link href="/login" className="inline-block mt-4 text-sm font-semibold text-[#006B3C] hover:underline">
                Get your badge →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        University of Ghana, Legon · Student Gigs · 2026
      </footer>
    </div>
  );
}
