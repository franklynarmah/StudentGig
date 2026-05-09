import type { Profile, Gig } from '@/types';
import seedGigsData from '@/data/gigs.json';
import seedProfilesData from '@/data/profiles.json';

const seedGigs = seedGigsData as Gig[];
const seedProfiles = seedProfilesData as Profile[];

const GIGS_KEY = 'sg_gigs';
const PROFILES_KEY = 'sg_profiles';
const USER_KEY = 'sg_user';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

// ── Gigs ──────────────────────────────────────────────────────────────────────

export function getGigs(): Gig[] {
  if (!isClient()) return [];
  const stored = localStorage.getItem(GIGS_KEY);
  if (stored === null) {
    localStorage.setItem(GIGS_KEY, JSON.stringify(seedGigs));
    return seedGigs;
  }
  return JSON.parse(stored) as Gig[];
}

export function addGig(gig: Gig): void {
  if (!isClient()) return;
  const gigs = getGigs();
  gigs.unshift(gig);
  localStorage.setItem(GIGS_KEY, JSON.stringify(gigs));
}

export function getGigById(id: string): Gig | null {
  return getGigs().find(g => g.id === id) ?? null;
}

export function getGigsByPosterId(id: string): Gig[] {
  return getGigs().filter(g => g.poster_id === id);
}

export function toggleGigOpen(id: string): void {
  if (!isClient()) return;
  const gigs = getGigs().map(g => g.id === id ? { ...g, is_open: !g.is_open } : g);
  localStorage.setItem(GIGS_KEY, JSON.stringify(gigs));
}

export function deleteGig(id: string): void {
  if (!isClient()) return;
  const gigs = getGigs().filter(g => g.id !== id);
  localStorage.setItem(GIGS_KEY, JSON.stringify(gigs));
}

// ── Profiles ──────────────────────────────────────────────────────────────────

export function getProfiles(): Profile[] {
  if (!isClient()) return [];
  const stored = localStorage.getItem(PROFILES_KEY);
  if (stored === null) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(seedProfiles));
    return seedProfiles;
  }
  return JSON.parse(stored) as Profile[];
}

export function addProfile(profile: Profile): void {
  if (!isClient()) return;
  const profiles = getProfiles();
  profiles.push(profile);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function updateProfile(id: string, updates: Partial<Profile>): void {
  if (!isClient()) return;
  const profiles = getProfiles().map(p => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getProfileById(id: string): Profile | null {
  return getProfiles().find(p => p.id === id) ?? null;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function getUser(): Profile | null {
  if (!isClient()) return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  return JSON.parse(stored) as Profile;
}

export function setUser(profile: Profile): void {
  if (!isClient()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

export function logout(): void {
  if (!isClient()) return;
  localStorage.removeItem(USER_KEY);
}
