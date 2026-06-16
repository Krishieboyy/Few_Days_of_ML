import { useState } from 'react'

// Highlighted "Today's checklist" for the right margin.
// Items live on today's day-entry for the active profile.
export default function TodayChecklist({ profile, items, onAdd, onToggle, onRemove }) {
  const [text, setText] = useState('')

  const done = items.filter((i) => i.done).length
  const total = items.length
  const pct = total ? Math.round((done / total) * 100) : 0

  const submit = (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onAdd(t)
    setText('')
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <aside
      className="lg:sticky lg:top-8 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl"
      style={{
        borderColor: `${profile.color}55`,
        background: `linear-gradient(160deg, ${profile.color}1f, rgba(255,255,255,0.03) 55%)`,
        boxShadow: `0 20px 50px -20px ${profile.color}66`,
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: profile.color }} />
          <h3 className="text-base font-bold tracking-tight">Today’s checklist</h3>
        </div>
        <p className="mt-1 text-xs text-white/45">{today}</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-white/55">
            {done}/{total} done
          </span>
          <span className="font-semibold" style={{ color: profile.color }}>
            {pct}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: profile.color }}
          />
        </div>
      </div>

      {/* Add item */}
      <form onSubmit={submit} className="mb-3 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task…"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                     placeholder:text-white/30 outline-none transition focus:border-violet-400/60
                     focus:bg-white/10 focus:ring-2 focus:ring-violet-400/30"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="shrink-0 rounded-xl px-3 text-lg font-bold text-white transition hover:brightness-110 active:scale-95"
          style={{ background: profile.color }}
        >
          +
        </button>
      </form>

      {/* Items */}
      {total === 0 ? (
        <p className="py-6 text-center text-sm text-white/35">
          No tasks yet. Add what you want to tackle today.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03]
                         px-3 py-2 transition hover:bg-white/[0.06]"
            >
              <button
                onClick={() => onToggle(item.id)}
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
                onClick={() => onRemove(item.id)}
                aria-label="Remove task"
                className="shrink-0 text-white/25 opacity-0 transition hover:text-white/70 group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
