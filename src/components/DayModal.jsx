import { useEffect, useRef, useState } from 'react'
import { prettyDate } from '../utils/date'
import { emptyEntry } from '../utils/storage'
import { MOODS } from '../utils/activity'

// Detail panel for a single day. Edits a local draft and commits on Save.
export default function DayModal({ date, entry, profile, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({ ...emptyEntry(), ...entry }))
  const [taskText, setTaskText] = useState('')
  const dialogRef = useRef(null)

  // Reset the draft whenever a different day/entry opens.
  useEffect(() => {
    setDraft({ ...emptyEntry(), ...entry })
  }, [date, entry])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }))
  const num = (field, value) => set(field, value === '' ? 0 : Math.max(0, Number(value)))

  // Checklist editing (committed with the rest of the draft on Save).
  const checklist = draft.checklist ?? []
  const addTask = () => {
    const t = taskText.trim()
    if (!t) return
    setDraft((d) => ({
      ...d,
      checklist: [...(d.checklist || []), { id: crypto.randomUUID(), text: t, done: false }],
    }))
    setTaskText('')
  }
  const toggleTask = (id) =>
    setDraft((d) => ({
      ...d,
      checklist: (d.checklist || []).map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    }))
  const removeTask = (id) =>
    setDraft((d) => ({
      ...d,
      checklist: (d.checklist || []).filter((i) => i.id !== id),
    }))

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm
                 animate-fade-in sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Log for ${prettyDate(date)}`}
        className="scroll-soft animate-pop-in max-h-[92vh] w-full max-w-lg overflow-y-auto
                   rounded-t-3xl border border-white/10 bg-[#15112a]/95 p-6 shadow-2xl
                   shadow-black/50 sm:rounded-3xl"
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div
              className="mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: `${profile.color}22`, color: profile.color }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: profile.color }} />
              {profile.name}
            </div>
            <h3 className="text-lg font-bold leading-tight">{prettyDate(date)}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                       border border-white/10 bg-white/5 text-white/70 transition
                       hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Checklist */}
          <Section title="Checklist" accent="#fbbf24">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addTask()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add a task for this day…"
                className={inputCls}
              />
              <button
                type="submit"
                aria-label="Add task"
                className="shrink-0 rounded-xl px-3.5 text-lg font-bold text-white transition
                           hover:brightness-110 active:scale-95"
                style={{ background: profile.color }}
              >
                +
              </button>
            </form>

            {checklist.length > 0 && (
              <ul className="space-y-1.5">
                {checklist.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-center gap-2.5 rounded-xl border border-white/5
                               bg-white/[0.03] px-3 py-2 transition hover:bg-white/[0.06]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleTask(item.id)}
                      aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition
                                  ${item.done ? 'border-transparent text-white' : 'border-white/25 text-transparent'}`}
                      style={item.done ? { background: profile.color } : {}}
                    >
                      ✓
                    </button>
                    <span
                      className={`flex-1 text-sm transition ${
                        item.done ? 'text-white/40 line-through' : 'text-white/85'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTask(item.id)}
                      aria-label="Remove task"
                      className="shrink-0 text-white/25 opacity-0 transition hover:text-white/70 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Sleep + Mood */}
          <Section title="Wellbeing" accent="#a78bfa">
            <div className="grid grid-cols-2 items-start gap-3">
              <Field label="Sleep hours">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={draft.sleepHours || ''}
                  onChange={(e) => num('sleepHours', e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Mood / energy">
                <div className="flex items-center gap-1.5">
                  {MOODS.map((emoji, i) => {
                    const value = i + 1
                    const selected = draft.mood === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set('mood', selected ? 0 : value)}
                        aria-label={`Mood ${value}`}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition
                                    ${selected
                                      ? 'scale-110 bg-violet-500/30 ring-2 ring-violet-300/70'
                                      : 'bg-white/5 opacity-60 hover:opacity-100'}`}
                      >
                        {emoji}
                      </button>
                    )
                  })}
                </div>
              </Field>
            </div>
          </Section>

          {/* Journal */}
          <Section title="Journal" accent="#34d399">
            <textarea
              rows={3}
              value={draft.journal}
              onChange={(e) => set('journal', e.target.value)}
              placeholder="How did today go?"
              className={`${inputCls} resize-none`}
            />
          </Section>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold
                       text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5
                       text-sm font-semibold text-white shadow-lg shadow-violet-900/40
                       transition hover:from-violet-400 hover:to-fuchsia-400 active:scale-95"
          >
            Save day
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white ' +
  'placeholder:text-white/30 outline-none transition focus:border-violet-400/60 ' +
  'focus:bg-white/10 focus:ring-2 focus:ring-violet-400/30'

function Section({ title, accent, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
        <h4 className="text-xs font-bold uppercase tracking-wider text-white/55">{title}</h4>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/50">{label}</span>
      {children}
    </label>
  )
}
