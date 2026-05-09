import type { Profile, Gig, UserCredential } from '@/types';
import seedGigsData from '@/data/gigs.json';
import seedProfilesData from '@/data/profiles.json';
import usersData from '@/data/users.json';

const seedGigs = seedGigsData as Gig[];
const seedProfiles = seedProfilesData as Profile[];
const staticUsers = usersData as UserCredential[];

const GIGS_KEY = 'sg_gigs';
const PROFILES_KEY = 'sg_profiles';
const USER_KEY = 'sg_user';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

// ── Credentials (static — never stored in localStorage) ───────────────────────

export function getUserByCredentials(email: string, password: string): UserCredential | null {
  return staticUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  ) ?? null;
}

// ── Gigs ──────────────────────────────────────────────────────────────────────

export function getGigs(): Gig[] {
  if (!isClient()) return seedGigs;
  const stored = localStorage.getItem(GIGS_KEY);
  if (stored === null) {
    localStorage.setItem(GIGS_KEY, JSON.stringify(seedGigs));
    return seedGigs;
  }
  // Ensure any new seed gigs (added in updates) are present, unless the user
  // explicitly deleted them — we track deletions via a separate key.
  const storedGigs = JSON.parse(stored) as Gig[];
  const storedIds = new Set(storedGigs.map(g => g.id));
  const missing = seedGigs.filter(g => !storedIds.has(g.id) && !isDeletedSeed(g.id));
  if (missing.length > 0) {
    const merged = [...storedGigs, ...missing];
    localStorage.setItem(GIGS_KEY, JSON.stringify(merged));
    return merged;
  }
  return storedGigs;
}

function isDeletedSeed(id: string): boolean {
  if (!isClient()) return false;
  const deleted = JSON.parse(localStorage.getItem('sg_deleted_seeds') ?? '[]') as string[];
  return deleted.includes(id);
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
  // Track seed gig deletions so they don't re-appear on merge
  const isSeed = seedGigs.some(g => g.id === id);
  if (isSeed) {
    const deleted = JSON.parse(localStorage.getItem('sg_deleted_seeds') ?? '[]') as string[];
    if (!deleted.includes(id)) {
      localStorage.setItem('sg_deleted_seeds', JSON.stringify([...deleted, id]));
    }
  }
  const gigs = getGigs().filter(g => g.id !== id);
  localStorage.setItem(GIGS_KEY, JSON.stringify(gigs));
}

// ── Profiles ──────────────────────────────────────────────────────────────────

export function getProfiles(): Profile[] {
  if (!isClient()) return seedProfiles;
  const stored = localStorage.getItem(PROFILES_KEY);
  if (stored === null) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(seedProfiles));
    return seedProfiles;
  }
  // Merge: ensure all seed profiles exist (profiles are never deleted)
  const storedProfiles = JSON.parse(stored) as Profile[];
  const storedIds = new Set(storedProfiles.map(p => p.id));
  const missing = seedProfiles.filter(p => !storedIds.has(p.id));
  if (missing.length > 0) {
    const merged = [...storedProfiles, ...missing];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(merged));
    return merged;
  }
  return storedProfiles;
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
  // Always return a fresh copy from profiles so runtime updates (available_now etc.) are reflected
  const saved = JSON.parse(stored) as Profile;
  return getProfileById(saved.id) ?? saved;
}

export function setUser(profile: Profile): void {
  if (!isClient()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

export function logout(): void {
  if (!isClient()) return;
  localStorage.removeItem(USER_KEY);
}
