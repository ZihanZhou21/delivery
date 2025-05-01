// Store business hours config
const storeHours: Record<string, { open: string; close: string } | null> = {
  Mon: { open: '18:30', close: '23:30' },
  Tue: null, // Closed
  Wed: { open: '18:00', close: '23:30' },
  Thu: { open: '18:30', close: '23:30' },
  Fri: { open: '18:00', close: '01:30' },
  Sat: { open: '18:00', close: '01:30' },
  Sun: { open: '18:00', close: '23:30' },
}

function getTodayKey() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date().getDay()]
}

export function isStoreClosedAllDay() {
  const todayKey = getTodayKey()
  return !storeHours[todayKey]
}

export function isStoreOpenNow() {
  const todayKey = getTodayKey()
  const hours = storeHours[todayKey]
  if (!hours) return false
  const now = new Date()
  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)

  const open = new Date(now)
  open.setHours(openH, openM, 0, 0)

  const close = new Date(now)
  close.setHours(closeH, closeM, 0, 0)
  // Handle overnight
  if (close <= open) close.setDate(close.getDate() + 1)

  return now >= open && now <= close
}

// 获取今天的关门时间（字符串，24小时制）
export function getStoreCloseTime(): string | null {
  const todayKey = getTodayKey()
  const hours = storeHours[todayKey]
  if (!hours) return null
  return hours.close
}

// 获取下次开门时间（字符串，24小时制）
export function getNextOpenTime(): { day: string; time: string } | null {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const idx = now.getDay()
  // 先判断今天
  const todayKey = days[idx]
  const todayHours = storeHours[todayKey]
  if (todayHours) {
    const [openH, openM] = todayHours.open.split(':').map(Number)
    const open = new Date(now)
    open.setHours(openH, openM, 0, 0)
    if (now < open) {
      return { day: todayKey, time: todayHours.open }
    }
  }
  // 查找未来7天
  for (let i = 1; i <= 7; i++) {
    const nextIdx = (idx + i) % 7
    const key = days[nextIdx]
    const hours = storeHours[key]
    if (hours) {
      return { day: key, time: hours.open }
    }
  }
  return null
}
