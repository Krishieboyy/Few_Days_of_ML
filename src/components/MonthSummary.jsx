import { toKey, getMonthGrid, isSameMonth } from '../utils/date'
import EasterEgg from './EasterEgg'

// Compact stat strip for the visible month (a taste of the Phase 4 dashboard).
export default function MonthSummary({ year, month, entries, accent }) {
  const cells = getMonthGrid(year, month).filter((d) => isSameMonth(d, year, month))

  let tasksDone = 0
  let tasksTotal = 0
  let activeDays = 0
  let sleepSum = 0
  let sleepDays = 0

  for (const date of cells) {
    const e = entries[toKey(date)]
    if (!e) continue
    const list = e.checklist || []
    const done = list.filter((i) => i.done).length
    tasksDone += done
    tasksTotal += list.length
    if (done > 0) activeDays += 1
    const sl = Number(e.sleepHours) || 0
    if (sl > 0) {
      sleepSum += sl
      sleepDays += 1
    }
  }

  const avgSleep = sleepDays ? (sleepSum / sleepDays).toFixed(1) : '—'

  const stats = [
    { label: 'Active days', value: activeDays },
    { label: 'Tasks done', value: tasksDone },
    { label: 'Tasks total', value: tasksTotal },
    { label: 'Avg sleep', value: avgSleep === '—' ? '—' : `${avgSleep}h` },
  ]

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {stats.map((s) => {
        const isAvgSleep = s.label === 'Avg sleep'
        return (
          <div
            key={s.label}
            className="relative rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md"
          >
            {/* Hidden surprise perched above the Avg Sleep box */}
            {isAvgSleep && (
              <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2">
                <EasterEgg />
              </div>
            )}
            <div className="text-2xl font-bold" style={{ color: accent }}>
              {s.value}
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-white/45">
              {s.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
