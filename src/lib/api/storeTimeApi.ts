import { StoreTimeDay, TimeInterval } from '@/app/store/opentimeStore'
import { api } from './apiUtils'

// 获取所有营业时间
export async function fetchStoreHours(): Promise<StoreTimeDay[]> {
  return api.get<StoreTimeDay[]>('/api/storetime')
}

// 更新所有营业时间
export async function updateStoreHours(
  hours: StoreTimeDay[]
): Promise<StoreTimeDay[]> {
  // 将数组包装在对象中以满足Record<string, unknown>类型要求
  return api
    .put<StoreTimeDay[]>('/api/storetime', { hours } as unknown as Record<
      string,
      unknown
    >)
    .then((response) => {
      // 如果后端直接返回hours数组，就直接使用
      if (Array.isArray(response)) {
        return response
      }
      // 如果后端将hours包装在对象中返回，则提取hours字段
      return (response as unknown as { hours: StoreTimeDay[] }).hours || []
    })
}

// 更新特定日期的营业时间
export async function updateDayHours(
  day: string,
  intervals: TimeInterval[],
  closed?: boolean
): Promise<StoreTimeDay> {
  return api.put<StoreTimeDay>(`/api/storetime/${day}`, {
    intervals,
    closed,
  })
}

// 判断当前店铺是否营业
export async function checkStoreOpen(): Promise<boolean> {
  try {
    // 获取营业时间
    const hours = await fetchStoreHours()

    // 获取当前时间信息
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
    const currentDay = days[now.getDay()]
    const currentHour = now.getHours().toString().padStart(2, '0')
    const currentMinute = now.getMinutes().toString().padStart(2, '0')
    const currentTime = `${currentHour}:${currentMinute}`

    // 查找当前日期
    const dayInfo = hours.find((day) => day.day === currentDay)
    if (
      !dayInfo ||
      dayInfo.closed ||
      !dayInfo.intervals ||
      dayInfo.intervals.length === 0
    ) {
      return false
    }

    // 检查是否在任一时间段内
    return dayInfo.intervals.some((interval) => {
      // 标准时间段 (例如 09:00-17:00)
      if (interval.open <= interval.close) {
        return currentTime >= interval.open && currentTime < interval.close
      }
      // 跨夜时间段 (例如 21:00-02:00)
      else {
        return currentTime >= interval.open || currentTime < interval.close
      }
    })
  } catch (error) {
    console.error('Failed to check if store is open:', error)
    return false
  }
}
