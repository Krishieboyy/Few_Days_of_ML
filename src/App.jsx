import { useEffect, useMemo, useState } from 'react'
import Calendar from './components/Calendar'
import DayModal from './components/DayModal'
import ProfileSwitcher from './components/ProfileSwitcher'
import MonthSummary from './components/MonthSummary'
import TodayChecklist from './components/TodayChecklist'
import { PROFILES } from './utils/storage'
import { loadData, saveData, emptyEntry } from './utils/storage'
import { toKey, todayKey } from './utils/date'

export default function App() {
  // Persisted study data for both profiles.
  const [data, setData] = useState(loadData)
  const [profileId, setProfileId] = useState('sailorr')

  // Visible month.
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })

  // Selected day (Date object) -> opens the modal.
  const [selected, setSelected] = useState(null)

  // Theme (dark by default per the aesthetic direction).
  const [dark, setDark] = useState(true)

  // Persist on every data change.
  useEffect(() => {
    saveData(data)
  }, [data])

  // Reflect theme on <html>.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const profile = PROFILES[profileId]
  const entries = data[profileId] || {}

  const prevMonth = () =>
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }))
  const nextMonth = () =>
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }))
  const goToday = () => setView({ year: now.getFullYear(), month: now.getMonth() })

  const saveDay = (entry) => {
    if (!selected) return
    const key = toKey(selected)
    setData((d) => ({
      ...d,
      [profileId]: { ...d[profileId], [key]: entry },
    }))
  }

  const selectedEntry = useMemo(
    () => (selected ? entries[toKey(selected)] ?? emptyEntry() : null),
    [selected, entries],
  )

  // ---- Today's checklist (lives on today's day-entry per profile) ----
  const todayItems = entries[todayKey()]?.checklist ?? []

  const mutateToday = (mutate) => {
    const key = todayKey()
    setData((d) => {
      const profEntries = d[profileId] || {}
      const existing = { ...emptyEntry(), ...profEntries[key] }
      const updated = mutate(existing)
      return { ...d, [profileId]: { ...profEntries, [key]: updated } }
    })
  }

  const addTask = (text) =>
    mutateToday((e) => ({
      ...e,
      checklist: [...(e.checklist || []), { id: crypto.randomUUID(), text, done: false }],
    }))

  const toggleTask = (id) =>
    mutateToday((e) => ({
      ...e,
      checklist: (e.checklist || []).map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    }))

  const removeTask = (id) =>
    mutateToday((e) => ({
      ...e,
      checklist: (e.checklist || []).filter((i) => i.id !== id),
    }))

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #f0abfc)' }}
            >
              D&S
            </div>
            <div>
              <h1 className="text-2xl font-extrabold leading-none tracking-tight">
                Dora <span className="text-white/40">&amp;</span> Sailorr
              </h1>
              <p className="mt-1 text-xs text-white/45">Shared study tracker · DSA + ML</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProfileSwitcher active={profileId} onChange={setProfileId} />
            <button
              onClick={() => setDark((v) => !v)}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10
                         bg-white/5 text-base transition hover:bg-white/10"
            >
              {dark ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {/* Calendar on the left, highlighted checklist on the right margin */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <p className="text-sm text-white/55">
              Viewing{' '}
              <span className="font-semibold" style={{ color: profile.color }}>
                {profile.name}
              </span>
              ’s month — click any day to log your progress.
            </p>

            <MonthSummary
              year={view.year}
              month={view.month}
              entries={entries}
              accent={profile.color}
            />

            <Calendar
              year={view.year}
              month={view.month}
              entries={entries}
              accent={profile.color}
              onPrev={prevMonth}
              onNext={nextMonth}
              onToday={goToday}
              onSelectDay={setSelected}
            />

            <footer className="pt-2 text-center text-xs text-white/30">
              Saved locally on this device · sleep charts &amp; stats coming next
            </footer>
          </main>

          <TodayChecklist
            profile={profile}
            items={todayItems}
            onAdd={addTask}
            onToggle={toggleTask}
            onRemove={removeTask}
          />
        </div>
      </div>

      {selected && (
        <DayModal
          date={selected}
          entry={selectedEntry}
          profile={profile}
          onSave={saveDay}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
