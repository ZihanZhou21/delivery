import React, { useEffect } from 'react'
import {
  isStoreClosedAllDay,
  isStoreOpenNow,
  getStoreCloseTime,
  getNextOpenTime,
} from '../utils/storeTime'

// 新增props: onVisibleChange
interface StoreNoticeProps {
  onVisibleChange?: (visible: boolean) => void
}

const StoreNotice: React.FC<StoreNoticeProps> = ({ onVisibleChange }) => {
  const closedAllDay = isStoreClosedAllDay()
  const openNow = isStoreOpenNow()
  const closeTime = getStoreCloseTime()
  const nextOpen = getNextOpenTime()

  let showYellow = false
  if (!closedAllDay && closeTime) {
    const now = new Date()
    const [closeH, closeM] = closeTime.split(':').map(Number)
    const close = new Date(now)
    close.setHours(closeH, closeM, 0, 0)
    const diff = close.getTime() - now.getTime()
    if (diff > 0 && diff <= 30 * 60 * 1000) {
      showYellow = true
    }
  }

  const showRed = !openNow

  const visible = showYellow || showRed

  useEffect(() => {
    if (onVisibleChange) onVisibleChange(visible)
  }, [visible, onVisibleChange])

  if (!visible) return null

  return (
    <>
      {showYellow && (
        <div className="bg-[#FDC519] text-black rounded-2xl p-6 text-center font-bold text-lg mb-4">
          The store will close at{' '}
          <span className="text-[#E53935]">{closeTime}</span>. Online ordering
          is now closed.
          <br />
          You&apos;re welcome to call us directly to check if we can still take
          your order.
          <br />
          <span>
            Call us:{' '}
            <a href="tel:0407509869" className="underline font-bold">
              0407 509 869
            </a>
          </span>
        </div>
      )}
      {showRed && (
        <div className="bg-[#E53935] text-white rounded-2xl p-6 text-center font-bold text-lg mb-4">
          Sorry, we&apos;re closed for now.
          <br />
          {nextOpen && (
            <span>
              We will open next on {nextOpen.day} at {nextOpen.time}.
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default StoreNotice
