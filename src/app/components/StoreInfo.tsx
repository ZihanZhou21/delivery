import React from 'react'
import { useStoreTime, TimeInterval } from '../store/opentimeStore'

const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Helper to format intervals for display
function formatIntervals(intervals: TimeInterval[]): string {
  if (!intervals || intervals.length === 0) {
    return 'Closed'
  }
  return intervals
    .filter((int) => int.open && int.close) // Filter out potentially empty/invalid intervals
    .map((int) => `${int.open} - ${int.close}`)
    .join(', ') // Join multiple intervals with a comma
}

export default function StoreInfo() {
  const hours = useStoreTime((state) => state.hours)
  return (
    <div className="w-full bg-black/80 rounded-2xl p-5 mt-4 text-white shadow-md flex flex-col gap-2">
      <div className="font-bold text-lg mb-2">Store Timing:</div>
      <div className="flex flex-col gap-1 text-base mb-4">
        {hours.map((h, idx) => (
          <div className="flex justify-between" key={h.day}>
            <span>{dayAbbr[idx]}:</span>
            {/* Check closed flag first, then format intervals */}
            {h.closed ? (
              <span>Closed</span>
            ) : (
              <span>
                {/* Use helper to format the possibly multiple intervals */}
                {formatIntervals(h.intervals)}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* Yellow dashed divider */}
      <div className="border-t border-dashed border-[#FFD600]/30 my-2"></div>
      <div className="font-bold text-lg mt-2">Contact Detail:</div>
      <div>Unit 4/24 Vale Ave, Valley View SA 5093</div>
      <div>0407 509 869</div>
    </div>
  )
}
