import React from 'react'

const storeHours: Record<string, { open: string; close: string } | null> = {
  Mon: { open: '18:30', close: '23:30' },
  Tue: null, // 休息
  Wed: { open: '18:30', close: '23:30' },
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
  // 处理跨天
  if (close <= open) close.setDate(close.getDate() + 1)

  return now >= open && now <= close
}

const StoreNotice: React.FC = () => {
  const closedAllDay = isStoreClosedAllDay()
  const openNow = isStoreOpenNow()
  const showYellow = !closedAllDay && !openNow
  const showRed = closedAllDay

  if (!showYellow && !showRed) return null

  return (
    <>
      {showYellow && (
        <div className="bg-[#FDC519] text-black rounded-2xl p-6 text-center font-bold text-lg mb-4">
          Online ordering is now closed for today as our store is getting ready
          to close.
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
          Sorry We&apos;re Closed for Today,
          <br />
          Please Come Back Tomorrow!
        </div>
      )}
    </>
  )
}

export default StoreNotice
