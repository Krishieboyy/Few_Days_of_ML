import { WEEKDAYS, getMonthGrid, toKey, todayKey, monthLabel, isSameMonth } from '../utils/date'
import CalendarDay from './CalendarDay'
import { heatColor } from '../utils/activity'

// Month view: header with navigation + the 6x7 block grid.
export default function Calendar({ year, month, entries, accent, onPrev, onNext, onToday, onSelectDay }) {
  const cells = getMonthGrid(year, month)
  const today = todayKey()

  return (
    <section
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6
                 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      {/* Month navigation */}
      <header className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {monthLabel(year, month)}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold
                       text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Today
          </button>
          <NavButton onClick={onPrev} label="Previous month">‹</NavButton>
          <NavButton onClick={onNext} label="Next month">›</NavButton>
        </div>
      </header>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-white/40">
            {d}
          </div>
        ))}
      </div>

      {/* Day blocks */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {cells.map((date) => {
          const key = toKey(date)
          return (
            <CalendarDay
              key={key}
              date={date}
              entry={entries[key]}
              inMonth={isSameMonth(date, year, month)}
              isToday={key === today}
              onClick={() => onSelectDay(date)}
            />
          )
        })}
      </div>

      {/* Legend */}
      <footer className="mt-5 flex items-center justify-end gap-2 text-[11px] text-white/45">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            className="h-3.5 w-3.5 rounded-md ring-1 ring-white/10"
            style={{ background: heatColor(lvl) }}
          />
        ))}
        <span>More</span>
        <span className="ml-2 hidden items-center gap-1 sm:inline-flex">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          activity
        </span>
      </footer>
    </section>
  )
}

function NavButton({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10
                 bg-white/5 text-lg font-bold leading-none text-white/80
                 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  )
}
