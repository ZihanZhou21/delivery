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
  // 从store中获取数据和方法
  const {
    hours: hoursFromStore,
    isLoading,
    error: apiError,
    fetchStoreHours,
    updateStoreHours,
    updateDayHours,
  } = useStoreTime()

  // 本地状态
  const [localHours, setLocalHours] = useState<StoreTimeDay[]>([])
  const [saved, setSaved] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false) // 客户端挂载追踪
  const [loadingPerDay, setLoadingPerDay] = useState<Record<string, boolean>>(
    {}
  )

  // 组件挂载后加载数据
  useEffect(() => {
    setHasMounted(true)
    fetchStoreHours()
  }, [fetchStoreHours])

  // 当store中的数据更新时，同步到本地状态
  useEffect(() => {
    if (hasMounted && hoursFromStore && hoursFromStore.length > 0) {
      setLocalHours(JSON.parse(JSON.stringify(hoursFromStore)))
    }
  }, [hoursFromStore, hasMounted])

  const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // --- Event Handlers ---

  function handleInputChange(
    dayIndex: number,
    intervalIndex: number,
    field: 'open' | 'close',
    value: string
  ) {
    const cleanedValue = value.replace(/[^\d:]/g, '').slice(0, 5)
    // 创建深拷贝避免状态突变问题
    const updatedHours = JSON.parse(JSON.stringify(localHours))

    if (updatedHours[dayIndex]?.intervals?.[intervalIndex]) {
      updatedHours[dayIndex].intervals[intervalIndex][field] = cleanedValue
      setLocalHours(updatedHours)
      setSaved(false) // 标记为未保存
      setValidationError(null) // 修改时清除错误，保存时重新验证
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
    // 如果标记为关闭，清除该天可能的错误
    if (isChecked && validationError?.includes(dayAbbr[dayIndex])) {
      setValidationError(null)
    }
    setSaved(false)
  }

  function addInterval(dayIndex: number) {
    // 创建深拷贝
    const updatedHours = JSON.parse(JSON.stringify(localHours))
    if (updatedHours[dayIndex]) {
      // 添加新的空时间间隔
      updatedHours[dayIndex].intervals.push({ open: '', close: '' })
      setLocalHours(updatedHours)
      setSaved(false)
    }
  }

  function removeInterval(dayIndex: number, intervalIndex: number) {
    // 创建深拷贝
    const updatedHours = JSON.parse(JSON.stringify(localHours))
    if (updatedHours[dayIndex]?.intervals) {
      // 过滤掉指定索引的时间间隔
      updatedHours[dayIndex].intervals = updatedHours[
        dayIndex
      ].intervals.filter(
        (_: TimeInterval, idx: number) => idx !== intervalIndex
      )
      setLocalHours(updatedHours)
      setSaved(false)
      // 如果错误与此天相关，则清除错误
      if (validationError?.includes(dayAbbr[dayIndex])) {
        setValidationError(null) // 下次保存时重新验证
      }
    }
  }

  // --- 验证并保存所有营业时间 ---
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setValidationError(null) // 清除之前的错误

    const validationResult = validateHours(localHours)
    if (!validationResult.isValid) {
      setValidationError(validationResult.error)
      return
    }

    // 如果所有验证通过，保存当前本地状态到API
    try {
      await updateStoreHours(JSON.parse(JSON.stringify(localHours)))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000) // 3秒后隐藏"已保存！"消息
    } catch (error) {
      console.error('Error saving hours:', error)
      setValidationError('Failed to save hours. Please try again.')
    }
  }

  // --- 单天营业时间更新 ---
  const handleSaveDay = async (dayIndex: number) => {
    setValidationError(null)
    const day = localHours[dayIndex]
    const dayName = day.day

    // 验证单天的时间间隔
    const validationResult = validateSingleDay(day, dayAbbr[dayIndex])
    if (!validationResult.isValid) {
      setValidationError(validationResult.error)
      return
    }

    // 设置该天为加载状态
    setLoadingPerDay((prev) => ({ ...prev, [dayName]: true }))

    // 调用API更新单天
    try {
      await updateDayHours(dayName, day.intervals, day.closed)
      // 显示临时成功消息
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error(`Error saving ${dayName} hours:`, error)
      setValidationError(`Failed to save ${dayName} hours. Please try again.`)
    } finally {
      setLoadingPerDay((prev) => ({ ...prev, [dayName]: false }))
    }
  }

  // --- 验证所有营业时间的辅助函数 ---
  function validateHours(hours: StoreTimeDay[]) {
    let isValid = true
    let errorMessage = null

    for (let i = 0; i < hours.length; i++) {
      const day = hours[i]
      const dayName = dayAbbr[i] // 获取日期名用于错误消息

      const result = validateSingleDay(day, dayName)
      if (!result.isValid) {
        isValid = false
        errorMessage = result.error
        break
      }
    }

    return { isValid, error: errorMessage }
  }

  // --- 验证单天营业时间的辅助函数 ---
  function validateSingleDay(day: StoreTimeDay, dayName: string) {
    if (day.closed) return { isValid: true, error: null }

    // 检查是否有时间间隔（如果天未关闭）
    if (!day.intervals || day.intervals.length === 0) {
      // 决定是否这是一个错误。目前假设允许
      return { isValid: true, error: null }
    }

    // 验证该天的每个时间间隔
    for (let j = 0; j < day.intervals.length; j++) {
      const interval = day.intervals[j]
      const intervalNum = j + 1 // 对用户友好的错误消息

      if (!isValidTimeFormat(interval.open)) {
        return {
          isValid: false,
          error: `${dayName} (Interval ${intervalNum}) has invalid start time format. Please use HH:MM.`,
        }
      }
      if (!isValidTimeFormat(interval.close)) {
        return {
          isValid: false,
          error: `${dayName} (Interval ${intervalNum}) has invalid end time format. Please use HH:MM.`,
        }
      }
      if (!isStartBeforeEnd(interval.open, interval.close)) {
        return {
          isValid: false,
          error: `${dayName} (Interval ${intervalNum}) start time (${interval.open}) must be earlier than end time (${interval.close}).`,
        }
      }
    }

    // Check for overlapping intervals within the current day
    if (hasOverlappingIntervals(day.intervals)) {
      return {
        isValid: false,
        error: `${dayName} has overlapping time intervals. Please correct them.`,
      }
    }

    return { isValid: true, error: null }
  }

  // --- 渲染逻辑 ---
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

        {/* 加载状态 */}
        {isLoading && !localHours.length && (
          <div className="w-full text-center mb-4 text-white py-2">
            Loading store hours...
          </div>
        )}

        {/* API错误显示 */}
        {apiError && (
          <div className="w-full text-center mb-4 text-red-500 py-2 rounded-lg">
            Error: {apiError}
          </div>
        )}

        {/* 验证错误显示 */}
        {validationError && (
          <div className="w-full text-center mb-4 text-red-500 py-2 bg-red-500/20 rounded-lg">
            {validationError}
          </div>
        )}

        {/* 保存成功消息 */}
        {saved && (
          <div className="w-full flex justify-center my-2">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Changes saved!
            </div>
          </div>
        )}

        <form className="w-full" onSubmit={handleSaveAll}>
          {/* Days of the week */}
          {!isLoading &&
            localHours.map((day, dayIndex) => (
              <div
                key={day.day}
                className="bg-[#222] rounded-xl p-4 mb-4 border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={day.closed || false}
                      onChange={(e) =>
                        handleCheckboxChange(dayIndex, e.target.checked)
                      }
                      className="w-4 h-4 accent-[#FDC519]"
                    />
                    <span className="text-white font-bold">
                      {day.day}: {day.closed ? 'Closed' : 'Open'}
                    </span>
                  </label>

                  {/* 单天保存按钮 */}
                  <button
                    type="button"
                    className="text-sm bg-[#FDC519] text-black px-2 py-1 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
                    onClick={() => handleSaveDay(dayIndex)}
                    disabled={loadingPerDay[day.day]}>
                    {loadingPerDay[day.day] ? 'Saving...' : 'Save Day'}
                  </button>
                </div>

                {/* Time intervals for the day - hide if closed */}
                {!day.closed && (
                  <div className="ml-6">
                    {day.intervals.map((interval, intervalIndex) => (
                      <div
                        key={`${day.day}-interval-${intervalIndex}`}
                        className="flex items-center gap-2 mb-2">
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
                          className="bg-black text-white border border-gray-600 rounded-lg p-2 w-20 focus:border-[#FDC519] focus:outline-none"
                        />
                        <span className="text-white">to</span>
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
                          className="bg-black text-white border border-gray-600 rounded-lg p-2 w-20 focus:border-[#FDC519] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeInterval(dayIndex, intervalIndex)
                          }
                          className="bg-red-600 text-white p-1 rounded-lg hover:bg-red-700">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M18 6L6 18M6 6l12 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addInterval(dayIndex)}
                      className="mt-2 bg-[#444] text-white px-3 py-1 rounded-lg hover:bg-[#555] text-sm">
                      + Add Time Interval
                    </button>
                  </div>
                )}
              </div>
            ))}

          {/* Save/Submit button */}
          <button
            type="submit"
            className="w-full bg-[#FDC519] text-black font-bold py-3 rounded-xl mt-2 hover:bg-yellow-400 disabled:opacity-50"
            disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save All Hours'}
          </button>
        </form>
      </div>
    </div>
  )
}
