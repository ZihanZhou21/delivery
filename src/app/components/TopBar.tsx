import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="w-full flex items-center justify-between bg-[#FDC519] px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-2 p-2">
        <Image src="/egg-logo.png" alt="logo" width={100} height={62} />
      </div>
      <div className="flex items-center gap-3">
        <Link href="/menu">
          <button className="bg-black text-white rounded-xl px-5 py-2 font-semibold text-lg">
            Menu
          </button>
        </Link>
        <button className="bg-white rounded-xl p-2 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <path d="M9 10h6M9 14h6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
