// localStorage persistence layer for Phase 1 (no backend yet).
// Shape:
// {
//   sailorr: { "2026-06-16": { sleepHours, journal, mood, checklist }, ... },
//   dora:    { ... }
// }

const STORAGE_KEY = 'dora-sailorr:data:v1'

export const PROFILES = {
  sailorr: { id: 'sailorr', name: 'Sailorr', realName: 'Krish', color: '#60a5fa' },
  dora: { id: 'dora', name: 'Dora', realName: 'Bhumika', color: '#f472b6' },
}

export const PROFILE_IDS = Object.keys(PROFILES)

/** A blank day entry. */
export function emptyEntry() {
  return {
    sleepHours: 0,
    journal: '',
    mood: 0,
    // Day's to-do checklist: [{ id, text, done }]
    checklist: [],
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { sailorr: {}, dora: {} }
    const parsed = JSON.parse(raw)
    return { sailorr: parsed.sailorr || {}, dora: parsed.dora || {} }
  } catch {
    return { sailorr: {}, dora: {} }
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Quota or privacy mode — fail silently for now.
  }
}
