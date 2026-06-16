// Productivity / heatmap intensity, GitHub-contribution-graph style.
// Intensity is a 0..4 bucket derived from how many checklist tasks were completed.

const HEAT_COLORS = [
  'var(--color-heat-0)',
  'var(--color-heat-1)',
  'var(--color-heat-2)',
  'var(--color-heat-3)',
  'var(--color-heat-4)',
]

/** Productivity score = number of checklist tasks completed that day. */
export function activityScore(entry) {
  if (!entry) return 0
  return (entry.checklist || []).filter((i) => i.done).length
}

/** Map completed-task count to a 0..4 intensity bucket. */
export function intensityLevel(entry) {
  const score = activityScore(entry)
  if (score <= 0) return 0
  if (score === 1) return 1
  if (score === 2) return 2
  if (score <= 4) return 3
  return 4
}

export function heatColor(level) {
  return HEAT_COLORS[level] ?? HEAT_COLORS[0]
}

/** True if the entry has any meaningful content worth flagging. */
export function hasContent(entry) {
  if (!entry) return false
  return Boolean(
    (entry.checklist || []).length ||
      entry.journal ||
      Number(entry.sleepHours) ||
      Number(entry.mood),
  )
}

export const MOODS = ['😞', '😕', '😐', '🙂', '😄']

export function moodEmoji(mood) {
  const m = Number(mood) || 0
  if (m < 1) return ''
  return MOODS[m - 1] ?? ''
}
