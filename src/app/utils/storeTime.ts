import { useStoreTime, TimeInterval } from '../store/opentimeStore'

function getTodayKey(): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date().getDay()]
}

// Helper to get store hours from Zustand (structure already updated in store)
function getStoreHoursFromZustand(): Record<
  string,
  { intervals: TimeInterval[]; closed?: boolean } | null
> {
  const hoursArr = useStoreTime.getState().hours
  const map: Record<
    string,
    { intervals: TimeInterval[]; closed?: boolean } | null
  > = {
    Mon: null,
    Tue: null,
    Wed: null,
    Thu: null,
    Fri: null,
    Sat: null,
    Sun: null,
  }
  const dayMap: Record<string, string> = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
  }

  hoursArr.forEach((h) => {
    const key = dayMap[h.day] || h.day?.slice(0, 3)
    if (key && key in map) {
      // Store the intervals array and closed status
      map[key] = { intervals: h.intervals || [], closed: !!h.closed }
    } else {
      console.warn(`Unrecognized or invalid day in store hours: ${h.day}`)
    }
  })
  return map
}

// Checks if the store is marked closed or has no valid open intervals today
export function isStoreClosedAllDay(): boolean {
  const storeHours = getStoreHoursFromZustand()
  const todayKey = getTodayKey()
  const dayInfo = storeHours[todayKey]

  // Closed if no info for the day, or explicitly marked closed,
  // or has no intervals, or all intervals are invalid/empty.
  return (
    !dayInfo ||
    dayInfo.closed === true ||
    !dayInfo.intervals ||
    dayInfo.intervals.length === 0 ||
    dayInfo.intervals.every((int) => !int.open || !int.close) // Check if all intervals are effectively empty
  )
}

// Basic HH:MM format validation
function isValidTimeFormat(timeStr: string): boolean {
  return !!timeStr && /^\d{2}:\d{2}$/.test(timeStr)
}

// Checks if the store is open *within any interval* right now
export function isStoreOpenNow(): boolean {
  const storeHours = getStoreHoursFromZustand()
  const todayKey = getTodayKey()
  const dayInfo = storeHours[todayKey]

  // Definitely closed if no info, marked closed, or no intervals
  if (
    !dayInfo ||
    dayInfo.closed ||
    !dayInfo.intervals ||
    dayInfo.intervals.length === 0
  ) {
    return false
  }

  const now = new Date()
  const currentH = now.getHours().toString().padStart(2, '0')
  const currentM = now.getMinutes().toString().padStart(2, '0')
  const currentTimeStr = `${currentH}:${currentM}`

  // Check if the current time falls within *any* valid interval for today
  for (const interval of dayInfo.intervals) {
    if (
      !isValidTimeFormat(interval.open) ||
      !isValidTimeFormat(interval.close)
    ) {
      console.warn('Skipping invalid interval format:', interval)
      continue // Skip invalid intervals
    }

    // Assuming intervals do not cross midnight for simplicity here.
    // If overnight intervals are possible *within a single interval definition* (e.g., 22:00-03:00), this logic needs adjustment.
    // But typically multiple intervals handle this (e.g., 09:00-17:00, 19:00-23:00).
    if (interval.open <= interval.close) {
      // Standard interval (e.g., 09:00 - 17:00)
      if (currentTimeStr >= interval.open && currentTimeStr < interval.close) {
        return true // Currently within this interval
      }
    } else {
      // This would be an overnight interval (e.g. 21:00 - 02:00), which is complex.
      // For multiple intervals per day, it's often better to keep intervals within the same day.
      // If you need overnight logic for a *single* interval, add it here.
      // Example for overnight: if (currentTimeStr >= interval.open || currentTimeStr < interval.close) return true;
      console.warn(
        'Overnight interval detected (e.g., 21:00-02:00). isStoreOpenNow logic might need adjustment for this case.'
      )
      if (currentTimeStr >= interval.open || currentTimeStr < interval.close) {
        return true
      }
    }
  }

  return false // Current time is not within any valid interval
}

// Gets the closing time of the *current* interval if open, otherwise null.
// Or maybe the *last* closing time of the day? Let's try current interval first.
export function getCurrentIntervalCloseTime(): string | null {
  const storeHours = getStoreHoursFromZustand()
  const todayKey = getTodayKey()
  const dayInfo = storeHours[todayKey]

  if (
    !dayInfo ||
    dayInfo.closed ||
    !dayInfo.intervals ||
    dayInfo.intervals.length === 0
  ) {
    return null
  }

  const now = new Date()
  const currentH = now.getHours().toString().padStart(2, '0')
  const currentM = now.getMinutes().toString().padStart(2, '0')
  const currentTimeStr = `${currentH}:${currentM}`

  for (const interval of dayInfo.intervals) {
    if (
      !isValidTimeFormat(interval.open) ||
      !isValidTimeFormat(interval.close)
    ) {
      continue
    }

    // Simplified check assuming non-overnight intervals:
    if (interval.open <= interval.close) {
      if (currentTimeStr >= interval.open && currentTimeStr < interval.close) {
        return interval.close // Return closing time of the current interval
      }
    } else {
      // Handle overnight case if needed
      if (currentTimeStr >= interval.open || currentTimeStr < interval.close) {
        return interval.close
      }
    }
  }

  return null // Not currently in any open interval
}

// Gets the next opening day and time (HH:MM) or null if never opens
export function getNextOpenTime(): { day: string; time: string } | null {
  const storeHours = getStoreHoursFromZustand()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const currentDayIndex = now.getDay()
  const currentH = now.getHours().toString().padStart(2, '0')
  const currentM = now.getMinutes().toString().padStart(2, '0')
  const currentTimeStr = `${currentH}:${currentM}`

  // Function to find the first valid opening time in a day's intervals after a certain time
  const findNextInterval = (
    dayInfo: { intervals: TimeInterval[]; closed?: boolean } | null,
    fromTime: string
  ): string | null => {
    if (!dayInfo || dayInfo.closed || !dayInfo.intervals) return null
    // Sort intervals by open time to ensure we get the earliest one
    const sortedIntervals = [...dayInfo.intervals].sort((a, b) =>
      a.open.localeCompare(b.open)
    )
    for (const interval of sortedIntervals) {
      if (isValidTimeFormat(interval.open) && interval.open >= fromTime) {
        return interval.open
      }
    }
    return null
  }

  // 1. Check later intervals today
  const todayKey = days[currentDayIndex]
  const todayInfo = storeHours[todayKey]
  const nextOpenToday = findNextInterval(todayInfo, currentTimeStr)
  if (nextOpenToday) {
    return { day: todayKey, time: nextOpenToday }
  }

  // 2. Check subsequent days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7
    const nextDayKey = days[nextDayIndex]
    const nextDayInfo = storeHours[nextDayKey]
    // Find the *first* opening time on that day (from 00:00)
    const firstOpenNextDay = findNextInterval(nextDayInfo, '00:00')
    if (firstOpenNextDay) {
      return { day: nextDayKey, time: firstOpenNextDay }
    }
  }

  return null // No opening times found in the next week
}
