import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  setStoreTime: (hours: StoreTimeDay[]) => void
}

// Default initial state with one interval per day
const defaultHours: StoreTimeDay[] = [
  {
    day: 'Monday',
    intervals: [{ open: '18:30', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Tuesday',
    intervals: [],
    closed: true,
  },
  {
    day: 'Wednesday',
    intervals: [{ open: '18:30', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Thursday',
    intervals: [{ open: '18:30', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Friday',
    intervals: [{ open: '18:00', close: '24:00' }],
    closed: false,
  },
  {
    day: 'Saturday',
    intervals: [
      { open: '00:00', close: '01:30' },
      { open: '18:00', close: '24:00' },
    ],
    closed: false,
  },
  {
    day: 'Sunday',
    intervals: [
      { open: '00:00', close: '01:30' },
      { open: '18:00', close: '23:30' },
    ],
    closed: false,
  },
]

export const useStoreTime = create<StoreTimeState>()(
  persist(
    (set) => ({
      hours: defaultHours,
      // The setter remains the same, it just accepts the new structure
      setStoreTime: (hours) => set({ hours: hours }),
    }),
    {
      name: 'store-time', // localStorage key name
      // Optional: Add migration logic here if needed from old structure
    }
  )
)
