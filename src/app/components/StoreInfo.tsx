import React from 'react'

export default function StoreInfo() {
  return (
    <div className="w-full bg-black/80 rounded-2xl p-5 mt-4 text-white shadow-md flex flex-col gap-2">
      <div className="font-bold text-lg mb-2">Store Timing:</div>
      <div className="flex flex-col gap-1 text-base mb-4">
        <div className="flex justify-between">
          <span>Mon, Wed, Thu:</span>
          <span>06.30 pm - 11:30 pm</span>
        </div>
        <div className="flex justify-between">
          <span>Tue:</span>
          <span>Closed</span>
        </div>
        <div className="flex justify-between">
          <span>Fri, Sat:</span>
          <span>06.00 pm - 01:30 am</span>
        </div>
        <div className="flex justify-between">
          <span>Sun:</span>
          <span>06.00 pm - 11:30 pm</span>
        </div>
      </div>
      {/* 黄色虚线分隔线 */}
      <div className="border-t border-dashed border-[#FFD600]/30 my-2"></div>
      <div className="font-bold text-lg mt-2">Contact Detail:</div>
      <div>Unit 4/24 Vale Ave, Valley View SA 5093</div>
      <div>0407 509 869</div>
      <div className="flex gap-4 mt-2">
        <a href="#" className="bg-white rounded-full p-2">
          <svg width="24" height="24" fill="black" viewBox="0 0 24 24">
            <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </a>
        <a href="#" className="bg-white rounded-full p-2">
          {/* Instagram 图标 */}
          <svg width="24" height="24" fill="black" viewBox="0 0 24 24">
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="6"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="5"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <circle cx="17" cy="7" r="1.2" fill="black" />
          </svg>
        </a>
      </div>
    </div>
  )
}
