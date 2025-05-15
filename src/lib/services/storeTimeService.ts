import { StoreTimeDay, TimeInterval } from '@/app/store/opentimeStore'

// 内存存储
let storeHours: StoreTimeDay[] = [
  {
    day: 'Monday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Tuesday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Wednesday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Thursday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Friday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Saturday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Sunday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
]

// 获取所有的营业时间
export async function getStoreHours(): Promise<StoreTimeDay[]> {
  return storeHours
}

// 设置营业时间
export async function setStoreHours(
  newHours: StoreTimeDay[]
): Promise<StoreTimeDay[]> {
  if (!Array.isArray(newHours)) {
    throw new Error('Store hours must be an array')
  }

  storeHours = newHours
  return storeHours
}

// 更新特定日期的营业时间
export async function updateDayHours(
  dayName: string,
  intervals: TimeInterval[],
  closed?: boolean
): Promise<StoreTimeDay | null> {
  const index = storeHours.findIndex((day) => day.day === dayName)
  if (index === -1) return null

  storeHours[index] = {
    ...storeHours[index],
    intervals,
    closed: closed ?? storeHours[index].closed,
  }

  return storeHours[index]
}

// 检查店铺当前是否开启
export function isStoreOpenNow(): boolean {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const today = days[new Date().getDay()]

  const dayInfo = storeHours.find((day) => day.day === today)
  if (
    !dayInfo ||
    dayInfo.closed ||
    !dayInfo.intervals ||
    dayInfo.intervals.length === 0
  ) {
    return false
  }

  const now = new Date()
  const currentHour = now.getHours().toString().padStart(2, '0')
  const currentMinute = now.getMinutes().toString().padStart(2, '0')
  const currentTime = `${currentHour}:${currentMinute}`

  return dayInfo.intervals.some((interval) => {
    // 标准时间区间 (例如: 09:00-17:00)
    if (interval.open <= interval.close) {
      return currentTime >= interval.open && currentTime < interval.close
    }
    // 跨夜时间区间 (例如: 21:00-02:00)
    else {
      return currentTime >= interval.open || currentTime < interval.close
    }
  })
}

// 获取下一次开店时间
export function getNextOpenTime(): { day: string; time: string } | null {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ...
  const currentHour = now.getHours().toString().padStart(2, '0')
  const currentMinute = now.getMinutes().toString().padStart(2, '0')
  const currentTime = `${currentHour}:${currentMinute}`

  // 检查今天剩余时间
  const todayHours = storeHours.find((day) => day.day === days[currentDay])
  if (todayHours && !todayHours.closed && todayHours.intervals) {
    // 查找今天剩余的营业时间段
    const laterToday = todayHours.intervals
      .filter((interval) => interval.open > currentTime)
      .sort((a, b) => a.open.localeCompare(b.open))

    if (laterToday.length > 0) {
      return { day: days[currentDay], time: laterToday[0].open }
    }
  }

  // 检查未来几天
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDay + i) % 7
    const nextDayHours = storeHours.find(
      (day) => day.day === days[nextDayIndex]
    )

    if (
      nextDayHours &&
      !nextDayHours.closed &&
      nextDayHours.intervals &&
      nextDayHours.intervals.length > 0
    ) {
      // 获取下一天的第一个营业时间段
      const sortedIntervals = [...nextDayHours.intervals].sort((a, b) =>
        a.open.localeCompare(b.open)
      )

      return { day: days[nextDayIndex], time: sortedIntervals[0].open }
    }
  }

  return null
}

// 初始化服务
export async function initStoreTimeService(
  initialHours?: StoreTimeDay[]
): Promise<void> {
  if (initialHours && Array.isArray(initialHours)) {
    storeHours = initialHours
  }
}
