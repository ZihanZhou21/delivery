'use client'
import React, { useState, useEffect } from 'react'
import {
  useStoreTime,
  StoreTimeDay,
  TimeInterval,
} from '../../store/opentimeStore'
import Link from 'next/link'

// --- Utility Functions (can be moved to utils if preferred) ---

// Basic HH:MM format validation
function isValidTimeFormat(timeStr: string): boolean {
  return !!timeStr && /^\d{2}:\d{2}$/.test(timeStr)
}

// Checks if open time string is lexicographically smaller than close time string
function isStartBeforeEnd(openStr: string, closeStr: string): boolean {
  if (!isValidTimeFormat(openStr) || !isValidTimeFormat(closeStr)) return false
  return openStr < closeStr
}

// Checks for overlaps between intervals within a single day
function hasOverlappingIntervals(intervals: TimeInterval[]): boolean {
  if (!intervals || intervals.length < 2) return false

  // Filter out invalid intervals first and sort by open time
  const sortedValidIntervals = intervals
    .filter(
      (int) =>
        isValidTimeFormat(int.open) &&
        isValidTimeFormat(int.close) &&
        isStartBeforeEnd(int.open, int.close)
    )
    .sort((a, b) => a.open.localeCompare(b.open))

  // Check for overlaps in the sorted list
  for (let i = 0; i < sortedValidIntervals.length - 1; i++) {
    // Overlap if the current interval's close time is after the next interval's open time
    if (sortedValidIntervals[i].close > sortedValidIntervals[i + 1].open) {
      return true // Overlap detected
    }
  }
  return false // No overlaps found
}

// --- Component ---

export default function StoreTimePage() {
  const hoursFromStore = useStoreTime((state) => state.hours)
  const setStoreTime = useStoreTime((state) => state.setStoreTime)

  // Initialize local state with a deep copy from the store
  const [localHours, setLocalHours] = useState<StoreTimeDay[]>(() =>
    JSON.parse(JSON.stringify(useStoreTime.getState().hours))
  )
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false) // Track client mount

  // Set mounted state after initial render
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Sync store changes to local state after mount
  useEffect(() => {
    if (hasMounted) {
      // Use deep comparison to check if store state actually changed
      if (JSON.stringify(localHours) !== JSON.stringify(hoursFromStore)) {
        console.log('Syncing store state to local state') // Debug log
        setLocalHours(JSON.parse(JSON.stringify(hoursFromStore)))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoursFromStore, hasMounted]) // Keep localHours out of deps to avoid loops on edit

  const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // --- Event Handlers ---

  function handleInputChange(
    dayIndex: number,
    intervalIndex: number,
    field: 'open' | 'close',
    value: string
  ) {
    const cleanedValue = value.replace(/[^\d:]/g, '').slice(0, 5)
    // Create deep copies to avoid state mutation issues
    const updatedHours = JSON.parse(JSON.stringify(localHours))

    if (updatedHours[dayIndex]?.intervals?.[intervalIndex]) {
      updatedHours[dayIndex].intervals[intervalIndex][field] = cleanedValue
      setLocalHours(updatedHours)
      setSaved(false) // Mark as unsaved
      setError(null) // Clear error on modification, re-validate on save
    } else {
      console.error('Attempted to update non-existent interval:', {
        dayIndex,
        intervalIndex,
        field,
      })
    }
  }

  function handleCheckboxChange(dayIndex: number, isChecked: boolean) {
    const updatedHours = localHours.map((day, i) =>
      i === dayIndex ? { ...day, closed: isChecked } : day
    )
    setLocalHours(updatedHours)
    // Clear potential errors for the day if marking as closed
    if (isChecked && error?.includes(dayAbbr[dayIndex])) {
      setError(null)
    }
    setSaved(false)
  }

  function addInterval(dayIndex: number) {
    // Create deep copies
    const updatedHours = JSON.parse(JSON.stringify(localHours))
    if (updatedHours[dayIndex]) {
      // Add a new empty interval object
      updatedHours[dayIndex].intervals.push({ open: '', close: '' })
      setLocalHours(updatedHours)
      setSaved(false)
    }
  }

  function removeInterval(dayIndex: number, intervalIndex: number) {
    // Create deep copies
    const updatedHours = JSON.parse(JSON.stringify(localHours))
    if (updatedHours[dayIndex]?.intervals) {
      // Filter out the interval at the specified index
      updatedHours[dayIndex].intervals = updatedHours[
        dayIndex
      ].intervals.filter(
        (_: TimeInterval, idx: number) => idx !== intervalIndex
      )
      setLocalHours(updatedHours)
      setSaved(false)
      // Clear error if it was related to this day
      if (error?.includes(dayAbbr[dayIndex])) {
        setError(null) // Re-validate on next save
      }
    }
  }

  // --- Save Handler with Validation ---
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null) // Clear previous errors
    let isValid = true

    for (let i = 0; i < localHours.length; i++) {
      const day = localHours[i]
      const dayName = dayAbbr[i] // Get day name for error messages

      if (day.closed) continue // Skip validation if the whole day is closed

      // Check if there are intervals if the day isn't closed
      if (!day.intervals || day.intervals.length === 0) {
        // Decide if this is an error or allowed. Assuming allowed for now.
        // If required:
        // setError(`At least one time interval is required for ${dayName} if not marked Closed.`);
        // isValid = false;
        // break;
        continue
      }

      // Validate each interval for the day
      for (let j = 0; j < day.intervals.length; j++) {
        const interval = day.intervals[j]
        const intervalNum = j + 1 // For user-friendly error messages

        if (!isValidTimeFormat(interval.open)) {
          setError(
            `Invalid open time format for ${dayName} (Interval ${intervalNum}). Use HH:MM.`
          )
          isValid = false
          break // Stop checking intervals for this day
        }
        if (!isValidTimeFormat(interval.close)) {
          setError(
            `Invalid close time format for ${dayName} (Interval ${intervalNum}). Use HH:MM.`
          )
          isValid = false
          break
        }
        if (!isStartBeforeEnd(interval.open, interval.close)) {
          setError(
            `Open time (${interval.open}) must be before close time (${interval.close}) for ${dayName} (Interval ${intervalNum}).`
          )
          isValid = false
          break
        }
      }
      if (!isValid) break // Stop checking other days if an error was found

      // Check for overlaps *within* the current day's intervals
      if (hasOverlappingIntervals(day.intervals)) {
        setError(`Time intervals overlap for ${dayName}. Please correct.`)
        isValid = false
        break // Stop checking other days
      }
    }

    // If all validations pass, save the current local state to Zustand
    if (isValid) {
      console.log('Saving valid hours:', JSON.stringify(localHours)) // Debug log
      setStoreTime(JSON.parse(JSON.stringify(localHours))) // Save a deep copy
      setSaved(true)
      setTimeout(() => setSaved(false), 3000) // Hide "Saved!" message
    }
  }

  // --- Render Logic ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#363636] w-[400px] mx-auto ">
      <div className="w-[400px] bg-black rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        {/* 返回按钮 */}
        <div className="self-end mb-4 rounded-xl border-2 border-[#FDC519] p-2">
          <Link
            href="/admin"
            className="flex items-center text-white hover:text-yellow-300 font-bold">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <h2 className="text-2xl font-extrabold text-[#FDC519] mb-6">
          Store Opening Hours
        </h2>
        {/* Show Skeleton Loader until client has mounted */}
        {!hasMounted ? (
          <div className="w-full flex flex-col gap-4">
            {/* Simple skeleton, adjust if needed */}
            {[...Array(7)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 h-10 animate-pulse mb-3 p-3 border border-gray-700 rounded-lg">
                <span className="bg-gray-700 rounded w-16 h-6"></span>
                <div className="flex-1 flex justify-end">
                  {' '}
                  <span className="bg-gray-700 rounded w-28 h-6"></span>
                </div>
              </div>
            ))}
            <div className="mt-4 w-full bg-gray-700 rounded-xl py-3 h-12 animate-pulse"></div>
          </div>
        ) : (
          // Render the actual form after client mount
          <form className="w-full flex flex-col" onSubmit={handleSave}>
            {/* Map through each day */}
            {localHours.map((day, dayIndex) => (
              <div
                key={day.day || dayIndex}
                className="mb-3 p-3 border border-gray-600 rounded-lg">
                {/* Day Label and Closed Checkbox */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-bold w-16">
                    {dayAbbr[dayIndex]}
                  </span>
                  <label className="flex items-center text-white text-sm font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!day.closed}
                      onChange={(e) =>
                        handleCheckboxChange(dayIndex, e.target.checked)
                      }
                      className="mr-2 h-4 w-4 accent-[#FDC519]"
                    />
                    Closed All Day
                  </label>
                </div>

                {/* Render intervals only if the day is not marked as closed */}
                {!day.closed && (
                  <div className="flex flex-col gap-2">
                    {day.intervals.map((interval, intervalIndex) => (
                      <div
                        key={intervalIndex}
                        className="flex items-center  gap-2">
                        {/* Open Time Input */}
                        <input
                          type="text"
                          value={interval.open}
                          onChange={(e) =>
                            handleInputChange(
                              dayIndex,
                              intervalIndex,
                              'open',
                              e.target.value
                            )
                          }
                          placeholder="HH:MM"
                          maxLength={5}
                          // Improved error highlighting check
                          className={`flex w-24 bg-[#222] text-white rounded-lg px-2 py-1 border ${
                            error &&
                            error.includes(
                              `${dayAbbr[dayIndex]} (Interval ${
                                intervalIndex + 1
                              })`
                            ) &&
                            (error.includes('open time') ||
                              error.includes('overlap'))
                              ? 'border-red-500'
                              : 'border-[#FDC519]'
                          } focus:outline-none focus:border-yellow-300 text-center`}
                        />
                        <span className="text-gray-400">-</span>
                        {/* Close Time Input */}
                        <input
                          type="text"
                          value={interval.close}
                          onChange={(e) =>
                            handleInputChange(
                              dayIndex,
                              intervalIndex,
                              'close',
                              e.target.value
                            )
                          }
                          placeholder="HH:MM"
                          maxLength={5}
                          // Improved error highlighting check
                          className={`flex w-24 bg-[#222] text-white rounded-lg px-2 py-1 border ${
                            error &&
                            error.includes(
                              `${dayAbbr[dayIndex]} (Interval ${
                                intervalIndex + 1
                              })`
                            ) &&
                            (error.includes('close time') ||
                              error.includes('overlap'))
                              ? 'border-red-500'
                              : 'border-[#FDC519]'
                          } focus:outline-none focus:border-yellow-300 text-center`}
                        />
                        {/* Remove Interval Button */}
                        {/* Show remove button only if more than one interval exists */}
                        {day.intervals.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeInterval(dayIndex, intervalIndex)
                            }
                            className="text-red-500 hover:text-red-400 text-2xl font-bold ml-1 px-1 flex-shrink-0"
                            aria-label="Remove time interval">
                            &times; {/* Cross symbol */}
                          </button>
                        )}
                        {/* Add placeholder if only one interval to maintain alignment */}
                        {day.intervals.length <= 1 && (
                          <div className="w-6 ml-1 px-1 flex-shrink-0"></div> // Placeholder
                        )}
                      </div>
                    ))}

                    {/* Add Interval Button */}
                    <button
                      type="button"
                      onClick={() => addInterval(dayIndex)}
                      className="text-[#FDC519] hover:text-yellow-300 text-sm font-semibold mt-2 self-start">
                      + Add Time Slot
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Save Button */}
            <button
              className="mt-4 w-full bg-[#FDC519] text-black font-extrabold rounded-xl py-3 text-xl hover:bg-yellow-400 transition disabled:opacity-50"
              type="submit"
              disabled={!!error} // Disable save if there's an error
            >
              Save
            </button>
          </form>
        )}

        {/* Feedback Messages - Render only after mount */}
        {hasMounted && saved && (
          <div className="text-green-400 font-bold mt-4">Saved!</div>
        )}
        {hasMounted && error && (
          <div className="text-red-400 font-bold mt-4 break-words w-full text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
