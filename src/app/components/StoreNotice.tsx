'use client'
import React, { useState, useEffect } from 'react'
import {
  // isStoreClosedAllDay,
  isStoreOpenNow,
  // Use the new function name
  getCurrentIntervalCloseTime,
  getNextOpenTime,
} from '../utils/storeTime'

interface StoreNoticeProps {
  onVisibleChange?: (visible: boolean) => void
}

const StoreNotice: React.FC<StoreNoticeProps> = ({ onVisibleChange }) => {
  const [hasMounted, setHasMounted] = useState(false)

  const [noticeData, setNoticeData] = useState<{
    visible: boolean
    showYellow: boolean
    showRed: boolean
    // Use the new function name's return type
    currentCloseTime: string | null
    nextOpen: { day: string; time: string } | null
  } | null>(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted) {
      // const closedAllDay = isStoreClosedAllDay()
      const openNow = isStoreOpenNow()
      // Call the renamed function
      const calculatedCurrentCloseTime = getCurrentIntervalCloseTime()
      const calculatedNextOpen = getNextOpenTime()

      let calculatedShowYellow = false
      // Use the current interval's close time for the "closing soon" logic
      if (openNow && calculatedCurrentCloseTime) {
        const now = new Date()
        const [closeH, closeM] = calculatedCurrentCloseTime
          .split(':')
          .map(Number)
        if (!isNaN(closeH) && !isNaN(closeM)) {
          const closeDateTime = new Date(now)
          closeDateTime.setHours(closeH, closeM, 0, 0)
          const diff = closeDateTime.getTime() - now.getTime()
          if (diff > 0 && diff <= 30 * 60 * 1000) {
            calculatedShowYellow = true
          }
        }
      }

      // Show red if not currently open (handles closed all day or between intervals)
      const calculatedShowRed = !openNow
      const calculatedVisible = calculatedShowYellow || calculatedShowRed

      setNoticeData({
        visible: calculatedVisible,
        showYellow: calculatedShowYellow,
        showRed: calculatedShowRed,
        // Store the correct value
        currentCloseTime: calculatedCurrentCloseTime,
        nextOpen: calculatedNextOpen,
      })

      if (onVisibleChange) {
        onVisibleChange(calculatedVisible)
      }
    }
  }, [hasMounted, onVisibleChange])

  if (!hasMounted || !noticeData || !noticeData.visible) {
    return null
  }

  return (
    <>
      {noticeData.showYellow && (
        <div className="bg-[#FDC519] text-black rounded-2xl p-6 text-center font-bold text-lg mb-4">
          {/* Use the current interval's close time in the message */}
          The store will close soon at{' '}
          <span className="text-[#E53935]">{noticeData.currentCloseTime}</span>.
          Online ordering may close shortly.
          <br />
          You&apos;re welcome to call us directly to check order availability.
          <br />
          <span>
            Call us:{' '}
            <a href="tel:0407509869" className="underline font-bold">
              0407 509 869
            </a>
          </span>
        </div>
      )}
      {noticeData.showRed && (
        <div className="bg-[#E53935] text-white rounded-2xl p-6 text-center font-bold text-lg mb-4">
          Sorry, we&apos;re closed for online orders right now.
          {noticeData.nextOpen && (
            <>
              <br />
              <span>
                We will open next on {noticeData.nextOpen.day} at{' '}
                {noticeData.nextOpen.time}.
              </span>
            </>
          )}
          {!noticeData.nextOpen && (
            <>
              <br />
              <span>
                Please check back later or contact us for opening hours.
              </span>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default StoreNotice
