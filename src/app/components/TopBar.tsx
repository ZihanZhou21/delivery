import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="w-full flex items-center justify-between bg-[#FDC519] px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-2 p-2">
        <Link href="/">
          <Image
            src="/egg-logo.png"
            alt="logo"
            width={100}
            height={62}
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/menu">
          <button className="bg-black text-white rounded-xl px-5 py-2 font-semibold text-lg">
            Menu
          </button>
        </Link>
        <Link href="/cart">
          <button className="bg-white rounded-xl p-2 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  )
}
