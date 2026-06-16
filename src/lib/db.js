// Unified data layer. Uses Supabase when configured (shared, realtime sync
// across both users/devices); otherwise transparently falls back to
// localStorage so local dev and offline use keep working.
//
// Cloud schema: table `entries (profile text, date text, data jsonb,
// updated_at timestamptz, primary key (profile, date))`.

import { supabase, isCloud } from './supabase'
import { loadData, saveData, PROFILE_IDS } from '../utils/storage'

function emptyShape() {
  return PROFILE_IDS.reduce((acc, id) => ({ ...acc, [id]: {} }), {})
}

/** Load every day-entry for both profiles into the in-app shape. */
export async function fetchAll() {
  if (!isCloud) return loadData()

  const { data, error } = await supabase.from('entries').select('profile,date,data')
  if (error) {
    console.error('[db] fetchAll failed, falling back to local:', error.message)
    return loadData()
  }

  const out = emptyShape()
  for (const row of data) {
    if (!out[row.profile]) out[row.profile] = {}
    out[row.profile][row.date] = row.data
  }
  return out
}

/** Create or update a single day's entry. */
export async function upsertEntry(profile, date, entry) {
  if (!isCloud) {
    const d = loadData()
    if (!d[profile]) d[profile] = {}
    d[profile][date] = entry
    saveData(d)
    return
  }

  const { error } = await supabase
    .from('entries')
    .upsert({ profile, date, data: entry, updated_at: new Date().toISOString() })
  if (error) console.error('[db] upsert failed:', error.message)
}

/**
 * Subscribe to remote changes. Calls onChange(profile, date, entry) whenever
 * any row is inserted/updated by either user. Returns an unsubscribe fn.
 */
export function subscribe(onChange) {
  if (!isCloud) return () => {}

  const channel = supabase
    .channel('entries-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'entries' },
      (payload) => {
        const row = payload.new
        if (row?.profile && row?.date) onChange(row.profile, row.date, row.data)
      },
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
