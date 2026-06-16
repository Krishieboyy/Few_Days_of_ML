import { intensityLevel, heatColor, moodEmoji } from '../utils/activity'

// A single clickable day "block" in the month grid.
export default function CalendarDay({ date, entry, inMonth, isToday, onClick }) {
  const level = intensityLevel(entry)
  const sleep = Number(entry?.sleepHours) || 0
  const mood = moodEmoji(entry?.mood)

  const checklist = entry?.checklist ?? []
  const doneCount = checklist.filter((i) => i.done).length
  const preview = checklist.slice(0, 2)

  return (
    <button
      onClick={onClick}
      style={{ background: heatColor(level) }}
      className={`group relative flex aspect-square sm:aspect-auto sm:min-h-[120px] flex-col
                  overflow-hidden rounded-2xl p-2 text-left
                  ring-1 transition-all duration-200 ease-out
                  hover:-translate-y-0.5 hover:ring-2 hover:ring-violet-300/70
                  hover:shadow-lg hover:shadow-violet-900/40
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300
                  ${inMonth ? 'ring-white/10' : 'opacity-35 ring-white/5'}
                  ${isToday ? 'ring-2 ring-violet-300/80' : ''}`}
    >
      {/* Date number + tasks badge */}
      <div className="flex items-start justify-between">
        <span
          className={`text-sm font-semibold leading-none
                      ${level >= 3 ? 'text-white' : 'text-white/80'}
                      ${isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-violet-400 text-white' : ''}`}
        >
          {date.getDate()}
        </span>
        <div className="flex items-center gap-1">
          {checklist.length > 0 && (
            <span
              className={`rounded-md px-1 text-[9px] font-semibold leading-tight
                          ${doneCount === checklist.length ? 'bg-emerald-400/25 text-emerald-200' : 'bg-white/15 text-white/80'}`}
              title="Tasks done"
            >
              ☑ {doneCount}/{checklist.length}
            </span>
          )}
          {mood && <span className="text-xs leading-none">{mood}</span>}
        </div>
      </div>

      {/* Checklist peek (sm+ where there's room) */}
      {preview.length > 0 && (
        <ul className="mt-2 hidden space-y-1 sm:block">
          {preview.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-1.5 rounded-md bg-black/20 px-1.5 py-0.5 leading-tight"
            >
              <span className={`text-[11px] ${item.done ? 'text-emerald-300' : 'text-white/55'}`}>
                {item.done ? '✓' : '○'}
              </span>
              <span
                className={`truncate text-[11px] ${
                  item.done ? 'text-white/45 line-through' : 'text-white/90'
                }`}
              >
                {item.text}
              </span>
            </li>
          ))}
          {checklist.length > 2 && (
            <li className="pl-1.5 text-[10px] font-medium text-white/50">
              +{checklist.length - 2} more
            </li>
          )}
        </ul>
      )}

      {/* Mini indicators */}
      {sleep > 0 && (
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-1 text-[10px] font-medium text-white/85">
          <span className="inline-flex items-center gap-0.5 text-white/70" title="Sleep hours">
            🌙<span>{sleep}h</span>
          </span>
        </div>
      )}
    </button>
  )
}
