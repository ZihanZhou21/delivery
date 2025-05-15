import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as storeTimeApi from '@/lib/api/storeTimeApi'

// Define the structure for a single time interval
export interface TimeInterval {
  open: string // HH:MM format
  close: string // HH:MM format
}

export interface StoreTimeDay {
  day: string // e.g., 'Monday', 'Tuesday'
  intervals: TimeInterval[] // Array of opening intervals
  closed?: boolean // Still allows marking the whole day as closed
}

export interface StoreTimeState {
  hours: StoreTimeDay[]
  isLoading: boolean
  error: string | null
  storeOpen: boolean | null // 当前是否营业中，null表示未知
  // 同步操作
  setStoreTime: (hours: StoreTimeDay[]) => void
  // 异步API操作
  fetchStoreHours: () => Promise<void>
  updateStoreHours: (hours: StoreTimeDay[]) => Promise<void>
  updateDayHours: (
    day: string,
    intervals: TimeInterval[],
    closed?: boolean
  ) => Promise<void>
  checkStoreOpen: () => Promise<void> // 检查当前是否营业中
}

// Default initial state with one interval per day
const defaultHours: StoreTimeDay[] = [
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

export const useStoreTime = create<StoreTimeState>()(
  persist(
    (set) => ({
      hours: defaultHours,
      isLoading: false,
      error: null,
      storeOpen: null,

      // 同步操作
      setStoreTime: (hours) => set({ hours }),

      // 异步API操作
      fetchStoreHours: async () => {
        set({ isLoading: true, error: null })
        try {
          const hours = await storeTimeApi.fetchStoreHours()
          set({ hours, isLoading: false })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error fetching store hours',
            isLoading: false,
          })
        }
      },

      updateStoreHours: async (hours) => {
        set({ isLoading: true, error: null })
        try {
          const updatedHours = await storeTimeApi.updateStoreHours(hours)
          set({ hours: updatedHours, isLoading: false })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error updating store hours',
            isLoading: false,
          })
        }
      },

      updateDayHours: async (day, intervals, closed) => {
        set({ isLoading: true, error: null })
        try {
          const updatedDay = await storeTimeApi.updateDayHours(
            day,
            intervals,
            closed
          )

          // 更新特定天的数据
          set((state) => ({
            hours: state.hours.map((d) => (d.day === day ? updatedDay : d)),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : `Unknown error updating hours for ${day}`,
            isLoading: false,
          })
        }
      },

      checkStoreOpen: async () => {
        set({ isLoading: true, error: null })
        try {
          const isOpen = await storeTimeApi.checkStoreOpen()
          set({ storeOpen: isOpen, isLoading: false })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error checking store open status',
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'store-time', // localStorage key name
      // 只持久化hours，其他状态（loading、error）不需要持久化
      partialize: (state) => ({ hours: state.hours }),
    }
  )
)
