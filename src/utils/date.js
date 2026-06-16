// Date helpers for the block-style calendar.
// We key every day by a local "YYYY-MM-DD" string so storage is timezone-stable.

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Format a Date as a local YYYY-MM-DD key (no UTC shifting). */
export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Today's key. */
export function todayKey() {
  return toKey(new Date())
}

/**
 * Build the 6x7 grid (42 cells) of Date objects for a given month,
 * including leading/trailing days from adjacent months so the grid is full.
 */
export function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay() // 0 (Sun) .. 6 (Sat)
  const gridStart = new Date(year, month, 1 - startOffset)

  const cells = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    cells.push(d)
  }
  return cells
}

/** "June 2026" style label. */
export function monthLabel(year, month) {
  return `${MONTHS[month]} ${year}`
}

/** Pretty long date, e.g. "Tuesday, June 16, 2026". */
export function prettyDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function isSameMonth(date, year, month) {
  return date.getFullYear() === year && date.getMonth() === month
}
